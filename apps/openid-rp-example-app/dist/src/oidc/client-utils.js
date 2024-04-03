"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAuthConfig = void 0;
// Method here just for development purpose
const logIdToken = (logger) => (_req, _resp, session) => {
    logger.debug(`IDToken: ${session.id_token}`);
    return session;
};
const makeAuthConfig = (logger) => (config) => {
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
exports.makeAuthConfig = makeAuthConfig;
//# sourceMappingURL=client-utils.js.map