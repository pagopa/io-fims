import { TokenCredential } from "@azure/identity";
import { CryptographyClient, KeyClient } from "@azure/keyvault-keys";
import * as assert from "node:assert/strict";
import { createHash } from "node:crypto";
import * as oidc from "oidc-provider";

const stringFromUint8Array = (uint8Array: Uint8Array) =>
  Buffer.from(uint8Array).toString("base64url");

export class KeyVaultKeystore implements oidc.CustomKeyStore {
  #credential: TokenCredential;
  #keyClient: KeyClient;
  #keyName: string;

  constructor(
    keyVaultUrl: string,
    credential: TokenCredential,
    keyName: string,
  ) {
    this.#keyClient = new KeyClient(keyVaultUrl, credential);
    this.#credential = credential;
    this.#keyName = keyName;
  }

  /**
   * Retrieves a JSON Web Key Set (JWKS) containing the public key information from Azure Key Vault.
   *
   * This method fetches the key from Azure Key Vault using the configured key name and transforms it
   * into a JWKS format as per the OpenID Connect specification. The JWKS contains cryptographic key
   * parameters necessary for token verification and encryption operations.
   *
   * @returns {Promise<oidc.JWKS>} A promise that resolves to a JWKS object containing the public key information.
   * The JWKS includes parameters such as curve (crv), exponent (e), key operations (key_ops),
   * key ID (kid), key type (kty), modulus (n), key usage (use), and coordinates (x, y).
   *
   * @throws {Error} If there's any error while fetching the key from KeyVault.
   */
  async jwksResponse(): Promise<oidc.JWKS> {
    try {
      const { key } = await this.#keyClient.getKey(this.#keyName);
      assert.ok(key);
      const jwks: oidc.JWKS = {
        keys: [
          {
            crv: key.crv,
            e: key.e ? stringFromUint8Array(key.e) : undefined,
            key_ops: key.keyOps,
            kid: key.kid,
            kty: key.kty,
            n: key.n ? stringFromUint8Array(key.n) : undefined,
            use: key.keyOps?.includes("encrypt") ? "enc" : "sig",
            x: key.x ? stringFromUint8Array(key.x) : undefined,
            y: key.y ? stringFromUint8Array(key.y) : undefined,
          },
        ],
      };
      return jwks;
    } catch (e) {
      throw new Error("Error fetching key from KeyVault");
    }
  }

  /**
   * Signs a given payload using the specified algorithm and options.
   *
   * @param payload - The payload to be signed.
   * @param alg - The algorithm to be used for signing.
   * @param options - Additional options for signing.
   * @returns A promise that resolves to the signed payload as a Buffer or string.
   *
   * @remarks
   * This method retrieves the key from the key vault, constructs the header and payload,
   * and then signs the payload using the specified algorithm. The resulting signed payload
   * is returned as a string in the format of `header.payload.signature` (JWT).
   *
   * @example
   * ```typescript
   * const signedPayload = await sign(payload, 'RS256', {
   *   typ: 'JWT',
   *   audience: 'example-audience',
   *   expiresIn: 3600,
   *   issuer: 'example-issuer',
   *   subject: 'example-subject',
   * });
   * console.log(signedPayload);
   * ```
   */
  async sign(
    payload: oidc.SignPayload,
    alg: string,
    options: oidc.SignOptions,
  ): Promise<string> {
    const key = await this.#keyClient.getKey(this.#keyName);

    const header = {
      alg,
      typ: options.typ !== undefined ? options.typ : "JWT",
      ...options.fields,
      kid: key.id, // required to identify the key used to sign the token, needed for verification
    };

    // Adapted from https://github.com/panva/node-oidc-provider/blob/main/lib/helpers/jwt.js#L30
    const timestamp = Math.floor(Date.now() / 1000);
    const iat = options.noIat ? undefined : timestamp;
    Object.assign(payload, {
      aud: options.audience !== undefined ? options.audience : payload.aud,
      azp:
        options.authorizedParty !== undefined
          ? options.authorizedParty
          : payload.azp,
      exp:
        options.expiresIn !== undefined
          ? timestamp + options.expiresIn
          : payload.exp,
      iat: payload.iat !== undefined ? payload.iat : iat,
      iss: options.issuer !== undefined ? options.issuer : payload.iss,
      sub: options.subject !== undefined ? options.subject : payload.sub,
    });

    const cryptoClient = new CryptographyClient(key, this.#credential);

    const input = [
      Buffer.from(JSON.stringify(header)).toString("base64url"),
      Buffer.from(JSON.stringify(payload)).toString("base64url"),
    ].join(".");

    // We are not catching any errors here because the OIDC provider will handle them.
    const digest = createHash("sha256").update(input).digest();
    const response = await cryptoClient.sign(alg, digest);

    return `${input}.${stringFromUint8Array(response.result)}`;
  }
}
