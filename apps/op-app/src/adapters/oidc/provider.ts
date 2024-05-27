import Provider, * as oidc from "oidc-provider";

export const createProvider = (
  issuer: string,
  findAccount: oidc.FindAccount,
  adapter: oidc.AdapterConstructor | oidc.AdapterFactory,
): Provider =>
  new Provider(issuer, {
    adapter,
    claims: {
      family_name: null,
      fiscal_code: null,
      given_name: null,
      name: null,
      openid: ["sub"],
      profile: ["name", "given_name", "family_name", "fiscal_code"],
    },
    clientAuthMethods: ["none"],
    features: {
      devInteractions: {
        enabled: true,
      },
    },
    findAccount,
    pkce: {
      required: () => false,
    },
    responseTypes: ["code"],
  });
