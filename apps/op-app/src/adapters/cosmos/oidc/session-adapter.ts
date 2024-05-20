import { Container } from "@azure/cosmos";

import type * as oidc from "oidc-provider";

import Adapter from "./adapter.js";
import { getCosmosErrorCause } from "../error.js";

export default class SessionAdapter extends Adapter {
  #sessionsByUid: Container;

  constructor(container: Container) {
    super(container);
    this.#sessionsByUid = container.database.container("sessions-by-uid");
  }

  async upsert(
    id: string,
    payload: oidc.AdapterPayload,
    ttl: number,
  ): Promise<void> {
    await super.upsert(id, payload, ttl);
    try {
      await this.#sessionsByUid.items.upsert({ id: payload.uid, payload, ttl });
    } catch (e) {
      throw new Error(`Error upserting to ${this.#sessionsByUid.id}`, {
        cause: getCosmosErrorCause(e),
      });
    }
  }

  async #withUid(
    id: string,
    cb: (uid: string) => Promise<void>,
  ): Promise<void> {
    const session = await this.find(id);
    if (session?.uid) {
      await cb(session.uid);
    }
  }

  async consume(id: string): Promise<void> {
    await super.consume(id);
    try {
      await this.#withUid(id, async (uid) => {
        this.#sessionsByUid.item(uid, uid).patch({
          operations: [{ op: "set", path: "/payload/consume", value: true }],
        });
      });
    } catch (e) {
      throw new Error(`Unable to consume ${this.#sessionsByUid.id}/${id}`, {
        cause: getCosmosErrorCause(e),
      });
    }
  }

  async findByUid(uid: string): Promise<oidc.AdapterPayload | undefined> {
    try {
      const response = await this.#sessionsByUid
        .item(uid, uid)
        .read<{ payload: oidc.AdapterPayload }>();
      return response.resource?.payload;
    } catch (e) {
      throw new Error(`Error retrieving model from ${this.#sessionsByUid.id}`, {
        cause: getCosmosErrorCause(e),
      });
    }
  }

  async destroy(id: string): Promise<void> {
    try {
      await this.#withUid(id, async (uid) => {
        this.#sessionsByUid.item(uid, uid).delete();
      });
    } catch {
      // these model have a ttl, so "destroy(id)" can fail silenty
      // in case of cosmos error
    }
    await super.destroy(id);
  }
}
