import express from "express";
import type Provider from "oidc-provider";

import { pinoHttp } from "pino-http";

import { ExpressConfig } from "./config.js";
import { Logger } from "pino";

export const createApplication = (
  config: ExpressConfig,
  provider: Provider,
  logger: Logger,
): express.Application => {
  const app = express();
  app.disable("x-powered-by");

  app.use(
    pinoHttp({
      logger,
    }),
  );

  if (config.environment === "development") {
    app.get("/echo", (req, res) => {
      res.json({
        query: req.query,
      });
    });
  }

  app.use(provider.callback());

  return app;
};
