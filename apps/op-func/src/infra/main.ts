import { CosmosClient } from "@azure/cosmos";
import { app } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import {
  azureFunction,
  httpAzureFunction,
} from "@pagopa/handler-kit-azure-func";

import { configSchema } from "./config.js";
import { CosmosOIDCClientRepository } from "./cosmosdb/oidc-client.js";
import {
  createOIDCClientHandler,
  createOIDCClientInputDecoder,
} from "./handlers/create-oidc-client.js";
import { healthCheckHandler } from "./handlers/health-check.js";

const config = configSchema.parse({
  cosmos: {
    name: process.env.COSMOS_DB_NAME,
    uri: process.env.COSMOS_DB_URI,
  },
  storage: {
    queue: { name: process.env.STORAGE_QUEUE_NAME },
  },
});

const cosmosClient = new CosmosClient({
  aadCredentials: new DefaultAzureCredential(),
  endpoint: config.cosmos.uri,
});

const database = cosmosClient.database(config.cosmos.name);
const oidcClientRepository = new CosmosOIDCClientRepository(database);

app.http("Health", {
  authLevel: "anonymous",
  handler: httpAzureFunction(healthCheckHandler)({}),
  methods: ["GET"],
  route: "health",
});

app.storageQueue("CreateOIDCClient", {
  connection: "CONFIG_QUEUE",
  handler: azureFunction(createOIDCClientHandler)({
    inputDecoder: createOIDCClientInputDecoder,
    oidcClientRepository,
  }),
  queueName: config.storage.queue.name,
});
