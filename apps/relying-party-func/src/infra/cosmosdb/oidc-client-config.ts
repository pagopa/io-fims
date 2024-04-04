import { Container, Database } from "@azure/cosmos";

import * as TE from "fp-ts/lib/TaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

import { parse } from "io-fims-common/parse";

import {
  OIDCClientConfig,
  oidcClientConfigSchema,
} from "io-fims-common/oidc-client-config";

import type { OIDCClientConfigRepository } from "@/oidc-client-config.js";

export class CosmosOIDCClientConfigRepository
  implements OIDCClientConfigRepository
{
  #container: Container;

  constructor(db: Database) {
    this.#container = db.container("oidc-client-configs");
  }

  upsert(c: OIDCClientConfig) {
    return pipe(
      TE.tryCatch(
        () => this.#container.items.upsert(c),
        () => new Error("Unable to upsert OIDC Client Config"),
      ),
      TE.map((response) => response.resource),
      TE.flatMapEither(parse(oidcClientConfigSchema)),
    );
  }
}
