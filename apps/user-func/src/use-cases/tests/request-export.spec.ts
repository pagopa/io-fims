import { ExportRequest, exportRequestSchema } from "@/domain/export.js";
import { EventEmitter } from "io-fims-common/domain/event-emitter";
import { describe, expect, it, vi } from "vitest";

import { RequestExportUseCase } from "../request-export.js";

const mocks: {
  eventEmitter: EventEmitter<ExportRequest>;
  exportRequest: ExportRequest;
} = {
  eventEmitter: {
    emit: vi.fn(),
  },
  exportRequest: exportRequestSchema.parse({
    email: "test.email@io.pagopa.it",
    fiscalCode: "AAABBB00C00A001X",
    id: "01F8MECHZX3TBDSZ7XRADM79XV",
    status: "PENDING",
  }),
};

describe("RequestExportUseCase", () => {
  it("Should return ALREADY_REQUESTED if there is an existing pending request", async () => {
    const create = vi.fn();
    const getPendingByFiscalCode = vi
      .fn()
      .mockResolvedValueOnce(mocks.exportRequest);

    const useCase = new RequestExportUseCase(
      {
        create,
        get: vi.fn(),
        getPendingByFiscalCode,
        upsert: vi.fn(),
      },
      mocks.eventEmitter,
    );

    const result = await useCase.execute(
      mocks.exportRequest.fiscalCode,
      mocks.exportRequest.email,
    );

    expect(result.status).toBe("ALREADY_REQUESTED");
    expect(result.exportRequest).toEqual(mocks.exportRequest);
    expect(getPendingByFiscalCode).toHaveBeenCalledWith(
      mocks.exportRequest.fiscalCode,
    );
    expect(create).not.toHaveBeenCalled();
  });

  it("Should create a new export request if there is no existing pending request", async () => {
    const create = vi.fn();
    const getPendingByFiscalCode = vi.fn().mockResolvedValueOnce(undefined);

    const useCase = new RequestExportUseCase(
      {
        create,
        get: vi.fn(),
        getPendingByFiscalCode,
        upsert: vi.fn(),
      },
      mocks.eventEmitter,
    );

    const result = await useCase.execute(
      mocks.exportRequest.fiscalCode,
      mocks.exportRequest.email,
    );

    expect(result.status).toBe("OK");
    expect(result.exportRequest).toHaveProperty(
      "fiscalCode",
      mocks.exportRequest.fiscalCode,
    );
    expect(getPendingByFiscalCode).toHaveBeenCalledWith(
      mocks.exportRequest.fiscalCode,
    );

    expect(mocks.eventEmitter.emit).toHaveBeenCalledWith(
      expect.objectContaining({
        email: mocks.exportRequest.email,
        fiscalCode: mocks.exportRequest.fiscalCode,
        status: "PENDING",
      }),
    );

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        fiscalCode: mocks.exportRequest.fiscalCode,
        status: "PENDING",
      }),
    );
  });

  it("Should throw an error if there is an issue with the repository", async () => {
    const create = vi.fn();
    const getPendingByFiscalCode = vi
      .fn()
      .mockRejectedValueOnce(new Error("Unable to request an export"));

    const useCase = new RequestExportUseCase(
      {
        create,
        get: vi.fn(),
        getPendingByFiscalCode,
        upsert: vi.fn(),
      },
      mocks.eventEmitter,
    );

    await expect(
      useCase.execute(
        mocks.exportRequest.fiscalCode,
        mocks.exportRequest.email,
      ),
    ).rejects.toThrow("Unable to request an export");

    expect(getPendingByFiscalCode).toHaveBeenCalledWith(
      mocks.exportRequest.fiscalCode,
    );
  });
});
