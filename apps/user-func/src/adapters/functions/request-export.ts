import type { RequestExportUseCase } from "@/use-cases/request-export.js";

import {
  ExportRequest,
  ExportRequest as ExportRequestApiModel,
} from "@/adapters/api-models/ExportRequest.js";
import { HttpFunctionOptions, HttpRequest } from "@azure/functions";
import { validationErrorResponse } from "io-fims-common/response";
import {
  emailAddressSchema,
  fiscalCodeSchema,
} from "io-fims-common/zod-schemas";
import * as assert from "node:assert/strict";
import { z } from "zod";

const requestSchema = z
  .object({
    body: z.object({
      email: emailAddressSchema,
    }),
    headers: z.object({
      user: fiscalCodeSchema,
    }),
  })
  .transform(({ body, headers }) => ({
    email: body.email,
    fiscalCode: headers["user"],
  }));

async function decodeHttpRequest(
  request: HttpRequest,
): Promise<z.infer<typeof requestSchema>> {
  return requestSchema.parse({
    body: await request.json(),
    headers: {
      user: request.headers.get("user"),
    },
  });
}

function encodeExportRequest(request: ExportRequest): ExportRequestApiModel {
  const result = ExportRequestApiModel.decode({
    id: request.id,
  });
  assert.ok(result._tag === "Right", "Unable to encode ExportRequest");
  return result.right;
}

export const getOptions = (
  requestExport: RequestExportUseCase,
): HttpFunctionOptions => ({
  authLevel: "function",
  handler: async (request) => {
    try {
      const { email, fiscalCode } = await decodeHttpRequest(request);
      const result = await requestExport.execute(fiscalCode, email);
      if (result.status === "ALREADY_REQUESTED") {
        return {
          jsonBody: {
            detail: "Export already requested",
            status: 409,
            title: "Conflict",
          },
          status: 409,
        };
      }
      const jsonBody = encodeExportRequest(result.exportRequest);
      return { jsonBody, status: 202 };
    } catch (e) {
      if (e instanceof z.ZodError) {
        return validationErrorResponse(e);
      }
      return {
        jsonBody: {
          detail: "Unable to request an export",
          status: 500,
          title: "Internal Server Error",
        },
        status: 500,
      };
    }
  },
  methods: ["POST"],
  route: "export-requests",
});
