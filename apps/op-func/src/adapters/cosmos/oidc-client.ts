import type { OIDCClientRepository } from "@/domain/oidc-client.js";

import { Container, Database } from "@azure/cosmos";
import { ClientMetadata } from "io-fims-common/domain/client-metadata";

export class CosmosOIDCClientRepository implements OIDCClientRepository {
  #container: Container;

  constructor(db: Database) {
    this.#container = db.container("clients");
  }

  async upsert(client: ClientMetadata) {
    try {
      await this.#container.items.upsert({
        id: client.client_id,
        payload: client,
      });
    } catch (e) {
      throw new Error("Error upserting the OIDC client", {
        cause: e,
      });
    }
  }
}
