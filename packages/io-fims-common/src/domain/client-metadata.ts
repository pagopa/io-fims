import { z } from "zod";

import { parse } from "../parse.js";
import { OIDCClientConfig } from "./oidc-client-config.js";

const clientMetadataSchema = z
  .object({
    client_id: z.string().ulid(),
    client_id_issued_at: z.number(),
    grant_types: z.tuple([z.literal("authorization_code")]),
    redirect_display_names: z.record(
      z.object({
        en: z.string().optional(),
        it: z.string().min(1),
      }),
    ),
    redirect_uris: z.array(z.string().url()),
    response_types: z.tuple([z.literal("code")]),
    token_endpoint_auth_method: z.literal("none"),
  })
  .refine(
    (arg) =>
      arg.redirect_uris.every((url) =>
        Object.hasOwn(arg.redirect_display_names, url),
      ),
    "All redirect_uri must have a redirect_display_name",
  );

export type ClientMetadata = z.TypeOf<typeof clientMetadataSchema>;

export const clientMetadataFromConfig = (
  config: OIDCClientConfig,
): ClientMetadata =>
  clientMetadataSchema.parse({
    client_id: config.id,
    client_id_issued_at: Date.now(),
    grant_types: ["authorization_code"],
    redirect_display_names: config.callbacks.reduce(
      (redirectDisplayNames, { displayName, uri }) => ({
        ...redirectDisplayNames,
        [uri]: displayName,
      }),
      {},
    ),
    redirect_uris: config.callbacks.map((cb) => cb.uri),
    response_types: ["code"],
    token_endpoint_auth_method: "none",
  });

export const parseClientMetadataFromConfig = (config: OIDCClientConfig) =>
  parse(clientMetadataSchema)(clientMetadataFromConfig(config));
