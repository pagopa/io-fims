import * as H from "@pagopa/handler-kit";
import { pipe } from "fp-ts/lib/function.js";
import { OIDCClient } from "io-fims-common/oidc-client";
import {
  OIDCClientConfig,
  oidcClientConfigSchema,
} from "io-fims-common/oidc-client-config";

import { createOIDCClient } from "../../oidc-client.js";
import { IoTsType } from "./validation.js";

export const createOIDCClientInputDecoder = IoTsType(oidcClientConfigSchema);

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

export const createOIDCClientHandler = H.of((clientConfigs: OIDCClientConfig) =>
  pipe(clientConfigs, clientConfigToClient, createOIDCClient),
);
