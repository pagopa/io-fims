import { loadConfigFromEnvironment } from "io-fims-common/adapters/config";
import { Issuer } from "openid-client";
import { pino } from "pino";
import { z } from "zod";

import { createApplication } from "./app.js";

const configSchema = z.object({
  OIDC_CLIENT_ID: z.string().min(1),
  OIDC_CLIENT_REDIRECT_URI: z.string().url(),
  OIDC_CLIENT_SECRET: z.string().min(1),
  OIDC_ISSUER_URL: z.string().min(1),
  PORT: z.string().default("3000"),
  SESSION_SECRET: z.string().min(1),
});

type Config = z.TypeOf<typeof configSchema>;

async function main(config: Config) {
  const logger = pino({
    level: process.env.NODE_ENV === "development" ? "debug" : "error",
  });

  const issuer = await Issuer.discover(config.OIDC_ISSUER_URL);

  const oidcClient = new issuer.Client({
    client_id: config.OIDC_CLIENT_ID,
    client_secret: config.OIDC_CLIENT_SECRET,
    redirect_uris: [config.OIDC_CLIENT_REDIRECT_URI],
    token_endpoint_auth_method: "client_secret_basic",
  });

  const app = createApplication(config.SESSION_SECRET, logger, oidcClient);

  app.listen(config.PORT);
}

loadConfigFromEnvironment(configSchema, main);
