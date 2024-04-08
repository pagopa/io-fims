import { describe, it, expect, vi } from "vitest";

import * as L from "@pagopa/logger";
import * as H from "@pagopa/handler-kit";

import { OIDCClientConfigRepository } from "@/oidc-client-config.js";
import { createOIDCClientConfigHandler } from "../create-oidc-client-config.js";

const oidcClientConfigRepository: OIDCClientConfigRepository = {
  upsert: async () => {},
};

const logger: L.Logger = {
  log: (s) => () => {
    console.log(s);
  },
};

const requestBody = {
  callbacks: [
    {
      uri: "https://example-rp.io.pagopa.it",
      display_name: "Gestione prenotazioni",
    },
  ],
  service_id: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  institution_id: "328b5e41-b386-47c6-8142-c5209fa00a5b",
};

const Handler = (input: H.HttpRequest) =>
  createOIDCClientConfigHandler({
    logger,
    oidcClientConfigRepository,
    input,
    inputDecoder: H.HttpRequest,
  });

describe("createOIDCClientConfigHandler", () => {
  it("should return a 422 HTTP response on invalid body", () => {
    const run = Handler({ ...H.request("https://api.test"), body: {} });
    expect(run()).resolves.toEqual(
      expect.objectContaining({
        right: expect.objectContaining({
          statusCode: 422,
          headers: expect.objectContaining({
            "Content-Type": "application/problem+json",
          }),
        }),
      }),
    );
  });

  it("should return 200 HTTP response on success", () => {
    const run = Handler({
      ...H.request("https://api.test"),
      body: requestBody,
    });
    expect(run()).resolves.toEqual(
      expect.objectContaining({
        right: expect.objectContaining({
          statusCode: 200,
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      }),
    );
  });

  it("should return 500 on DB failure", () => {
    vi.spyOn(oidcClientConfigRepository, "upsert").mockRejectedValueOnce(
      undefined,
    );
    const run = Handler({
      ...H.request("https://api.test"),
      body: requestBody,
    });
    expect(run()).resolves.toEqual(
      expect.objectContaining({
        right: expect.objectContaining({
          statusCode: 500,
        }),
      }),
    );
  });
});
