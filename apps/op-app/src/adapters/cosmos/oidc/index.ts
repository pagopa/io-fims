import { Database } from "@azure/cosmos";
import type * as oidc from "oidc-provider";

import Adapter from "./adapter.js";
import SessionAdapter from "./session-adapter.js";
import GrantableAdapter from "./grantable-adapter.js";

import { z } from "zod";

const modelNameSchema = z.enum([
  "Client",
  "AccessToken",
  "Grant",
  "Session",
  "AuthorizationCode",
  "Interaction",
]);

type ModelName = z.TypeOf<typeof modelNameSchema>;

const containerNames: Record<ModelName, string> = {
  Client: "clients",
  Session: "sessions",
  Interaction: "interactions",
  Grant: "grants",
  AccessToken: "access-tokens",
  AuthorizationCode: "authorization-codes",
};

export const createAdapterFactory =
  (db: Database): oidc.AdapterFactory =>
  (name: string) => {
    const modelName = modelNameSchema.parse(name);
    const container = db.container(containerNames[modelName]);
    switch (modelName) {
      case "Session":
        return new SessionAdapter(container);
      case "AuthorizationCode":
      case "AccessToken":
        return new GrantableAdapter(container);
      default:
        return new Adapter(container);
    }
  };
