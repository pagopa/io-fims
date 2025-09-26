import { exportRequestSchema } from "@/domain/export.js";
import { ProcessExportUseCase } from "@/use-cases/process-export.js";
import { StorageQueueFunctionOptions } from "@azure/functions";

import { StorageQueueConfig } from "../config.js";

export const getOptions = (
  queueConfig: Pick<
    StorageQueueConfig,
    "connectionPrefix" | "exportQueueName" | "legacyConnectionPrefix"
  >,
  processExport: ProcessExportUseCase,
): StorageQueueFunctionOptions => ({
  connection: queueConfig.legacyConnectionPrefix,
  handler: async (queueItem) => {
    try {
      const exportRequest = exportRequestSchema.parse(queueItem);
      await processExport.execute(exportRequest);
    } catch (e) {
      throw new Error("Failed to process export", { cause: e });
    }
  },
  queueName: queueConfig.exportQueueName,
});
