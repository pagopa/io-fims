import { z } from "zod";

export const oidcConfigSchema = z.object({
  issuer: z.string().url(),
  cookieKeys: z.array(z.string().min(16)).min(1),
});

export type OIDCConfig = z.TypeOf<typeof oidcConfigSchema>;
