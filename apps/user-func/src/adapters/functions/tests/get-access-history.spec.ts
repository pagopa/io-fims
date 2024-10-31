import { HttpRequest, InvocationContext } from "@azure/functions";
import { describe, expect, it } from "vitest";

import { getOptions } from "../get-access-history.js";

const mocks = {
  fiscalCode: "AAABBB00C00A001X",
  repository: {
    get: async () => ({ data: [], next: undefined }),
  },
};

describe("GetAccessHistoryFunction", () => {
  it("Should return a 422 response if the request is missing the user header", async () => {
    const request = new HttpRequest({
      headers: {},
      method: "GET",
      url: "https://localhost:7071/access-history",
    });
    const { handler } = getOptions(mocks.repository);
    const response = await handler(request, new InvocationContext());
    expect(response.status).toBe(422);
  });

  it("Should return a 200 response if the request is valid", async () => {
    const request = new HttpRequest({
      headers: {
        user: mocks.fiscalCode,
      },
      method: "GET",
      url: "https://localhost:7071/access-history",
    });
    const { handler } = getOptions(mocks.repository);
    const response = await handler(request, new InvocationContext());
    expect(response.status).toBe(200);
  });

  it("Should return a 500 response if an error occurs", async () => {
    const request = new HttpRequest({
      headers: {
        user: mocks.fiscalCode,
      },
      method: "GET",
      url: "https://localhost:7071/access-history",
    });
    const { handler } = getOptions({
      get: async () => {
        throw new Error("Test error");
      },
    });
    const response = await handler(request, new InvocationContext());
    expect(response.status).toBe(500);
  });
});
