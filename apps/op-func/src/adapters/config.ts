import { cosmosConfigSchema } from "io-fims-common/adapters/cosmos/config";
import { z } from "zod";

import { envSchema } from "./env.js";
import { storageQueueConfigSchema } from "./storage-queue/config.js";

export const configSchema = z.object({
  cosmos: cosmosConfigSchema,
  storage: z.object({
    queue: storageQueueConfigSchema,
  }),
});

export type Config = z.TypeOf<typeof configSchema>;

export const configFromEnvironment = envSchema
  .transform((env) => ({
    cosmos: {
      databaseName: env.COSMOS_DBNAME,
      endpoint: env.COSMOS_ENDPOINT,
    },
    storage: {
      queue: {
        config: {
          connectionPrefix: "CONFIG_QUEUE_",
          name: env.CONFIG_QUEUE_queueServiceUri.split("/").at(-1),
        },
      },
    },
  }))
  .pipe(configSchema);
