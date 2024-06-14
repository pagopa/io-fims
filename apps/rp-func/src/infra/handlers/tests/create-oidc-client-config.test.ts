import { OIDCClientConfigRepository } from "@/oidc-client-config.js";
import * as H from "@pagopa/handler-kit";
import * as L from "@pagopa/logger";
import { describe, expect, it, vi } from "vitest";

import { createOIDCClientConfigHandler } from "../create-oidc-client-config.js";

const oidcClientConfigRepository: OIDCClientConfigRepository = {
  upsert: async () => {},
};

const logger: L.Logger = {
  log: () => () => {},
};

const requestBody = {
  callbacks: [
    {
      display_name: "Gestione prenotazioni",
      uri: "https://example-rp.io.pagopa.it",
    },
  ],
  institution_id: "328b5e41-b386-47c6-8142-c5209fa00a5b",
  service_id: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
};

const Handler = (input: H.HttpRequest) =>
  createOIDCClientConfigHandler({
    input,
    inputDecoder: H.HttpRequest,
    logger,
    oidcClientConfigRepository,
  });

describe("createOIDCClientConfigHandler", () => {
  it("should return a 422 HTTP response on invalid body", async () => {
    const run = Handler({ ...H.request("https://api.test"), body: {} });
    await expect(run()).resolves.toEqual(
      expect.objectContaining({
        right: expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/problem+json",
          }),
          statusCode: 422,
        }),
      }),
    );
  });

  it("should return 200 HTTP response on success", async () => {
    const run = Handler({
      ...H.request("https://api.test"),
      body: requestBody,
    });
    await expect(run()).resolves.toEqual(
      expect.objectContaining({
        right: expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          statusCode: 200,
        }),
      }),
    );
  });

  it("should return 500 on DB failure", async () => {
    vi.spyOn(oidcClientConfigRepository, "upsert").mockRejectedValueOnce(
      undefined,
    );
    const run = Handler({
      ...H.request("https://api.test"),
      body: requestBody,
    });
    await expect(run()).resolves.toEqual(
      expect.objectContaining({
        right: expect.objectContaining({
          statusCode: 500,
        }),
      }),
    );
  });
});
