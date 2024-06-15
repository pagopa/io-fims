import { HealthUseCase } from "@/use-cases/health.js";
import * as express from "express";

export default function createHealthRouter(health: HealthUseCase) {
  const router = express.Router({});

  router.all("/health", async (req, res) => {
    const failures = await health.execute();
    res.status(failures.length > 0 ? 503 : 200).json(failures);
  });

  return router;
}
