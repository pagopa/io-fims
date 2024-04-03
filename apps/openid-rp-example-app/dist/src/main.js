"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const E = __importStar(require("fp-ts/Either"));
const D = __importStar(require("io-ts/Decoder"));
const function_1 = require("fp-ts/function");
const application_1 = require("./application");
const c = __importStar(require("./config"));
const logger_1 = require("./logger");
const start = (application, log) => {
    log.info("Starting application");
    const server = http.createServer(application);
    const port = application.get("port");
    server.listen(port, application.get("hostname"), () => {
        log.info(`Server is listening on port ${port}`);
    });
};
const exit = (parseError) => {
    const log = (0, logger_1.makeLogger)({ logLevel: "error", logName: "main" });
    log.error(`Shutting down application ${D.draw(parseError)}`);
    process.exit(1);
};
// TODO: add graceful shutdown
const main = (0, function_1.pipe)(E.Do, E.bind("conf", () => c.parseConfig(process.env)), E.bind("log", ({ conf }) => E.right((0, logger_1.makeLogger)(conf.logger))), E.bind("app", ({ conf, log }) => E.right((0, application_1.makeApplication)(conf, (0, logger_1.makeSubLogger)(log, "application")))), E.map(({ app, log }) => start(app, log)));
E.getOrElse(exit)(main);
//# sourceMappingURL=main.js.map