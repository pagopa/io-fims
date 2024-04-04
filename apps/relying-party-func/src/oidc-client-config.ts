import {
  OIDCClientConfig,
  oidcClientConfigSchema,
} from "io-fims-common/oidc-client-config";

import { parse } from "io-fims-common/parse";

import { ulid } from "ulid";

import * as IOE from "fp-ts/lib/IOEither.js";
import * as TE from "fp-ts/lib/TaskEither.js";

import { pipe } from "fp-ts/lib/function.js";

import { z } from "zod";

export const payloadSchema = oidcClientConfigSchema.pick({
  serviceId: true,
  institutionId: true,
  callbacks: true,
});

type Payload = z.TypeOf<typeof payloadSchema>;

const OIDCClientConfig = (
  payload: Payload,
): IOE.IOEither<Error, OIDCClientConfig> =>
  pipe(
    IOE.fromIO(() => ulid()),
    IOE.map((id) => ({ id, ...payload, scopes: ["openid", "profile"] })),
    IOE.flatMapEither(parse(oidcClientConfigSchema)),
  );

export type OIDCClientConfigRepository = {
  upsert: (
    oidcClientConfig: OIDCClientConfig,
  ) => TE.TaskEither<Error, OIDCClientConfig>;
};

type Environment = {
  oidcClientConfigRepository: OIDCClientConfigRepository;
};

export const createOIDCClientConfig =
  (payload: Payload) =>
  ({ oidcClientConfigRepository: repo }: Environment) =>
    pipe(OIDCClientConfig(payload), TE.fromIOEither, TE.flatMap(repo.upsert));
