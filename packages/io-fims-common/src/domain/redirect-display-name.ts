import { z } from "zod";

const displayNameSchema = z.string().min(3).max(30);

export const redirectDisplayNameSchema = z.object({
  en: displayNameSchema.optional(),
  it: displayNameSchema,
});
