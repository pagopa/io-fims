import { QueueSendMessageResponse } from "@azure/storage-queue";
import * as E from "fp-ts/lib/Either.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { AuditEvent } from "io-fims-common/domain/audit-event";

import { EventRepository } from "./session.js";

export interface StorageQueueClient {
  sendMessage(auditEvent: AuditEvent): Promise<QueueSendMessageResponse>;
}

export interface StorageEnvironment {
  eventRepository: EventRepository;
  queueClient: StorageQueueClient;
}

export const sendEventsMessage =
  (auditEvent: AuditEvent) =>
  ({ queueClient: client }: StorageEnvironment) =>
    TE.tryCatch(() => client.sendMessage(auditEvent), E.toError);
