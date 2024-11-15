import { EventEmitter } from "io-fims-common/domain/event-emitter";
import {
  EmailAddress,
  FiscalCode,
  emailAddressSchema,
  fiscalCodeSchema,
} from "io-fims-common/zod-schemas";
import * as nodemailer from "nodemailer";
import { ulid } from "ulid";
import { z } from "zod";

import { Access } from "./access.js";

export const exportRequestMetadataSchema = z.object({
  email: emailAddressSchema,
  fiscalCode: fiscalCodeSchema,
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
});

export type ExportRequestMetadata = z.infer<typeof exportRequestMetadataSchema>;

export const exportRequestSchema = exportRequestMetadataSchema.extend({
  id: z.string().ulid(),
});

export type ExportRequest = z.infer<typeof exportRequestSchema>;

export const createExportRequest = (
  metadata: Omit<ExportRequestMetadata, "status">,
): ExportRequest => ({
  id: ulid(),
  ...metadata,
  status: "PENDING",
});

export const accessExportSchema = z.object({
  content: z.string().min(1),
  type: z.string().min(1),
});

export type AccessExport = z.infer<typeof accessExportSchema>;

export interface AccessExporter {
  export(accessList: Access[]): Promise<AccessExport>;
}

// TODO(IOCOM-1925): Replace with the actual template
export const exportMailOptions = (
  email: EmailAddress,
  exportFile: AccessExport,
): nodemailer.SendMailOptions => ({
  attachments: [
    {
      content: exportFile.content,
      contentType: exportFile.type,
      filename: "export.csv",
    },
  ],
  from: "IO - l'app dei servizi pubblici <no-reply@io.italia.it>",
  html: "<p>In allegato il file richiesto</p>",
  subject: "Ecco il tuo la lista dei tuoi accessi",
  text: "In allegato il file richiesto",
  to: email,
});

export interface ExportRequestRepository {
  create(request: ExportRequest): Promise<void>;
  get(
    id: ExportRequest["id"],
    fiscalCode: FiscalCode,
  ): Promise<ExportRequest | undefined>;
  getPendingByFiscalCode(
    fiscalCode: FiscalCode,
  ): Promise<ExportRequest | undefined>;
  upsert(request: ExportRequest): Promise<void>;
}

export type ExportRequestEventEmitter = EventEmitter<ExportRequest>;
