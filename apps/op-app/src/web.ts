import { DefaultAzureCredential } from "@azure/identity";
import { pino } from "pino";
import { z } from "zod";

import { configFromEnvironment } from "./adapters/config.js";
import { getCosmosDatabase } from "./adapters/cosmos/index.js";
import { createAdapterFactory } from "./adapters/cosmos/oidc/index.js";
import { envSchema } from "./adapters/env.js";
import { createApplication } from "./adapters/express/application.js";
import { createFindAccount } from "./adapters/io/oidc.js";
import { createProvider } from "./adapters/oidc/provider.js";

const logger = pino({
  level: "error",
});

const webConfigSchema = envSchema
  .transform((env) => ({
    web: {
      port: env.PORT,
    },
  }))
  .pipe(
    z.object({
      web: z.object({
        port: z.coerce.number(),
      }),
    }),
  );

const config = configFromEnvironment
  .and(webConfigSchema)
  .safeParse(process.env);

if (!config.success) {
  logger.error("Unable to parse configuration from environment");
  process.exit(1);
}

const database = getCosmosDatabase(
  config.data.cosmos,
  new DefaultAzureCredential(),
);

const provider = createProvider(
  config.data.oidc.issuer,
  createFindAccount(config.data.io.baseUrl, logger),
  createAdapterFactory(database),
);

provider.on("server_error", (ctx, err) => {
  logger.error({ cause: err.cause }, err.message);
});

const app = createApplication(config.data.express, provider, logger);

app.listen(config.data.web.port);
