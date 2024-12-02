import { cosmosEnvSchema, nodeEnvSchema } from "io-fims-common/adapters/env";
import { z } from "zod";

export const envSchema = nodeEnvSchema.and(cosmosEnvSchema).and(
  z.object({
    ACCESS_QUEUE_URL: z.string().min(1),
    AUDIT_EVENT_QUEUE_URL: z.string().url(),
    KEY_VAULT_KEY_NAME: z.string().min(1),
    KEY_VAULT_URL: z.string().url(),
    LOLLIPOP_API_KEY: z.string().min(1),
    LOLLIPOP_BASE_URL: z.string().url(),
    OIDC_ISSUER: z.string().url(),
    PORT: z.string().default("3000"),
    REDIS_PASSWORD: z.string().min(1),
    REDIS_PING_INTERVAL: z.coerce.number(),
    REDIS_URL: z.string().url(),
    SESSION_MANAGER_BASE_URL: z.string().url(),
  }),
);
