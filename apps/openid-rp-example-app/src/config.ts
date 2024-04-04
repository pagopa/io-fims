import * as E from "fp-ts/Either";
import * as D from "io-ts/Decoder";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings.js";
import * as packageJson from "../package.json";
import * as logger from "./logger/index.js";
import { ClientConfig } from "./oidc/client-utils.js";
import { booleanDecoder } from "./utils/decoders.js";

interface ServerConfig {
  readonly hostname: string;
  readonly port: string;
}

interface Info {
  readonly name: NonEmptyString;
  readonly version: NonEmptyString;
}

interface Config {
  readonly server: ServerConfig;
  readonly logger: logger.LogConfig;
  readonly info: Info;
  readonly oidcClient: ClientConfig;
}

type ConfEnv = NodeJS.ProcessEnv;

/* eslint-disable */
const envDecoder = D.struct({
  APPLICATION_NAME: D.string,
  LOG_LEVEL: D.literal(
    "error",
    "warn",
    "info",
    "http",
    "verbose",
    "debug",
    "silly"
  ),
  SERVER_HOSTNAME: D.string,
  PORT: D.string,
  // OIDC Client Configurations
  BASE_URL: D.string,
  CLIENT_ID: D.string,
  ISSUER_BASE_URL: D.string,
  OIDC_SCOPES: D.string,
  SECRET: D.string,
  SILENT_LOGIN_ENABLED: booleanDecoder,
  AUTH_REQUIRED_ON_ALL_ROUTES: booleanDecoder,
});
/* eslint-enable */
type EnvStruct = D.TypeOf<typeof envDecoder>;

const makeConfigFromStr = (str: EnvStruct): Config => ({
  // TODO: Improve the fetch of info
  info: {
    name: packageJson.default.name as NonEmptyString,
    version: packageJson.default.version as NonEmptyString,
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

const parseConfig = (processEnv: ConfEnv): E.Either<D.DecodeError, Config> => {
  const result = envDecoder.decode({ ...processEnv });
  return E.map(makeConfigFromStr)(result);
};

export { Config, parseConfig };
