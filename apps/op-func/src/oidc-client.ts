import { OIDCClient } from "io-fims-common/oidc-client";

import * as E from "fp-ts/lib/Either.js";
import * as TE from "fp-ts/lib/TaskEither.js";

export type OIDCClientRepository = {
  upsert: (oidcClient: OIDCClient) => Promise<void>;
};

type Environment = {
  oidcClientRepository: OIDCClientRepository;
};

export const createOIDCClient =
  (payload: OIDCClient) =>
  ({ oidcClientRepository: repo }: Environment) =>
    TE.tryCatch(() => repo.upsert(payload), E.toError);
