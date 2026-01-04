import {
  CookieParameters,
  HeaderParameters,
  PathParameters,
  QueryParameters,
  RequestBody,
  ResponseObject,
  Responses,
  ResponseStatuses,
  OptionalIfNoRequiredFields,
  Operation,
} from "../openapiHelpers.js";
import { FetchMockGlobalConfig } from "./FetchMock.js";
import { PathsWithMethod, HttpMethod } from "openapi-typescript-helpers";

// ======================================================
// == THIS FILE IS A TYPED COPY OF fetch-mock/Route.ts ==
// ======================================================

/*

ORIGINAL from fetch-mock:

    export type UserRouteSpecificConfig = {
        name?: RouteName;
        method?: string;
        headers?: {
            [key: string]: string | number;
        };
        missingHeaders?: string[];
        query?: {
            [key: string]: string;
        };
        params?: {
            [key: string]: string;
        };
        body?: object;
        matcherFunction?: RouteMatcherFunction;
        url?: RouteMatcherUrl;
        response?: RouteResponse | RouteResponseFunction;
        repeat?: number;
        delay?: number;
        waitFor?: RouteName | RouteName[];
        sticky?: boolean;
    };

    type RouteName = string

EXPLANATIONS for the typed redefinitions:

    Existing properties:
    - name, repeat, delay, waitFor, sticky are used unchanged, as their information has nothing to do with the request itself.
    - method: Is no longer optional, as it is required to infer the openapi operation. For inference, its type is a generic.
    - url: Is no longer optional, as it is required to infer the openapi operation. For inference, its type is a generic.
           Also, the url is now the path string of the generated openapi types, which include {param} placeholders for path
           parameters. Therefore, the params object HAS to be used, if the path contains parameters AND the url does not
           require any prefix to enable the templating of path parameters.
    - headers: Are defines as exactly those headers, the openapi spec defines for the inferred operation. This disallows
               matching of headers, that are not explicitly defined, but added anyway, like authentication headers.
               TODO: Is this too restrictive? Do we have to allow any headers too, for cases where they are not defined? Or is the openapi spec then not specific enough?
    - missingHeaders: TODO Currently omitted, but I am not sure if we need it. Could be types as a list of optional headers in the openapi spec.
    - query: Is defines as exactly those query parameters, the openapi spec defines for the inferred operation.
    - params: Are defines as exactly those path parameters (for the placeholders in the path string), the openapi spec
              defines for the inferred operation. See 'url' for more information about the different usage compared to
              the original fetch-mock.
    - body: Is defines as exactly the requestBody type for the inferred operation.
    - matcherFunction: Is omitted from the openapi-typed API, as it is completely runtime-based, and no openapi
                       operation can be inferred.
    - response: See the redefined RouteResponse type.

    New properties:
    - cookies: The openapi spec defines a section for request cookies. In the fetch call itself they are represented as
               a single 'cookie:' header. For more clarity, these typed cookies are included as a top-level property in
               the config object. The wrapper code than, adds any cookies to the headers property, when passing the config
               to fetch-mock. TODO Still requires evaluation how this is matched in fetch-mock.
    */
export type UserRouteSpecificConfig<
  PATHS extends {},
  METHOD extends HttpMethod,
  PATH extends PathsWithMethod<PATHS, METHOD>,
  STATUS extends ResponseStatuses<Responses<Operation<PATHS, METHOD, PATH>>>,
  CONTENT_TYPE, //TODO which media types does fetch mock support??
> = {
  method: METHOD;
  url: PATH;
} & OptionalIfNoRequiredFields<"headers", HeaderParameters<Operation<PATHS, METHOD, PATH>>> &
  OptionalIfNoRequiredFields<"query", QueryParameters<Operation<PATHS, METHOD, PATH>>> &
  OptionalIfNoRequiredFields<"cookies", CookieParameters<Operation<PATHS, METHOD, PATH>>> &
  OptionalIfNoRequiredFields<"params", PathParameters<Operation<PATHS, METHOD, PATH>>> &
  OptionalIfNoRequiredFields<"body", RequestBody<Operation<PATHS, METHOD, PATH>>> & {
    response: RouteResponse<Responses<Operation<PATHS, METHOD, PATH>>, STATUS, CONTENT_TYPE>;
  } & {
    name?: RouteName;
    repeat?: number;
    delay?: number;
    waitFor?: RouteName | RouteName[];
    sticky?: boolean;
  };

