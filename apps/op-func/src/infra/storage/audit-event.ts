import { AuditEventRepository } from "@/domain/audit-event.js";
import { BaseContainerClientWithFallback } from "@pagopa/azure-storage-migration-kit";
import {
  AuditEvent,
  auditEventSchema,
} from "io-fims-common/domain/audit-event";
import * as assert from "node:assert/strict";
import { Readable } from "stream";

// A helper function used to read a Node.js readable stream into a String
export async function getStreamIntoString(
  readableStream: NodeJS.ReadableStream,
) {
  const chunks = [];

  for await (const chunk of readableStream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}

export class BlobAuditEventRepository implements AuditEventRepository {
  #container: BaseContainerClientWithFallback;

  constructor(client: BaseContainerClientWithFallback) {
    this.#container = client;
  }

  async get(name: string): Promise<AuditEvent> {
    const blobClient = this.#container.getBlobClient(name);
    const downloadBlockBlobResponse = await blobClient.downloadToBuffer();

    try {
      const downloadedStream = Readable.from(downloadBlockBlobResponse);
      assert.ok(downloadedStream, `No Blob with name ${name} found`);
      const blobString = await getStreamIntoString(downloadedStream);
      return auditEventSchema.parse({
        blobName: name,
        data: JSON.parse(blobString),
        type: "rpStep",
      });
    } catch (error) {
      throw new Error(`Error retrieving blob with name ${name}`, {
        cause: error,
      });
    }
  }

  async upload(content: AuditEvent): Promise<AuditEvent> {
    try {
      const blockBlobClient = this.#container.getBlockBlobClient(
        content.blobName,
      );
      const parsedContent = JSON.stringify(content.data);
      const response = await blockBlobClient.upload(
        parsedContent,
        parsedContent.length,
      );
      assert.ok(
        typeof response.errorCode !== "undefined",
        `Blob Error: ${response.errorCode}`,
      );
      return content;
    } catch (error) {
      throw new Error("Error creating new blob", {
        cause: error,
      });
    }
  }
}
