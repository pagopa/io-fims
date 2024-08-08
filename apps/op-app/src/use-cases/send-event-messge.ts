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
import {
  auditEventSchema,
  requestParamsSchema,
} from "io-fims-common/domain/audit-event";
import * as jose from "jose";
import * as assert from "node:assert/strict";
import { z } from "zod";

export class AuditError extends Error {
  name = "AuditError";
  constructor(message?: string) {
    super(message || "Unexpected error during audit use case.");
  }
}

const eventParamsSchema = z.discriminatedUnion("type", [
  z.object({
    ipAddress: z.string().ip(),
    requestParams: requestParamsSchema,
    sessionId: z.string().min(1),
    type: z.literal("rpStep"),
  }),
  z.object({
    idTokenString: z.string().min(1),
    type: z.literal("idToken"),
  }),
]);

type EventParams = z.TypeOf<typeof eventParamsSchema>;

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

  async execute(params: EventParams): Promise<void> {
    if (params.type === "idToken") {
      const idTokenString = params.idTokenString;
      const idToken = jose.decodeJwt(idTokenString);
      const clientId = Array.isArray(idToken.aud)
        ? idToken.aud[0]
        : idToken.aud;

      assert.ok(clientId, new AuditError());
      assert.ok(idToken.sub, new AuditError());

      const findEvent = await safeGetEvent(clientId, idToken.sub)(this.#ctx)();
      assert.equal(findEvent._tag, "Right", new AuditError());
      const event = findEvent.right;
      const auditEvent = auditEventSchema.parse({
        blobName: event?.blobName,
        data: {
          idToken: idTokenString,
        },
        type: "idToken",
      });
      await sendEventsMessage(auditEvent)(this.#ctx)();
    }

    if (params.type === "rpStep") {
      const sessionId = params.sessionId;
      const requestParams = params.requestParams;
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
          ipAddress: params.ipAddress,
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
}
