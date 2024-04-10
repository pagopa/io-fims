import path from "path";
import express from "express";
import { auth } from "express-openid-connect";
import { Config } from "./config.js";
import { Logger } from "./logger/index.js";
import { makeRouter } from "./routes/index.js";
import { makeAuthConfig } from "./oidc/client-utils.js";
import { rateLimit } from "express-rate-limit";

type Application = express.Application;

const makeErrorRequestHandler =
  (logger: Logger): express.ErrorRequestHandler =>
  (err, _req, resp, _next) => {
    logger.error(`Something went wrong. Error: ${err}`);
    logger.error(`Stack: \n${err.stack}`);
    resp.status(500).render("error", {
      error: err,
      message: err.message,
    });
  };

/* eslint-disable */
const propagateUserInfoToViews =
  (): express.RequestParamHandler => (req, resp, next) => {
    resp.locals.user = req.oidc.user;
    next();
  };
/* eslint-enable */

const makeApplication = (config: Config, logger: Logger): Application => {
  const application = express();

  var limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // max 1000 requests per windowMs
  });

  // apply rate limiter to all requests
  application.use(limiter);

  // Serve static files
  application.use(express.static(path.join(__dirname, "public")));

  // Add a middleware that parses JSON HTTP
  // request bodies into JavaScript objects
  application.use(express.json());
  // Add a middleware that parses form-url-encoded requests
  application.use(express.urlencoded({ extended: true }));

  application.use(auth(makeAuthConfig(logger)(config.oidcClient)));

  // Register routers
  application.use(makeRouter(logger)(config));

  // Register error handler
  application.use(makeErrorRequestHandler(logger));

  // Middleware to make the user object available for all views
  application.use(propagateUserInfoToViews);

  const serverConfig = config.server;
  application.set("port", serverConfig.port);
  application.set("hostname", serverConfig.hostname);

  // Template engine configuration
  application.set("views", path.join(__dirname, "views"));
  application.set("view engine", "ejs");
  return application;
};

export { Application, makeApplication };
