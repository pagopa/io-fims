import * as H from "@pagopa/handler-kit";

import * as RTE from "fp-ts/lib/ReaderTaskEither.js";

export const healthCheckHandler = H.of((req: H.HttpRequest) =>
  RTE.right(
    H.successJson({
      message: "it works!",
    }),
  ),
);
