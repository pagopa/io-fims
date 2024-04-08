import {
  OIDCClientConfig,
  oidcClientConfigSchema,
} from "io-fims-common/oidc-client-config";

import * as E from "fp-ts/lib/Either.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import { z } from "zod";

export const payloadSchema = oidcClientConfigSchema.pick({
  id: true,
  institutionId: true,
  callbacks: true,
});

type Payload = z.TypeOf<typeof payloadSchema>;

const OIDCClientConfig = (payload: Payload): OIDCClientConfig => ({
  ...payload,
  scopes: ["openid", "profile"],
});

export type OIDCClientConfigRepository = {
  upsert: (oidcClientConfig: OIDCClientConfig) => Promise<void>;
};

type Environment = {
  oidcClientConfigRepository: OIDCClientConfigRepository;
};

export const createOIDCClientConfig =
  (payload: Payload) =>
  ({ oidcClientConfigRepository: repo }: Environment) =>
    pipe(
      TE.right(OIDCClientConfig(payload)),
      TE.tap((clientConfig) =>
        TE.tryCatch(() => repo.upsert(clientConfig), E.toError),
      ),
    );
