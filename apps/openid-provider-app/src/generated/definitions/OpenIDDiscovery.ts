/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import * as t from "io-ts";

/**
 * The OpenID configuration document as defined by the specification: http://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
 */

// required attributes
const OpenIDDiscoveryR = t.interface({
  jwks_uri: t.string,

  subject_types_supported: t.readonlyArray(t.string, "array of string"),

  token_endpoint: t.string,

  id_token_signing_alg_values_supported: t.readonlyArray(
    t.string,
    "array of string",
  ),

  response_types_supported: t.readonlyArray(t.string, "array of string"),

  authorization_endpoint: t.string,

  issuer: t.string,
});

// optional attributes
const OpenIDDiscoveryO = t.partial({
  userinfo_endpoint: t.string,

  scopes_supported: t.readonlyArray(t.string, "array of string"),

  claims_supported: t.readonlyArray(t.string, "array of string"),

  grant_types_supported: t.readonlyArray(t.string, "array of string"),

  acr_values_supported: t.readonlyArray(t.string, "array of string"),

  token_endpoint_auth_methods_supported: t.readonlyArray(
    t.string,
    "array of string",
  ),

  token_endpoint_auth_signing_alg_values_supported: t.readonlyArray(
    t.string,
    "array of string",
  ),

  display_values_supported: t.readonlyArray(t.string, "array of string"),

  claim_types_supported: t.readonlyArray(t.string, "array of string"),

  service_documentation: t.string,

  ui_locales_supported: t.readonlyArray(t.string, "array of string"),
});

export const OpenIDDiscovery = t.intersection(
  [OpenIDDiscoveryR, OpenIDDiscoveryO],
  "OpenIDDiscovery",
);

export type OpenIDDiscovery = t.TypeOf<typeof OpenIDDiscovery>;
