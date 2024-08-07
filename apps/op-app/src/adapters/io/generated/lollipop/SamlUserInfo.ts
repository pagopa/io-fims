/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import * as t from "io-ts";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings.js";

// required attributes
const SamlUserInfoR = t.interface({
  response_xml: NonEmptyString,
});

// optional attributes
const SamlUserInfoO = t.partial({});

export const SamlUserInfo = t.intersection(
  [SamlUserInfoR, SamlUserInfoO],
  "SamlUserInfo",
);

export type SamlUserInfo = t.TypeOf<typeof SamlUserInfo>;
