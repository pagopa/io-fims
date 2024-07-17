import { z } from "zod";

export const userMetadataSchema = z.object({
  firstName: z.string().min(1),
  fiscalCode: z.string().min(1),
  lastName: z.string().min(1),
});

export type UserMetadata = z.TypeOf<typeof userMetadataSchema>;