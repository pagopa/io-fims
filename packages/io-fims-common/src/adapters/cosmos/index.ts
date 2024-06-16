import { CosmosClient } from "@azure/cosmos";
import { TokenCredential } from "@azure/identity";

import type { CosmosConfig } from "./config.js";

import { CosmosDBHealthChecker } from "./health.js";

export function initCosmos(
  config: CosmosConfig,
  aadCredentials: TokenCredential,
) {
  const client = new CosmosClient({
    aadCredentials,
    endpoint: config.endpoint,
  });
  const database = client.database(config.databaseName);
  const healthChecker = new CosmosDBHealthChecker(client);
  return { client, database, healthChecker };
}
