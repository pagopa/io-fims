import { logErrorAndReturnResponse } from "@/response.js";
import { HealthUseCase } from "@/use-cases/health.js";
import * as H from "@pagopa/handler-kit";
import * as E from "fp-ts/lib/Either.js";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import * as TE from "fp-ts/lib/TaskEither.js";
import { pipe } from "fp-ts/lib/function.js";

export const health = () => (r: { health: HealthUseCase }) =>
  TE.tryCatch(() => r.health.execute(), E.toError);

export default H.of(() =>
  pipe(
    health(),
    RTE.map((failures) =>
      pipe(
        H.successJson(failures),
        H.withStatusCode(failures.length > 0 ? 503 : 200),
      ),
    ),
    RTE.orElseW(logErrorAndReturnResponse),
  ),
);
