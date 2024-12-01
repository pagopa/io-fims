import { DefaultAzureCredential } from "@azure/identity";
import { QueueClient } from "@azure/storage-queue";
import { loadConfigFromEnvironment } from "io-fims-common/adapters/config";
import { initCosmos } from "io-fims-common/adapters/cosmos/index";
import { StorageQueueEventEmitter } from "io-fims-common/adapters/storage-queue/event-emitter";
import { AccessMetadata } from "io-fims-common/domain/access-metadata";
import { AuditEvent } from "io-fims-common/domain/audit-event";
import { pino } from "pino";
import { createClient } from "redis";
import { z } from "zod";

import { Config, configFromEnvironment } from "./adapters/config.js";
import { createAdapterFactory } from "./adapters/cosmos/oidc/index.js";
import { envSchema } from "./adapters/env.js";
import { createApplication } from "./adapters/express/application.js";
import { IO } from "./adapters/io/user-metadata.js";
import { KeyVaultKeystore } from "./adapters/keyvault/keystore.js";
import { createTokenMiddleware } from "./adapters/oidc/middleware.js";
import { createProvider } from "./adapters/oidc/provider.js";
import RedisEventRepository from "./adapters/redis/event.js";
import RedisHealthChecker from "./adapters/redis/health.js";
import RedisSessionRepository from "./adapters/redis/session.js";
import { HealthUseCase } from "./use-cases/health.js";
import { LogAccessUseCase } from "./use-cases/log-access.js";
import { LoginUseCase } from "./use-cases/login.js";
import { SendEventMessageUseCase } from "./use-cases/send-event-messge.js";

const webConfig = z.object({
  web: z.object({
    port: z.coerce.number().default(3000),
  }),
});

type WebConfig = z.TypeOf<typeof webConfig>;

const webConfigFromEnvironment = envSchema
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
  const eventRepository = new RedisEventRepository(redis);

  const credential = new DefaultAzureCredential();

  const cosmos = initCosmos(config.cosmos, credential);

  const keyStore = new KeyVaultKeystore(
    config.keyVault.url,
    credential,
    config.keyVault.keyName,
  );

  const oidc = createProvider(
    config.oidc.issuer,
    sessionRepository,
    createAdapterFactory(cosmos.database),
    keyStore,
  );

  oidc.on("server_error", (ctx, err) => {
    logger.error({ cause: err.cause }, err.message);
  });

  const identityProvider = new IO(config.io);

  const login = new LoginUseCase({
    identityProvider,
    sessionRepository,
  });

  const eventUseCase = new SendEventMessageUseCase(
    sessionRepository,
    eventRepository,
    new StorageQueueEventEmitter<AuditEvent>(
      new QueueClient(config.storageQueue.eventsQueueUrl, credential),
    ),
  );

  const logAccess = new LogAccessUseCase(
    sessionRepository,
    new StorageQueueEventEmitter<AccessMetadata>(
      new QueueClient(config.storageQueue.accessQueueUrl, credential),
    ),
  );

  const health = new HealthUseCase([
    cosmos.healthChecker,
    new RedisHealthChecker(redis),
  ]);

  createTokenMiddleware(oidc, eventUseCase, logger);

  const app = createApplication(
    oidc,
    login,
    eventUseCase,
    logAccess,
    health,
    logger,
  );

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

await loadConfigFromEnvironment(
  configFromEnvironment.and(webConfigFromEnvironment),
  main,
);
