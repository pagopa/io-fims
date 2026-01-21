import { cosmosConfigSchema } from "io-fims-common/adapters/cosmos/config";
import { z } from "zod";

import { initializeAppInsights } from "./app-insights/index.js";
import { envSchema } from "./env.js";
import { ioConfigSchema } from "./io/config.js";
import { keyVaultConfigSchema } from "./keyvault/config.js";
import { oidcConfigSchema } from "./oidc/config.js";
import { redisConfigSchema } from "./redis/config.js";

export const storageQueueConfigSchema = z.object({
  accessQueueUrl: z.string().url(),
  eventsQueueUrl: z.string().url(),
});

export const appInsightsConfigSchema = z.object({
  cloudName: z.string(),
  connectionString: z.string(),
});

export const configSchema = z.object({
  appInsights: appInsightsConfigSchema.optional(),
  cosmos: cosmosConfigSchema,
  io: ioConfigSchema,
  keyVault: keyVaultConfigSchema,
  oidc: oidcConfigSchema,
  redis: redisConfigSchema,
  storageQueue: storageQueueConfigSchema,
});

export type Config = z.TypeOf<typeof configSchema>;

export const configFromEnvironment = envSchema.transform(
  (env): Config => ({
    appInsights: env.APPLICATIONINSIGHTS_CONNECTION_STRING
      ? {
          cloudName: env.WEBSITE_SITE_NAME,
          connectionString: env.APPLICATIONINSIGHTS_CONNECTION_STRING,
        }
      : undefined,
    cosmos: {
      databaseName: env.COSMOS_DBNAME,
      endpoint: env.COSMOS_ENDPOINT,
    },
    io: {
      lollipop: {
        apiKey: env.LOLLIPOP_API_KEY,
        baseUrl: env.LOLLIPOP_BASE_URL,
      },
      sessionManager: {
        baseUrl: env.SESSION_MANAGER_BASE_URL,
      },
    },
    keyVault: {
      keyName: env.KEY_VAULT_KEY_NAME,
      url: env.KEY_VAULT_URL,
    },
    oidc: {
      cookieKeys: [env.COOKIE_KEY],
      issuer: env.OIDC_ISSUER,
    },
    redis: {
      password: env.REDIS_PASSWORD,
      pingInterval: env.REDIS_PING_INTERVAL,
      url: env.REDIS_URL,
    },
    storageQueue: {
      accessQueueUrl: env.ACCESS_QUEUE_URL,
      eventsQueueUrl: env.AUDIT_EVENT_QUEUE_URL,
    },
  }),
);

export function initializeConfig(config: Config) {
  if (config.appInsights) {
    initializeAppInsights(config.appInsights);
  }
}
