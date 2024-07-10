import { z } from "zod";

export const storageConfigSchema = z.object({
  eventsQueueName: z.string().min(1),
  storageAccountName: z.string().min(1),
});

export type StorageConfig = z.TypeOf<typeof storageConfigSchema>;
