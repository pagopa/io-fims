import * as E from "fp-ts/lib/Either.js";
import * as TE from "fp-ts/lib/TaskEither.js";

import { EventRepository, StorageQueueClient } from "./session.js";
import { AuditEvent } from "io-fims-common/domain/audit-event";

export interface StorageEnvironment {
  eventRepository: EventRepository;
  queueClient: StorageQueueClient;
}

export const sendEventsMessage =
  (auditEvent: AuditEvent) =>
  ({ queueClient: client }: StorageEnvironment) =>
    TE.tryCatch(() => client.sendMessage(auditEvent), E.toError);
