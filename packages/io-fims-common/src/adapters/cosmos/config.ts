import { z } from "zod";

export const cosmosConfigSchema = z.object({
  databaseName: z.string().default("op"),
  endpoint: z.string().url(),
});

export type CosmosConfig = z.TypeOf<typeof cosmosConfigSchema>;
