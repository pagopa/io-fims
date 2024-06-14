import { z } from "zod";

export const oidcConfigSchema = z.object({
  issuer: z.string().url(),
});

export type OIDCConfig = z.TypeOf<typeof oidcConfigSchema>;
