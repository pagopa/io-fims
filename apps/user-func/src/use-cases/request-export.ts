import {
  ExportRequest,
  ExportRequestRepository,
  createExportRequest,
} from "@/domain/export.js";
import { EventEmitter } from "io-fims-common/domain/event-emitter";
import { EmailAddress, FiscalCode } from "io-fims-common/zod-schemas";

export interface RequestExportResult {
  exportRequest: ExportRequest;
  status: "ALREADY_REQUESTED" | "OK";
}

export class RequestExportUseCase {
  #eventEmitter: EventEmitter<ExportRequest>;
  #repository: ExportRequestRepository;

  constructor(
    repository: ExportRequestRepository,
    eventEmitter: EventEmitter<ExportRequest>,
  ) {
    this.#repository = repository;
    this.#eventEmitter = eventEmitter;
  }

  async execute(
    fiscalCode: FiscalCode,
    email: EmailAddress,
  ): Promise<RequestExportResult> {
    try {
      const existingRequest =
        await this.#repository.getPendingByFiscalCode(fiscalCode);

      if (existingRequest) {
        return {
          exportRequest: existingRequest,
          status: "ALREADY_REQUESTED",
        };
      }

      const exportRequest = createExportRequest({ email, fiscalCode });

      await this.#repository.create(exportRequest);

      await this.#eventEmitter.emit(exportRequest);

      return {
        exportRequest,
        status: "OK",
      };
    } catch (e) {
      throw new Error("Unable to request an export", { cause: e });
    }
  }
}
