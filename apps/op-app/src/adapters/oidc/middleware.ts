import { AuditUseCase } from "@/use-cases/audit.js";
import Provider from "oidc-provider";
import { Logger } from "pino";

export function createTokenMiddleware(
  provider: Provider,
  audit: AuditUseCase,
  logger: Logger,
) {
  provider.use(async (ctx, next) => {
    await next();
    if (ctx.oidc.route === "token") {
      logger.info(`started post middleware for the route 'token'`);
      const tokenResponse = ctx.response;
      if (tokenResponse.status === 200) {
        const responseBody = tokenResponse.body;
        if (responseBody["id_token"]) {
          audit.manageIdToken(responseBody["id_token"]);
        }
      }
    }
  });
}
