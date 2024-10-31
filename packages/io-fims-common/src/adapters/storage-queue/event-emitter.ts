import { EventEmitter } from "@/domain/event-emitter.js";
import { QueueClient } from "@azure/storage-queue";

export class StorageQueueEventEmitter<T> implements EventEmitter<T> {
  #queueClient: QueueClient;

  constructor(queueClient: QueueClient) {
    this.#queueClient = queueClient;
  }

  async emit(event: T): Promise<void> {
    try {
      const message = Buffer.from(JSON.stringify(event)).toString("base64");
      await this.#queueClient.sendMessage(message);
    } catch (e) {
      throw new Error("Failed to emit event", { cause: e });
    }
  }
}
