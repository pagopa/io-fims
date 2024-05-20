import { z } from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  fiscalCode: z.string().min(1),
});

export type User = z.TypeOf<typeof userSchema>;

export const federationTokenSchema = z.string().min(1);

export type FederationToken = z.TypeOf<typeof federationTokenSchema>;

export interface UserRepository {
  getUser(token: FederationToken): Promise<User>;
}
