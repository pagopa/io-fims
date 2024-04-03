import { app, HttpResponseInit } from "@azure/functions";

export const healthcheckHandler = async (): Promise<HttpResponseInit> => ({
  status: 200,
  body: "Function up and running",
});

app.http("health", {
  methods: ["GET"],
  route: "v1/healthcheck",
  authLevel: "anonymous",
  handler: healthcheckHandler,
});
