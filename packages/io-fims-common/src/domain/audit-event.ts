import { z } from "zod";

import { userMetadataSchema } from "./user-metadata.js";

export const rpParamsSchema = z.object({
  client_id: z.string().min(1),
  redirect_uri: z.string().min(1).optional(),
  response_type: z.string().min(1).optional(),
  scope: z.string().min(1).optional(),
});

export type RPParams = z.TypeOf<typeof rpParamsSchema>;

export const auditEventSchema = z.discriminatedUnion("type", [
  z.object({
    blobName: z.string().min(1),
    data: z.object({
      ipAddress: z.string().min(1),
      rpParams: rpParamsSchema,
      timestamp: z.number(),
      userData: userMetadataSchema,
    }),
    type: z.literal("rpStep"),
  }),
  z.object({
    blobName: z.string().min(1),
    data: z.object({
      idToken: z.string().min(1),
    }),
    type: z.literal("idToken"),
  }),
  z.object({
    blobName: z.string().min(1),
    data: z.object({
      idToken: z.string().min(1),
      ipAddress: z.string().min(1),
      rpParams: rpParamsSchema,
      timestamp: z.number(),
      userData: userMetadataSchema,
    }),
    type: z.literal("complete"),
  }),
]);

export type AuditEvent = z.TypeOf<typeof auditEventSchema>;
