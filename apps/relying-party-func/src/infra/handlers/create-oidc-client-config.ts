import * as H from "@pagopa/handler-kit";

import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import {
  payloadSchema as OIDCClientConfigPayloadSchema,
  createOIDCClientConfig,
} from "@/oidc-client-config.js";

import { parse } from "io-fims-common/parse";
import { logErrorAndReturnResponse } from "io-fims-common/response";

const requirePayload = (req: H.HttpRequest) =>
  pipe(req.body, parse(OIDCClientConfigPayloadSchema));

const requirePayloadRTE = RTE.fromEitherK(requirePayload);

export const createOIDCClientConfigHandler = H.of((req: H.HttpRequest) =>
  pipe(
    requirePayloadRTE(req),
    RTE.flatMap(createOIDCClientConfig),
    RTE.map(H.successJson),
    RTE.orElseW(logErrorAndReturnResponse),
  ),
);
