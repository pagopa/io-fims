import { apply as htmlTemplate } from "@pagopa/io-app-email-templates/FimsAccessExport/index";
import { EventEmitter } from "io-fims-common/domain/event-emitter";
import {
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

export const exportMailOptions = (
  exportFile: AccessExport,
): Pick<
  nodemailer.SendMailOptions,
  "attachments" | "html" | "subject" | "text"
> => {
  const exportDate = new Date();
  // Format the date in the format gg/mm/aa (example: 01/01/21)
  const formattedDate = exportDate.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  // Format the date in the format ggmmaaaa (example: 01012021)
  const formattedDateNoSlash = exportDate
    .toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "");
  return {
    attachments: [
      {
        cid: "access-export",
        content: exportFile.content,
        filename: `Accessi a servizi di terze parti-${formattedDateNoSlash}.csv`,
      },
    ],
    html: htmlTemplate(exportDate),
    subject: "I tuoi accessi a servizi di terze parti",
    text: `Ciao, la cronologia dei tuoi accessi a servizi di terze parti aggiornata al ${formattedDate} è disponibile nel file allegato a questa email.
  Per ciascun accesso effettuato sono riportati: Data e ora di accesso, nome del servizio esterno utilizzato, link alla piattaforma web del servizio.
  Ti ricordiamo che puoi sempre consultare la cronologia dei tuoi accessi aggiornata su IO, dalla sezione Impostazioni > Sicurezza e accessi.`,
  };
};

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
