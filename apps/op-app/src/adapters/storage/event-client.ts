import { StorageQueueClient } from "@/domain/storage.js";
import { DefaultAzureCredential } from "@azure/identity";
import { QueueClient } from "@azure/storage-queue";
import { AuditEvent } from "io-fims-common/domain/audit-event";

import { Config } from "../config.js";

export default class EventQueueClient implements StorageQueueClient {
  #client: QueueClient;

  constructor(config: Config) {
    this.#client = new QueueClient(
      `https://${config.storage.storageAccountName}.queue.core.windows.net/${config.storage.eventsQueueName}`,
      new DefaultAzureCredential(),
    );
  }

  #jsonToBase64(jsonObj: AuditEvent) {
    const jsonString = JSON.stringify(jsonObj);
    return Buffer.from(jsonString).toString("base64");
  }

  async sendMessage(auditEvent: AuditEvent) {
    return this.#client.sendMessage(this.#jsonToBase64(auditEvent));
  }
}
