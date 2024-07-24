import type * as oidc from "openid-client";

import express from "express";
import { ErrorRequestHandler } from "express";
import rateLimit from "express-rate-limit";
import session from "express-session";
import helmet from "helmet";
import * as assert from "node:assert/strict";
import * as crypto from "node:crypto";
import { Logger } from "pino";
import { pinoHttp } from "pino-http";
import { z } from "zod";

import { Profile, profileSchema } from "./profile.js";

declare module "express-session" {
  interface SessionData {
    profile: Profile;
  }
}

export function createApplication(
  sessionSecret: string,
  logger: Logger,
  oidcClient: oidc.Client,
) {
  const app = express();

  app.disable("x-powered-by");
  app.enable("trust proxy");
  app.set("view engine", "ejs");

  app.use(
    pinoHttp({
      logger,
      quietReqLogger: true,
    }),
  );

  app.use(helmet());

  app.use(
    session({
      resave: true,
      saveUninitialized: true,
      secret: sessionSecret,
      cookie: {
        secure: true,
        sameSite: true,
      },
    }),
  );

  app.use(rateLimit());

  app.get("/", async (req, res, next) => {
    if (
      typeof req.query.sid === "string" &&
      req.session.id !== req.query.sid &&
      !req.session.profile
    ) {
      const sid = req.query.sid;
      req.sessionStore.load(sid, (err, session) => {
        if (err) {
          next(err);
        } else if (typeof session === "undefined") {
          next(new Error("Session not found"));
        } else {
          req.session.profile = session.profile;
          req.sessionStore.destroy(sid, (err) => next(err));
        }
      });
    } else {
      next();
    }
  });

  app.get("/", (req, res, next) => {
    if (!req.session.profile) {
      const redirectTo = oidcClient.authorizationUrl({
        response_mode: "query",
        response_type: "code",
        scope: "openid profile",
        state: crypto.randomBytes(15).toString("hex"),
      });
      res.redirect(redirectTo);
    } else {
      next();
    }
  });

  app.get("/", (req, res) => {
    res.render("index", { profile: req.session.profile });
  });

  app.get("/callback", async (req, res, next) => {
    try {
      const querySchema = z.object({
        code: z.string().min(1),
        iss: z.string().url(),
      });
      const params = querySchema.parse(req.query);

      const redirectUri = oidcClient.metadata.redirect_uris?.at(0);
      assert.ok(typeof redirectUri !== "undefined");

      const response = await oidcClient.callback(redirectUri, params);
      const callbackResponseSchema = z.object({
        access_token: z.string(),
      });
      const tokenSet = callbackResponseSchema.parse(response);
      const userinfo = await oidcClient.userinfo(tokenSet.access_token);
      const profile = profileSchema.parse(userinfo);
      req.session.profile = profile;
      res.redirect(`/?sid=${req.session.id}`);
    } catch (err) {
      next(err);
    }
  });

  app.get("/health", (req, res) => {
    res.status(204).end();
  });

  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
      next(err);
    } else {
      res.render("index", {
        error: {
          message:
            err instanceof Error
              ? err.message
              : "Si è verificato un errore inaspettato.",
        },
      });
    }
  };

  app.use(errorHandler);

  return app;
}
