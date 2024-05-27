import { z } from "zod";

export const envSchema = z.object({
  COSMOS_DBNAME: z.string().min(1).default("op"),
  COSMOS_ENDPOINT: z.string().url(),
  IO_BASE_URL: z.string().url(),
  NODE_ENVIRONMENT: z.enum(["production", "development"]),
  OIDC_ISSUER: z.string().url(),
  PORT: z.string().default("3000"),
});

/* eslint-disable */
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.TypeOf<typeof envSchema> {}
  }
}
/* eslint-enable */
