"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConfig = void 0;
const E = __importStar(require("fp-ts/Either"));
const D = __importStar(require("io-ts/Decoder"));
const packageJson = __importStar(require("../package.json"));
const decoders_1 = require("./utils/decoders");
/* eslint-disable */
const envDecoder = D.struct({
    APPLICATION_NAME: D.string,
    LOG_LEVEL: D.literal("error", "warn", "info", "http", "verbose", "debug", "silly"),
    SERVER_HOSTNAME: D.string,
    PORT: D.string,
    // OIDC Client Configurations
    BASE_URL: D.string,
    CLIENT_ID: D.string,
    ISSUER_BASE_URL: D.string,
    OIDC_SCOPES: D.string,
    SECRET: D.string,
    SILENT_LOGIN_ENABLED: decoders_1.booleanDecoder,
    AUTH_REQUIRED_ON_ALL_ROUTES: decoders_1.booleanDecoder,
});
const makeConfigFromStr = (str) => ({
    // TODO: Improve the fetch of info
    info: {
        name: packageJson.name,
        version: packageJson.version,
    },
    logger: {
        logLevel: str.LOG_LEVEL,
        logName: str.APPLICATION_NAME,
    },
    oidcClient: {
        authRequired: str.AUTH_REQUIRED_ON_ALL_ROUTES,
        baseURL: str.BASE_URL,
        clientId: str.CLIENT_ID,
        issuerBaseURL: str.ISSUER_BASE_URL,
        scopes: str.OIDC_SCOPES,
        secret: str.SECRET,
        silentLoginEnabled: str.SILENT_LOGIN_ENABLED,
    },
    server: {
        hostname: str.SERVER_HOSTNAME,
        port: str.PORT,
    },
});
const parseConfig = (processEnv) => {
    const result = envDecoder.decode(Object.assign({}, processEnv));
    return E.map(makeConfigFromStr)(result);
};
exports.parseConfig = parseConfig;
//# sourceMappingURL=config.js.map