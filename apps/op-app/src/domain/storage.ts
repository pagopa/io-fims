import { QueueClient } from "@azure/storage-queue";
import * as TE from "fp-ts/lib/TaskEither.js";
import * as E from "fp-ts/lib/Either.js";
import { AuditEvent } from "@/adapters/express/routes/interaction.js";
import { EventRepository, StorageQueueClient } from "./session.js";

export interface StorageEnvironment {
  queueClient: StorageQueueClient;
  eventRepository: EventRepository;
}

export const sendEventsMessage =
  (auditEvent: AuditEvent) =>
  ({ queueClient: client }: StorageEnvironment) =>
    TE.tryCatch(() => client.sendMessage(auditEvent), E.toError);
