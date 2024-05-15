import { z } from "zod";

export const configSchema = z.object({
  storage: z.object({
    accountName: z.string().min(1),
    queue: z.object({
      name: z.string().min(1),
    }),
  }),
  cosmos: z.object({
    uri: z.string(),
    name: z.string().min(1),
  }),
});
