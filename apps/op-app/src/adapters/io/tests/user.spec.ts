import { EmailString, NonEmptyString } from "@pagopa/ts-commons/lib/strings.js";
import * as E from "fp-ts/lib/Either.js";
import { describe, expect, it, vi } from "vitest";

import { FiscalCode } from "../generated/FiscalCode.js";
import { SpidLevelEnum } from "../generated/SpidLevel.js";
import { IO } from "../user-metadata.js";

const repo = new IO("http://localhost");

const { getLollipopUserForFIMS } = vi.hoisted(() => ({
  getLollipopUserForFIMS: vi.fn(),
}));

vi.mock("../generated/client", () => ({
  createClient: vi.fn().mockReturnValue({ getLollipopUserForFIMS }),
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
    const value = {
      profile: {
        acr: SpidLevelEnum["https://www.spid.gov.it/SpidL2"],
        auth_time: 1648474413,
        date_of_birth: new Date(),
        email: "email@test.com" as EmailString,
        family_name: "Surname",
        fiscal_code: "AAABBB01C02D123Z" as FiscalCode,
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
      ).resolves.toEqual(
        expect.objectContaining({
          firstName: value.profile.name,
          fiscalCode: value.profile.fiscal_code,
          lastName: value.profile.family_name,
        }),
      );
    });
  });
  it("Throws on invalid user schema", async () => {
    const value = {
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
      ).rejects.toThrowError("Invalid user data");
    });
  });
  it("Throws on invalid request", async () => {
    getLollipopUserForFIMS.mockResolvedValueOnce(E.left({}));

    withOperationId(async (operationId) => {
      await expect(
        repo.getUserMetadata("my-fed-token", operationId),
      ).rejects.toThrowError("Request failed");
    });
  });
  it("Throws on request failed", async () => {
    getLollipopUserForFIMS.mockResolvedValueOnce(
      E.right({
        headers: {},
        status: 401,
        value: "Token null or expired",
      }),
    );

    withOperationId(async (operationId) => {
      await expect(
        repo.getUserMetadata("my-fed-token", operationId),
      ).rejects.toThrowError("Request failed");
    });
  });
  it("Throws on client error", async () => {
    getLollipopUserForFIMS.mockResolvedValueOnce(new Error("!!"));

    withOperationId(async (operationId) => {
      await expect(
        repo.getUserMetadata("my-fed-token", operationId),
      ).rejects.toThrowError("Unable to fetch user data. Request failed");
    });
  });
});
