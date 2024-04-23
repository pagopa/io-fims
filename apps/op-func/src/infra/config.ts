import { z } from "zod";

export const configSchema = z.object({
  storage: z.object({
    queue: z.object({
      name: z.string().min(1),
    }),
  }),
  cosmos: z.object({
    uri: z.string(),
    name: z.string().min(1),
    connectionString: z.string().min(1),
  }),
});
