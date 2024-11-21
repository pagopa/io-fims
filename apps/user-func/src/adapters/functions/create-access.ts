import { AccessRepository, createAccess } from "@/domain/access.js";
import { StorageQueueFunctionOptions } from "@azure/functions";
import { accessMetadataSchema } from "io-fims-common/domain/access-metadata";

import { StorageQueueConfig } from "../config.js";

export const getOptions = (
  queueConfig: Pick<StorageQueueConfig, "accessQueueName" | "connectionPrefix">,
  repository: AccessRepository,
): StorageQueueFunctionOptions => ({
  connection: queueConfig.connectionPrefix,
  handler: async (queueItem) => {
    try {
      const metadata = accessMetadataSchema.parse(queueItem);
      const access = createAccess(metadata);
      await repository.create(access);
    } catch (e) {
      throw new Error("Failed to create Access", { cause: e });
    }
  },
  queueName: queueConfig.accessQueueName,
});
