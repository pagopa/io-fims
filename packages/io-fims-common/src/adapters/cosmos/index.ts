import { ConsistencyLevel, CosmosClient } from "@azure/cosmos";
import { TokenCredential } from "@azure/identity";

import type { CosmosConfig } from "./config.js";

import { CosmosDBHealthChecker } from "./health.js";

/*
 * Initialize a cosmos client, database and healthChecker.
 *
 * Be aware that consistency level cannot be stronger than the one set at the database configuration level.
 * */
export function initCosmos(
  config: CosmosConfig,
  aadCredentials: TokenCredential,
  consistencyLevel: ConsistencyLevel,
) {
  const client = new CosmosClient({
    aadCredentials,
    consistencyLevel,
    endpoint: config.endpoint,
  });
  const database = client.database(config.databaseName);
  const healthChecker = new CosmosDBHealthChecker(client);
  return { client, database, healthChecker };
}
