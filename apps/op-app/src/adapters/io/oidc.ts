import * as oidc from "oidc-provider";

import { User, federationTokenSchema } from "@/domain/user.js";

import { createClient } from "./generated/client.js";
import { IOUserRepository } from "./user.js";

import QuickLRU from "quick-lru";
import { Logger } from "pino";

// Map User domain entity to OIDC standard claims
// See https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
const accountClaimsFromUser = (
  sub: string,
  user: User,
): oidc.AccountClaims => ({
  sub,
  name: `${user.firstName} ${user.lastName}`,
  given_name: user.firstName,
  family_name: user.lastName,
  fiscal_code: user.fiscalCode,
});

// since we use "auth code flow" the id token generation is done by the RP user-agent
// that does not have "_io_fims_token". So, FOR NOW, we store user claims in memory
// the first time we read it (on consent screen)
// this workaround will be removed with IOCOM-1336, when we will implement lollipop
const lru = new QuickLRU<string, oidc.AccountClaims>({ maxSize: 10 });

export const createFindAccount =
  (baseUrl: string, logger: Logger): oidc.FindAccount =>
  async (ctx, sub) => {
    if (ctx.cookies.get("_io_fims_token")) {
      const client = createClient({
        baseUrl,
        fetchApi: globalThis.fetch,
      });
      const repository = new IOUserRepository(client, logger);
      const federationToken = federationTokenSchema.parse(
        ctx.cookies.get("_io_fims_token"),
      );
      const user = await repository.getUser(federationToken);
      lru.set(sub, accountClaimsFromUser(sub, user));
    }
    return {
      accountId: sub,
      claims: () => {
        const claims = lru.get(sub);
        if (typeof claims === "undefined") {
          return { sub };
        }
        return claims;
      },
    };
  };
