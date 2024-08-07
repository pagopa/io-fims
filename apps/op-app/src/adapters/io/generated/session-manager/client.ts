/**
 * Do not edit this file it is auto-generated by io-utils / gen-api-models.
 * See https://github.com/pagopa/io-utils
 */
/* eslint-disable  */

import { withoutUndefinedValues } from "@pagopa/ts-commons/lib/types.js";
import {
  RequestParams,
  TypeofApiCall,
  TypeofApiParams,
  createFetchRequestForApi,
  ReplaceRequestParams,
} from "@pagopa/ts-commons/lib/requests.js";
import { identity } from "fp-ts/lib/function.js";

import {
  GetUserForFIMST,
  getUserForFIMSDefaultDecoder,
  GetLollipopUserForFIMST,
  getLollipopUserForFIMSDefaultDecoder,
} from "./requestTypes.js";

// This is a placeholder for undefined when dealing with object keys
// Typescript doesn't perform well when narrowing a union type which includes string and undefined
// (example: "foo" | "bar" | undefined)
// We use this as a placeholder for type parameters indicating "no key"
type __UNDEFINED_KEY = "_____";

export type ApiOperation = TypeofApiCall<GetUserForFIMST> &
  TypeofApiCall<GetLollipopUserForFIMST>;

export type ParamKeys = keyof (TypeofApiParams<GetUserForFIMST> &
  TypeofApiParams<GetLollipopUserForFIMST>);

/**
 * Defines an adapter for TypeofApiCall which omit one or more parameters in the signature
 * @param ApiT the type which defines the operation to expose
 * @param K the parameter to omit. undefined means no parameters will be omitted
 */
export type OmitApiCallParams<
  ApiT,
  K extends ParamKeys | __UNDEFINED_KEY = __UNDEFINED_KEY,
> = (
  op: TypeofApiCall<ApiT>,
) => K extends __UNDEFINED_KEY
  ? TypeofApiCall<ApiT>
  : TypeofApiCall<ReplaceRequestParams<ApiT, Omit<RequestParams<ApiT>, K>>>;

/**
 * Defines an adapter for TypeofApiCall which omit one or more parameters in the signature
 * @param ApiT the type which defines the operation to expose
 * @param K the parameter to omit. undefined means no parameters will be omitted
 */
export type WithDefaultsT<
  K extends ParamKeys | __UNDEFINED_KEY = __UNDEFINED_KEY,
> = OmitApiCallParams<GetUserForFIMST | GetLollipopUserForFIMST, K>;

/**
 * Defines a collection of api operations
 * @param K name of the parameters that the Clients masks from the operations
 */
export type Client<K extends ParamKeys | __UNDEFINED_KEY = __UNDEFINED_KEY> =
  K extends __UNDEFINED_KEY
    ? {
        readonly getUserForFIMS: TypeofApiCall<GetUserForFIMST>;

        readonly getLollipopUserForFIMS: TypeofApiCall<GetLollipopUserForFIMST>;
      }
    : {
        readonly getUserForFIMS: TypeofApiCall<
          ReplaceRequestParams<
            GetUserForFIMST,
            Omit<RequestParams<GetUserForFIMST>, K>
          >
        >;

        readonly getLollipopUserForFIMS: TypeofApiCall<
          ReplaceRequestParams<
            GetLollipopUserForFIMST,
            Omit<RequestParams<GetLollipopUserForFIMST>, K>
          >
        >;
      };

/**
 * Create an instance of a client
 * @param params hash map of parameters thata define the client:
 *  - baseUrl: the base url for every api call (required)
 *  - fetchApi: an implementation of the fetch() web API, depending on the platform (required)
 *  - basePath: optional path to be appended to the baseUrl
 *  - withDefaults: optional adapter to be applied to every operation, to omit some paramenters
 * @returns a collection of api operations
 */
export function createClient<K extends ParamKeys>(params: {
  baseUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchApi: typeof fetch;
  withDefaults: WithDefaultsT<K>;
  basePath?: string;
}): Client<K>;
export function createClient(params: {
  baseUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchApi: typeof fetch;
  withDefaults?: undefined;
  basePath?: string;
}): Client;
export function createClient<K extends ParamKeys>({
  baseUrl,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchApi,
  withDefaults,
  basePath = "/fims/api/v1",
}: {
  baseUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchApi: typeof fetch;
  withDefaults?: WithDefaultsT<K>;
  basePath?: string;
}) {
  const options = {
    baseUrl,
    fetchApi,
  };

  const getUserForFIMST: ReplaceRequestParams<
    GetUserForFIMST,
    RequestParams<GetUserForFIMST>
  > = {
    method: "get",

    headers: ({ ["Bearer"]: Bearer }) => ({
      Authorization: Bearer,
    }),
    response_decoder: getUserForFIMSDefaultDecoder(),
    url: ({}) => `${basePath}/user`,

    query: () => withoutUndefinedValues({}),
  };
  const getUserForFIMS: TypeofApiCall<GetUserForFIMST> =
    createFetchRequestForApi(getUserForFIMST, options);

  const getLollipopUserForFIMST: ReplaceRequestParams<
    GetLollipopUserForFIMST,
    RequestParams<GetLollipopUserForFIMST>
  > = {
    method: "post",

    headers: ({ ["Bearer"]: Bearer }) => ({
      Authorization: Bearer,

      "Content-Type": "application/json",
    }),
    response_decoder: getLollipopUserForFIMSDefaultDecoder(),
    url: ({}) => `${basePath}/lollipop-user`,

    body: ({ ["body"]: body }) =>
      body?.constructor?.name === "Readable" ||
      body?.constructor?.name === "ReadableStream"
        ? (body as ReadableStream)
        : body?.constructor?.name === "Buffer"
          ? (body as Buffer)
          : JSON.stringify(body),

    query: () => withoutUndefinedValues({}),
  };
  const getLollipopUserForFIMS: TypeofApiCall<GetLollipopUserForFIMST> =
    createFetchRequestForApi(getLollipopUserForFIMST, options);

  return {
    getUserForFIMS: (withDefaults || identity)(getUserForFIMS),
    getLollipopUserForFIMS: (withDefaults || identity)(getLollipopUserForFIMS),
  };
}
