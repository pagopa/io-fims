import {
  EventRepository,
  Session,
  SessionRepository,
  auditEventSessionSchema,
  getEvent,
  getSession,
  writeEvent,
} from "@/domain/session.js";
import { StorageEnvironment } from "@/domain/storage.js";
import * as E from "fp-ts/lib/Either.js";
import * as O from "fp-ts/lib/Option.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { flow, pipe } from "fp-ts/lib/function.js";
import {
  AuditEvent,
  RPParams,
  auditEventSchema,
  requestParamsSchema,
} from "io-fims-common/domain/audit-event";
import { EventEmitter } from "io-fims-common/domain/event-emitter";
import * as jose from "jose";
import * as assert from "node:assert/strict";
import * as crypto from "node:crypto";
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
  #eventEmitter: EventEmitter<AuditEvent>;
  #eventRepository: EventRepository;
  #sessionRepository: SessionRepository;

  constructor(
    sessionRepository: SessionRepository,
    eventRepository: EventRepository,
    eventEmitter: EventEmitter<AuditEvent>,
  ) {
    this.#sessionRepository = sessionRepository;
    this.#eventRepository = eventRepository;
    this.#eventEmitter = eventEmitter;
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
    )({
      eventEmitter: this.#eventEmitter,
      eventRepository: this.#eventRepository,
    })();

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
        idToken,
      },
      type: "idToken",
    });

    try {
      await this.#eventEmitter.emit(auditEvent);
    } catch (e) {
      throw new Error("Unexpected error during send event message", {
        cause: e,
      });
    }
  }

  async #sendRpStepMessage(
    requestParams: RPParams,
    sessionId: string,
    ipAddress: string,
  ) {
    const findUserData = await safeFindSession(sessionId)({
      sessionRepository: this.#sessionRepository,
    })();

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

    // Generate a random string to avoid collisions in the same session
    const random = crypto.randomBytes(5).toString("hex");
    const blobName = `${userData.fiscalCode}_${requestParams.client_id}_${sessionId}_${random}.json`;

    const auditEventSession = auditEventSessionSchema.parse({
      blobName,
      clientId: requestParams.client_id,
      fiscalCode: userData.fiscalCode,
    });

    const auditEvent = auditEventSchema.parse({
      blobName: blobName,
      data: {
        ipAddress,
        requestParams,
        timestamp: Date.now(),
        userData,
      },
      type: "rpStep",
    });

    const emitEventRTE = (auditEvent: AuditEvent) => (r: StorageEnvironment) =>
      TE.tryCatch(
        () => r.eventEmitter.emit(auditEvent),
        (e) => new Error("Error during emit event", { cause: e }),
      );

    const audit = pipe(
      writeEvent(auditEventSession),
      RTE.chain(() => emitEventRTE(auditEvent)),
    );

    const result = await audit({
      eventEmitter: this.#eventEmitter,
      eventRepository: this.#eventRepository,
    })();

    if (E.isLeft(result)) {
      throw new Error("Unexpected error during send event message", {
        cause: result.left,
      });
    }
  }

  async execute(params: AuditEventParams): Promise<void> {
    if (params.type === "idToken") {
      this.#sendIdTokenStepMessage(params.idToken);
    } else if (params.type === "rpStep") {
      this.#sendRpStepMessage(
        params.requestParams,
        params.sessionId,
        params.ipAddress,
      );
    }
  }
}
