import { AccessRepository } from "@/domain/access.js";
import {
  AccessExporter,
  ExportRequest,
  ExportRequestRepository,
  exportMailOptions,
} from "@/domain/export.js";
import * as assert from "node:assert/strict";
import * as nodemailer from "nodemailer";

export class ProcessExportUseCase {
  #accessRepository: AccessRepository;
  #emailService: nodemailer.Transporter;
  #exportRepository: ExportRequestRepository;
  #exporter: AccessExporter;

  constructor(
    exportRepository: ExportRequestRepository,
    accessRepository: AccessRepository,
    exporter: AccessExporter,
    emailService: nodemailer.Transporter,
  ) {
    this.#exportRepository = exportRepository;
    this.#accessRepository = accessRepository;
    this.#exporter = exporter;
    this.#emailService = emailService;
  }

  async execute({ fiscalCode, id }: Pick<ExportRequest, "fiscalCode" | "id">) {
    try {
      const exportRequest = await this.#exportRepository.get(id, fiscalCode);

      assert.ok(exportRequest, "ExportRequest not found");
      assert.equal(
        exportRequest.status,
        "PENDING",
        "ExportRequest not pending",
      );

      const accessList = await this.#accessRepository.list(
        exportRequest.fiscalCode,
      );

      const exportData = await this.#exporter.export(accessList);

      await this.#emailService.sendMail(
        exportMailOptions(exportRequest.email, exportData),
      );

      await this.#exportRepository.upsert({
        ...exportRequest,
        status: "COMPLETED",
      });
    } catch (e) {
      throw new Error("Unable to process export", { cause: e });
    }
  }
}
