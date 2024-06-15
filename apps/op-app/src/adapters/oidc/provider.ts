import { SessionRepository } from "@/domain/session.js";
import { claims } from "@/domain/user-metadata.js";
import Provider, * as oidc from "oidc-provider";

import { findAccount } from "./account.js";

export const createProvider = (
  issuer: string,
  sessionRepository: SessionRepository,
  adapter: oidc.AdapterConstructor | oidc.AdapterFactory,
): Provider =>
  new Provider(issuer, {
    adapter,
    claims: Object.entries(claims).reduce(
      (acc, [scope, claims]) => ({
        ...acc,
        [scope]: [...claims],
      }),
      {},
    ),
    clientAuthMethods: ["none"],
    extraClientMetadata: {
      properties: ["redirect_display_names"],
    },
    features: {
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
    ttl: {
      AccessToken: 60,
      AuthorizationCode: 60,
      Grant: 60,
      IdToken: 60,
      Interaction: 5 * 60,
      Session: 5 * 60,
    },
  });
