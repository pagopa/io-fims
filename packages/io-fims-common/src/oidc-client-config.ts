import { z } from "zod";

const callbackSchema = z.object({
  uri: z.string().url(),
  displayName: z.string().min(3).max(15),
});

export const oidcClientConfigSchema = z.object({
  id: z.string().ulid(),
  institutionId: z.string().uuid(),
  callbacks: z.array(callbackSchema).min(1),
  scopes: z.tuple([z.literal("openid"), z.literal("profile")]),
  serviceId: z.string().ulid(),
});

export type OIDCClientConfig = z.TypeOf<typeof oidcClientConfigSchema>;
