import { Request, Response } from "express";
import { ConfigParams, Session } from "express-openid-connect";

import { Logger } from "../logger/index.js";

interface ClientConfig {
  readonly authRequired: boolean;
  readonly baseURL: string;
  readonly clientId: string;
  readonly issuerBaseURL: string;
  readonly scopes: string;
  readonly secret: string;
  readonly silentLoginEnabled: boolean;
}

// Method here just for development purpose
const logIdToken =
  (logger: Logger) => (_req: Request, _resp: Response, session: Session) => {
    logger.debug(`IDToken: ${session.id_token}`);
    return session;
  };

const makeAuthConfig =
  (logger: Logger) =>
  (config: ClientConfig): ConfigParams => {
    // More options available on https://auth0.github.io/express-openid-connect/interfaces/configparams.html
    const authParams = {
      response_mode: "form_post",
      scope: config.scopes,
    };
    return {
      afterCallback: logIdToken(logger),
      attemptSilentLogin: config.silentLoginEnabled,
      authRequired: config.authRequired,
      authorizationParams: authParams,
      baseURL: config.baseURL,
      clientID: config.clientId,
      idTokenSigningAlg: "ES256",
      issuerBaseURL: config.issuerBaseURL,
      secret: config.secret,
      session: {
        // TODO: Take the value from the configuration
        absoluteDuration: 25,
      },
    };
  };

export { ClientConfig, makeAuthConfig };
