import { z } from "zod";

export const userMetadataSchema = z.object({
  assertion: z.string().min(1),
  assertionRef: z.string().min(1),
  firstName: z.string().min(1),
  fiscalCode: z.string().min(1),
  lastName: z.string().min(1),
  publicKey: z.string().min(1),
});

export type UserMetadata = z.TypeOf<typeof userMetadataSchema>;
