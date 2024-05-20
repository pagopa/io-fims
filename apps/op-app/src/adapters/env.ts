import { z } from "zod";

export const envSchema = z.object({
  NODE_ENVIRONMENT: z.enum(["production", "development"]),
  COSMOS_ENDPOINT: z.string().url(),
  COSMOS_DBNAME: z.string().min(1).default("op"),
  OIDC_ISSUER: z.string().url(),
  PORT: z.string().default("3000"),
  IO_BASE_URL: z.string().url(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.TypeOf<typeof envSchema> {}
  }
}
