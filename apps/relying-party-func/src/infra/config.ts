import { z } from "zod";

export const configSchema = z.object({
  cosmos: z.object({
    connectionString: z.string().min(1),
    databaseName: z.string().default("relying-party"),
  }),
});
