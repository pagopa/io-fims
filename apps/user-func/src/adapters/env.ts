import { cosmosEnvSchema, nodeEnvSchema } from "io-fims-common/adapters/env";
import { queueServiceUriSchema } from "io-fims-common/zod-schemas";
import { z } from "zod";

export const envSchema = nodeEnvSchema.and(cosmosEnvSchema).and(
  z
    .object({
      ACCESS_QUEUE_NAME: z.string().min(1),
      EXPORT_QUEUE_NAME: z.string().min(1),
      FIMS_STORAGE__queueServiceUri: queueServiceUriSchema,
      MAIL_FROM: z.string().min(1),
    })
    .and(
      z.discriminatedUnion("NODE_ENV", [
        z.object({
          MAILUP_SECRET: z.string().min(1),
          MAILUP_USERNAME: z.string().min(1),
          NODE_ENV: z.literal("production"),
        }),
        z.object({
          MAILHOG_HOSTNAME: z.literal("localhost"),
          NODE_ENV: z.literal("development"),
        }),
      ]),
    ),
);
