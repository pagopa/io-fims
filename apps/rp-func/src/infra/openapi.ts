import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const Id = z.string();
const OIDCClientConfig = z
  .object({
    service_id: Id,
    institution_id: z.string().uuid(),
    callbacks: z.array(z.any()).min(1),
  })
  .passthrough();

export const schemas = {
  Id,
  OIDCClientConfig,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/oidc-client-configs",
    alias: "createOIDCClientConfig",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `OIDC Client Configuration`,
        type: "Body",
        schema: OIDCClientConfig,
      },
    ],
    response: OIDCClientConfig,
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
