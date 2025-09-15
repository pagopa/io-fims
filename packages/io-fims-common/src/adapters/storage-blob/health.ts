import type { HealthChecker } from "@/use-cases/health.js";
import { BlobServiceClient } from "@azure/storage-blob";

export class StorageBlobHealthChecker implements HealthChecker {
  #client: BlobServiceClient;
  id = "Azure Blob Storage";

  constructor(blobClient: BlobServiceClient) {
    this.#client = blobClient;
  }

  async health() {
    const containers = await this.#client.listContainers().next();
    if (containers.done) {
      throw new Error("No containers found");
    }
  }
}
