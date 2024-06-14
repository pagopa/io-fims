import { z } from "zod";

export const ioConfigSchema = z.object({
  baseUrl: z.string().url(),
});

export type IOConfigSchema = z.TypeOf<typeof ioConfigSchema>;
