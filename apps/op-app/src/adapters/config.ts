import { cosmosConfigSchema } from "io-fims-common/adapters/cosmos/config";
import { z } from "zod";

import { envSchema } from "./env.js";
import { ioConfigSchema } from "./io/config.js";
import { oidcConfigSchema } from "./oidc/config.js";
import { redisConfigSchema } from "./redis/config.js";

export const configSchema = z.object({
  cosmos: cosmosConfigSchema,
  io: ioConfigSchema,
  oidc: oidcConfigSchema,
  redis: redisConfigSchema,
});

export type Config = z.TypeOf<typeof configSchema>;

export const configFromEnvironment = envSchema.transform(
  (env): Config => ({
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
    oidc: {
      issuer: env.OIDC_ISSUER,
    },
    redis: {
      password: env.REDIS_PASSWORD,
      pingInterval: env.REDIS_PING_INTERVAL,
      url: env.REDIS_URL,
    },
  }),
);
