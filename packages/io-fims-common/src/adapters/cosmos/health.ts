import type { HealthChecker } from "@/use-cases/health.js";
import type { CosmosClient } from "@azure/cosmos";

export class CosmosDBHealthChecker implements HealthChecker {
  #client: CosmosClient;
  id = "Azure Cosmos DB";

  constructor(cosmosClient: CosmosClient) {
    this.#client = cosmosClient;
  }

  async health() {
    await this.#client.getDatabaseAccount();
  }
}
