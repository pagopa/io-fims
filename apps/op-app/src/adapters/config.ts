import { z } from "zod";

import { cosmosConfigSchema } from "io-fims-common/adapters/cosmos/config";
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
      baseUrl: env.IO_BASE_URL,
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
