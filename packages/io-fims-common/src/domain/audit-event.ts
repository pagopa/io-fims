import { z } from "zod";

import { userMetadataSchema } from "./user-metadata.js";

export const rpParamsSchema = z.object({
  client_id: z.string().min(1),
  redirect_uri: z.string().min(1).optional(),
  response_type: z.string().min(1).optional(),
  scope: z.string().min(1).optional(),
});

export type RPParams = z.TypeOf<typeof rpParamsSchema>;

const auditEventSchema = z.object({
  idToken: z.string().optional(),
  ipAddress: z.string().optional(),
  rpParams: rpParamsSchema.optional(),
  userData: userMetadataSchema.optional(),
});

export type AuditEvent = z.TypeOf<typeof auditEventSchema>;
