import { z } from "zod";

export const expressConfigSchema = z.object({
  environment: z.enum(["production", "development"]).default("development"),
});

export type ExpressConfig = z.TypeOf<typeof expressConfigSchema>;
