import { ConfigParams, Session } from "express-openid-connect";
import { Request, Response } from "express";
import { Logger } from "../logger/index.js";
import { AuthorizationParameters } from "openid-client";

interface ClientConfig {
  readonly clientId: string;
  readonly issuerBaseURL: string;
  readonly baseURL: string;
  readonly secret: string;
  readonly clientSecret: string;
  readonly authRequired: boolean;
  readonly scopes: string;
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
    const authParams: AuthorizationParameters = {
      response_mode: "form_post",
      response_type: "code",
      scope: config.scopes,
    };
    return {
      afterCallback: logIdToken(logger),
      clientSecret: config.clientSecret,
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
