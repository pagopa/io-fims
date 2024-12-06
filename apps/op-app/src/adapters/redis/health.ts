import { HealthChecker } from "@/use-cases/health.js";
import {
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisScripts,
} from "redis";

export default class RedisHealthChecker implements HealthChecker {
  #client: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts>;
  id = "Redis";

  constructor(
    client: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts>,
  ) {
    this.#client = client;
  }

  async health() {
    await this.#client.ping();
  }
}
