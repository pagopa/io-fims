import { DefaultAzureCredential } from "@azure/identity";
import { pino } from "pino";
import { createClient } from "redis";
import { ZodError, z } from "zod";

import { Config, configFromEnvironment } from "./adapters/config.js";
import { getCosmosDatabase } from "./adapters/cosmos/index.js";
import { createAdapterFactory } from "./adapters/cosmos/oidc/index.js";
import { envSchema } from "./adapters/env.js";
import { createApplication } from "./adapters/express/application.js";
import { IO } from "./adapters/io/user-metadata.js";
import { createProvider } from "./adapters/oidc/provider.js";
import { LoginUseCase } from "./use-cases/login.js";

const webConfig = z.object({
  web: z.object({
    port: z.coerce.number().default(3000),
  }),
});

type WebConfig = z.TypeOf<typeof webConfig>;

const webConfigFromEnvrionment = envSchema
  .transform(({ PORT }) => ({ web: { port: PORT } }))
  .pipe(webConfig);

const logger = pino({
  level: process.env.NODE_ENV === "production" ? "error" : "debug",
});

async function main(config: Config & WebConfig) {
  const redis = createClient(config.redis);

  redis.on("error", (err) => {
    logger.error({ err }, "redis error");
  });

  await redis.connect();
  logger.debug("redis connected");

  const sessionRepository = new RedisSessionRepository(redis);

  const database = getCosmosDatabase(
    config.cosmos,
    new DefaultAzureCredential(),
  );

  const oidc = createProvider(
    config.oidc.issuer,
    sessionRepository,
    createAdapterFactory(database),
  );

  oidc.on("server_error", (ctx, err) => {
    logger.error({ cause: err.cause }, err.message);
  });

  const identityProvider = new IO(config.io.baseUrl);

  const login = new LoginUseCase({
    identityProvider,
    sessionRepository,
  });


  const app = createApplication(oidc, login, logger);

  const server = app.listen(config.web.port, () => {
    logger.info(`http server listening on ${config.web.port}`);
  });

  const cleanup = () => {
    redis.disconnect().then(() => {
      logger.info("redis disconnected");
    });
    server.close(() => {
      logger.info("http server closed");
    });
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

try {
  const config = configFromEnvironment
    .and(webConfigFromEnvrionment)
    .parse(process.env);

  await main(config);
} catch (err) {
  if (err instanceof ZodError) {
    err.issues.forEach((issue) => {
      logger.error({ issue }, "Error parsing environment variable");
    });
  } else if (err instanceof Error) {
    logger.error(
      {
        err,
      },
      err.message,
    );
  } else {
    logger.error(
      {
        err,
      },
      "Unable to start the application due to an unexpected error",
    );
  }
}
