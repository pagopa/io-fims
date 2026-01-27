import { ConsistencyLevel } from "@azure/cosmos";
import { app } from "@azure/functions";
import { DefaultAzureCredential } from "@azure/identity";
import { QueueClient } from "@azure/storage-queue";
import { getMailerTransporter } from "@pagopa/io-functions-commons/dist/src/mailer/index.js";
import { loadConfigFromEnvironment } from "io-fims-common/adapters/config";
import { initCosmos } from "io-fims-common/adapters/cosmos/index";
import { StorageQueueEventEmitter } from "io-fims-common/adapters/storage-queue/event-emitter";

import { Config, configFromEnvironment } from "./adapters/config.js";
import { CosmosDBAccessRepository } from "./adapters/cosmos/access.js";
import { CosmosDBAccessHistoryPageRepository } from "./adapters/cosmos/access-history-page.js";
import { CosmosDBExportRequestRepository } from "./adapters/cosmos/export.js";
import { CSVAccessExporter } from "./adapters/csv.js";
import * as CreateAccessFunction from "./adapters/functions/create-access.js";
import * as GetAccessHistoryFunction from "./adapters/functions/get-access-history.js";
import * as HealthFunction from "./adapters/functions/health.js";
import * as ProcessExportFunction from "./adapters/functions/process-export.js";
import * as RequestExportFunction from "./adapters/functions/request-export.js";
import { ExportRequest } from "./domain/export.js";
import { ProcessExportUseCase } from "./use-cases/process-export.js";
import { RequestExportUseCase } from "./use-cases/request-export.js";

async function main(config: Config) {
  const credential = new DefaultAzureCredential();

  const cosmos = initCosmos(
    config.cosmos,
    credential,
    // Be aware that consistency level cannot be stronger than the one set at the database configuration level.
    ConsistencyLevel.Session,
  );

  app.http("Health", HealthFunction.getOptions([cosmos.healthChecker]));

  const accessRepository = new CosmosDBAccessRepository(cosmos.database);

  app.storageQueue(
    "CreateAccess",
    CreateAccessFunction.getOptions(config.storageQueue, accessRepository),
  );

  app.http(
    "GetAccessHistory",
    GetAccessHistoryFunction.getOptions(
      new CosmosDBAccessHistoryPageRepository(cosmos.database),
    ),
  );

  const exportRequestRepository = new CosmosDBExportRequestRepository(
    cosmos.database,
  );

  const queueClient = new QueueClient(
    config.storageQueue.exportQueueUrl,
    credential,
  );

  app.http(
    "RequestExport",
    RequestExportFunction.getOptions(
      new RequestExportUseCase(
        exportRequestRepository,
        new StorageQueueEventEmitter<ExportRequest>(queueClient),
      ),
    ),
  );

  const emailService = getMailerTransporter(config.mailer, globalThis.fetch);

  app.storageQueue(
    "ProcessExport",
    ProcessExportFunction.getOptions(
      config.storageQueue,
      new ProcessExportUseCase(
        exportRequestRepository,
        accessRepository,
        new CSVAccessExporter(),
        emailService,
        config.mailer.MAIL_FROM,
      ),
    ),
  );
}

await loadConfigFromEnvironment(configFromEnvironment, main);
