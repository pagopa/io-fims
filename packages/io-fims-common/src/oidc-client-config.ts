import { z } from "zod";

const callbackSchema = z.object({
  displayName: z.string().min(3).max(30),
  uri: z.string().url(),
});

export const oidcClientConfigSchema = z.object({
  callbacks: z.array(callbackSchema).min(1),
  id: z.string().ulid(),
  institutionId: z.string().uuid(),
  scopes: z.tuple([z.literal("openid"), z.literal("profile")]),
});

export type OIDCClientConfig = z.TypeOf<typeof oidcClientConfigSchema>;
