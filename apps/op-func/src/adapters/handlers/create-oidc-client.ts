import { createOIDCClient } from "@/domain/oidc-client.js";
import * as H from "@pagopa/handler-kit";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { pipe } from "fp-ts/lib/function.js";
import { parseClientMetadataFromConfig } from "io-fims-common/domain/client-metadata";
import {
  OIDCClientConfig,
  oidcClientConfigSchema,
} from "io-fims-common/domain/oidc-client-config";
import { iotsCodecFromZod } from "io-fims-common/io-ts-from-zod";

export const inputDecoder = iotsCodecFromZod(oidcClientConfigSchema);

export const createOIDCClientHandler = H.of((clientConfig: OIDCClientConfig) =>
  pipe(
    parseClientMetadataFromConfig(clientConfig),
    RTE.fromIOEither,
    RTE.flatMap(createOIDCClient),
  ),
);
