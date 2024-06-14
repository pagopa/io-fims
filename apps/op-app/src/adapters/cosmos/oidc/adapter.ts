// This module exports a base adapter used by oidc-provider library.
// We don't validate/parse these payload because they can change as the oidc-library gets updated.
// Reference: https://github.com/panva/node-oidc-provider/blob/main/example/my_adapter.js

import type * as oidc from "oidc-provider";

import { Container } from "@azure/cosmos";

import { getCosmosErrorCause } from "../error.js";

export default class Adapter implements oidc.Adapter {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
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

  /**
   * Find Sessions by user id.
   * For the concrete implementation see {@link SessionAdapter#findByUid}
   * @abstract
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findByUid(uid: string): Promise<oidc.AdapterPayload | undefined> {
    throw new Error("Not implemented");
  }

  /**
   * Find DeviceCode by user code.
   * @abstract
   */
  async findByUserCode(): Promise<void> {
    throw new Error("Not implemented");
  }

  /**
   * Revoke grantables (AccessToken, AuthorizationCode) by grantId.
   * For the concrete implementation see {@link GrantableAdapter#revokeByGrantId}
   * @abstract
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async revokeByGrantId(grantId: string): Promise<void> {
    throw new Error("Not implemented");
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
}
