import { z } from "zod";

export class ValidationError extends Error {
  static defaultMessage = "Your request didn't validate.";
  name = "ValidationError";
  constructor(
    public issues: z.ZodIssue[],
    message: string,
  ) {
    super(message);
  }
}

import * as E from "fp-ts/lib/Either.js";

export const parse =
  <T>(schema: z.ZodSchema<T>, message = ValidationError.defaultMessage) =>
  (i: unknown): E.Either<ValidationError, T> => {
    const result = schema.safeParse(i);
    return result.success
      ? E.right(result.data)
      : E.left(new ValidationError(result.error.issues, message));
  };
