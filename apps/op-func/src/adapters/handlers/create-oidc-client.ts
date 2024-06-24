import { createOIDCClient } from "@/domain/oidc-client.js";
import * as H from "@pagopa/handler-kit";
import { pipe } from "fp-ts/lib/function.js";
import { iotsCodecFromZod } from "io-fims-common/io-ts-from-zod";
import { OIDCClient } from "io-fims-common/oidc-client";
import {
  OIDCClientConfig,
  oidcClientConfigSchema,
} from "io-fims-common/oidc-client-config";

export const clientConfigToClient = (
  clientConfig: OIDCClientConfig,
): OIDCClient => ({
  grantTypes: clientConfig.scopes.join(" "),
  id: clientConfig.id,
  issueadAt: new Date(),
  redirectUris: clientConfig.callbacks.map((callback) => callback.uri),
  responseTypes: "id_token",
  scope: clientConfig.scopes.join(" "),
});

export const inputDecoder = iotsCodecFromZod(oidcClientConfigSchema);

export const createOIDCClientHandler = H.of((clientConfig: OIDCClientConfig) =>
  pipe(clientConfig, clientConfigToClient, createOIDCClient),
);
