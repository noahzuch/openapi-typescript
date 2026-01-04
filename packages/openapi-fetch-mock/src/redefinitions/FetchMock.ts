// ==============================================================================
// == THIS FILE contains copies of modified types from fetch-mock/FetchMock.ts ==
// ==============================================================================

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
