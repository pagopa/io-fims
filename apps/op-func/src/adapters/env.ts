import { cosmosEnvSchema, nodeEnvSchema } from "io-fims-common/adapters/env";
import { queueServiceUriSchema } from "io-fims-common/zod-schemas";
import { z } from "zod";

export const envSchema = nodeEnvSchema.and(cosmosEnvSchema).and(
  z.object({
    AUDIT_EVENT_CONTAINER_NAME: z.string().min(1),
    AUDIT_EVENT_QUEUE_NAME: z.string().min(1),
    AUDIT_STORAGE_URI: z.string().url(),
    AUDIT_STORAGE_FALLBACK_URI: z.string().url(),
    CONFIG_QUEUE_NAME: z.string().min(1),
    FIMS_STORAGE__queueServiceUri: queueServiceUriSchema,
  }),
);
