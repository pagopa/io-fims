import { BlobServiceClient, BlockBlobUploadResponse, ContainerClient } from "@azure/storage-blob";

type AccessLogRecord = {
  fiscalCode: string;
  ipAddress: string;
  rpAuthRequest: string;
  timestamp: string;
  idToken: string;
}

export class AccessLogRegister {
  #container: ContainerClient;

  constructor(blobServiceClient: BlobServiceClient, containerName: string) {
    this.#container = blobServiceClient.getContainerClient(containerName);
  }

  async upload(name: string, content: AccessLogRecord): Promise<BlockBlobUploadResponse> {
    const blockBlobClient = this.#container.getBlockBlobClient(name);
    try {
      const parsedContent = JSON.stringify(content);
      return await blockBlobClient.upload(parsedContent, parsedContent.length);
    } catch (e) {
      throw new Error("Error creating new blob", {
        cause: e,
      });
    }
  }
}
