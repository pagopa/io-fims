"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSubLogger = exports.makeLogger = void 0;
const winston_1 = __importDefault(require("winston"));
/**
 * Create a Winston logger given a configuration.
 *
 * @param logConfig the configuration to use to create a new logger.
 * @return a Winston logger.
 */
const makeLogger = (logConfig) => winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.splat(), winston_1.default.format.simple(), winston_1.default.format.printf((info) => `${info.timestamp} [${info.level}] [${logConfig.logName}]: ${info.message}`)),
    transports: [new winston_1.default.transports.Console({ level: logConfig.logLevel })],
});
exports.makeLogger = makeLogger;
/**
 * Create a Winston child logger given a logger and the component name.
 *
 * @param logger the logger from which create a sub logger.
 * @param componentName the name of the sub logger.
 * @return a Winston logger.
 */
const makeSubLogger = (logger, componentName) => logger.child({ component: componentName });
exports.makeSubLogger = makeSubLogger;
//# sourceMappingURL=index.js.map