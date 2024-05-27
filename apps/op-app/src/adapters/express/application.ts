import type Provider from "oidc-provider";

import express from "express";
import { Logger } from "pino";
import { pinoHttp } from "pino-http";

import { ExpressConfig } from "./config.js";

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
