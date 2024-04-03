import { app, HttpResponseInit } from "@azure/functions";

export const healthcheckHandler = async (): Promise<HttpResponseInit> => ({
  status: 200,
  body: "Function up and running",
});

app.http("HealthCheck", {
  methods: ["GET"],
  route: "health",
  authLevel: "anonymous",
  handler: healthcheckHandler,
});
