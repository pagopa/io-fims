import * as E from "fp-ts/lib/Either.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { ClientMetadata } from "io-fims-common/domain/client-metadata";

export interface OIDCClientRepository {
  upsert: (clientMetadata: ClientMetadata) => Promise<void>;
}

interface Environment {
  oidcClientRepository: OIDCClientRepository;
}

export const createOIDCClient =
  (payload: ClientMetadata) =>
  ({ oidcClientRepository: repo }: Environment) =>
    TE.tryCatch(() => repo.upsert(payload), E.toError);
