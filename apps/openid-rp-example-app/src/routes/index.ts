import { NextFunction, Request, Response, Router } from "express";
import { requiresAuth } from "express-openid-connect";
import { Logger } from "../logger";
import { Config } from "../config";

const handleIndex =
  (logger: Logger) => (req: Request, res: Response, _next: NextFunction) => {
    logger.silly("Index Page");
    res.render("index", {
      isAuthenticated: req.oidc.isAuthenticated(),
      title: process.env.RELYING_PARTY_NAME || "Comune di Milano",
    });
  };

const handleGetProfile =
  (logger: Logger) => (req: Request, res: Response, _next: NextFunction) => {
    logger.silly("Profile Page");
    res.render("profile", {
      title: "Profile page",
      userProfile: JSON.stringify(req.oidc.user),
    });
  };

const handleBookAppointment =
  (logger: Logger) => (req: Request, res: Response, _next: NextFunction) => {
    logger.silly("Book appointment");
    res.render("book_appointment", {
      title: "Prenota appuntamento",
      user: req.oidc.user,
    });
  };

const makeRouter =
  (logger: Logger) =>
  (_config: Config): Router => {
    const router = Router();

    router.get("/", handleIndex(logger));

    // Protected resource
    router.get("/profile", requiresAuth(), handleGetProfile(logger));

    router.get(
      "/book_appointment",
      requiresAuth(),
      handleBookAppointment(logger)
    );

    router.get("/info", (_req, res) => {
      res.send("I am ready!");
    });

    return router;
  };

export { makeRouter };
