import { z } from "zod";

export const configSchema = z.object({
  cosmos: z.object({
    endpoint: z.string().url(),
    databaseName: z.string().default("relying-party"),
  }),
});
