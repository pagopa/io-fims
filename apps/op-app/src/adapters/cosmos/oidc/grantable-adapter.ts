import type * as oidc from "oidc-provider";

import { Container } from "@azure/cosmos";

import { getCosmosErrorCause } from "../error.js";
import Adapter from "./adapter.js";

export default class GrantableAdapter extends Adapter {
  #grantedsByGrantId: Container;

  constructor(container: Container) {
    super(container);
    this.#grantedsByGrantId = container.database.container(
      "granteds-by-grant-id",
    );
  }

  async revokeByGrantId(grantId: string): Promise<void> {
    try {
      const { resource } = await this.#grantedsByGrantId
        .item(grantId, grantId)
        .read<{ payload: { id: string } }>();
      if (resource) {
        const id = resource.payload.id;
        await this.destroy(id);
      }
    } catch {
      // these model have a ttl, so "destroy(id)" can fail silenty
      // in case of cosmos error
    }
  }

  async upsert(
    id: string,
    payload: oidc.AdapterPayload,
    ttl: number,
  ): Promise<void> {
    await super.upsert(id, payload, ttl);
    try {
      await this.#grantedsByGrantId.items.upsert({
        id: payload.grantId,
        payload: {
          id,
          kind: payload.kind,
        },
        ttl,
      });
    } catch (e) {
      throw new Error(`Error upserting to ${this.#grantedsByGrantId.id}`, {
        cause: getCosmosErrorCause(e),
      });
    }
  }
}
