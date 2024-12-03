import { upsertAuditEventBlob } from "@/domain/audit-event.js";
import * as H from "@pagopa/handler-kit";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { pipe } from "fp-ts/lib/function.js";
import {
  AuditEvent,
  auditEventSchema,
} from "io-fims-common/domain/audit-event";
import { iotsCodecFromZod } from "io-fims-common/io-ts-from-zod";

export const auditEventInputDecoder = iotsCodecFromZod(auditEventSchema);

export const manageAuditEventHandler = H.of((auditEvent: AuditEvent) =>
  pipe(RTE.right(auditEvent), RTE.chain(upsertAuditEventBlob)),
);
