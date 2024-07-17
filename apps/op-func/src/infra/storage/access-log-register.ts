import { BlockBlobUploadResponse, ContainerClient } from "@azure/storage-blob";
import {
  AuditEvent,
  auditEventSchema,
} from "io-fims-common/domain/audit-event";
import * as assert from "node:assert/strict";

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

export class AccessLogRegister {
  #container: ContainerClient;

  constructor(client: ContainerClient) {
    this.#container = client;
  }

  async get(name: string): Promise<AuditEvent> {
    try {
      const blobClient = this.#container.getBlobClient(name);
      const downloadBlockBlobResponse = await blobClient.download();
      const downloadedStream = downloadBlockBlobResponse.readableStreamBody;
      assert.ok(downloadedStream, `No Blob with name ${name} found`);
      const blobString = await getStreamIntoString(downloadedStream);
      const parsedResult = JSON.parse(blobString);
      return auditEventSchema.parse({
        blobName: name,
        data: parsedResult,
        type: "rpStep",
      });
    } catch (error) {
      throw new Error(`Error retrieving blob with name ${name}`, {
        cause: error,
      });
    }
  }

  async upload(content: AuditEvent): Promise<BlockBlobUploadResponse> {
    const blockBlobClient = this.#container.getBlockBlobClient(
      content.blobName,
    );
    try {
      const parsedContent = JSON.stringify(content.data);
      return blockBlobClient.upload(parsedContent, parsedContent.length);
    } catch (error) {
      throw new Error("Error creating new blob", {
        cause: error,
      });
    }
  }
}
