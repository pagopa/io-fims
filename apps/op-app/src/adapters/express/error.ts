import { LoginError } from "@/use-cases/login.js";
import { ErrorRequestHandler } from "express";

import { UserNotLoggedError } from "../io/user-metadata.js";

type HttpErrorStatusCode = 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500 | 503;

interface ProblemJson {
  detail: string;
  status: HttpErrorStatusCode;
  title: string;
}

export class HttpError extends Error {
  name = "HttpError";
  status: HttpErrorStatusCode = 500 as const;
  title = "Internal Server Error";
}

export class HttpBadRequestError extends HttpError {
  status = 400 as const;
  title = "Bad Request";
}

export class HttpUnauthorizedError extends HttpError {
  message = "You must provide a valid API key to access this resource.";
  status = 401 as const;
  title = "Unauthorized";
}

export class HttpForbiddenError extends HttpError {
  status = 403 as const;
  title = "Forbidden";
}

export class HttpNotFoundError extends HttpError {
  status = 404 as const;
  title = "Not Found";
}

export class HttpConflictError extends HttpError {
  status = 409 as const;
  title = "Conflict";
}

export class HttpUnprocessableEntityError extends HttpError {
  status = 422 as const;
  title = "Unprocessable Entity";
}

export class HttpTooManyRequestsError extends HttpError {
  status = 429 as const;
  title = "Too many request";
}

export class HttpServiceUnavailableError extends HttpError {
  status = 503 as const;
  title = "Service Unavailable";
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let httpError;

  if (err instanceof LoginError && err.cause instanceof UserNotLoggedError) {
    httpError = new HttpUnauthorizedError("Session expired");
  } else if (err instanceof HttpError) {
    httpError = err;
  } else {
    httpError = new HttpError("Something went wrong!", {
      cause: err,
    });
  }

  if (httpError.status >= 500) {
    req.log.error(
      {
        err,
      },
      err.message,
    );
  }

  const problem: ProblemJson = {
    detail: httpError.message,
    status: httpError.status,
    title: httpError.title,
  };

  res.type("application/problem+json").status(problem.status).json(problem);
};

export default errorHandler;
