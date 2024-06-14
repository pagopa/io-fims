import { z } from "zod";

export const configSchema = z.object({
  cosmos: z.object({
    name: z.string().min(1),
    uri: z.string(),
  }),
  storage: z.object({
    accountName: z.string().min(1),
    queue: z.object({
      name: z.string().min(1),
    }),
  }),
});
