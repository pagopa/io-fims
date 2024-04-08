import { Container, Database } from "@azure/cosmos";

import { OIDCClientConfig } from "io-fims-common/oidc-client-config";

import type { OIDCClientConfigRepository } from "@/oidc-client-config.js";

export class CosmosOIDCClientConfigRepository
  implements OIDCClientConfigRepository
{
  #container: Container;

  constructor(db: Database) {
    this.#container = db.container("oidc-client-configs");
  }

  async upsert(clientConfig: OIDCClientConfig) {
    try {
      await this.#container.items.upsert(clientConfig);
    } catch (e) {
      throw new Error("Error upserting OIDCClientConfig", {
        cause: e,
      });
    }
  }
}
