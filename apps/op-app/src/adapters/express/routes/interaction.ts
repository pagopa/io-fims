import type { LoginUseCase } from "@/use-cases/login.js";
import type Provider from "oidc-provider";

import { metadataForConsentFromScopes } from "@/domain/user-metadata.js";
import { AuditUseCase } from "@/use-cases/audit.js";
import * as express from "express";
import { rpParamsSchema } from "io-fims-common/domain/audit-event";
import * as assert from "node:assert/strict";
import { z } from "zod";

import { schemas } from "../api-models.js";
import { HttpBadRequestError, HttpError } from "../error.js";

const consentSchema = z.object({
  blobName: z.string().min(1),
  params: z.object({
    client_id: z.string().min(1),
    redirect_uri: z.string().url(),
  }),
  prompt: z.object({
    details: z.object({
      missingOIDCScope: z.array(z.enum(["openid", "profile"])),
    }),
    name: z.literal("consent"),
  }),
  session: z.object({
    accountId: z.string().ulid(),
  }),
});

// Parses and retrieves the localized display name for a given redirect URI and locale.
export const parseRedirectDisplayName = (
  redirectDisplayNames: unknown,
  redirectUri: string,
  locale: string,
) => {
  const redirectDisplayNamesSchema = z.object({
    // since we don't know [redirectUri] at compile time, we parse it with
    // a dynamic schema
    [redirectUri]: z.record(z.string()),
  });
  const result = redirectDisplayNamesSchema.safeParse(redirectDisplayNames);
  assert.ok(
    result.success,
    "Failed to validate the client. The redirect_display_name field is either missing or invalid.",
  );
  const redirectDisplayName = result.data[redirectUri];
  // redirectDisplayName contains a map of displayNames by supported locales (it, en, de)
  // so we should extract it based on current locale
  if (Object.hasOwn(redirectDisplayName, locale)) {
    return redirectDisplayName[locale];
  }
  return redirectDisplayName.it;
};

export default function createInteractionRouter(
  oidcProvider: Provider,
  loginUseCase: LoginUseCase,
  auditUseCase: AuditUseCase,
) {
  const router = express.Router();

  router.get("/interaction/:uid", async (req, res, next) => {
    try {
      const interaction = await oidcProvider.interactionDetails(req, res);
      req.log.debug(
        { interaction },
        "interaction obtained from oidc-provided (not parsed)",
      );
      const interactionType = interaction.prompt.name;

      // interactionType can be "login" or "consent"
      assert.ok(
        interactionType === "login" || interactionType === "consent",
        new HttpError("Unsupported interaction"),
      );

      req.log.debug("the obtained interaction is supported");

      if (interactionType === "login") {
        // redirect to login route
        req.log.debug("login required, redirect to login endpoint");
        return res.redirect(`/interaction/${req.params.uid}/login`);
      }

      req.log.debug("consent required, parse interaction");

      // interactionType is consent, parse the interaction again to obtain
      // all the required fields
      const consent = consentSchema.parse(interaction);

      req.log.debug("the interaction is a valid consent request");

      const client = await oidcProvider.Client.find(consent.params.client_id);
      assert.ok(client !== undefined, new HttpError("Client not found"));

      req.log.debug(client, "client retrieved from oidc provided");

      const locale = req.getLocale();

      const redirectDisplayName = parseRedirectDisplayName(
        client["redirect_display_names"],
        consent.params.redirect_uri,
        locale,
      );

      req.log.debug(
        redirectDisplayName,
        "computed display name for locale: %s",
        { locale },
      );

      // we enabled "trust proxy" option but req.hostname does not include the port
      // so we use the plain header to build the right links
      const host = req.header("X-Forwarded-Host") ?? req.header("Host");
      const baseUrl = `${req.protocol}://${host}${req.path}`;

      req.log.debug("using %s as baseUrl for links", baseUrl);

      const userMetadata = metadataForConsentFromScopes(
        consent.prompt.details.missingOIDCScope,
      );
      const apiModel = schemas.Consent.safeParse({
        _links: {
          abort: {
            href: `${baseUrl}/abort`,
          },
          consent: {
            href: `${baseUrl}/consent`,
          },
        },
        redirect: {
          display_name: redirectDisplayName,
        },
        service_id: consent.params.client_id,
        type: interactionType,
        user_metadata: userMetadata.map((name) => ({
          // name can be "firstName", "lastName", ..
          display_name: req.__(name),
          // localize each metadata name using i18n-node
          name,
        })),
      });

      assert.ok(
        apiModel.success,
        new HttpError("Unable to serialize the response", {
          cause: apiModel.error,
        }),
      );

      res.type("application/hal+json").json(apiModel.data);
    } catch (err) {
      req.log.debug({ error: err }, "error on interaction detail");
      next(err);
    }
  });

  router.get("/interaction/:uid/login", async (req, res, next) => {
    try {
      req.log.debug("login route");
      const interaction = await oidcProvider.interactionDetails(req, res);
      assert.equal(
        interaction.prompt.name,
        "login",
        new Error("Interaction type mismatch, login expected"),
      );

      const cookiesSchema = z.object({
        _io_fims_token: z.string().min(1),
      });
      const cookies = cookiesSchema.safeParse(req.cookies);
      assert.ok(
        cookies.success,
        new HttpBadRequestError(`Unable to parse the "_io_fims_token" cookie.`),
      );
      req.log.debug("_io_fims_token parsed from cookies");
      const rpParams = rpParamsSchema.safeParse(interaction.params);
      assert.ok(
        rpParams.success,
        new HttpBadRequestError(`Unable to parse the query params.`),
      );
      const ipAddress = req.ip || "";
      const accountId = await loginUseCase.execute(cookies.data._io_fims_token);
      await auditUseCase.manageUserAndRpParams(
        accountId,
        rpParams.data,
        ipAddress,
      );
      return oidcProvider.interactionFinished(req, res, {
        login: {
          accountId,
          remember: false,
        },
      });
    } catch (err) {
      req.log.debug({ error: err }, "error on login route");
      next(err);
    }
  });

  // Sets the HTTP method based on the execution environment
  // Uses "post" for production and "all" for non-production environments to facilitate local testing
  const method = process.env.NODE_ENV === "production" ? "post" : "all";

  router[method]("/interaction/:uid/consent", async (req, res, next) => {
    try {
      req.log.debug("consent route");
      const interaction = await oidcProvider.interactionDetails(req, res);
      const consent = consentSchema.parse(interaction);
      req.log.debug({ consent }, "interaction parsed to consent type");
      const grant = new oidcProvider.Grant({
        accountId: consent.session.accountId,
        clientId: consent.params.client_id,
      });
      consent.prompt.details.missingOIDCScope.forEach((scope) => {
        grant.addOIDCScope(scope);
      });
      const grantId = await grant.save();
      req.log.debug({ grantId }, "grant saved");
      return await oidcProvider.interactionFinished(req, res, {
        consent: {
          grantId,
        },
      });
    } catch (err) {
      req.log.debug({ error: err }, "error on consent route");
      next(err);
    }
  });

  router[method]("/interaction/:uid/abort", (req, res) => {
    req.log.debug("on abort route");
    return oidcProvider.interactionFinished(req, res, {
      error: "access_denied",
      error_description: "End-User aborted interaction",
    });
  });

  return router;
}
