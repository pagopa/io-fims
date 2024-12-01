import { QueueSendMessageResponse } from "@azure/storage-queue";
import { AuditEvent } from "io-fims-common/domain/audit-event";
import { EventEmitter } from "io-fims-common/domain/event-emitter";

import { EventRepository } from "./session.js";

export interface StorageQueueClient {
  sendMessage(auditEvent: AuditEvent): Promise<QueueSendMessageResponse>;
}

export interface StorageEnvironment {
  eventEmitter: EventEmitter<AuditEvent>;
  eventRepository: EventRepository;
}
