import { z } from "zod";

export const fiscalCodeSchema = z
  .string()
  .regex(
    /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/,
    "Must be a valid Italian fiscal code",
  )
  .brand("FiscalCode");

export type FiscalCode = z.infer<typeof fiscalCodeSchema>;

export const emailAddressSchema = z.string().email().brand("EmailAddress");

export type EmailAddress = z.infer<typeof emailAddressSchema>;

export const queueServiceUriSchema = z
  .string()
  .regex(/^https:\/\/([a-z0-9]+)\.queue\.core\.windows\.net\/$/)
  .brand("QueueServiceUri");
