/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import * as t from "io-ts";

// required attributes
const ExportRequestR = t.interface({});

// optional attributes
const ExportRequestO = t.partial({
  id: t.string,
});

export const ExportRequest = t.exact(
  t.intersection([ExportRequestR, ExportRequestO], "ExportRequest"),
);

export type ExportRequest = t.TypeOf<typeof ExportRequest>;
