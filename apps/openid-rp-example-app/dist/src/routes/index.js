"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRouter = void 0;
const express_1 = require("express");
const express_openid_connect_1 = require("express-openid-connect");
const handleIndex = (logger) => (req, res, _next) => {
    logger.silly("Index Page");
    res.render("index", {
        isAuthenticated: req.oidc.isAuthenticated(),
        title: process.env.RELYING_PARTY_NAME || "Comune di Milano",
    });
};
const handleGetProfile = (logger) => (req, res, _next) => {
    logger.silly("Profile Page");
    res.render("profile", {
        title: "Profile page",
        userProfile: JSON.stringify(req.oidc.user),
    });
};
const handleBookAppointment = (logger) => (req, res, _next) => {
    logger.silly("Book appointment");
    res.render("book_appointment", {
        title: "Prenota appuntamento",
        user: req.oidc.user,
    });
};
const makeRouter = (logger) => (_config) => {
    const router = (0, express_1.Router)();
    router.get("/", handleIndex(logger));
    // Protected resource
    router.get("/profile", (0, express_openid_connect_1.requiresAuth)(), handleGetProfile(logger));
    router.get("/book_appointment", (0, express_openid_connect_1.requiresAuth)(), handleBookAppointment(logger));
    router.get("/info", (_req, res) => {
        res.send("I am ready!");
    });
    return router;
};
exports.makeRouter = makeRouter;
//# sourceMappingURL=index.js.map