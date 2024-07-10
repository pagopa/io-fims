import { DefaultAzureCredential } from "@azure/identity";
import { QueueClient } from "@azure/storage-queue";
import { Config } from "../config.js";
import { AuditEvent } from "../express/routes/interaction.js";
import { StorageQueueClient } from "@/domain/session.js";

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
