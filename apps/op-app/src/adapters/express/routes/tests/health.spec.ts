import { HealthUseCase } from "@/use-cases/health.js";
import express from "express";
import request from "supertest";
import { describe, expect, test } from "vitest";

import healthRouter from "../health.js";

const success = async () => {};
const failure = async () => {
  throw new Error("failure");
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
      const app = express();

      const health = new HealthUseCase(input);

      app.use(healthRouter(health));

      const response = await request(app)
        .get("/health")
        .expect("Content-Type", /json/)
        .expect(status);

      expect(response.body).toEqual(failures);
    },
  );
});
