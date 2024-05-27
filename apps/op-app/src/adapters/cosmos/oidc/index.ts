import type * as oidc from "oidc-provider";

import { Database } from "@azure/cosmos";
import { z } from "zod";

import Adapter from "./adapter.js";
import GrantableAdapter from "./grantable-adapter.js";
import SessionAdapter from "./session-adapter.js";

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
  AccessToken: "access-tokens",
  AuthorizationCode: "authorization-codes",
  Client: "clients",
  Grant: "grants",
  Interaction: "interactions",
  Session: "sessions",
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
