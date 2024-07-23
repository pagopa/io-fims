/* eslint-disable */
declare module "openid-client" {
  interface ClaimsParameterMember {
    [key: string]: unknown;
    essential?: boolean;
    value?: string;

    values?: string[];
  }

  type UnknownObject = Record<string, unknown>;

  type KnownKeys<T> = {
    [K in keyof T]: string extends K ? never : number extends K ? never : K;
  } extends { [_ in keyof T]: infer U }
    ? {} extends U
      ? never
      : U
    : never;
  type Override<T1, T2> = Omit<T1, keyof Omit<T2, keyof KnownKeys<T2>>> & T2;

  type Address<ExtendedAddress extends {} = UnknownObject> = Override<
    {
      country?: string;
      formatted?: string;
      locality?: string;
      postal_code?: string;
      region?: string;
      street_address?: string;
    },
    ExtendedAddress
  >;

  export interface AuthorizationParameters {
    [key: string]: unknown;
    acr_values?: string;
    audience?: string;
    claims?:
      | {
          id_token?: Record<string, ClaimsParameterMember | null>;
          userinfo?: Record<string, ClaimsParameterMember | null>;
        }
      | string;
    claims_locales?: string;
    client_id?: string;
    code_challenge?: string;
    code_challenge_method?: string;
    display?: string;
    id_token_hint?: string;
    login_hint?: string;
    max_age?: number;
    nonce?: string;
    prompt?: string;
    redirect_uri?: string;
    registration?: string;
    request?: string;
    request_uri?: string;
    resource?: string | string[];
    response_mode?: string;
    response_type?: string;
    scope?: string;
    state?: string;

    ui_locales?: string;
  }

  export interface IdTokenClaims extends UserinfoResponse {
    [key: string]: unknown;
    acr?: string;
    amr?: string[];
    at_hash?: string;
    aud: string | string[];
    auth_time?: number;
    azp?: string;
    c_hash?: string;
    exp: number;
    iat: number;
    iss: string;
    nonce?: string;
    s_hash?: string;

    sub: string;
  }

  export type UserinfoResponse<
    UserInfo extends {} = UnknownObject,
    ExtendedAddress extends {} = UnknownObject
  > = Override<
    {
      address?: Address<ExtendedAddress>;
      birthdate?: string;
      email?: string;
      email_verified?: boolean;
      family_name?: string;
      gender?: string;
      given_name?: string;
      locale?: string;
      middle_name?: string;
      name?: string;
      nickname?: string;
      phone_number?: string;
      picture?: string;
      preferred_username?: string;
      profile?: string;
      sub: string;
      updated_at?: number;
      website?: string;
      zoneinfo?: string;
    },
    UserInfo
  >;
}
declare module "jose" {
  type use = "enc" | "sig";
  type keyOperation =
    | "decrypt"
    | "deriveKey"
    | "encrypt"
    | "sign"
    | "unwrapKey"
    | "verify"
    | "wrapKey";
  type ECCurve = "P-256" | "P-384" | "P-521" | "secp256k1";
  type OKPCurve = "Ed448" | "Ed25519" | "X448" | "X25519";

  interface BasicParameters {
    alg?: string;
    key_ops?: keyOperation[];
    kid?: string;
    use?: use;
  }
  interface KeyParameters extends BasicParameters {
    x5c?: string[];
    x5t?: string;
    "x5t#S256"?: string;
  }

  interface JWKOctKey extends BasicParameters {
    k?: string;
    // no x5c
    kty: "oct";
  }

  interface JWKECKey extends KeyParameters {
    crv: ECCurve;
    d?: string;
    kty: "EC";
    x: string;
    y: string;
  }

  interface JWKOKPKey extends KeyParameters {
    crv: OKPCurve;
    d?: string;
    kty: "OKP";
    x: string;
  }

  interface JWKRSAKey extends KeyParameters {
    d?: string;
    dp?: string;
    dq?: string;
    e: string;
    kty: "RSA";
    n: string;
    p?: string;
    q?: string;
    qi?: string;
  }

  export type JSONWebKey = JWKECKey | JWKOKPKey | JWKOctKey | JWKRSAKey;
  export interface KeyInput {}
}
/* eslint-enable */
