import { z } from "zod";

import { redirectDisplayNameSchema } from "./redirect-display-name.js";

const callbackSchema = z.object({
  displayName: redirectDisplayNameSchema,
  uri: z.string().url(),
});

export const oidcClientConfigSchema = z.object({
  callbacks: z.array(callbackSchema).min(1),
  id: z.string().ulid(),
});

export type OIDCClientConfig = z.TypeOf<typeof oidcClientConfigSchema>;
