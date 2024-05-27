import { Application } from "express";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as http from "http";
import * as D from "io-ts/Decoder";

import { makeApplication } from "./application.js";
import * as c from "./config.js";
import { Logger, makeLogger, makeSubLogger } from "./logger/index.js";

const start = (application: Application, log: Logger): void => {
  log.info("Starting application");
  const server = http.createServer(application);
  const port = application.get("port");
  server.listen(port, application.get("hostname"), () => {
    log.info(`Server is listening on port ${port}`);
  });
};

const exit = (parseError: D.DecodeError): void => {
  const log = makeLogger({ logLevel: "error", logName: "main" });
  log.error(`Shutting down application ${D.draw(parseError)}`);
  process.exit(1);
};

// TODO: add graceful shutdown

const main = pipe(
  E.Do,
  E.bind("conf", () => c.parseConfig(process.env)),
  E.bind("log", ({ conf }) => E.right(makeLogger(conf.logger))),
  E.bind("app", ({ conf, log }) =>
    E.right(makeApplication(conf, makeSubLogger(log, "application"))),
  ),
  E.map(({ app, log }) => start(app, log)),
);

E.getOrElse(exit)(main);