export type RouteName = string;

/*
ORIGINAL from fetch-mock:

    export type UserRouteConfig = UserRouteSpecificConfig & FetchMockGlobalConfig;

EXPLANATIONS for the typed redefinitions:
    No changes except passing the generic types to infer the openapi operation.
 */
export type UserRouteConfig<
  PATHS extends {},
  METHOD extends HttpMethod,
  PATH extends PathsWithMethod<PATHS, METHOD>,
  STATUS extends ResponseStatuses<Responses<Operation<PATHS, METHOD, PATH>>>,
  CONTENT_TYPE,
> = UserRouteSpecificConfig<PATHS, METHOD, PATH, STATUS, CONTENT_TYPE> & FetchMockGlobalConfig;

/*
ORIGINAL from fetch-mock:

    export type ModifyRouteConfig = Omit<Nullable<UserRouteSpecificConfig>, 'name' | 'sticky'>;

EXPLANATIONS for the typed redefinitions:

    The modifyRoute method is originally used to modify a previously configured route with partial updates to its
    configuration (Typed via the Nullable<> helper type).
    Due to the previously configured route being runtime information, the ModifyRouteConfig parameter can not be
    typed safely without redefining the properties required to infer the openapi operation. Therefore, this library
    requires the user to:

    - always redeclare 'url' and 'method'
    - either not redeclare the response object, or redeclare it completely.

    TODO More complex: Response must be retyped, all other types must be DeepNullable? Is this enough?

 */

/**
 * Helper type to make all properties nullable of a given type except a set of given keys.
 */
type ExcludeNullable<T, P extends keyof T> = {
  [Key in P]: T[Key];
} & {
  [Key in Exclude<keyof T, P>]+?: T[Key];
};

export type ModifyRouteConfig<
  PATHS extends {},
  METHOD extends HttpMethod,
  PATH extends PathsWithMethod<PATHS, METHOD>,
  STATUS extends ResponseStatuses<Responses<Operation<PATHS, METHOD, PATH>>>,
  CONTENT_TYPE,
> = Omit<
  ExcludeNullable<UserRouteSpecificConfig<PATHS, METHOD, PATH, STATUS, CONTENT_TYPE>, "url" | "method">,
  "name" | "sticky"
>;

/*
ORIGINAL:

export type RouteResponseConfig = {
    body?: BodyInit | object;
    status?: number;
    headers?: {
        [key: string]: string;
    };
    throws?: Error;
    redirectUrl?: string;
    options?: ResponseInit;
};
 */
export type RouteResponseConfig<RESPONSES, STATUS extends ResponseStatuses<RESPONSES>, CONTENT_TYPE> =
  | ({
      status: STATUS;
    } & OptionalIfNoRequiredFields<"body", ResponseObject<RESPONSES, STATUS, CONTENT_TYPE>> & {
        headers?: {
          [key: string]: string;
        };
        redirectUrl?: string;
      })
  | {
      throws: Error;
    };
/*
ORIGINAL:

export type RouteResponseObjectData = RouteResponseConfig | object;
export type RouteResponseData = Response | number | string | RouteResponseObjectData;
export type RouteResponsePromise = Promise<RouteResponseData>;
export type RouteResponseFunction = (arg0: CallLog) => RouteResponseData | RouteResponsePromise;
export type RouteResponse = RouteResponseData | RouteResponsePromise | RouteResponseFunction;
 */
export type RouteResponse<RESPONSES, STATUS extends ResponseStatuses<RESPONSES>, CONTENT_TYPE> =
  | RouteResponseConfig<RESPONSES, STATUS, CONTENT_TYPE>
  | Promise<RouteResponseConfig<RESPONSES, STATUS, CONTENT_TYPE>>;
// TODO Does the Response function option even make sense?
// | ((
//     callLog: CallLog,
//   ) =>
//     | RouteResponseConfig<RESPONSES, STATUS, CONTENT_TYPE>
//     | Promise<RouteResponseConfig<RESPONSES, STATUS, CONTENT_TYPE>>)
