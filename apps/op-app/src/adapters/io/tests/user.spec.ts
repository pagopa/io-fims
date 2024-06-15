import { EmailString } from "@pagopa/ts-commons/lib/strings.js";
import * as E from "fp-ts/lib/Either.js";
import { describe, expect, it, vi } from "vitest";

import { FiscalCode } from "../generated/FiscalCode.js";
import { SpidLevelEnum } from "../generated/SpidLevel.js";
import { IO } from "../user-metadata.js";

const repo = new IO("http://localhost");

const { getUserForFIMS } = vi.hoisted(() => ({
  getUserForFIMS: vi.fn(),
}));

vi.mock("../generated/client", () => ({
  createClient: vi.fn().mockReturnValue({ getUserForFIMS }),
}));

describe("getUserMetadata", () => {
  it("Retrieves correctly the user metadata using the federation token", async () => {
    const value = {
      acr: SpidLevelEnum["https://www.spid.gov.it/SpidL2"],
      auth_time: 1648474413,
      date_of_birth: new Date(),
      email: "email@test.com" as EmailString,
      family_name: "Surname",
      fiscal_code: "AAABBB01C02D123Z" as FiscalCode,
      name: "Name",
    };

    getUserForFIMS.mockResolvedValueOnce(
      E.right({
        headers: {},
        status: 200,
        value,
      }),
    );

    await expect(repo.getUserMetadata("my-fed-token")).resolves.toEqual(
      expect.objectContaining({
        firstName: value.name,
        fiscalCode: value.fiscal_code,
        lastName: value.family_name,
      }),
    );
  });
  it("Throws on invalid user schema", async () => {
    const value = {
      acr: SpidLevelEnum["https://www.spid.gov.it/SpidL2"],
      auth_time: 1648474413,
      date_of_birth: new Date(),
      name: "Name",
    };
    getUserForFIMS.mockResolvedValueOnce(
      E.right({
        headers: {},
        status: 200,
        value,
      }),
    );
    await expect(repo.getUserMetadata("my-fed-token")).rejects.toThrowError(
      "Invalid user data",
    );
  });
  it("Throws on invalid request", async () => {
    getUserForFIMS.mockResolvedValueOnce(E.left({}));
    await expect(repo.getUserMetadata("my-fed-token")).rejects.toThrowError(
      "Request failed",
    );
  });
  it("Throws on request failed", async () => {
    getUserForFIMS.mockResolvedValueOnce(
      E.right({
        headers: {},
        status: 401,
        value: "Token null or expired",
      }),
    );
    await expect(repo.getUserMetadata("my-fed-token")).rejects.toThrowError(
      "Request failed",
    );
  });
  it("Throws on client error", async () => {
    getUserForFIMS.mockResolvedValueOnce(new Error("!!"));
    await expect(repo.getUserMetadata("my-fed-token")).rejects.toThrowError(
      "Unable to fetch user data. Request failed",
    );
  });
});
