import { app } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import {
  azureFunction,
  httpAzureFunction,
} from "@pagopa/handler-kit-azure-func";
import { loadConfigFromEnvironment } from "io-fims-common/adapters/config";
import { initCosmos } from "io-fims-common/adapters/cosmos/index";
import healthHandler from "io-fims-common/adapters/handlers/health";
import { HealthUseCase } from "io-fims-common/use-cases/health";

import { Config, configFromEnvironment } from "./adapters/config.js";
import { CosmosOIDCClientRepository } from "./adapters/cosmos/oidc-client.js";
import {
  createOIDCClientHandler,
  inputDecoder,
} from "./adapters/handlers/create-oidc-client.js";

async function main(config: Config) {
  const cosmos = initCosmos(config.cosmos, new DefaultAzureCredential());
  const health = new HealthUseCase([cosmos.healthChecker]);

  const oidcClientRepository = new CosmosOIDCClientRepository(cosmos.database);

  app.http("Health", {
    handler: httpAzureFunction(healthHandler)({
      health,
    }),
    methods: ["GET", "POST"],
    route: "health",
  });

  app.storageQueue("CreateOIDCClient", {
    connection: config.storage.queue.config.connectionPrefix,
    handler: azureFunction(createOIDCClientHandler)({
      inputDecoder,
      oidcClientRepository,
    }),
    queueName: config.storage.queue.config.name,
  });
}

await loadConfigFromEnvironment(configFromEnvironment, main);
