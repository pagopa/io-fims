"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeApplication = void 0;
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const express_openid_connect_1 = require("express-openid-connect");
const routes_1 = require("./routes");
const client_utils_1 = require("./oidc/client-utils");
const makeErrorRequestHandler = (logger) => (err, _req, resp, _next) => {
    logger.error(`Something went wrong. Error: ${err}`);
    logger.error(`Stack: \n${err.stack}`);
    resp.status(500).render("error", {
        error: err,
        message: err.message,
    });
};
/* eslint-disable */
const propagateUserInfoToViews = () => (req, resp, next) => {
    resp.locals.user = req.oidc.user;
    next();
};
/* eslint-enable */
const makeApplication = (config, logger) => {
    const application = (0, express_1.default)();
    // Serve static files
    application.use(express_1.default.static(path_1.default.join(__dirname, "public")));
    // Add a middleware that parses JSON HTTP
    // request bodies into JavaScript objects
    application.use(express_1.default.json());
    // Add a middleware that parses form-url-encoded requests
    application.use(express_1.default.urlencoded({ extended: true }));
    application.use((0, express_openid_connect_1.auth)((0, client_utils_1.makeAuthConfig)(logger)(config.oidcClient)));
    // Register routers
    application.use((0, routes_1.makeRouter)(logger)(config));
    // Register error handler
    application.use(makeErrorRequestHandler(logger));
    // Middleware to make the user object available for all views
    application.use(propagateUserInfoToViews);
    const serverConfig = config.server;
    application.set("port", serverConfig.port);
    application.set("hostname", serverConfig.hostname);
    // Template engine configuration
    application.set("views", path_1.default.join(__dirname, "views"));
    application.set("view engine", "ejs");
    return application;
};
exports.makeApplication = makeApplication;
//# sourceMappingURL=application.js.map