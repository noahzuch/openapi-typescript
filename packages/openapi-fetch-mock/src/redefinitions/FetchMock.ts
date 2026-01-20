// ==============================================================================
// == THIS FILE contains copies of modified types from fetch-mock/FetchMock.ts ==
// ==============================================================================

import {FetchMock as OriginalFetchMock, RemoveRouteOptions, RouteResponse as OriginalRouteResponse, UserRouteConfig as OriginalUserRouteConfig} from "fetch-mock";
import {HttpMethod} from "openapi-typescript-helpers/src/index.js";
import {Operation, Responses, ResponseStatuses, StringPathsWithMethod} from "../openapiHelpers.js";
import {ModifyRouteConfig, RouteName, UserRouteConfig} from "./Routes.js";
import {WrapperConfig} from "../index.js";

export type FetchMockGlobalConfig = {
  includeContentLength?: boolean;
  /**
   * @deprecated Matching of partial bodies would result in lenient type safety. This library therefore disables that particular
   * feature of fetch-mock.
   */
  matchPartialBody?: never;
  allowRelativeUrls?: boolean;
};

export type FetchImplementations = {
  fetch?: typeof fetch;
  Headers?: typeof Headers;
  Request?: typeof Request;
  Response?: typeof Response;
};

export type FetchMockConfig = FetchMockGlobalConfig & FetchImplementations;

export class TypedFetchMock<PATHS extends {}> {
  private readonly internalFetchMock: OriginalFetchMock;
  private readonly wrapperConfig: WrapperConfig;

  constructor(internalFetchMock: OriginalFetchMock, wrapperConfig?: WrapperConfig) {
    this.internalFetchMock = internalFetchMock;
    this.wrapperConfig = wrapperConfig ?? {};
  }

  get config() {
    return this.internalFetchMock.config as FetchMockGlobalConfig;
  }

  set config(config: FetchMockGlobalConfig) {
    this.internalFetchMock.config = config;
  }

  get router() {
    return this.internalFetchMock.router;
  }

  set router(router: OriginalFetchMock["router"]) {
    this.internalFetchMock.router = router;
  }

  get callHistory() {
    return this.internalFetchMock.callHistory;
  }

  set callHistory(callHistory: OriginalFetchMock["callHistory"]) {
    this.internalFetchMock.callHistory = callHistory;
  }

  fetchHandler(requestInput: string | URL | Request, requestInit?: RequestInit): Promise<Response> {
    return this.internalFetchMock.fetchHandler(requestInput, requestInit);
  }

  route<
      METHOD extends HttpMethod,
      PATH extends StringPathsWithMethod<PATHS, METHOD>,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, METHOD, PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, METHOD, PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.route(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  // TODO: should we by default throw some error?
  //  One thought: A 'catch response' that returns any value is not part of the openapi and should not be relied on in the test. Only throwing an Error would be consistent.
  catch(response?: OriginalRouteResponse): this {
    this.internalFetchMock.catch(response);
    return this;
  }

  /**
   * @deprecated The defineMatcher method from fetch-mock allows a user to define runtime-matchers not compatible with the
   * openapi type focused approach of this wrapper library, and we therefore not support it.
   * TODO unify messages. Is @deprecated and typing the parameters as never the best approach?
   */
  defineMatcher(matcher: never): void {
    throw new Error(
        "The defineMatcher method from fetch-mock is not supported in the openapi-ts wrapper, see its documentation for further information",
    );
  }

  removeRoutes(options?: RemoveRouteOptions): this {
    this.internalFetchMock.removeRoutes(options);
    return this;
  }

  removeRoute(routeName: string): this {
    this.internalFetchMock.removeRoute(routeName);
    return this;
  }

  //TODO ModifyRouteConfig object is not yet correctly typed
  modifyRoute<
      METHOD extends HttpMethod,
      PATH extends StringPathsWithMethod<PATHS, METHOD>,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, METHOD, PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(routeName: string, options: ModifyRouteConfig<PATHS, METHOD, PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.modifyRoute(routeName, options);
    return this;
  }

  clearHistory(): this {
    this.internalFetchMock.clearHistory();
    return this;
  }

  mockGlobal(): this {
    this.internalFetchMock.mockGlobal();
    return this;
  }

  unmockGlobal(): this {
    this.internalFetchMock.unmockGlobal();
    return this;
  }

  hardReset(options?: Parameters<OriginalFetchMock["hardReset"]>[0]): this {
    this.internalFetchMock.hardReset(options);
    return this;
  }

  spy<
      METHOD extends HttpMethod,
      PATH extends StringPathsWithMethod<PATHS, METHOD>,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, METHOD, PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, METHOD, PATH, STATUS, CONTENT_TYPE>, name?: RouteName): this {
    this.internalFetchMock.spy(this.convertConfigToOriginalFetchMockConfig(config), name);
    return this;
  }

  spyGlobal(): this {
    this.internalFetchMock.spyGlobal();
    return this;
  }

