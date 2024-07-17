import { schemas } from "@/infra/openapi.js";
import { createOIDCClientConfig, payloadSchema } from "@/oidc-client-config.js";
import * as H from "@pagopa/handler-kit";
import * as E from "fp-ts/lib/Either.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { flow, pipe } from "fp-ts/lib/function.js";
import { oidcClientConfigSchema } from "io-fims-common/domain/oidc-client-config";
import { parse } from "io-fims-common/parse";
import { logErrorAndReturnResponse } from "io-fims-common/response";

const requestSchema = schemas.OIDCClientConfig.transform(
  ({ callbacks, service_id }) => ({
    callbacks: callbacks.map(({ display_name: displayName, uri }) => ({
      displayName,
      uri,
    })),
    id: service_id,
  }),
).pipe(payloadSchema);

const responseSchema = oidcClientConfigSchema
  .transform(({ callbacks, id }) => ({
    callbacks: callbacks.map(({ displayName: display_name, uri }) => ({
      display_name,
      uri,
    })),
    service_id: id,
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
