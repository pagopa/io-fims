import { InvocationContext } from "@azure/functions";
import { describe, expect, it, vi } from "vitest";

import { getOptions } from "../create-access.js";

const mocks = {
  queueConfig: {
    accessQueueName: "test-queue",
    connectionPrefix: "test-connection",
  },
  queueItem: {
    fiscalCode: "AAABBB00C00A001X",
    redirect: {
      displayName: {
        it: "RP di esempio",
      },
      uri: "https://io-p-weu-fims-rp-example-app-02.azurewebsites.net",
    },
    serviceId: "01JBHG50D4BYHQ2ZG3GZ5V052T",
    timestamp: "2018-10-13T00:00:00.000Z",
  },
  repository: {
    create: vi.fn(),
    list: vi.fn(),
  },
};

describe("CreateAccessFunction", () => {
  it("Should create Access successfully", async () => {
    const { handler } = getOptions(mocks.queueConfig, mocks.repository);
    await handler(mocks.queueItem, new InvocationContext());

    expect(mocks.repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mocks.queueItem,
        id: expect.any(String),
      }),
    );
  });

  it.each([{}, { fiscalCode: "not-valid" }])(
    "Should throw an error if queueItem is not a valid AccessMetadata",
    async (queueItem) => {
      const context = new InvocationContext();
      const { handler } = getOptions(mocks.queueConfig, mocks.repository);
      await expect(handler(queueItem, context)).rejects.toThrowError();
    },
  );

  it("Should throw an error if an error occurs", async () => {
    const { handler } = getOptions(mocks.queueConfig, {
      create: async () => {
        throw new Error("Test error");
      },
      list: vi.fn(),
    });
    await expect(
      handler(mocks.queueItem, new InvocationContext()),
    ).rejects.toThrowError();
  });
});
