import {
  AccessHistoryPage,
  AccessHistoryPageRepository,
  accessHistoryPageSchema,
} from "@/domain/access.js";
import { HttpFunctionOptions, HttpRequest } from "@azure/functions";
import { validationErrorResponse } from "io-fims-common/response";
import { fiscalCodeSchema } from "io-fims-common/zod-schemas";
import * as assert from "node:assert/strict";
import { z } from "zod";

import { AccessHistoryPage as AccessHistoryPageApiModel } from "../api-models/AccessHistoryPage.js";

const requestSchema = z
  .object({
    headers: z.object({
      user: fiscalCodeSchema,
    }),
    query: z.object({
      page: accessHistoryPageSchema.shape.next.catch(undefined),
    }),
  })
  .transform(({ headers, query }) => ({
    fiscalCode: headers["user"],
    id: query.page,
  }));

const decodeHttpRequest = (
  request: HttpRequest,
): z.infer<typeof requestSchema> =>
  requestSchema.parse({
    headers: {
      user: request.headers.get("user"),
    },
    query: {
      page: request.query.get("page"),
    },
  });

const encodeAccessHistoryPage = (
  page: AccessHistoryPage,
): AccessHistoryPageApiModel => {
  const result = AccessHistoryPageApiModel.decode({
    data: page.data.map((access) => ({
      fiscal_code: access.fiscalCode,
      id: access.id,
      redirect: {
        display_name: access.redirect.displayName.it,
        uri: access.redirect.uri,
      },
      service_id: access.serviceId,
      timestamp: access.timestamp,
    })),
    next: page.next,
  });
  assert.ok(result._tag === "Right", "Unable to encode AccessHistoryPage");
  return result.right;
};

export const getOptions = (
  repository: AccessHistoryPageRepository,
): HttpFunctionOptions => ({
  authLevel: "function",
  handler: async (request) => {
    try {
      const { fiscalCode, id } = decodeHttpRequest(request);
      const page = await repository.get(id, fiscalCode);
      const jsonBody = encodeAccessHistoryPage(page);
      return { jsonBody, status: 200 };
    } catch (e) {
      if (e instanceof z.ZodError) {
        return validationErrorResponse(e);
      }
      return {
        jsonBody: { status: 500, title: "Internal Server Error" },
        status: 500,
      };
    }
  },
  methods: ["GET"],
  route: "accesses",
});
