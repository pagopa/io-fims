import { AuditEvent, RPParams } from "@/adapters/express/routes/interaction.js";
import {
  Event,
  Session,
  SessionEnvironment,
  getSession,
  writeEventBlobName,
} from "@/domain/session.js";
import { StorageEnvironment, sendEventsMessage } from "@/domain/storage.js";
import { UserMetadata } from "@/domain/user-metadata.js";
import * as O from "fp-ts/lib/Option.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { flow } from "fp-ts/lib/function.js";
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

export class AuditUseCase {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  async execute(
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
    const auditEvent = { ipAddress, rpParams, userData } as AuditEvent;
    await writeEventBlobName(redisEvent);
    await sendEventsMessage(auditEvent);
  }
}
