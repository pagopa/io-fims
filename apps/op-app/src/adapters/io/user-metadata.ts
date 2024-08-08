import { IdentityProvider } from "@/domain/user-metadata.js";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings.js";
import * as E from "fp-ts/lib/Either.js";
import { userMetadataSchema } from "io-fims-common/domain/user-metadata";
import * as assert from "node:assert/strict";
import { ZodError, z } from "zod";

import { IOConfig } from "./config.js";
import { AssertionRef } from "./generated/lollipop/AssertionRef.js";
import { LollipopAuthBearer } from "./generated/lollipop/LollipopAuthBearer.js";
import * as Lollipop from "./generated/lollipop/client.js";
import * as SessionManager from "./generated/session-manager/client.js";

export class UserNotLoggedError extends Error {
  name = "UserNotLoggedError";
  constructor() {
    super("User not logged");
  }
}

const assertionSchema = z.object({
  response_xml: z.string().min(1),
});

export class IO implements IdentityProvider {
  #lollipop: Lollipop.Client;
  #lollipopApiKeyAuth: string;
  #sessionManager: SessionManager.Client;

  constructor(config: IOConfig) {
    const fetchApi = globalThis.fetch;
    this.#sessionManager = SessionManager.createClient({
      baseUrl: config.sessionManager.baseUrl,
      fetchApi,
    });
    this.#lollipop = Lollipop.createClient({
      baseUrl: config.lollipop.baseUrl,
      fetchApi,
    });
    this.#lollipopApiKeyAuth = config.lollipop.apiKey;
  }

  async #getAssertion(
    lollipopAuth: LollipopAuthBearer,
    assertionRef: AssertionRef,
  ): Promise<string> {
    try {
      const response = await this.#lollipop.getAssertion({
        ApiKeyAuth: this.#lollipopApiKeyAuth,
        assertion_ref: assertionRef,
        "x-pagopa-lollipop-auth": lollipopAuth,
      });
      assert.ok(E.isRight(response));
      assert.strictEqual(response.right.status, 200);
      const assertion = assertionSchema.parse(response.right.value);
      return assertion.response_xml;
    } catch (err) {
      throw new Error("Unable to retrieve the assertion", {
        cause: err,
      });
    }
  }

  async #getLollipopUser(fimsToken: string, operation_id: NonEmptyString) {
    try {
      const response = await this.#sessionManager.getLollipopUserForFIMS({
        Bearer: `Bearer ${fimsToken}`,
        body: { operation_id },
      });
      assert.ok(E.isRight(response));
      assert.notStrictEqual(
        response.right.status,
        401,
        new UserNotLoggedError(),
      );
      assert.strictEqual(response.right.status, 200);
      return response.right.value;
    } catch (err) {
      throw new Error("Unable to retrieve the lollipop user", {
        cause: err,
      });
    }
  }

  async getUserMetadata(
    token: string,
    operationId: NonEmptyString,
  ): Promise<UserMetadata> {
    try {
      const lollipopUser = await this.#getLollipopUser(token, operationId);

      const { lc_params, profile } = lollipopUser;

      const lollipopAuth = LollipopAuthBearer.decode(
        `Bearer ${lc_params.lc_authentication_bearer}`,
      );

      assert.ok(
        E.isRight(lollipopAuth),
        new Error("Invalid LollipopAuthBearer"),
      );

      const assertion = await this.#getAssertion(
        lollipopAuth.right,
        lc_params.assertion_ref,
      );

      return userMetadataSchema.parse({
        assertion: assertion,
        assertionRef: lc_params.assertion_ref,
        firstName: profile.name,
        fiscalCode: profile.fiscal_code,
        lastName: profile.family_name,
        publicKey: lc_params.pub_key,
      });
    } catch (err) {
      let cause;
      if (err instanceof ZodError) {
        cause = new Error("Can't parse user metadata");
      } else if (err instanceof Error) {
        cause = err.cause instanceof UserNotLoggedError ? err.cause : err;
      }
      throw new Error("Unable to retrieve the IO user metadata", { cause });
    }
  }
}
