import {
  ExportRequest,
  ExportRequestRepository,
  exportRequestSchema,
} from "@/domain/export.js";
import { Container, Database } from "@azure/cosmos";
import { FiscalCode } from "io-fims-common/zod-schemas";
import * as assert from "node:assert/strict";
import { z } from "zod";

export class CosmosDBExportRequestRepository
  implements ExportRequestRepository
{
  #container: Container;

  constructor(db: Database) {
    this.#container = db.container("export-requests");
  }

  async create(exportRequest: ExportRequest): Promise<void> {
    try {
      await this.#container.items.create(exportRequest);
    } catch (e) {
      throw new Error("Failed to create ExportRequest", { cause: e });
    }
  }

  async get(
    id: ExportRequest["id"],
    fiscalCode: FiscalCode,
  ): Promise<ExportRequest | undefined> {
    try {
      const response = await this.#container.item(id, fiscalCode).read();
      return z.undefined().or(exportRequestSchema).parse(response.resource);
    } catch (e) {
      throw new Error("Failed to get ExportRequest", { cause: e });
    }
  }

  async getPendingByFiscalCode(
    fiscalCode: FiscalCode,
  ): Promise<ExportRequest | undefined> {
    try {
      const response = await this.#container.items
        .query({
          parameters: [{ name: "@fiscalCode", value: fiscalCode }],
          query: `SELECT * FROM c WHERE c.fiscalCode = @fiscalCode AND c.status = "PENDING"`,
        })
        .fetchNext();
      assert.ok(response.resources.length <= 1);
      return z
        .undefined()
        .or(exportRequestSchema)
        .parse(response.resources.at(0));
    } catch (e) {
      throw new Error("Failed to get ExportRequest", { cause: e });
    }
  }

  async upsert(request: ExportRequest): Promise<void> {
    try {
      await this.#container.items.upsert(request);
    } catch (e) {
      throw new Error("Failed to upsert ExportRequest", { cause: e });
    }
  }
}
