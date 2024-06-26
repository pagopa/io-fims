/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import * as t from "io-ts";
import { FiscalCode } from "./FiscalCode.js";

/**
 * User data needed by federated applications.
 */

// required attributes
const FederatedUser1R = t.interface({
  name: t.string,

  family_name: t.string,
});

// optional attributes
const FederatedUser1O = t.partial({});

export const FederatedUser1 = t.intersection(
  [FederatedUser1R, FederatedUser1O],
  "FederatedUser1",
);

export type FederatedUser1 = t.TypeOf<typeof FederatedUser1>;

/**
 * User data needed by federated applications.
 */

// required attributes
const FederatedUser2R = t.interface({
  fiscal_code: FiscalCode,
});

// optional attributes
const FederatedUser2O = t.partial({});

export const FederatedUser2 = t.intersection(
  [FederatedUser2R, FederatedUser2O],
  "FederatedUser2",
);

export type FederatedUser2 = t.TypeOf<typeof FederatedUser2>;

export const FederatedUser = t.intersection(
  [FederatedUser1, FederatedUser2],
  "FederatedUser",
);

export type FederatedUser = t.TypeOf<typeof FederatedUser>;
