import { cosmosEnvSchema, nodeEnvSchema } from "io-fims-common/adapters/env";
import { queueServiceUriSchema } from "io-fims-common/zod-schemas";
import { z } from "zod";

export const envSchema = nodeEnvSchema.and(cosmosEnvSchema).and(
  z.object({
    FIMS_STORAGE__queueServiceUri: queueServiceUriSchema,
    CONFIG_QUEUE_NAME: z.string().min(1),
    AUDIT_EVENT_QUEUE_NAME: z.string().min(1),
    AUDIT_STORAGE_URI: z.string().url(),
    AUDIT_EVENT_CONTAINER_NAME: z.string().min(1),
  }),
);
