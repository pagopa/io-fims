import { HealthUseCase } from "@/use-cases/health.js";
import * as H from "@pagopa/handler-kit";
import { describe, expect, test } from "vitest";

import Health from "../health.js";

const success = async () => {};
const failure = async () => {
  throw new Error("failure");
};

const logger = {
  log: () => () => {},
};

describe("Health", () => {
  test.each([
    {
      failures: [],
      input: [],
      status: 200,
    },
    {
      failures: ["test-1-failure"],
      input: [
        { health: success, id: "test-1-ok" },
        { health: failure, id: "test-1-failure" },
      ],
      status: 503,
    },
    {
      failures: [],
      input: [
        { health: success, id: "test-2-ok" },
        { health: success, id: "test-3-ok" },
      ],
      status: 200,
    },
    {
      failures: ["test-2-failure"],
      input: [{ health: failure, id: "test-2-failure" }],
      status: 503,
    },
  ])(
    "Respond with the right status code ($probes.length probes, $status)",
    async ({ failures, input, status }) => {
      const run = Health({
        health: new HealthUseCase(input),
        input: H.request("http://my-unit-test.local/health"),
        inputDecoder: H.HttpRequest,
        logger,
      });
      await expect(run()).resolves.toEqual(
        expect.objectContaining({
          right: expect.objectContaining({
            body: failures,
            headers: expect.objectContaining({
              "Content-Type": "application/json",
            }),
            statusCode: status,
          }),
        }),
      );
    },
  );
});
