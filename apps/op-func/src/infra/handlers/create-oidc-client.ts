import * as H from "@pagopa/handler-kit";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import * as RA from "fp-ts/lib/ReadonlyArray.js";
import * as z from "zod";

import { pipe } from "fp-ts/lib/function.js";
import {
  OIDCClientConfig,
  oidcClientConfigSchema,
} from "io-fims-common/oidc-client-config";
import { OIDCClient } from "io-fims-common/oidc-client";
import { createOIDCClient } from "../../oidc-client.js";
import { IoTsType } from "./validation.js";

export const createOIDCClientInputDecoder = IoTsType(
  z.array(oidcClientConfigSchema)
);

export const clientConfigToClient = (
  clientConfig: OIDCClientConfig
): OIDCClient => ({
  id: clientConfig.id,
  grantTypes: clientConfig.scopes.join(" "),
  issueadAt: new Date(),
  redirectUris: clientConfig.callbacks.map((callback) => callback.uri),
  responseTypes: "id_token",
  scope: clientConfig.scopes.join(" "),
});

type OIDCClientConfigs = ReadonlyArray<OIDCClientConfig>;

export const createOIDCClientHandler = H.of(
  (clientConfigs: OIDCClientConfigs) =>
    pipe(
      clientConfigs,
      RA.map(clientConfigToClient),
      RA.map(createOIDCClient),
      RA.sequence(RTE.ApplicativePar)
    )
);
