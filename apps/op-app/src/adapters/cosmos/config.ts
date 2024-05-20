import { z } from "zod";

export const cosmosConfigSchema = z.object({
  endpoint: z.string().url(),
  databaseName: z.string().default("op"),
});

export type CosmosConfig = z.TypeOf<typeof cosmosConfigSchema>;
