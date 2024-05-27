import {
  FederationToken,
  User,
  UserRepository,
  userSchema,
} from "@/domain/user.js";
import * as E from "fp-ts/lib/Either.js";
import * as assert from "node:assert/strict";
import { Logger } from "pino";
import { ZodError } from "zod";

import { Client } from "./generated/client.js";

export class IOUserRepository implements UserRepository {
  #client: Client;
  #logger: Logger;

  constructor(client: Client, logger: Logger) {
    this.#client = client;
    this.#logger = logger;
  }

  async getUser(token: FederationToken): Promise<User> {
    try {
      const result = await this.#client.getUserForFIMS({
        Bearer: `Bearer ${token}`,
      });
      assert.ok(E.isRight(result));
      assert.strictEqual(result.right.status, 200);
      const {
        family_name: lastName,
        fiscal_code: fiscalCode,
        name: firstName,
      } = result.right.value;
      return userSchema.parse({ firstName, fiscalCode, lastName });
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
      this.#logger.error(err, msg);
      throw new Error(msg, {
        cause: err.cause,
      });
    }
  }
}
