import { z } from "zod";

export const oidcClientSchema = z.object({
  id: z.string().ulid(),
  grantTypes: z.string(),
  issueadAt: z.date(),
  redirectUris: z.array(z.string().url()),
  responseTypes: z.string(),
  scope: z.string(),
});

export type OIDCClient = z.TypeOf<typeof oidcClientSchema>;
