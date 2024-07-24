import {
  Session,
  SessionEnvironment,
  eventsSchema,
  getEvent,
  getSession,
  writeEvent,
} from "@/domain/session.js";
import { StorageEnvironment, sendEventsMessage } from "@/domain/storage.js";
import * as O from "fp-ts/lib/Option.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { flow, pipe } from "fp-ts/lib/function.js";
import { RPParams, auditEventSchema } from "io-fims-common/domain/audit-event";
import * as jose from "jose";
import * as assert from "node:assert/strict";

export class AuditError extends Error {
  name = "AuditError";
  constructor(message?: string) {
    super(message || "Unexpected error during audit use case.");
  }
}

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

export class AuditUseCase {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  async manageIdToken(idTokenString: string): Promise<void> {
    const idToken = jose.decodeJwt(idTokenString);
    const clientId = Array.isArray(idToken.aud) ? idToken.aud[0] : idToken.aud;

    assert.ok(clientId, new AuditError());
    assert.ok(idToken.sub, new AuditError());

    const findEvent = await safeGetEvent(clientId, idToken.sub)(this.#ctx)();
    assert.equal(findEvent._tag, "Right", new AuditError());
    const event = findEvent.right;
    const auditEvent = auditEventSchema.parse({
      blobName: event?.blobName,
      data: {
        isToken: idTokenString,
      },
      type: "idToken",
    });
    await sendEventsMessage(auditEvent)(this.#ctx)();
  }

  async manageUserAndRequestParams(
    sessionId: string,
    requestParams: RPParams,
    ipAddress: string,
  ): Promise<void> {
    const findUserData = await safeFindSession(sessionId)(this.#ctx)();
    assert.equal(
      findUserData._tag,
      "Right",
      new AuditError(`No session found with sessionId ${sessionId}`),
    );
    const userData = findUserData.right;
    const blobName = `${userData?.fiscalCode}_${requestParams.client_id}_${sessionId}.json`;
    const redisEvent = eventsSchema.parse({
      blobName,
      clientId: requestParams.client_id,
      fiscalCode: userData?.fiscalCode,
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
      writeEvent(redisEvent),
      RTE.chain(() => sendEventsMessage(auditEvent)),
    );
    const result = await audit(this.#ctx)();
    assert.equal(result._tag, "Right", new AuditError());
  }
}
