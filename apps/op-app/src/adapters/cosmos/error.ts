import { ErrorResponse, RestError, TimeoutError } from "@azure/cosmos";
import { AggregateAuthenticationError } from "@azure/identity";

export const getCosmosErrorCause = (e: unknown) => {
  let cause = "Unknown";
  if (e instanceof ErrorResponse) {
    cause = `Request failed with ${e.code} code`;
  } else if (e instanceof RestError) {
    cause = "Cosmos REST client error";
  } else if (e instanceof TimeoutError) {
    cause = "Request timeout";
  } else if (e instanceof AggregateAuthenticationError) {
    cause = "Cosmos authentication error";
  }
  return cause;
};
