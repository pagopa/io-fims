declare module "openid-client" {
  interface ClaimsParameterMember {
    essential?: boolean;
    value?: string;
    values?: string[];
  
    [key: string]: unknown;
  }

  interface UnknownObject {
    [key: string]: unknown;
  }
  
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
      formatted?: string;
      street_address?: string;
      locality?: string;
      region?: string;
      postal_code?: string;
      country?: string;
    },
    ExtendedAddress
  >;

  export type AuthorizationParameters = {
    acr_values?: string;
    audience?: string;
    claims?:
      | string
      | {
          id_token?: {
            [key: string]: null | ClaimsParameterMember;
          };
          userinfo?: {
            [key: string]: null | ClaimsParameterMember;
          };
        };
    claims_locales?: string;
    client_id?: string;
    code_challenge_method?: string;
    code_challenge?: string;
    display?: string;
    id_token_hint?: string;
    login_hint?: string;
    max_age?: number;
    nonce?: string;
    prompt?: string;
    redirect_uri?: string;
    registration?: string;
    request_uri?: string;
    request?: string;
    resource?: string | string[];
    response_mode?: string;
    response_type?: string;
    scope?: string;
    state?: string;
    ui_locales?: string;

    [key: string]: unknown;
  };

  export interface IdTokenClaims extends UserinfoResponse {
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

    [key: string]: unknown;
  }

  export type UserinfoResponse<
    UserInfo extends {} = UnknownObject,
    ExtendedAddress extends {} = UnknownObject,
  > = Override<
    {
      sub: string;
      name?: string;
      given_name?: string;
      family_name?: string;
      middle_name?: string;
      nickname?: string;
      preferred_username?: string;
      profile?: string;
      picture?: string;
      website?: string;
      email?: string;
      email_verified?: boolean;
      gender?: string;
      birthdate?: string;
      zoneinfo?: string;
      locale?: string;
      phone_number?: string;
      updated_at?: number;
      address?: Address<ExtendedAddress>;
    },
    UserInfo
  >;
}
declare module "jose" {
  type use = 'sig' | 'enc';
  type keyOperation = 'sign' | 'verify' | 'encrypt' | 'decrypt' | 'wrapKey' | 'unwrapKey' | 'deriveKey';
  type ECCurve = 'P-256' | 'secp256k1' | 'P-384' | 'P-521';
  type OKPCurve = 'Ed25519' | 'Ed448' | 'X25519' | 'X448';

  interface BasicParameters {
    alg?: string;
    use?: use;
    kid?: string;
    key_ops?: keyOperation[];
  }
  interface KeyParameters extends BasicParameters {
    x5c?: string[];
    x5t?: string;
    'x5t#S256'?: string;
  }

  interface JWKOctKey extends BasicParameters { // no x5c
    kty: 'oct';
    k?: string;
  }
  
  interface JWKECKey extends KeyParameters {
    kty: 'EC';
    crv: ECCurve;
    x: string;
    y: string;
    d?: string;
  }
  
  interface JWKOKPKey extends KeyParameters {
    kty: 'OKP';
    crv: OKPCurve;
    x: string;
    d?: string;
  }
  
  interface JWKRSAKey extends KeyParameters {
    kty: 'RSA';
    e: string;
    n: string;
    d?: string;
    p?: string;
    q?: string;
    dp?: string;
    dq?: string;
    qi?: string;
  }

  export type JSONWebKey = JWKRSAKey | JWKOKPKey | JWKECKey | JWKOctKey;
  export type KeyInput = {};
}
