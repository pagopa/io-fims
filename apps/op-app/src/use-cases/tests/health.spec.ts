import { describe, expect, it } from "vitest";

import { HealthUseCase } from "../health.js";

describe("HealthUseCase", () => {
  it("Catches all exceptions in HealthChecker", async () => {
    const test1 = {
      health: async () => {
        throw new Error("Failed!");
      },
      id: "test-1",
    };
    const health = new HealthUseCase([test1]);
    await expect(health.execute()).resolves.toEqual(["test-1"]);
  });
  it.each([
    {
      expected: [],
      input: [],
    },
    {
      expected: ["test-1-failed"],
      input: [
        {
          health: async () => {},
          id: "test-1-ok",
        },
        {
          health: async () => {
            throw new Error("failed");
          },
          id: "test-1-failed",
        },
      ],
    },
    {
      expected: [],
      input: [
        {
          health: async () => {},
          id: "test-1-ok",
        },
      ],
    },
  ])("Returns the right health value", async ({ expected, input }) => {
    const health = new HealthUseCase(input);
    await expect(health.execute()).resolves.toEqual(expected);
  });
});
