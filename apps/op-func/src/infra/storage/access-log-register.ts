import {
  BlobServiceClient,
  BlockBlobUploadResponse,
  ContainerClient,
} from "@azure/storage-blob";
import { AuditEvent, auditEventSchema } from "io-fims-common/domain/audit-event";
import * as assert from "node:assert/strict";

export class AccessLogRegister {
  #container: ContainerClient;

  constructor(blobServiceClient: BlobServiceClient, containerName: string) {
    this.#container = blobServiceClient.getContainerClient(containerName);
  }

  // A helper method used to read a Node.js readable stream into a String
  async #streamToAuditEvent(readableStream: NodeJS.ReadableStream) {
    return new Promise<AuditEvent>(async (resolve, reject) => {
      let result = '';
      for await (const chunk of readableStream) {
        result += chunk;
      }

      try {
        const parsedResult = JSON.parse(result);
        resolve(auditEventSchema.parse(parsedResult));
      } catch(e) {
        reject(e);
      }
    });
  }

  async get(name: string): Promise<AuditEvent> {
    const blobClient = this.#container.getBlobClient(name);

    // Get blob content from position 0 to the end
    // get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    const downloadBlockBlobResponse = await blobClient.download();
    const downloadedStream = downloadBlockBlobResponse.readableStreamBody;
    assert.ok(
      downloadedStream,
      "No Blob with name " + name + " found",
    );
    try {
      return await this.#streamToAuditEvent(downloadedStream)
    } catch (error) {
      throw new Error(`Error retrieving blob with name ${name}`, {
        cause: error,
      });
    }
    ;
  }

  async upload(
    content: AuditEvent,
  ): Promise<BlockBlobUploadResponse> {
    const blockBlobClient = this.#container.getBlockBlobClient(content.blobName);
    try {
      const parsedContent = JSON.stringify(content);
      return blockBlobClient.upload(parsedContent, parsedContent.length);
    } catch (e) {
      throw new Error("Error creating new blob", {
        cause: e,
      });
    }
  }
}
