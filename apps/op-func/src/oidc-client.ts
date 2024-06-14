import * as E from "fp-ts/lib/Either.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { OIDCClient } from "io-fims-common/oidc-client";

export interface OIDCClientRepository {
  upsert: (oidcClient: OIDCClient) => Promise<void>;
}

interface Environment {
  oidcClientRepository: OIDCClientRepository;
}

export const createOIDCClient =
  (payload: OIDCClient) =>
  ({ oidcClientRepository: repo }: Environment) =>
    TE.tryCatch(() => repo.upsert(payload), E.toError);
