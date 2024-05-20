import Provider, * as oidc from "oidc-provider";

export const createProvider = (
  issuer: string,
  findAccount: oidc.FindAccount,
  adapter: oidc.AdapterConstructor | oidc.AdapterFactory,
): Provider =>
  new Provider(issuer, {
    responseTypes: ["code"],
    claims: {
      openid: ["sub"],
      fiscal_code: null,
      name: null,
      given_name: null,
      family_name: null,
      profile: ["name", "given_name", "family_name", "fiscal_code"],
    },
    clientAuthMethods: ["none"],
    findAccount,
    adapter,
    features: {
      devInteractions: {
        enabled: true,
      },
    },
    pkce: {
      required: () => false,
    },
  });
