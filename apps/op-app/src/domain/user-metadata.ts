import { NonEmptyString } from "@pagopa/ts-commons/lib/strings.js";
import * as E from "fp-ts/lib/Either.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { pipe } from "fp-ts/lib/function.js";
import { z } from "zod";

export const userMetadataSchema = z.object({
  assertion: z.string().min(1),
  assertionRef: z.string().min(1),
  firstName: z.string().min(1),
  fiscalCode: z.string().min(1),
  lastName: z.string().min(1),
  publicKey: z.string().min(1),
});

export type UserMetadata = z.TypeOf<typeof userMetadataSchema>;

export const claims = {
  lollipop: ["public_key", "assertion_ref", "assertion"],
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
  assertion: userMetadata.assertion,
  assertion_ref: userMetadata.assertionRef,
  family_name: userMetadata.lastName,
  fiscal_code: userMetadata.fiscalCode,
  given_name: userMetadata.firstName,
  public_key: userMetadata.publicKey,
  sub: userMetadata.fiscalCode,
});

export const federationTokenSchema = z.string().min(1);

export type FederationToken = z.TypeOf<typeof federationTokenSchema>;

export interface IdentityProvider {
  getUserMetadata(
    token: FederationToken,
    operationId: NonEmptyString,
  ): Promise<UserMetadata>;
}

export const getUserMetadata =
  (token: FederationToken, operationId: string) =>
  ({ identityProvider }: { identityProvider: IdentityProvider }) =>
    pipe(
      NonEmptyString.decode(operationId),
      TE.fromEither,
      TE.flatMap((operationId) =>
        TE.tryCatch(
          () => identityProvider.getUserMetadata(token, operationId),
          E.toError,
        ),
      ),
    );
