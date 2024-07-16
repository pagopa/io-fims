import {
  Event,
  Session,
  SessionEnvironment,
  getEvent,
  getSession,
  writeEvent,
} from "@/domain/session.js";
import { StorageEnvironment, sendEventsMessage } from "@/domain/storage.js";
import * as O from "fp-ts/lib/Option.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { flow } from "fp-ts/lib/function.js";
import { AuditEvent, RPParams } from "io-fims-common/domain/audit-event";
import { UserMetadata } from "io-fims-common/domain/user-metadata";
import * as jose from "jose";
import * as assert from "node:assert/strict";

export class AuditError extends Error {
  name = "AuditError";
  constructor() {
    super("Unexpected error during audit use case.");
  }
}

type Context = SessionEnvironment & StorageEnvironment;

const userDataFromSession = ({ userMetadata }: Session): UserMetadata =>
  userMetadata;

const safeFindSession = flow(
  getSession,
  RTE.map(flow(O.map(userDataFromSession), O.toUndefined)),
);

const eventFromEvent = (event: Event): Event => event;

const safeGetEvent = flow(
  getEvent,
  RTE.map(flow(O.map(eventFromEvent), O.toUndefined)),
);

export class AuditUseCase {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  async manageIdToken(idTokenString: string): Promise<void> {
    const idToken = jose.decodeJwt(idTokenString);
    const clientId = Array.isArray(idToken.aud) ? idToken.aud[0] : idToken.aud;
    const findEvent = await safeGetEvent(
      clientId || "",
      idToken.sub || "",
    )(this.#ctx.eventRepository)();
    assert.equal(findEvent._tag, "Right", new AuditError());
    const event = findEvent.right;
    const auditEvent = {
      blobName: event?.blobName,
      idTokenString,
    } as AuditEvent;
    await sendEventsMessage(auditEvent);
  }

  async manageUserAndRpParams(
    sessionId: string,
    rpParams: RPParams,
    ipAddress: string,
  ): Promise<void> {
    const findUserData = await safeFindSession(sessionId)({
      sessionRepository: this.#ctx.sessionRepository,
    })();
    assert.equal(findUserData._tag, "Right", new AuditError());
    const userData = findUserData.right;
    const blobName = `${userData?.fiscalCode}_${rpParams.client_id}_${sessionId}.json`;
    const redisEvent = {
      blobName,
      clientId: rpParams.client_id,
      fiscalCode: userData?.fiscalCode,
    } as Event;
    const auditEvent = {
      blobName: blobName,
      ipAddress: ipAddress,
      rpParams: rpParams,
      userData: userData,
    } as AuditEvent;
    await writeEvent(redisEvent);
    await sendEventsMessage(auditEvent);
  }
}
