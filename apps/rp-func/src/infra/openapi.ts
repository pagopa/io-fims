import { Zodios, type ZodiosOptions, makeApi } from "@zodios/core";
import { z } from "zod";

const Id = z.string();
const OIDCClientConfig = z
  .object({ callbacks: z.array(z.any()).min(1), service_id: Id })
  .passthrough();

export const schemas = {
  Id,
  OIDCClientConfig,
};

const endpoints = makeApi([
  {
    alias: "createOIDCClientConfig",
    method: "put",
    parameters: [
      {
        description: `OIDC Client Configuration`,
        name: "body",
        schema: OIDCClientConfig,
        type: "Body",
      },
    ],
    path: "/oidc-client-configs",
    requestFormat: "json",
    response: OIDCClientConfig,
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
