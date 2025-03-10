import * as E from "fp-ts/lib/Either.js";
import * as IO from "fp-ts/lib/IO.js";
import * as O from "fp-ts/lib/Option.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { pipe } from "fp-ts/lib/function.js";
import {
  UserMetadata,
  userMetadataSchema,
} from "io-fims-common/domain/user-metadata";
import { ulid } from "ulid";
import { z } from "zod";

import { StorageEnvironment } from "./storage.js";

export const sessionSchema = z.object({
  id: z.string().ulid(),
  userMetadata: userMetadataSchema,
});

export type Session = z.TypeOf<typeof sessionSchema>;

export const auditEventSessionSchema = z.object({
  blobName: z.string().min(1),
  clientId: z.string().min(1),
  fiscalCode: z.string().min(1),
});

export type Event = z.TypeOf<typeof auditEventSessionSchema>;

export const createSession = (userMetadata: UserMetadata) =>
  pipe(
    () => ulid(),
    IO.map((id) => ({ id, userMetadata })),
  );

export interface SessionRepository {
  get(id: Session["id"]): Promise<Session>;
  upsert(session: Session): Promise<void>;
}

export interface EventRepository {
  get(clientId: string, fiscalCode: UserMetadata["fiscalCode"]): Promise<Event>;
  upsert(event: Event): Promise<void>;
}

export interface SessionEnvironment {
  sessionRepository: SessionRepository;
}

export const getSession =
  (id: Session["id"]) =>
  ({
    sessionRepository: repo,
  }: SessionEnvironment): TE.TaskEither<Error, O.Option<Session>> =>
    pipe(
      TE.tryCatch(() => repo.get(id), E.toError),
      TE.map(O.fromNullable),
    );

export const startSession =
  (userMetadata: UserMetadata) =>
  ({ sessionRepository: sessionRepo }: SessionEnvironment) =>
    pipe(
      TE.fromIO(createSession(userMetadata)),
      TE.tap((session) =>
        TE.tryCatch(() => sessionRepo.upsert(session), E.toError),
      ),
      TE.map((session) => session.id),
    );

export const writeEvent =
  (event: Event) =>
  ({ eventRepository: eventRepository }: StorageEnvironment) =>
    TE.tryCatch(() => eventRepository.upsert(event), E.toError);

export const getEvent =
  (clientId: string, fiscalCode: string) =>
  ({
    eventRepository: eventRepository,
  }: StorageEnvironment): TE.TaskEither<Error, O.Option<Event>> =>
    pipe(
      TE.tryCatch(() => eventRepository.get(clientId, fiscalCode), E.toError),
      TE.map(O.fromNullable),
    );
