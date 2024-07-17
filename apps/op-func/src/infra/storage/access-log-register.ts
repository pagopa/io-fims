import { BlockBlobUploadResponse, ContainerClient } from "@azure/storage-blob";
import {
  AuditEvent,
  auditEventSchema,
} from "io-fims-common/domain/audit-event";
import * as assert from "node:assert/strict";

export class AccessLogRegister {
  #container: ContainerClient;

  constructor(client: ContainerClient) {
    this.#container = client;
  }

  // A helper method used to read a Node.js readable stream into a String
  async #getStreamIntoString(readableStream: NodeJS.ReadableStream) {
    let result = "";
    for await (const chunk of readableStream) {
      result += chunk;
    }
    return result;
  }

  async get(name: string): Promise<AuditEvent> {
    const blobClient = this.#container.getBlobClient(name);

    // Get blob content from position 0 to the end
    // get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    const downloadBlockBlobResponse = await blobClient.download();
    const downloadedStream = downloadBlockBlobResponse.readableStreamBody;
    assert.ok(downloadedStream, `No Blob with name ${name} found`);
    try {
      const blobString = await this.#getStreamIntoString(downloadedStream);
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
