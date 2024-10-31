import { Access, AccessRepository, accessSchema } from "@/domain/access.js";
import { Container, Database } from "@azure/cosmos";
import { FiscalCode } from "io-fims-common/zod-schemas";
import { z } from "zod";

export class CosmosDBAccessRepository implements AccessRepository {
  #container: Container;

  constructor(db: Database) {
    this.#container = db.container("accesses");
  }

  async create(access: Access): Promise<void> {
    try {
      await this.#container.items.create(access);
    } catch (e) {
      throw new Error("Failed to create Access", { cause: e });
    }
  }

  async list(fiscalCode: FiscalCode): Promise<Access[]> {
    try {
      const response = await this.#container.items
        .readAll({
          partitionKey: fiscalCode,
        })
        .fetchAll();
      return z.array(accessSchema).parse(response.resources);
    } catch (e) {
      throw new Error("Failed to list Accesses", { cause: e });
    }
  }
}
