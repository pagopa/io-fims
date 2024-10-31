import * as H from "@pagopa/handler-kit";
import { errorRTE } from "@pagopa/logger";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";
import { flow } from "fp-ts/lib/function.js";
import { z } from "zod";

import { ValidationError } from "./parse.js";

const isValidationError = (e: Error): e is ValidationError =>
  e.name === "ValidationError";

const isHttpError = (e: Error): e is H.HttpError => e.name === "HttpError";

export const toProblemJson = (e: Error): H.ProblemJson => {
  if (isValidationError(e)) {
    return {
      detail: e.message,
      issues: e.issues,
      status: 422,
      title: "Validation Error",
      type: "http://io.pagopa.it/problems/validation-error",
    };
  }
  if (isHttpError(e)) {
    return {
      detail: e.message,
      status: e.status,
      title: e.title,
    };
  }
  return {
    detail: e.name,
    status: 500,
    title: "Internal Server Error",
  };
};

export const logErrorAndReturnResponse = flow(
  RTE.right<object, Error, Error>,
  RTE.chainFirst((error) =>
    errorRTE("returning with an error response", { error }),
  ),
  RTE.map(flow(toProblemJson, H.problemJson)),
);

export const validationError = (error: z.ZodError) => ({
  detail: "Your request didn't validate",
  issues: error.issues,
  status: 422,
  title: "Validation Error",
  type: "https://pagopa.github.io/dx/problems/validation-error",
});

export const validationErrorResponse = (error: z.ZodError) => ({
  jsonBody: validationError(error),
  status: 422,
});
