import * as E from "fp-ts/lib/Either.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import {
  AuditEvent,
  auditEventSchema,
} from "io-fims-common/domain/audit-event";

export interface AuditEventRepository {
  get(name: string): Promise<AuditEvent>;
  upload(content: AuditEvent): Promise<AuditEvent>;
}

interface Environment {
  auditEventRepository: AuditEventRepository;
}

export const upsertAuditEventBlob =
  (auditEvent: AuditEvent) =>
  ({
    auditEventRepository: repo,
  }: Environment): TE.TaskEither<Error, AuditEvent> =>
    TE.tryCatch(async () => {
      if (auditEvent.type === "rpStep" || auditEvent.type === "complete") {
        return repo.upload(auditEvent);
      }
      const oldAuditEvent = await repo.get(auditEvent.blobName);
      const completeEvent = auditEventSchema.parse({
        blobName: auditEvent.blobName,
        data: {
          ...oldAuditEvent.data,
          idToken: auditEvent.data.idToken,
        },
        type: "complete",
      });
      return repo.upload(completeEvent);
    }, E.toError);
