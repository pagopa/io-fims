import { z } from "zod";

import { ValidationError } from "@pagopa/handler-kit";

import * as E from "fp-ts/lib/Either.js";

export const parse =
  <T>(schema: z.ZodSchema<T>, message = ValidationError.defaultMessage) =>
  (i: unknown): E.Either<ValidationError, T> => {
    const result = schema.safeParse(i);
    return result.success
      ? E.right(result.data)
      : E.left(
          new ValidationError(
            result.error.issues.map((issue) => issue.message),
            message,
          ),
        );
  };
