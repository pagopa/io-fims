import {
  BlobServiceClient,
  BlockBlobUploadResponse,
  ContainerClient,
} from "@azure/storage-blob";

interface AccessLogRecord {
  fiscalCode: string;
  idToken: string;
  ipAddress: string;
  rpAuthRequest: string;
  timestamp: string;
}

export class AccessLogRegister {
  #container: ContainerClient;

  constructor(blobServiceClient: BlobServiceClient, containerName: string) {
    this.#container = blobServiceClient.getContainerClient(containerName);
  }

  // A helper method used to read a Node.js readable stream into a String
  async #streamToBuffer(readableStream: NodeJS.ReadableStream) {
    return new Promise<AccessLogRecord>((resolve, reject) => {
      const chunks: Buffer[] | Uint8Array[] = [];
      readableStream.on("data", (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      });
      readableStream.on("error", reject);
    });
  }

  async get(name: string): Promise<AccessLogRecord> {
    const blobClient = this.#container.getBlobClient(name);

    // Get blob content from position 0 to the end
    // get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    const downloadBlockBlobResponse = await blobClient.download();
    const downloadedStream = downloadBlockBlobResponse.readableStreamBody;
    if (!downloadedStream)
      throw new Error("No Blob with name " + name + " found");

    return await this.#streamToBuffer(downloadedStream);
  }

  async upload(
    name: string,
    content: AccessLogRecord,
  ): Promise<BlockBlobUploadResponse> {
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
