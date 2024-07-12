import { z } from "zod";

export const nodeEnvSchema = z.object({
  NODE_ENV: z.string().default("production"),
});

export const cosmosEnvSchema = z.object({
  COSMOS_DBNAME: z.string().min(1).default("op"),
  COSMOS_ENDPOINT: z.string().url(),
});
