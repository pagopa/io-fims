import { HttpFunctionOptions } from "@azure/functions";
import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";
import Health from "io-fims-common/adapters/handlers/health";
import { HealthChecker, HealthUseCase } from "io-fims-common/use-cases/health";

export const getOptions = (
  healthCheckers: HealthChecker[] = [],
): HttpFunctionOptions => ({
  authLevel: "anonymous",
  handler: httpAzureFunction(Health)({
    health: new HealthUseCase(healthCheckers),
  }),
  methods: ["GET"],
  route: "health",
});
