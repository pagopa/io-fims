// This module exports a base adapter used by oidc-provider library.
// We don't validate/parse these payload because they can change as the oidc-library gets updated.
// Reference: https://github.com/panva/node-oidc-provider/blob/main/example/my_adapter.js

import { Container } from "@azure/cosmos";
import type * as oidc from "oidc-provider";
import { getCosmosErrorCause } from "../error.js";

export default class Adapter implements oidc.Adapter {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  async upsert(
    id: string,
    payload: oidc.AdapterPayload,
    ttl: number,
  ): Promise<void> {
    try {
      await this.#container.items.upsert({
        id,
        payload,
        ttl,
      });
    } catch (e) {
      throw new Error(`Error upserting to ${this.#container.id}`, {
        cause: getCosmosErrorCause(e),
      });
    }
  }

  async find(id: string): Promise<oidc.AdapterPayload | undefined> {
    try {
      const response = await this.#container
        .item(id, id)
        .read<{ payload: oidc.AdapterPayload }>();
      return response.resource?.payload;
    } catch (e) {
      throw new Error(`Error retrieving model from ${this.#container.id}`, {
        cause: getCosmosErrorCause(e),
      });
    }
  }

  async consume(id: string): Promise<void> {
    try {
      await this.#container.item(id, id).patch({
        operations: [{ op: "set", path: "/payload/consume", value: true }],
      });
    } catch (e) {
      throw new Error(`Unable to consume ${this.#container.id}/${id}`, {
        cause: getCosmosErrorCause(e),
      });
    }
  }

  async destroy(id: string): Promise<void> {
    try {
      await this.#container.item(id, id).delete();
    } catch {
      // these model have a ttl, so "destroy(id)" can fail silenty
      // in case of cosmos error
    }
  }

  /**
   * Find Sessions by user id.
   * For the concrete implementation see {@link SessionAdapter#findByUid}
   * @abstract
   */
  async findByUid(uid: string): Promise<oidc.AdapterPayload | void> {}

  /**
   * Revoke grantables (AccessToken, AuthorizationCode) by grantId.
   * For the concrete implementation see {@link GrantableAdapter#revokeByGrantId}
   * @abstract
   */
  async revokeByGrantId(grantId: string): Promise<void> {}

  /**
   * Find DeviceCode by user code.
   * @abstract
   */
  async findByUserCode(): Promise<void> {}
}
