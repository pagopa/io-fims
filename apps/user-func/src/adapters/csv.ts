import { Access } from "@/domain/access.js";
import { AccessExport, AccessExporter } from "@/domain/export.js";

export class CSVAccessExporter implements AccessExporter {
  async export(accessList: Access[]): Promise<AccessExport> {
    return {
      content: accessList
        .map(
          (access) =>
            `${access.id},${access.timestamp},${access.fiscalCode},${access.serviceId},${access.redirect.uri}`,
        )
        .join("\n"),
      type: "text/csv",
    };
  }
}
