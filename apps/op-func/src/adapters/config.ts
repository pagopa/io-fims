import { eventStorageConfigSchema } from "@/infra/storage/config.js";
import { cosmosConfigSchema } from "io-fims-common/adapters/cosmos/config";
import { z } from "zod";

import { envSchema } from "./env.js";
import { eventQueueConfigSchema } from "./event-queue/config.js";
import { storageQueueConfigSchema } from "./storage-queue/config.js";

export const configSchema = z.object({
  cosmos: cosmosConfigSchema,
  eventStorage: eventStorageConfigSchema,
  storage: z.object({
    eventQueue: eventQueueConfigSchema,
    queue: storageQueueConfigSchema,
  }),
});

export type Config = z.TypeOf<typeof configSchema>;

export const configFromEnvironment = envSchema
  .transform(
    (env): Config => ({
      cosmos: {
        databaseName: env.COSMOS_DBNAME,
        endpoint: env.COSMOS_ENDPOINT,
      },
      eventStorage: {
        containerName: env.EVENT_CONTAINER_NAME,
        uri: env.EVENT_STORAGE_URI,
      },
      storage: {
        eventQueue: {
          config: {
            connectionPrefix: "EVENT_QUEUE",
            name: env.EVENT_QUEUE__name,
          },
        },
        queue: {
          config: {
            connectionPrefix: "CONFIG_QUEUE",
            name: env.CONFIG_QUEUE__name,
          },
        },
      },
    }),
  )
  .pipe(configSchema);
