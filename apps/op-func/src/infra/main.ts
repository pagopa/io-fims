import { app } from "@azure/functions";
import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";
import { healthCheckHandler } from "./handlers/health-check.js";

app.http("Health", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: httpAzureFunction(healthCheckHandler)({}),
});