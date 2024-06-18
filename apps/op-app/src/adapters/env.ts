import { cosmosEnvSchema, nodeEnvSchema } from "io-fims-common/adapters/env";
import { z } from "zod";

export const envSchema = nodeEnvSchema.and(cosmosEnvSchema).and(
  z.object({
    IO_BASE_URL: z.string().url(),
    OIDC_ISSUER: z.string().url(),
    PORT: z.string().default("3000"),
    REDIS_PASSWORD: z.string().min(1),
    REDIS_PING_INTERVAL: z.coerce.number(),
    REDIS_URL: z.string().url(),
  }),
);
