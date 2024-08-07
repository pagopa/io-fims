/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import { PatternString } from "@pagopa/ts-commons/lib/strings.js";
import * as t from "io-ts";

export type AssertionRefSha384 = t.TypeOf<typeof AssertionRefSha384>;
export const AssertionRefSha384 = PatternString(
  "^(sha384-[A-Za-z0-9-_=]{1,66})$",
);
