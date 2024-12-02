import { z } from "zod";

export const storageQueueSchema = z.object({
  name: z.string().min(1),
});

export const storageBindingSchema = z.object({
  connectionPrefix: z.string().min(1),
  queue: z.object({
    auditEvents: storageQueueSchema,
    config: storageQueueSchema,
  }),
});
