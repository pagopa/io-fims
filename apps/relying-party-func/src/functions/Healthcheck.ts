import { app, HttpResponseInit } from "@azure/functions";

export const healthcheckHandler = async (): Promise<HttpResponseInit> => ({
  status: 200,
  body: "Function up and running",
});

app.http("healthcheck", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: healthcheckHandler,
});
