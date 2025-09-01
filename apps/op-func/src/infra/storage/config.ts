import { z } from "zod";

export const eventStorageConfigSchema = z.object({
  containerName: z.string().min(1),
  fallback: z.string().url(),
  uri: z.string().url(),
});
