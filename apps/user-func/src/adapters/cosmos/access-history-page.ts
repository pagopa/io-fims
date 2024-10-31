import {
  AccessHistoryPage,
  AccessHistoryPageRepository,
  accessHistoryPageSchema,
} from "@/domain/access.js";
import { Container, Database } from "@azure/cosmos";
import { FiscalCode } from "io-fims-common/zod-schemas";

export class CosmosDBAccessHistoryPageRepository
  implements AccessHistoryPageRepository
{
  #container: Container;

  constructor(db: Database) {
    this.#container = db.container("accesses");
  }

  async get(
    id: AccessHistoryPage["next"],
    fiscalCode: FiscalCode,
  ): Promise<AccessHistoryPage> {
    try {
      const response = await this.#container.items
        .readAll({
          continuationToken: id,
          partitionKey: fiscalCode,
        })
        .fetchNext();

      return accessHistoryPageSchema.parse({
        data: response.resources,
        next: response.continuationToken,
      });
    } catch (e) {
      throw new Error("Failed to get AccessHistoryPage", { cause: e });
    }
  }
}
