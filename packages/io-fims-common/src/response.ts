import * as H from "@pagopa/handler-kit";
import { errorRTE } from "@pagopa/logger";

import * as RTE from "fp-ts/lib/ReaderTaskEither.js";

import { flow } from "fp-ts/lib/function.js";

import { ValidationError } from "./parse.js";

const isValidationError = (e: Error): e is ValidationError =>
  e.name === "ValidationError";

const isHttpError = (e: Error): e is H.HttpError => e.name === "HttpError";

export const toProblemJson = (e: Error): H.ProblemJson => {
  if (isValidationError(e)) {
    return {
      type: "http://io.pagopa.it/problems/validation-error",
      title: "Validation Error",
      detail: e.message,
      status: 422,
      issues: e.issues,
    };
  }
  if (isHttpError(e)) {
    return {
      title: e.title,
      status: e.status,
      detail: e.message,
    };
  }
  return {
    title: "Internal Server Error",
    detail: e.name,
    status: 500,
  };
};

export const logErrorAndReturnResponse = flow(
  RTE.right<object, Error, Error>,
  RTE.chainFirst((error) =>
    errorRTE("returning with an error response", { error }),
  ),
  RTE.map(flow(toProblemJson, H.problemJson)),
);
