import { BlockBlobUploadResponse, ContainerClient } from "@azure/storage-blob";
import {
  AuditEvent,
  auditEventSchema,
} from "io-fims-common/domain/audit-event";
import * as assert from "node:assert/strict";

import { BlobNotFoundError } from "./blob-error.js";

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
    const blobClient = this.#container.getBlobClient(name);
    const downloadBlockBlobResponse = await blobClient.download();
    /* if the blob requested does not exists a different error is returned
     *  in order to avoid unwanted retries
     */
    if (
      downloadBlockBlobResponse.errorCode &&
      downloadBlockBlobResponse.errorCode === "BlobNotFound"
    )
      throw new BlobNotFoundError(`No Blob with name ${name} found`);

    assert.ok(
      downloadBlockBlobResponse.errorCode,
      `Error retrieving blob with name ${name} with error code ${downloadBlockBlobResponse.errorCode}`,
    );

    try {
      const downloadedStream = downloadBlockBlobResponse.readableStreamBody;
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

  async upload(content: AuditEvent): Promise<BlockBlobUploadResponse> {
    try {
      const blockBlobClient = this.#container.getBlockBlobClient(
        content.blobName,
      );
      const parsedContent = JSON.stringify(content.data);
      return blockBlobClient.upload(parsedContent, parsedContent.length);
    } catch (error) {
      throw new Error("Error creating new blob", {
        cause: error,
      });
    }
  }
}
