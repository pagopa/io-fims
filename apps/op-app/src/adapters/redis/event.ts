import { Event, EventRepository, eventsSchema } from "@/domain/session.js";
import * as assert from "node:assert/strict";
import {
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisScripts,
} from "redis";

export default class RedisEventRepository implements EventRepository {
  #client: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts>;

  constructor(
    client: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts>,
  ) {
    this.#client = client;
  }

  #key(clientId: string, fiscalCode: string) {
    return `audit:${clientId}:${fiscalCode}`;
  }

  async get(clientId: string, fiscalCode: string) {
    const blobName = await this.#client.hGetAll(
      this.#key(clientId, fiscalCode),
    );
    const event = eventsSchema.parse({ blobName, clientId, fiscalCode });
    return event;
  }

  async upsert(event: Event) {
    const result = await this.#client.hSet(
      this.#key(event.clientId, event.fiscalCode),
      "blobName",
      event.blobName,
    );
    assert.equal(result, Object.keys(event.blobName).length);
  }
}
