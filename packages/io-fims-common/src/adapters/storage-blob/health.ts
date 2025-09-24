import type { HealthChecker } from "@/use-cases/health.js";

import { BlobServiceClient } from "@azure/storage-blob";
import { pino } from "pino";

export class StorageBlobHealthChecker implements HealthChecker {
  #client: BlobServiceClient;
  id: string;
  logger: pino.Logger;

  constructor(blobClient: BlobServiceClient, id = "Azure Blob Storage") {
    this.#client = blobClient;
    this.id = id;

    this.logger = pino({
      level: process.env.NODE_ENV === "production" ? "error" : "debug",
    });
  }

  async health() {
    try {
      const containers = await this.#client.listContainers().next();
      if (containers.done) {
        throw new Error("No containers found");
      }
    } catch (e) {
      this.logger.error("Health check failed", JSON.stringify(e));
      throw e;
    }
  }
}
