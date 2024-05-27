import { z } from "zod";

export const oidcClientSchema = z.object({
  grantTypes: z.string(),
  id: z.string().ulid(),
  issueadAt: z.date(),
  redirectUris: z.array(z.string().url()),
  responseTypes: z.string(),
  scope: z.string(),
});

export type OIDCClient = z.TypeOf<typeof oidcClientSchema>;
