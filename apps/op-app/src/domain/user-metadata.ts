import * as E from "fp-ts/lib/Either.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { UserMetadata } from "io-fims-common/domain/user-metadata";
import { z } from "zod";

export const claims = {
  openid: ["sub"],
  profile: ["given_name", "family_name", "fiscal_code"],
} as const;

export type Scope = keyof typeof claims;

// Extracts all the values from the 'claims' object, removing the keys,
// "sub" | "name" | "given_name" | ...
export type Claim = (typeof claims)[Scope][number];

export const metadataForConsentFromScopes = (
  scopes: Scope[],
): (keyof UserMetadata)[] => {
  // fiscalCode will be always shared, because
  // is the subject identifier (sub claim, that is mandatory)
  const metas: (keyof UserMetadata)[] = ["fiscalCode"];
  if (scopes.includes("profile")) {
    metas.push("firstName", "lastName");
  }
  return metas;
};

export const claimsFromUserMetadata = (
  userMetadata: UserMetadata,
): Record<Claim, string> => ({
  family_name: userMetadata.lastName,
  fiscal_code: userMetadata.fiscalCode,
  given_name: userMetadata.firstName,
  sub: userMetadata.fiscalCode,
});

export const federationTokenSchema = z.string().min(1);

export type FederationToken = z.TypeOf<typeof federationTokenSchema>;

export interface IdentityProvider {
  getUserMetadata(token: FederationToken): Promise<UserMetadata>;
}

export const getUserMetadata =
  (token: FederationToken) =>
  ({ identityProvider }: { identityProvider: IdentityProvider }) =>
    TE.tryCatch(() => identityProvider.getUserMetadata(token), E.toError);
