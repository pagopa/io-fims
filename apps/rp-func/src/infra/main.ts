import { CosmosClient } from "@azure/cosmos";
import { app } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";

import { configSchema } from "./config.js";
import { CosmosOIDCClientConfigRepository } from "./cosmosdb/oidc-client-config.js";
import { createOIDCClientConfigHandler } from "./handlers/create-oidc-client-config.js";
import { healthCheckHandler } from "./handlers/health-check.js";

const config = configSchema.parse({
  cosmos: {
    databaseName: process.env.COSMOS_DB_NAME,
    endpoint: process.env.COSMOS_DB_URI,
  },
});

const cosmosClient = new CosmosClient({
  aadCredentials: new DefaultAzureCredential(),
  endpoint: config.cosmos.endpoint,
});

const database = cosmosClient.database(config.cosmos.databaseName);

const oidcClientConfigRepository = new CosmosOIDCClientConfigRepository(
  database,
);

app.http("Health", {
  authLevel: "anonymous",
  handler: httpAzureFunction(healthCheckHandler)({}),
  methods: ["GET"],
  route: "health",
});

// CreateOIDCClientConfig manages the creation
// and persistence (via upsert) of OIDCClientConfig objects
app.http("CreateOIDCClientConfig", {
  authLevel: "function",
  handler: httpAzureFunction(createOIDCClientConfigHandler)({
    oidcClientConfigRepository,
  }),
  methods: ["PUT"],
  route: "oidc-client-configs",
});
