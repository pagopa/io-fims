import { app } from "@azure/functions";
import {
  azureFunction,
  httpAzureFunction,
} from "@pagopa/handler-kit-azure-func";
import { healthCheckHandler } from "./handlers/health-check.js";
import { configSchema } from "./config.js";
import {
  createOIDCClientHandler,
  createOIDCClientInputDecoder,
} from "./handlers/create-oidc-client.js";
import { CosmosClient } from "@azure/cosmos";
import { CosmosOIDCClientRepository } from "./cosmosdb/oidc-client.js";
import { DefaultAzureCredential } from "@azure/identity";

const config = configSchema.parse({
  storage: {
    queue: { name: process.env.STORAGE_QUEUE_NAME },
  },
  cosmos: {
    uri: process.env.COSMOS_DB_URI,
    name: process.env.COSMOS_DB_NAME,
  },
});

const cosmosClient = new CosmosClient({ aadCredentials: new DefaultAzureCredential(), endpoint: config.cosmos.uri });

const database = cosmosClient.database(config.cosmos.name);
const oidcClientRepository = new CosmosOIDCClientRepository(database);

app.http("Health", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: httpAzureFunction(healthCheckHandler)({}),
});

app.storageQueue("CreateOIDCClient", {
  queueName: config.storage.queue.name,
  connection: "CONFIG_QUEUE",
  handler: azureFunction(createOIDCClientHandler)({
    inputDecoder: createOIDCClientInputDecoder,
    oidcClientRepository,
  }),
});
