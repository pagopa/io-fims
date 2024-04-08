import { app } from "@azure/functions";

import { CosmosClient } from "@azure/cosmos";

import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";

import { healthCheckHandler } from "./handlers/health-check.js";
import { createOIDCClientConfigHandler } from "./handlers/create-oidc-client-config.js";

import { CosmosOIDCClientConfigRepository } from "./cosmosdb/oidc-client-config.js";

import { configSchema } from "./config.js";

const config = configSchema.parse({
  cosmos: {
    connectionString: process.env.COSMOS_DB_CONNECTION_STRING,
    databaseName: process.env.COSMOS_DB_NAME,
  },
});

const cosmosClient = new CosmosClient(config.cosmos.connectionString);

const database = cosmosClient.database(config.cosmos.databaseName);

const oidcClientConfigRepository = new CosmosOIDCClientConfigRepository(
  database,
);

app.http("Health", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: httpAzureFunction(healthCheckHandler)({}),
});

app.http("CreateOIDCClientConfig", {
  methods: ["PUT"],
  authLevel: "function",
  route: "oidc-client-configs",
  handler: httpAzureFunction(createOIDCClientConfigHandler)({
    oidcClientConfigRepository,
  }),
});
