import { z } from "zod";

export const eventStorageConfigSchema = z.object({
  containerName: z.string().min(1),
  uri: z.string().url(),
});
