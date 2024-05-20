import { CosmosClient } from "@azure/cosmos";
import { TokenCredential } from "@azure/identity";

import { CosmosConfig } from "./config.js";

export function getCosmosDatabase(
  config: CosmosConfig,
  aadCredentials: TokenCredential,
) {
  const client = new CosmosClient({
    endpoint: config.endpoint,
    aadCredentials,
  });
  return client.database(config.databaseName);
}

export { cosmosConfigSchema } from "./config.js";
