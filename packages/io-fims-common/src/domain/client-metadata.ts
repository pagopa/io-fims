import { sequenceS } from "fp-ts/lib/Apply.js";
import * as IO from "fp-ts/lib/IO.js";
import { flow, pipe } from "fp-ts/lib/function.js";
import * as crypto from "node:crypto";
import { z } from "zod";

import { parse } from "../parse.js";
import { OIDCClientConfig } from "./oidc-client-config.js";

const clientMetadataSchema = z
  .object({
    client_id: z.string().ulid(),
    client_id_issued_at: z.number(),
    client_secret: z.string().min(1),
    grant_types: z.array(z.enum(["implicit", "authorization_code"])),
    redirect_display_names: z.record(
      z.intersection(
        z.record(z.string()),
        z.object({
          it: z.string().min(1),
        }),
      ),
    ),
    redirect_uris: z.array(z.string().url()),
    response_types: z.array(z.enum(["code", "id_token"])),
    token_endpoint_auth_method: z.literal("client_secret_basic"),
  })
  .refine(
    (arg) =>
      arg.redirect_uris.every((url) =>
        Object.hasOwn(arg.redirect_display_names, url),
      ),
    "All redirect_uri must have a redirect_display_name",
  );

export type ClientMetadata = z.TypeOf<typeof clientMetadataSchema>;

const clientMetadataFromConfig = (
  config: OIDCClientConfig,
): IO.IO<ClientMetadata> =>
  pipe(
    sequenceS(IO.Apply)({
      client_id_issued_at: () => Date.now(),
      client_secret: () => crypto.randomBytes(32).toString("base64"),
    }),
    IO.map(({ client_id_issued_at, client_secret }) => ({
      client_id: config.id,
      client_id_issued_at,
      client_secret,
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
      token_endpoint_auth_method: "client_secret_basic",
    })),
  );

export const parseClientMetadataFromConfig = flow(
  clientMetadataFromConfig,
  IO.map(parse(clientMetadataSchema)),
);
