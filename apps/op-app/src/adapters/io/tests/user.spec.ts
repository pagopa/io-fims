import { EmailString } from "@pagopa/ts-commons/lib/strings.js";
import * as E from "fp-ts/lib/Either.js";
import { pino } from "pino";
import { describe, expect, it, vi } from "vitest";

import { FiscalCode } from "../generated/FiscalCode.js";
import { SpidLevelEnum } from "../generated/SpidLevel.js";
import { IOUserRepository } from "../user.js";

const logger = pino({
  level: "silent",
});

describe("getUser", () => {
  it("correctly retrieves an user", async () => {
    const value = {
      acr: SpidLevelEnum["https://www.spid.gov.it/SpidL2"],
      auth_time: 1648474413,
      date_of_birth: new Date(),
      email: "email@test.com" as EmailString,
      family_name: "Surname",
      fiscal_code: "AAABBB01C02D123Z" as FiscalCode,
      name: "Name",
    };
    const getUserForFIMS = vi.fn().mockResolvedValueOnce(
      E.right({
        headers: {},
        status: 200,
        value,
      }),
    );
    const repo = new IOUserRepository({ getUserForFIMS }, logger);
    await expect(repo.getUser("my-fed-token")).resolves.toEqual(
      expect.objectContaining({
        firstName: value.name,
        fiscalCode: value.fiscal_code,
        lastName: value.family_name,
      }),
    );
  });
  it("throws on invalid user schema", async () => {
    const value = {
      acr: SpidLevelEnum["https://www.spid.gov.it/SpidL2"],
      auth_time: 1648474413,
      date_of_birth: new Date(),
      name: "Name",
    };
    const getUserForFIMS = vi.fn().mockResolvedValueOnce(
      E.right({
        headers: {},
        status: 200,
        value,
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
        headers: {},
        status: 401,
        value: "Token null or expired",
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
