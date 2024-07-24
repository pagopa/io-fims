import { z } from "zod";

export const ioConfigSchema = z.object({
  lollipop: z.object({
    apiKey: z.string().min(1),
    baseUrl: z.string().url(),
  }),
  sessionManager: z.object({
    baseUrl: z.string().url(),
  }),
});

export type IOConfig = z.TypeOf<typeof ioConfigSchema>;
