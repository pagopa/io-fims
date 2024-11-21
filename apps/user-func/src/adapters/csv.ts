import { Access } from "@/domain/access.js";
import { AccessExport, AccessExporter } from "@/domain/export.js";

export class CSVAccessExporter implements AccessExporter {
  async export(accessList: Access[]): Promise<AccessExport> {
    return {
      content:
        "Data e ora,Nome del servizio esterno,Link al servizio web esterno\n" +
        accessList
          .map(
            (access) =>
              `${access.timestamp},${access.redirect.displayName.it},${access.redirect.uri}`,
          )
          .join("\n"),
      type: "text/csv",
    };
  }
}
