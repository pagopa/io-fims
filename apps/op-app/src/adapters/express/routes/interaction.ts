import type { LoginUseCase } from "@/use-cases/login.js";
import type Provider from "oidc-provider";

import { metadataForConsentFromScopes } from "@/domain/user-metadata.js";
import { LogAccessUseCase } from "@/use-cases/log-access.js";
import { SendEventMessageUseCase } from "@/use-cases/send-event-messge.js";
import * as express from "express";
import { requestParamsSchema } from "io-fims-common/domain/audit-event";
import * as assert from "node:assert/strict";
import { Logger } from "pino";
import { z } from "zod";

import { schemas } from "../api-models.js";
import { HttpBadRequestError, HttpError } from "../error.js";

const consentSchema = z.object({
  params: z.object({
    client_id: z.string().min(1),
    redirect_uri: z.string().url(),
  }),
  prompt: z.object({
    details: z.object({
      missingOIDCScope: z.array(z.enum(["openid", "profile", "lollipop"])),
    }),
    name: z.literal("consent"),
  }),
  session: z.object({
    accountId: z.string().ulid(),
  }),
});

type Consent = z.infer<typeof consentSchema>;

const redirectDisplayNamesSchema = (redirectUri: string) =>
  z.object({
    // since we don't know [redirectUri] at compile time, we parse it with
    // a dynamic schema
    [redirectUri]: z.record(z.string()).and(z.object({ it: z.string() })),
  });

// Parses and retrieves the localized display name for a given redirect URI and locale.
export const parseRedirectDisplayName = (
  redirectDisplayNames: unknown,
  redirectUri: string,
  locale: string,
) => {
  const result =
    redirectDisplayNamesSchema(redirectUri).safeParse(redirectDisplayNames);
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

const confirmConsent = async (
  oidcProvider: Provider,
  consent: Consent,
  logAccess: LogAccessUseCase,
  logger: Logger,
): Promise<string> => {
  const grant = new oidcProvider.Grant({
    accountId: consent.session.accountId,
    clientId: consent.params.client_id,
  });

  consent.prompt.details.missingOIDCScope.forEach((scope) => {
    grant.addOIDCScope(scope);
  });

  const grantId = await grant.save();
  logger.debug({ grantId }, "grant saved");

  const client = await oidcProvider.Client.find(consent.params.client_id);
  assert.ok(client, new HttpError("Client not found"));

  logger.debug(client, "client retrieved from oidc provided");

  const redirectDisplayNames = redirectDisplayNamesSchema(
    consent.params.redirect_uri,
  ).parse(client["redirect_display_names"]);

  await logAccess.execute(
    consent.session.accountId,
    {
      client_id: consent.params.client_id,
      redirect_display_names: redirectDisplayNames,
    },
    consent.params.redirect_uri,
  );
  return grantId;
};

/* eslint-disable max-lines-per-function */
export default function createInteractionRouter(
  oidcProvider: Provider,
  login: LoginUseCase,
  eventUseCase: SendEventMessageUseCase,
  logAccess: LogAccessUseCase,
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

      if (Object.hasOwn(client, "is_internal") && client["is_internal"]) {
        const grantId = await confirmConsent(
          oidcProvider,
          consent,
          logAccess,
          req.log,
        );

        return await oidcProvider.interactionFinished(req, res, {
          consent: {
            grantId,
          },
        });
      }

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
        "Interaction type mismatch, login expected",
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
      const rpParams = requestParamsSchema.safeParse(interaction.params);
      assert.ok(
        rpParams.success,
        new HttpBadRequestError(`Unable to parse the query params.`),
      );
      assert.ok(
        req.ip,
        new HttpBadRequestError(`Unable to retrieve ip address from request`),
      );
      const accountId = await login.execute(
        cookies.data._io_fims_token,
        interaction.jti,
      );
      await eventUseCase.execute({
        ipAddress: req.ip,
        requestParams: rpParams.data,
        sessionId: accountId,
        type: "rpStep",
      });
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

      const grantId = await confirmConsent(
        oidcProvider,
        consent,
        logAccess,
        req.log,
      );

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
/* eslint-enable max-lines-per-function */
