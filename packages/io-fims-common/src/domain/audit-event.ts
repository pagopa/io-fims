import { z } from "zod";

export const requestParamsSchema = z.object({
  client_id: z.string().min(1),
  redirect_uri: z.string().url(),
  response_type: z.union([z.literal("id_token"), z.literal("code")]),
  scope: z.string().min(1).optional(),
});

export const userDataSchema = z.object({
  firstName: z.string().min(1),
  fiscalCode: z.string().min(1),
  lastName: z.string().min(1),
});

export type RPParams = z.TypeOf<typeof requestParamsSchema>;

const commonAuditSchema = z.object({
  ipAddress: z.string().ip(),
  requestParams: requestParamsSchema,
  timestamp: z.number(),
  userData: userDataSchema,
});

export const auditEventSchema = z.discriminatedUnion("type", [
  z.object({
    blobName: z.string().min(1),
    data: commonAuditSchema,
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
    data: commonAuditSchema.merge(z.object({ idToken: z.string().min(1) })),
    type: z.literal("complete"),
  }),
]);

export type AuditEvent = z.TypeOf<typeof auditEventSchema>;
