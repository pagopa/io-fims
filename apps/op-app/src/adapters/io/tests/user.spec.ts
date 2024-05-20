import { describe, vi, it, expect } from "vitest";

import { IOUserRepository } from "../user.js";

import { pino } from "pino";

import { FiscalCode } from "../generated/FiscalCode.js";
import { SpidLevelEnum } from "../generated/SpidLevel.js";
import { EmailString } from "@pagopa/ts-commons/lib/strings.js";

import * as E from "fp-ts/lib/Either.js";

const logger = pino({
  level: "silent",
});

describe("getUser", () => {
  it("correctly retrieves an user", async () => {
    const value = {
      name: "Name",
      family_name: "Surname",
      fiscal_code: "AAABBB01C02D123Z" as FiscalCode,
      auth_time: 1648474413,
      acr: SpidLevelEnum["https://www.spid.gov.it/SpidL2"],
      email: "email@test.com" as EmailString,
      date_of_birth: new Date(),
    };
    const getUserForFIMS = vi.fn().mockResolvedValueOnce(
      E.right({
        status: 200,
        value,
        headers: {},
      }),
    );
    const repo = new IOUserRepository({ getUserForFIMS }, logger);
    await expect(repo.getUser("my-fed-token")).resolves.toEqual(
      expect.objectContaining({
        firstName: value.name,
        lastName: value.family_name,
        fiscalCode: value.fiscal_code,
      }),
    );
  });
  it("throws on invalid user schema", async () => {
    const value = {
      name: "Name",
      auth_time: 1648474413,
      acr: SpidLevelEnum["https://www.spid.gov.it/SpidL2"],
      date_of_birth: new Date(),
    };
    const getUserForFIMS = vi.fn().mockResolvedValueOnce(
      E.right({
        status: 200,
        value,
        headers: {},
      }),
    );
    const repo = new IOUserRepository({ getUserForFIMS }, logger);
    await expect(repo.getUser("my-fed-token")).rejects.toThrowError(
      "Invalid user data",
    );
  });
  it("throws on invalid request", async () => {
    const getUserForFIMS = vi.fn().mockResolvedValueOnce(E.left({}));
    const repo = new IOUserRepository({ getUserForFIMS }, logger);
    await expect(repo.getUser("my-fed-token")).rejects.toThrowError(
      "Request failed",
    );
  });
  it("throws on request failed", async () => {
    const getUserForFIMS = vi.fn().mockResolvedValueOnce(
      E.right({
        status: 401,
        value: "Token null or expired",
        headers: {},
      }),
    );
    const repo = new IOUserRepository({ getUserForFIMS }, logger);
    await expect(repo.getUser("my-fed-token")).rejects.toThrowError(
      "Request failed",
    );
  });
  it("throws on client error", async () => {
    const getUserForFIMS = vi.fn().mockRejectedValueOnce(new Error("!!"));
    const repo = new IOUserRepository({ getUserForFIMS }, logger);
    await expect(repo.getUser("my-fed-token")).rejects.toThrowError(
      "Client error",
    );
  });
});
