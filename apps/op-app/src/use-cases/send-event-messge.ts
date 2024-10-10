import {
  Session,
  SessionEnvironment,
  auditEventSessionSchema,
  getEvent,
  getSession,
  writeEvent,
} from "@/domain/session.js";
import { StorageEnvironment, sendEventsMessage } from "@/domain/storage.js";
import * as E from "fp-ts/lib/Either.js";
import * as O from "fp-ts/lib/Option.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { flow, pipe } from "fp-ts/lib/function.js";
import {
  RPParams,
  auditEventSchema,
  requestParamsSchema,
} from "io-fims-common/domain/audit-event";
import * as jose from "jose";
import * as assert from "node:assert/strict";
import { z } from "zod";

const auditEventParamsSchema = z.discriminatedUnion("type", [
  z.object({
    ipAddress: z.string().ip(),
    requestParams: requestParamsSchema,
    sessionId: z.string().min(1),
    type: z.literal("rpStep"),
  }),
  z.object({
    idToken: z.string().min(1),
    type: z.literal("idToken"),
  }),
]);

type AuditEventParams = z.TypeOf<typeof auditEventParamsSchema>;

type Context = SessionEnvironment & StorageEnvironment;

const safeFindSession = flow(
  getSession,
  RTE.map(
    flow(
      O.map(({ userMetadata }: Session) => userMetadata),
      O.toUndefined,
    ),
  ),
);

const safeGetEvent = flow(getEvent, RTE.map(O.toUndefined));

export class SendEventMessageUseCase {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  async #sendIdTokenStepMessage(idToken: string) {
    const idTokenDecoded = jose.decodeJwt(idToken);
    const clientId = Array.isArray(idTokenDecoded.aud)
      ? idTokenDecoded.aud[0]
      : idTokenDecoded.aud;

    assert.ok(clientId, "The clientId is undefined");
    assert.ok(idTokenDecoded.sub, "The fiscal code is undefined");

    const findAuditEventSession = await safeGetEvent(
      clientId,
      idTokenDecoded.sub,
    )(this.#ctx)();
    if (E.isLeft(findAuditEventSession)) {
      throw new Error("Unexpected error during send audit event message", {
        cause: findAuditEventSession.left,
      });
    }
    const auditEventSession = findAuditEventSession.right;
    assert.ok(auditEventSession, "Audit event session not found");
    const auditEvent = auditEventSchema.parse({
      blobName: auditEventSession.blobName,
      data: {
        idToken: idTokenDecoded,
      },
      type: "idToken",
    });
    const result = await sendEventsMessage(auditEvent)(this.#ctx)();
    if (E.isLeft(result)) {
      throw new Error("Unexpected error during send event message", {
        cause: result.left,
      });
    }
  }

  async #sendRpStepMessage(
    requestParams: RPParams,
    sessionId: string,
    ipAddress: string,
  ) {
    const findUserData = await safeFindSession(sessionId)(this.#ctx)();
    if (E.isLeft(findUserData)) {
      throw new Error(`No session found with sessionId ${sessionId}`, {
        cause: findUserData.left,
      });
    }

    const userData = findUserData.right;
    assert.ok(
      userData,
      `The session with sessionId ${sessionId} is not present`,
    );

    const blobName = `${userData.fiscalCode}_${requestParams.client_id}_${sessionId}.json`;
    const auditEventSession = auditEventSessionSchema.parse({
      blobName,
      clientId: requestParams.client_id,
      fiscalCode: userData.fiscalCode,
    });
    const auditEvent = auditEventSchema.parse({
      blobName: blobName,
      data: {
        ipAddress: ipAddress,
        requestParams: requestParams,
        timestamp: new Date().getSeconds(),
        userData: userData,
      },
      type: "rpStep",
    });
    const audit = pipe(
      writeEvent(auditEventSession),
      RTE.chain(() => sendEventsMessage(auditEvent)),
    );
    const result = await audit(this.#ctx)();
    if (E.isLeft(result)) {
      throw new Error("Unexpected error during send event message", {
        cause: result.left,
      });
    }
  }

  async execute(params: AuditEventParams): Promise<void> {
    if (params.type === "idToken") {
      this.#sendIdTokenStepMessage(params.idToken);
    }
    if (params.type === "rpStep") {
      this.#sendRpStepMessage(
        params.requestParams,
        params.sessionId,
        params.ipAddress,
      );
    }
  }
}
