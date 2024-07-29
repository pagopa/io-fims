import { z } from "zod";

export const profileSchema = z.object({
  family_name: z.string().min(1),
  fiscal_code: z.string().min(1),
  given_name: z.string().min(1),
});

export type Profile = z.TypeOf<typeof profileSchema>;
