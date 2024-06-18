import type * as oidc from "oidc-provider";

import { Session, SessionEnvironment, getSession } from "@/domain/session.js";
import { claimsFromUserMetadata } from "@/domain/user-metadata.js";
import * as E from "fp-ts/lib/Either.js";
import * as O from "fp-ts/lib/Option.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { flow } from "fp-ts/lib/function.js";
import * as assert from "node:assert/strict";

const accountFromSession = ({ id, userMetadata }: Session): oidc.Account => ({
  accountId: id,
  claims: () => claimsFromUserMetadata(userMetadata),
});

const safeFindAccount = flow(
  getSession,
  RTE.map(flow(O.map(accountFromSession), O.toUndefined)),
);

export const findAccount =
  ({ sessionRepository }: SessionEnvironment): oidc.FindAccount =>
  async (ctx, sub) => {
    const result = await safeFindAccount(sub)({ sessionRepository })();
    assert.ok(E.isRight(result), new Error("Unable to get account"));
    return result.right;
  };
