import { SessionRepository } from "@/domain/session.js";
import { claims } from "@/domain/user-metadata.js";
import Provider, * as oidc from "oidc-provider";

import { findAccount } from "./account.js";

const oidcClaims: oidc.Configuration["claims"] = Object.entries(claims).reduce(
  (acc, [scope, claims]) => ({
    ...acc,
    [scope]: [...claims],
  }),
  {},
);

export function createProvider(
  issuer: string,
  sessionRepository: SessionRepository,
  adapter: oidc.AdapterConstructor | oidc.AdapterFactory,
  cookieKeys: string[],
  keyStore?: oidc.CustomKeyStore,
) {
  const provider = new Provider(issuer, {
    adapter,
    claims: oidcClaims,
    clientAuthMethods: ["client_secret_basic"],
    extraClientMetadata: {
      properties: ["redirect_display_names"],
    },
    features: {
      customKeyStore: {
        enabled: typeof keyStore !== "undefined",
        keyStore,
      },
      devInteractions: {
        enabled: false,
      },
    },
    findAccount: findAccount({ sessionRepository }),
    pkce: {
      required: () => false,
    },
    renderError(ctx, out) {
      ctx.type = "application/json";
      ctx.body = out;
    },
    responseTypes: ["code", "id_token"],
    routes: {
      authorization: "/authorize",
      userinfo: "/userinfo",
    },
    ttl: {
      AccessToken: 60,
      AuthorizationCode: 60,
      Grant: 60,
      IdToken: 60,
      Interaction: 5 * 60,
      Session: 5 * 60,
    },
    cookies: {
      keys: cookieKeys,
    },
  });
  // Configure the OIDC provider to trust the X-Forwarded-* headers.
  // https://github.com/panva/node-oidc-provider/blob/main/docs/README.md#trusting-tls-offloading-proxies
  provider.proxy = true;
  return provider;
}
