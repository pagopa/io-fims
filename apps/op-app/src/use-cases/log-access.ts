import { Session, SessionRepository } from "@/domain/session.js";
import {
  AccessMetadata,
  accessMetadataSchema,
} from "io-fims-common/domain/access-metadata";
import { ClientMetadata } from "io-fims-common/domain/client-metadata";
import { EventEmitter } from "io-fims-common/domain/event-emitter";
import * as assert from "node:assert/strict";

export class LogAccessUseCase {
  #eventEmitter: EventEmitter<AccessMetadata>;
  #sessionRepository: SessionRepository;

  constructor(
    sessionRepository: SessionRepository,
    eventEmitter: EventEmitter<AccessMetadata>,
  ) {
    this.#sessionRepository = sessionRepository;
    this.#eventEmitter = eventEmitter;
  }

  async execute(
    sessionId: Session["id"],
    clientMetadata: Pick<
      ClientMetadata,
      "client_id" | "redirect_display_names"
    >,
    redirectUri: string,
  ) {
    try {
      const session = await this.#sessionRepository.get(sessionId);
      assert.ok(
        Object.hasOwn(clientMetadata.redirect_display_names, redirectUri),
        "The client does not support the provided redirect",
      );
      const accessMetadata = accessMetadataSchema.parse({
        fiscalCode: session.userMetadata.fiscalCode,
        redirect: {
          displayName: clientMetadata.redirect_display_names[redirectUri],
          uri: redirectUri,
        },
        serviceId: clientMetadata.client_id,
        timestamp: new Date().toISOString(),
      });

      await this.#eventEmitter.emit(accessMetadata);
    } catch (e) {
      throw new Error("Failed to log access", { cause: e });
    }
  }
}