  sticky<
      METHOD extends HttpMethod,
      PATH extends StringPathsWithMethod<PATHS, METHOD>,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, METHOD, PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, METHOD, PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.sticky(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  once<
      METHOD extends HttpMethod,
      PATH extends StringPathsWithMethod<PATHS, METHOD>,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, METHOD, PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, METHOD, PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.once(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  /**
   *  @deprecated The any-methods allow mocking without specifying a RouteMatcher object. Therefore, the response type can not be
   *  inferred and would have to allow arbitrary response objects. This does not fit the intent of this library, and we
   *  therefore not support them.
   */
  any(response: never, options?: never): this {
    throw new Error(
        "The any method from fetch-mock is not supported in the openapi-ts wrapper, see its documentation for further information",
    );
  }

  /**
   *
   *  @deprecated The any-methods allow mocking without specifying a RouteMatcher object. Therefore, the response type can not be
   *  inferred and would have to allow arbitrary response objects. This does not fit the intent of this library, and we
   *  therefore not support them.
   */
  anyOnce(response: never, options?: never): this {
    throw new Error(
        "The any method from fetch-mock is not supported in the openapi-ts wrapper, see its documentation for further information",
    );
  }

  get<
      PATH extends StringPathsWithMethod<PATHS, "get">,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, "get", PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, "get", PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.get(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  getOnce<
      PATH extends StringPathsWithMethod<PATHS, "get">,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, "get", PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, "get", PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.getOnce(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  post<
      PATH extends StringPathsWithMethod<PATHS, "post">,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, "post", PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, "post", PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.post(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  postOnce<
      PATH extends StringPathsWithMethod<PATHS, "post">,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, "post", PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, "post", PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.postOnce(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  put<
      PATH extends StringPathsWithMethod<PATHS, "put">,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, "put", PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, "put", PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.put(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  putOnce<
      PATH extends StringPathsWithMethod<PATHS, "put">,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, "put", PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, "put", PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.putOnce(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  delete<
      PATH extends StringPathsWithMethod<PATHS, "delete">,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, "delete", PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, "delete", PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.delete(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  deleteOnce<
      PATH extends StringPathsWithMethod<PATHS, "delete">,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, "delete", PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, "delete", PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.deleteOnce(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  head<
      PATH extends StringPathsWithMethod<PATHS, "head">,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, "head", PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, "head", PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.head(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  headOnce<
      PATH extends StringPathsWithMethod<PATHS, "head">,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, "head", PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, "head", PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.headOnce(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  patch<
      PATH extends StringPathsWithMethod<PATHS, "patch">,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, "patch", PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, "patch", PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.patch(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  patchOnce<
      PATH extends StringPathsWithMethod<PATHS, "patch">,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, "patch", PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, "patch", PATH, STATUS, CONTENT_TYPE>): this {
    this.internalFetchMock.patchOnce(this.convertConfigToOriginalFetchMockConfig(config));
    return this;
  }

  /**
   * Converts a UserRouteConfig object from this typed fetch-mock wrapper into a matching UserRouteConfig object from
   * the actual fetch-mock API.
   * @param config The config to convert.
   */
  private convertConfigToOriginalFetchMockConfig<
      METHOD extends HttpMethod,
      PATH extends StringPathsWithMethod<PATHS, METHOD>,
      STATUS extends ResponseStatuses<Responses<Operation<PATHS, METHOD, PATH>>>,
      CONTENT_TYPE = `${string}/${string}`,
  >(config: UserRouteConfig<PATHS, METHOD, PATH, STATUS, CONTENT_TYPE>): OriginalUserRouteConfig {
    const internalConfig: OriginalUserRouteConfig = {
      ...config,
      // Resolve the final url from the relative url of the openapi spec and any path params
      url: this.resolvePath(config.url, config.params),
    };
    const headers = this.combineHeadersWithCookies(config.headers, config.cookies);
    if (headers) {
      internalConfig.headers = headers;
      // Delete the cookie property, as it is now already present inside the header property
      // @ts-expect-error The type OriginalUserRouteConfig does not have this property, but it may be introduced via
      // the spread of config.
      delete internalConfig.cookies;
    }

    // Delete the params property, as it was already used to resolve the path before passing it to fetch-mock
    delete internalConfig.params;

    return internalConfig;
  }

  /**
   * Resolves the given path containing placeholders in the format '{placeholder}' with the actual values given in the
   * pathParameter record.
   * @param path The path to resolve containing placeholders.
   * @param pathParameters A record containing the actual value per placeholder in the path.
   */
  private resolvePath(path: string, pathParameters?: Record<string, string>) {
    let resolvedPath: string = path;
    if (pathParameters) {
      for (const key in pathParameters) {
        resolvedPath = resolvedPath.replaceAll(`{${key}}`, pathParameters[key]!);
      }
    }
    return (this.wrapperConfig.baseUrl ?? "") + resolvedPath;
  }

  /**
   * Combines the headers config property with the cookies property of a UserRouteConfig modifying or adding a 'cookie'
   * property in the headers with the values from the cookie property. Returns the combined headers config object.
   */
  private combineHeadersWithCookies(headers?: Record<string, string | number>, cookies?: Record<string, unknown>) {
    if (!cookies) {
      return headers;
    }

    function combineCookieHeaderValues(originalValue: string, newValues: Record<string, unknown>): string {
      return Object.entries(newValues).reduce(
          (acc, item) => `${acc}${acc ? "; " : ""}${item[0]}=${item[1]}`,
          originalValue,
      );
    }

    if (headers) {
      const cookieKeys = Object.keys(headers).filter((key) => key.toLowerCase() === "cookie");
      if (cookieKeys.length > 1) {
        throw new Error("Multiple cookie headers found. The HTTP specifications don't allow duplicate headers.");
      }
      const cookieKey = cookieKeys.length == 1 ? cookieKeys[0] : undefined;
      if (cookieKey) {
        headers[cookieKey] = combineCookieHeaderValues((headers[cookieKey] ?? "").toString(), cookies);
      } else {
        headers.cookie = combineCookieHeaderValues("", cookies);
      }
      return headers;
    } else {
      return {
        cookie: combineCookieHeaderValues("", cookies),
      };
    }
  }
}