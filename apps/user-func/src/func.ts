import healthHandler from "@/adapters/functions/health.js";
import { app } from "@azure/functions";
import { HealthUseCase } from "io-fims-common/use-cases/health";

app.http("Health", {
  authLevel: "anonymous",
  handler: healthHandler({
    health: new HealthUseCase([]),
  }),
  methods: ["GET"],
  route: "health",
});
