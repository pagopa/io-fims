import { cosmosEnvSchema, nodeEnvSchema } from "io-fims-common/adapters/env";
import { z } from "zod";

export const envSchema = nodeEnvSchema.and(cosmosEnvSchema).and(
  z.object({
    CONFIG_QUEUE_queueServiceUri: z
      .string()
      .regex(
        /https:\/\/([a-z]+).queue.core.windows.net\/([a-z][a-z|-]*[a-z]+)/,
      ),
  }),
);
