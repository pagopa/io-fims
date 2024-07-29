import { AuditEventRepository } from "@/domain/audit-event.js";
import * as L from "@pagopa/logger";
import { AuditEvent } from "io-fims-common/domain/audit-event";
import { describe, expect, it, vi } from "vitest";

import {
  auditEventInputDecoder,
  manageAuditEventHandler,
} from "../upsert-audit-event.js";

const auditEventRepository: AuditEventRepository = {
  get: async () => aValidRpStepAuditEvent,
  upload: async () => aValidRpStepAuditEvent,
};

const logger: L.Logger = {
  log: () => () => {},
};

const aValidCompleteAuditEvent: AuditEvent = {
  blobName: "blobName",
  data: {
    idToken: "anIdToken",
    ipAddress: "127.0.0.1",
    requestParams: {
      client_id: "aClientId",
      redirect_uri: "https://aRedirect.uri",
      response_type: "code",
    },
    timestamp: 123456789,
    userData: {
      firstName: "aFirstName",
      fiscalCode: "aFiscalCode",
      lastName: "aLastName",
    },
  },
  type: "complete",
};

const aValidRpStepAuditEvent: AuditEvent = {
  blobName: "blobName",
  data: {
    ipAddress: "127.0.0.1",
    requestParams: {
      client_id: "aClientId",
      redirect_uri: "https://aRedirect.uri",
      response_type: "code",
    },
    timestamp: 123456789,
    userData: {
      firstName: "aFirstName",
      fiscalCode: "aFiscalCode",
      lastName: "aLastName",
    },
  },
  type: "rpStep",
};

const aValidIdTokenAuditEvent: AuditEvent = {
  blobName: "blobName",
  data: {
    idToken: "anIdToken",
  },
  type: "idToken",
};

describe("manageAuditEvenntHandler", () => {
  it("should return a left if the input is not valid", async () => {
    const run = manageAuditEventHandler({
      auditEventRepository,
      input: { foo: "foo" },
      inputDecoder: auditEventInputDecoder,
      logger,
    });
    await expect(run()).resolves.toEqual(
      expect.objectContaining({
        _tag: "Left",
      }),
    );
  });

  it("should return a left if the input is valid but the blob storage fails to save the resource", async () => {
    vi.spyOn(auditEventRepository, "upload").mockRejectedValue(undefined);
    const run = manageAuditEventHandler({
      auditEventRepository,
      input: aValidRpStepAuditEvent,
      inputDecoder: auditEventInputDecoder,
      logger,
    });
    const result = await run();
    expect(result).toEqual(
      expect.objectContaining({
        _tag: "Left",
      }),
    );
    expect(auditEventRepository.upload).toHaveBeenCalledTimes(1);
  });

  it("should return a right if the input is valid idToken type audit event and the update goes fine", async () => {
    vi.spyOn(auditEventRepository, "get").mockResolvedValueOnce(
      aValidRpStepAuditEvent,
    );
    vi.spyOn(auditEventRepository, "upload").mockResolvedValueOnce(
      aValidCompleteAuditEvent,
    );
    const run = manageAuditEventHandler({
      auditEventRepository,
      input: aValidIdTokenAuditEvent,
      inputDecoder: auditEventInputDecoder,
      logger,
    });
    const result = await run();
    expect(result).toEqual(
      expect.objectContaining({
        _tag: "Right",
      }),
    );
    expect(auditEventRepository.get).toHaveBeenCalledTimes(1);
    expect(auditEventRepository.upload).toHaveBeenCalledTimes(1);
  });

  it("should return a right if the input is valid rpStep audit event and the upload goes fine", async () => {
    vi.spyOn(auditEventRepository, "upload").mockResolvedValueOnce(
      aValidRpStepAuditEvent,
    );
    const run = manageAuditEventHandler({
      auditEventRepository,
      input: aValidRpStepAuditEvent,
      inputDecoder: auditEventInputDecoder,
      logger,
    });
    const result = await run();
    expect(result).toEqual(
      expect.objectContaining({
        _tag: "Right",
      }),
    );
    expect(auditEventRepository.upload).toHaveBeenCalledTimes(1);
  });
});
