import {
  ExportRequest,
  ExportRequestEventEmitter,
  exportRequestSchema,
} from "@/domain/export.js";
import { RequestExportUseCase } from "@/use-cases/request-export.js";
import { HttpRequest, InvocationContext } from "@azure/functions";
import { describe, expect, it, vi } from "vitest";

import { getOptions } from "../request-export.js";

const mocks: {
  eventEmitter: ExportRequestEventEmitter;
  exportRequest: ExportRequest;
} = {
  eventEmitter: {
    emit: vi.fn(),
  },
  exportRequest: exportRequestSchema.parse({
    email: "test.email@io.example.it",
    fiscalCode: "AAABBB00C00A001X",
    id: "01F8MECHZX3TBDSZ7XRADM79XV",
    status: "PENDING",
  }),
};

describe("RequestExportFunction", () => {
  it("Should return 202 and requestId when export is successful", async () => {
    const request = new HttpRequest({
      body: {
        string: JSON.stringify({ email: mocks.exportRequest.email }),
      },
      headers: {
        user: mocks.exportRequest.fiscalCode,
      },
      method: "POST",
      url: "https://localhost:7071/export-requests",
    });
    const { handler } = getOptions(
      new RequestExportUseCase(
        {
          create: vi.fn(),
          get: vi.fn(),
          getPendingByFiscalCode: async () => undefined,
          upsert: vi.fn(),
        },
        mocks.eventEmitter,
      ),
    );
    const response = await handler(request, new InvocationContext());
    expect(response.status).toBe(202);
    expect(response).toHaveProperty("jsonBody", {
      id: expect.any(String),
    });
  });

  it("Should return 409 when export is already requested", async () => {
    const request = new HttpRequest({
      body: {
        string: JSON.stringify({ email: mocks.exportRequest.email }),
      },
      headers: {
        user: mocks.exportRequest.fiscalCode,
      },
      method: "POST",
      url: "https://localhost:7071/export-requests",
    });
    const { handler } = getOptions(
      new RequestExportUseCase(
        {
          create: vi.fn(),
          get: vi.fn(),
          getPendingByFiscalCode: async () => mocks.exportRequest,
          upsert: vi.fn(),
        },
        mocks.eventEmitter,
      ),
    );
    const response = await handler(request, new InvocationContext());
    expect(response.status).toBe(409);
    expect(response).toHaveProperty(
      "jsonBody",
      expect.objectContaining({
        status: 409,
        title: "Conflict",
      }),
    );
  });

  it("Should return 422 when request validation fails", async () => {
    const request = new HttpRequest({
      body: {
        string: JSON.stringify({ email: mocks.exportRequest.email }),
      },
      headers: {},
      method: "POST",
      url: "https://localhost:7071/export-requests",
    });
    const { handler } = getOptions(
      new RequestExportUseCase(
        {
          create: vi.fn(),
          get: vi.fn(),
          getPendingByFiscalCode: async () => undefined,
          upsert: vi.fn(),
        },
        mocks.eventEmitter,
      ),
    );
    const response = await handler(request, new InvocationContext());
    expect(response.status).toBe(422);
    expect(response).toHaveProperty(
      "jsonBody",
      expect.objectContaining({
        status: 422,
        title: "Validation Error",
      }),
    );
  });

  it("Should return 500 when an unexpected error occurs", async () => {
    const request = new HttpRequest({
      body: {
        string: JSON.stringify({ email: mocks.exportRequest.email }),
      },
      headers: {
        user: mocks.exportRequest.fiscalCode,
      },
      method: "POST",
      url: "https://localhost:7071/export-requests",
    });
    const { handler } = getOptions(
      new RequestExportUseCase(
        {
          create: vi.fn(),
          get: vi.fn(),
          getPendingByFiscalCode: async () => {
            throw new Error("Unable to retrieve export request");
          },
          upsert: vi.fn(),
        },
        mocks.eventEmitter,
      ),
    );
    const response = await handler(request, new InvocationContext());
    expect(response.status).toBe(500);
    expect(response).toHaveProperty(
      "jsonBody",
      expect.objectContaining({
        status: 500,
        title: "Internal Server Error",
      }),
    );
  });
});
