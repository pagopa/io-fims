import { z } from "zod";

export const storageQueueConfigSchema = z.object({
  config: z.object({
    connectionPrefix: z.string().min(1),
    name: z.string().min(1),
  }),
});
