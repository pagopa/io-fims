import { z } from "zod";

export const eventQueueConfigSchema = z.object({
  config: z.object({
    connectionPrefix: z.string().min(1),
    name: z.string().min(1),
  }),
});
