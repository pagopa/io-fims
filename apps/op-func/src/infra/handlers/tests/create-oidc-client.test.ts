import { OIDCClientRepository } from "@/oidc-client.js";
import * as L from "@pagopa/logger";
import { OIDCClientConfig } from "io-fims-common/oidc-client-config";
import { describe, expect, it, vi } from "vitest";

import {
  createOIDCClientHandler,
  createOIDCClientInputDecoder,
} from "../create-oidc-client.js";

const oidcClientRepository: OIDCClientRepository = {
  upsert: async () => {},
};

const logger: L.Logger = {
  log: () => () => {},
};

const aValidOidcClientConfig: OIDCClientConfig = {
  callbacks: [
    {
      displayName: "Gestione prenotazioni",
      uri: "https://example-rp.io.pagopa.it",
    },
  ],
  id: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
  institutionId: "328b5e41-b386-47c6-8142-c5209fa00a5b",
  scopes: ["openid", "profile"],
};

describe("createOIDCClientConfigHandler", () => {
  it("should return a left if the input is not valid", async () => {
    const run = createOIDCClientHandler({
      input: { foo: "foo" },
      inputDecoder: createOIDCClientInputDecoder,
      logger,
      oidcClientRepository,
    });
    await expect(run()).resolves.toEqual(
      expect.objectContaining({
        _tag: "Left",
      }),
    );
  });

  it("should return a left if the input is valid but the database fails to save the resource", async () => {
    vi.spyOn(oidcClientRepository, "upsert").mockRejectedValue(undefined);
    const run = createOIDCClientHandler({
      input: aValidOidcClientConfig,
      inputDecoder: createOIDCClientInputDecoder,
      logger,
      oidcClientRepository,
    });
    const result = await run();
    expect(result).toEqual(
      expect.objectContaining({
        _tag: "Left",
      }),
    );
    expect(oidcClientRepository.upsert).toHaveBeenCalledTimes(1);
  });

  it("should return a right if the input is valid and the upsert goes fine", async () => {
    vi.spyOn(oidcClientRepository, "upsert").mockResolvedValue();
    const run = createOIDCClientHandler({
      input: aValidOidcClientConfig,
      inputDecoder: createOIDCClientInputDecoder,
      logger,
      oidcClientRepository,
    });
    const result = await run();
    expect(result).toEqual(
      expect.objectContaining({
        _tag: "Right",
      }),
    );
    expect(oidcClientRepository.upsert).toHaveBeenCalledTimes(1);
  });
});
