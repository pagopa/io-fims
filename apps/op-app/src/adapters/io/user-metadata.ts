import {
  IdentityProvider,
  UserMetadata,
  userMetadataSchema,
} from "@/domain/user-metadata.js";
import * as E from "fp-ts/lib/Either.js";
import * as assert from "node:assert/strict";
import { ZodError } from "zod";

import { Client, createClient } from "./generated/client.js";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings.js";

export class IO implements IdentityProvider {
  #client: Client;

  constructor(baseUrl: string) {
    this.#client = createClient({
      baseUrl,
      fetchApi: globalThis.fetch,
    });
  }

  async getUserMetadata(
    token: string,
    operationId: NonEmptyString,
  ): Promise<UserMetadata> {
    try {
      const result = await this.#client.getLollipopUserForFIMS({
        Bearer: `Bearer ${token}`,
        body: {
          operation_id: operationId,
        },
      });
      assert.ok(E.isRight(result));
      assert.strictEqual(result.right.status, 200);
      const {
        family_name: lastName,
        fiscal_code: fiscalCode,
        name: firstName,
      } = result.right.value.profile;
      return userMetadataSchema.parse({ firstName, fiscalCode, lastName });
    } catch (e) {
      const err = {
        cause: "Client error",
        msg: "Unable to fetch user data",
      };
      if (e instanceof ZodError) {
        err.cause = "Invalid user data";
      } else if (e instanceof assert.AssertionError) {
        err.cause = "Request failed";
      }
      const msg = `${err.msg}. ${err.cause}.`;
      throw new Error(msg, {
        cause: err.cause,
      });
    }
  }
}
