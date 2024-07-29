import { cosmosEnvSchema, nodeEnvSchema } from "io-fims-common/adapters/env";
import { z } from "zod";

export const envSchema = nodeEnvSchema.and(cosmosEnvSchema).and(
  z.object({
    CONFIG_QUEUE__name: z.string().min(1),
    CONFIG_QUEUE__queueServiceUri: z
      .string()
      .regex(/^https:\/\/([a-z]+)\.queue\.core\.windows\.net$/),
    EVENT_CONTAINER_NAME: z.string().min(1),
    EVENT_QUEUE__name: z.string().min(1),
    EVENT_QUEUE__queueServiceUri: z
      .string()
      .regex(/^https:\/\/([a-z]+)\.queue\.core\.windows\.net$/),
    EVENT_STORAGE_URI: z.string().url(),
  }),
);
