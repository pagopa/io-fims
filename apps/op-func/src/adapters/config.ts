import { eventStorageConfigSchema } from "@/infra/storage/config.js";
import { cosmosConfigSchema } from "io-fims-common/adapters/cosmos/config";
import { z } from "zod";

import { envSchema } from "./env.js";
import { storageBindingSchema } from "./storage-queue/config.js";

export const configSchema = z.object({
  cosmos: cosmosConfigSchema,
  auditEventStorage: eventStorageConfigSchema,
  storage: storageBindingSchema,
});

export type Config = z.TypeOf<typeof configSchema>;

export const configFromEnvironment = envSchema
  .transform(
    (env): Config => ({
      cosmos: {
        databaseName: env.COSMOS_DBNAME,
        endpoint: env.COSMOS_ENDPOINT,
      },
      auditEventStorage: {
        containerName: env.AUDIT_EVENT_CONTAINER_NAME,
        uri: env.AUDIT_STORAGE_URI,
      },
      storage: {
        connectionPrefix: "FIMS_STORAGE",
        queue: {
          config: {
            name: env.CONFIG_QUEUE_NAME,
          },
          auditEvents: {
            name: env.AUDIT_EVENT_QUEUE_NAME,
          },
        },
      },
    }),
  )
  .pipe(configSchema);
