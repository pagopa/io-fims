import { Session, SessionRepository, sessionSchema } from "@/domain/session.js";
import * as assert from "node:assert/strict";
import {
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisScripts,
} from "redis";

export default class RedisSessionRepository implements SessionRepository {
  #client: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts>;

  constructor(
    client: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts>,
  ) {
    this.#client = client;
  }

  #key(id: Session["id"]) {
    return `session:${id}:user.metadata`;
  }

  async get(id: Session["id"]) {
    const userMetadata = await this.#client.HGETALL(this.#key(id));
    const session = sessionSchema.parse({ id, userMetadata });
    return session;
  }

  async upsert(session: Session) {
    const key = this.#key(session.id);
    const result = await this.#client.HSET(key, session.userMetadata);
    await this.#client.EXPIRE(key, 60 * 5); // 5 minutes
    assert.equal(result, Object.keys(session.userMetadata).length);
  }
}
