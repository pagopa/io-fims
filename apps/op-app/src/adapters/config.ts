import { z } from "zod";

import { cosmosConfigSchema } from "./cosmos/config.js";
import { envSchema } from "./env.js";
import { expressConfigSchema } from "./express/config.js";
import { ioConfigSchema } from "./io/config.js";
import { oidcConfigSchema } from "./oidc/config.js";

export const configSchema = z.object({
  cosmos: cosmosConfigSchema,
  express: expressConfigSchema,
  io: ioConfigSchema,
  oidc: oidcConfigSchema,
});

export type Config = z.TypeOf<typeof configSchema>;

export const configFromEnvironment = envSchema
  .transform(
    (env): Config => ({
      cosmos: {
        databaseName: env.COSMOS_DBNAME,
        endpoint: env.COSMOS_ENDPOINT,
      },
      express: {
        environment: env.NODE_ENVIRONMENT,
      },
      io: {
        baseUrl: env.IO_BASE_URL,
      },
      oidc: {
        issuer: env.OIDC_ISSUER,
      },
    }),
  )
  .pipe(configSchema);
