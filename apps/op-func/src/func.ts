import { app } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient } from "@azure/storage-blob";
import { BlobServiceClientWithFallBack } from "@pagopa/azure-storage-migration-kit";
import {
  azureFunction,
  httpAzureFunction,
} from "@pagopa/handler-kit-azure-func";
import { loadConfigFromEnvironment } from "io-fims-common/adapters/config";
import healthHandler from "io-fims-common/adapters/handlers/health";
import { StorageBlobHealthChecker } from "io-fims-common/adapters/storage-blob/health";
import { HealthUseCase } from "io-fims-common/use-cases/health";

import { Config, configFromEnvironment } from "./adapters/config.js";
import {
  auditEventInputDecoder,
  manageAuditEventHandler,
} from "./adapters/handlers/upsert-audit-event.js";
import { BlobAuditEventRepository } from "./infra/storage/audit-event.js";

async function main(config: Config) {
  const blobServiceClient = new BlobServiceClient(
    config.auditEventStorage.uri,
    new DefaultAzureCredential(),
  );

  const legacyBlobServiceClient = new BlobServiceClient(
    config.auditEventStorage.fallback,
    new DefaultAzureCredential(),
  );

  const blobServiceClientWithFallback = new BlobServiceClientWithFallBack(
    blobServiceClient,
    legacyBlobServiceClient,
  );

  const health = new HealthUseCase([
    new StorageBlobHealthChecker(blobServiceClient, "Azure Blob Storage"),
  ]);

  const containerClient = blobServiceClientWithFallback.getContainerClient(
    config.auditEventStorage.containerName,
  );

  const auditEventRepository = new BlobAuditEventRepository(containerClient);

  app.http("Health", {
    handler: httpAzureFunction(healthHandler)({
      health,
    }),
    methods: ["GET", "POST"],
    route: "health",
  });

  app.storageQueue("ManageAuditEvent", {
    connection: config.storage.connectionPrefix,
    handler: azureFunction(manageAuditEventHandler)({
      auditEventRepository,
      inputDecoder: auditEventInputDecoder,
    }),
    queueName: config.storage.queue.auditEvents.name,
  });
}

await loadConfigFromEnvironment(configFromEnvironment, main);
