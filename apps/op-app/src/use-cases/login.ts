import { Session, SessionEnvironment, startSession } from "@/domain/session.js";
import { IdentityProvider, getUserMetadata } from "@/domain/user-metadata.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { flow } from "fp-ts/lib/function.js";
import * as assert from "node:assert/strict";

export class LoginError extends Error {
  name = "LoginError";
  constructor() {
    super("Unexpected error during login.");
  }
}

type Context = { identityProvider: IdentityProvider } & SessionEnvironment;

export class LoginUseCase {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  async execute(token: string, operationId: string): Promise<Session["id"]> {
    const login = flow(getUserMetadata, RTE.flatMap(startSession));
    const result = await login(token, operationId)(this.#ctx)();
    assert.equal(result._tag, "Right", new LoginError());
    return result.right;
  }
}
