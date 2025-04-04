/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import { Access } from "./Access.js";
import * as t from "io-ts";

// required attributes
const AccessHistoryPageR = t.interface({
  data: t.readonlyArray(Access, "array of Access"),
});

// optional attributes
const AccessHistoryPageO = t.partial({
  next: t.string,
});

export const AccessHistoryPage = t.exact(
  t.intersection([AccessHistoryPageR, AccessHistoryPageO], "AccessHistoryPage"),
);

export type AccessHistoryPage = t.TypeOf<typeof AccessHistoryPage>;
