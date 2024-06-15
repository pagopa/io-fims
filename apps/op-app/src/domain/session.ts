import * as E from "fp-ts/lib/Either.js";
import * as IO from "fp-ts/lib/IO.js";
import * as O from "fp-ts/lib/Option.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { pipe } from "fp-ts/lib/function.js";
import { ulid } from "ulid";
import { z } from "zod";

import { UserMetadata, userMetadataSchema } from "./user-metadata.js";

export const sessionSchema = z.object({
  id: z.string().ulid(),
  userMetadata: userMetadataSchema,
});

export type Session = z.TypeOf<typeof sessionSchema>;

export const createSession = (userMetadata: UserMetadata) =>
  pipe(
    () => ulid(),
    IO.map((id) => ({ id, userMetadata })),
  );

export interface SessionRepository {
  get(id: Session["id"]): Promise<Session>;
  upsert(session: Session): Promise<void>;
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
  ({ sessionRepository: repo }: SessionEnvironment) =>
    pipe(
      TE.fromIO(createSession(userMetadata)),
      TE.tap((session) => TE.tryCatch(() => repo.upsert(session), E.toError)),
      TE.map((session) => session.id),
    );
