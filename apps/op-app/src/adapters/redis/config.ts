import { z } from "zod";

export const redisConfigSchema = z.object({
  password: z.string().min(1),
  pingInterval: z.number(),
  url: z.string().url(),
});

export type RedisConfig = z.TypeOf<typeof redisConfigSchema>;
