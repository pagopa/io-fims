import { app } from "@azure/functions";
export const healthcheckHandler = async () => ({
    status: 200,
    body: "Function up and running",
});
app.http("httpTrigger1", {
    methods: ["GET"],
    authLevel: "anonymous",
    handler: healthcheckHandler,
});
//# sourceMappingURL=CreateOIDCClientConfig.js.map