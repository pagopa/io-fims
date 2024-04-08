import * as H from "@pagopa/handler-kit";

import * as E from "fp-ts/lib/Either.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";

import { pipe, flow } from "fp-ts/lib/function.js";

import { payloadSchema, createOIDCClientConfig } from "@/oidc-client-config.js";
import { oidcClientConfigSchema } from "io-fims-common/oidc-client-config";

import { schemas } from "@/infra/openapi.js";

import { parse } from "io-fims-common/parse";
import { logErrorAndReturnResponse } from "io-fims-common/response";

const requestSchema = schemas.OIDCClientConfig.transform(
  ({ service_id, institution_id, callbacks }) => ({
    id: service_id,
    institutionId: institution_id,
    callbacks: callbacks.map(({ uri, display_name: displayName }) => ({
      uri,
      displayName,
    })),
  }),
).pipe(payloadSchema);

const responseSchema = oidcClientConfigSchema
  .transform(({ id, institutionId, callbacks }) => ({
    service_id: id,
    institution_id: institutionId,
    callbacks: callbacks.map(({ uri, displayName: display_name }) => ({
      uri,
      display_name,
    })),
  }))
  .pipe(schemas.OIDCClientConfig);

export const createOIDCClientConfigHandler = H.of((req: H.HttpRequest) =>
  pipe(
    RTE.fromEither(pipe(req.body, parse(requestSchema))),
    RTE.flatMap(createOIDCClientConfig),
    RTE.flatMapEither(
      flow(
        parse(responseSchema),
        E.mapLeft(() => new Error("Unable to serialize the response")),
      ),
    ),
    RTE.map(H.successJson),
    RTE.orElseW(logErrorAndReturnResponse),
  ),
);
