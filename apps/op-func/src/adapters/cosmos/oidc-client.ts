import type { OIDCClientRepository } from "@/domain/oidc-client.js";

import { Container, Database } from "@azure/cosmos";
import { OIDCClient } from "io-fims-common/oidc-client";

export class CosmosOIDCClientRepository implements OIDCClientRepository {
  #container: Container;

  constructor(db: Database) {
    this.#container = db.container("clients");
  }

  async upsert(client: OIDCClient) {
    try {
      await this.#container.items.upsert(client);
    } catch (e) {
      throw new Error("Error upserting OIDCClient", {
        cause: e,
      });
    }
  }
}
