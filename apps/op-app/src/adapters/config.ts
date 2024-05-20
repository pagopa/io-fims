import { z } from "zod";

import { cosmosConfigSchema } from "./cosmos/config.js";
import { oidcConfigSchema } from "./oidc/config.js";
import { expressConfigSchema } from "./express/config.js";
import { ioConfigSchema } from "./io/config.js";

import { envSchema } from "./env.js";

export const configSchema = z.object({
  cosmos: cosmosConfigSchema,
  oidc: oidcConfigSchema,
  express: expressConfigSchema,
  io: ioConfigSchema,
});

export type Config = z.TypeOf<typeof configSchema>;

export const configFromEnvironment = envSchema
  .transform(
    (env): Config => ({
      cosmos: {
        endpoint: env.COSMOS_ENDPOINT,
        databaseName: env.COSMOS_DBNAME,
      },
      oidc: {
        issuer: env.OIDC_ISSUER,
      },
      express: {
        environment: env.NODE_ENVIRONMENT,
      },
      io: {
        baseUrl: env.IO_BASE_URL,
      },
    }),
  )
  .pipe(configSchema);
