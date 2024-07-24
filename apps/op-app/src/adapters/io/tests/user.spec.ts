import { EmailString, NonEmptyString } from "@pagopa/ts-commons/lib/strings.js";
import * as E from "fp-ts/lib/Either.js";
import { describe, expect, it, vi } from "vitest";

import { FiscalCode } from "../generated/session-manager/FiscalCode.js";
import { SpidLevelEnum } from "../generated/session-manager/SpidLevel.js";
import { IO, UserNotLoggedError } from "../user-metadata.js";

const repo = new IO({
  lollipop: {
    apiKey: "api-key",
    baseUrl: "http://localhost",
  },
  sessionManager: {
    baseUrl: "http://localhost",
  },
});

const { getAssertion, getLollipopUserForFIMS } = vi.hoisted(() => ({
  getAssertion: vi.fn(),
  getLollipopUserForFIMS: vi.fn(),
}));

vi.mock("../generated/session-manager/client", () => ({
  createClient: vi.fn().mockReturnValue({ getLollipopUserForFIMS }),
}));

vi.mock("../generated/lollipop/client", () => ({
  createClient: vi.fn().mockReturnValue({ getAssertion }),
}));

const withOperationId = (
  cb: (operationId: NonEmptyString) => Promise<void>,
) => {
  const operationId = NonEmptyString.decode("test");
  expect(operationId._tag).toBe("Right");
  if (operationId._tag === "Right") {
    cb(operationId.right);
  }
};

describe("getUserMetadata", () => {
  it("Retrieves correctly the user metadata using the federation token", async () => {
    const response = {
      getAssertion: {
        response_xml: "<my-saml-assertion></my-saml-assertion>",
      },
      getLollipopUserForFIMS: {
        lc_params: {
          assertion_ref: "sha256-k8YQcM9wlvc1Zb3o7l88htasPda3dYiZ3Xt17ulY6fE",
          lc_authentication_bearer: "my-auth-token",
          pub_key: "my-pub-key",
        },
        profile: {
          acr: SpidLevelEnum["https://www.spid.gov.it/SpidL2"],
          auth_time: 1648474413,
          date_of_birth: new Date(),
          email: "email@test.com" as EmailString,
          family_name: "Surname",
          fiscal_code: "AAABBB01C02D123Z" as FiscalCode,
          name: "Name",
        },
      },
    };

    getLollipopUserForFIMS.mockResolvedValueOnce(
      E.right({
        headers: {},
        status: 200,
        value: response.getLollipopUserForFIMS,
      }),
    );

    getAssertion.mockResolvedValueOnce(
      E.right({
        headers: {},
        status: 200,
        value: response.getAssertion,
      }),
    );

    withOperationId(async (operationId) => {
      await expect(
        repo.getUserMetadata("my-fed-token", operationId),
      ).resolves.toEqual(
        expect.objectContaining({
          firstName: response.getLollipopUserForFIMS.profile.name,
          fiscalCode: response.getLollipopUserForFIMS.profile.fiscal_code,
          lastName: response.getLollipopUserForFIMS.profile.family_name,
        }),
      );
    });
  });

  it("Throws on invalid user schema", async () => {
    const value = {
      lc_params: {
        assertion_ref: "sha256-k8YQcM9wlvc1Zb3o7l88htasPda3dYiZ3Xt17ulY6fE",
        lc_authentication_bearer: "my-auth-token",
        pub_key: "my-pub-key",
      },
      profile: {
        acr: SpidLevelEnum["https://www.spid.gov.it/SpidL2"],
        auth_time: 1648474413,
        date_of_birth: new Date(),
        name: "Name",
      },
    };

    getLollipopUserForFIMS.mockResolvedValueOnce(
      E.right({
        headers: {},
        status: 200,
        value,
      }),
    );

    withOperationId(async (operationId) => {
      await expect(
        repo.getUserMetadata("my-fed-token", operationId),
      ).rejects.toThrowError("Unable to retrieve the IO user metadata");
    });
  });
  it("Throws on invalid request", async () => {
    getLollipopUserForFIMS.mockResolvedValueOnce(E.left({}));

    withOperationId(async (operationId) => {
      await expect(
        repo.getUserMetadata("my-fed-token", operationId),
      ).rejects.toThrowError("Unable to retrieve the IO user metadata");
    });
  });
  it("Throws on request failed", async () => {
    getLollipopUserForFIMS.mockResolvedValueOnce(
      E.right({
        headers: {},
        status: 500,
        value: "Token null or expired",
      }),
    );

    withOperationId(async (operationId) => {
      await expect(
        repo.getUserMetadata("my-fed-token", operationId),
      ).rejects.toThrowError("Unable to retrieve the IO user metadata");
    });
  });
  it("Throws with UserNotLoggedError cause on 401", async () => {
    getLollipopUserForFIMS.mockResolvedValueOnce(
      E.right({
        headers: {},
        status: 401,
        value: "Token null or expired",
      }),
    );

    expect.assertions(1);

    withOperationId(async (operationId) => {
      try {
        await repo.getUserMetadata("my-fed-token", operationId);
      } catch (err) {
        if (err instanceof Error) {
          expect(err.cause).instanceof(UserNotLoggedError);
        }
      }
    });
  });
  it("Throws on client error", async () => {
    getLollipopUserForFIMS.mockResolvedValueOnce(new Error("!!"));

    withOperationId(async (operationId) => {
      await expect(
        repo.getUserMetadata("my-fed-token", operationId),
      ).rejects.toThrowError("Unable to retrieve the IO user metadata");
    });
  });
});
