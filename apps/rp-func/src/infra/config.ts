import { z } from "zod";

export const configSchema = z.object({
  cosmos: z.object({
    databaseName: z.string().default("rp"),
    endpoint: z.string().url(),
  }),
});
