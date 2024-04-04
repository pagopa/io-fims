import { app } from "@azure/functions";

import { CosmosClient } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";

import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";

import { healthCheckHandler } from "./handlers/health-check.js";
import { createOIDCClientConfigHandler } from "./handlers/create-oidc-client-config.js";

import { CosmosOIDCClientConfigRepository } from "./cosmosdb/oidc-client-config.js";

import { configSchema } from "./config.js";

const config = configSchema.parse({
  cosmos: {
    endpoint: process.env.COSMOS_DB_ENDPOINT,
    databaseName: process.env.COSMOS_DB_NAME,
  },
});

const credential = new DefaultAzureCredential();

const cosmosClient = new CosmosClient({
  endpoint: config.cosmos.endpoint,
  aadCredentials: credential,
});

const database = cosmosClient.database("relying-party");

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
  methods: ["POST"],
  authLevel: "function",
  route: "oidc-client-configs",
  handler: httpAzureFunction(createOIDCClientConfigHandler)({
    oidcClientConfigRepository,
  }),
});
