import { app } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
// temporary fix to avoid type mismatch between @azure/storage-blob adn @pagopa/azure-storage-migration-kit
const { BlobServiceClient } = require("@azure/storage-blob");
// import { BlobServiceClient } from "@azure/storage-blob";
import { BlobServiceClientWithFallBack } from "@pagopa/azure-storage-migration-kit";
import {
  azureFunction,
  httpAzureFunction,
} from "@pagopa/handler-kit-azure-func";
import { loadConfigFromEnvironment } from "io-fims-common/adapters/config";
import { initCosmos } from "io-fims-common/adapters/cosmos/index";
import healthHandler from "io-fims-common/adapters/handlers/health";
import { HealthUseCase } from "io-fims-common/use-cases/health";

import { Config, configFromEnvironment } from "./adapters/config.js";
/*import { CosmosOIDCClientRepository } from "./adapters/cosmos/oidc-client.js";
import {
  createOIDCClientHandler,
  inputDecoder,
} from "./adapters/handlers/create-oidc-client.js";*/
import {
  auditEventInputDecoder,
  manageAuditEventHandler,
} from "./adapters/handlers/upsert-audit-event.js";
import { BlobAuditEventRepository } from "./infra/storage/audit-event.js";

async function main(config: Config) {
  const cosmos = initCosmos(config.cosmos, new DefaultAzureCredential());
  const health = new HealthUseCase([cosmos.healthChecker]);

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

  const containerClient = blobServiceClientWithFallback.getContainerClient(
    config.auditEventStorage.containerName,
  );

  //const oidcClientRepository = new CosmosOIDCClientRepository(cosmos.database);
  const auditEventRepository = new BlobAuditEventRepository(containerClient);

  app.http("Health", {
    handler: httpAzureFunction(healthHandler)({
      health,
    }),
    methods: ["GET", "POST"],
    route: "health",
  });

  /*app.storageQueue("CreateOIDCClient", {
    connection: config.storage.connectionPrefix,
    handler: azureFunction(createOIDCClientHandler)({
      inputDecoder,
      oidcClientRepository,
    }),
    queueName: config.storage.queue.config.name,
  });*/

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
