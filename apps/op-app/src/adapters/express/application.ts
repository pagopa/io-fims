import type { LoginUseCase } from "@/use-cases/login.js";
import type Provider from "oidc-provider";

import { HealthUseCase } from "@/use-cases/health.js";
import { LogAccessUseCase } from "@/use-cases/log-access.js";
import { SendEventMessageUseCase } from "@/use-cases/send-event-messge.js";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { Logger } from "pino";
import { pinoHttp } from "pino-http";

import errorHandler from "./error.js";
import i18n from "./i18n.js";
import healthRouter from "./routes/health.js";
import interactionRouter from "./routes/interaction.js";

export const createApplication = (
  oidc: Provider,
  login: LoginUseCase,
  event: SendEventMessageUseCase,
  logAccess: LogAccessUseCase,
  health: HealthUseCase,
  logger: Logger,
): express.Application => {
  const app = express();

  app.disable("x-powered-by");
  app.enable("trust proxy");

  app.use(helmet());
  app.use(cookieParser());
  app.use(i18n.init);
  app.use(
    pinoHttp({
      logger,
      quietReqLogger: true,
      useLevel: "debug",
    }),
  );

  app.use(interactionRouter(oidc, login, event, logAccess));

  app.use(healthRouter(health));

  app.use(oidc.callback());

  app.use(errorHandler);

  return app;
};
