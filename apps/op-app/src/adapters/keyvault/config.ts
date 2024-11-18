import { z } from "zod";

export const keyVaultConfigSchema = z.object({
  keyName: z.string().min(1),
  url: z.string().url(),
});

export type OIDCConfig = z.TypeOf<typeof keyVaultConfigSchema>;
