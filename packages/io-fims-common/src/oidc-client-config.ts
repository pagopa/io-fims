import { z } from "zod";

const callbackSchema = z.object({
  uri: z.string().url(),
  displayName: z.string().min(3).max(30),
});

export const oidcClientConfigSchema = z.object({
  id: z.string().ulid(),
  institutionId: z.string().uuid(),
  callbacks: z.array(callbackSchema).min(1),
  scopes: z.tuple([z.literal("openid"), z.literal("profile")]),
});

export type OIDCClientConfig = z.TypeOf<typeof oidcClientConfigSchema>;
