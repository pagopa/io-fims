import { z } from "zod";

export const oidcConfigSchema = z.object({
  cookieKeys: z.array(z.string().min(16)).min(1),
  issuer: z.string().url(),
});

export type OIDCConfig = z.TypeOf<typeof oidcConfigSchema>;
