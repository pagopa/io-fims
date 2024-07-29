import { Session, SessionEnvironment, startSession } from "@/domain/session.js";
import { IdentityProvider, getUserMetadata } from "@/domain/user-metadata.js";
import * as E from "fp-ts/lib/Either.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { flow } from "fp-ts/lib/function.js";

export class LoginError extends Error {
  name = "LoginError";
  constructor(cause: unknown) {
    super("Unexpected error during login.");
    this.cause = cause;
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
    if (E.isLeft(result)) {
      throw new LoginError(result.left);
    }
    return result.right;
  }
}
