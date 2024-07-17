import { z } from "zod";

import { userMetadataSchema } from "./user-metadata.js";

export const rpParamsSchema = z.object({
  client_id: z.string().min(1),
  redirect_uri: z.string().min(1).optional(),
  response_type: z.string().min(1).optional(),
  scope: z.string().min(1).optional(),
});

export type RPParams = z.TypeOf<typeof rpParamsSchema>;

export const auditEventSchema = z.object({
  blobName: z.string().min(1),
  idToken: z.string().min(1).optional(),
  ipAddress: z.string().min(1).optional(),
  rpParams: rpParamsSchema.optional(),
  timestamp: z.number().optional(),
  userData: userMetadataSchema.optional(),
});

export type AuditEvent = z.TypeOf<typeof auditEventSchema>;
