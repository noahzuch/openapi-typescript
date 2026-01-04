import { type HttpMethod } from "openapi-typescript-helpers";
import { PathsWithMethod, RequiredKeysOf } from "openapi-typescript-helpers/src/index.js";

/**
 * Helper type to narrow down the PathsWithMethod type to only include string paths.
 */
export type StringPathsWithMethod<Paths extends {}, Method extends HttpMethod> = PathsWithMethod<Paths, Method> &
  string;

/**
 * Helper type to access an operation for a given method and path.
 */
export type Operation<
  Paths extends {},
  Method extends HttpMethod,
  Path extends PathsWithMethod<Paths, Method>,
> = Paths[Path][keyof Paths[Path] & Method];

/**
 * Query parameters for a given operation or never, if none exist
 */
export type QueryParameters<Operation> = Operation extends { parameters: { query: any } }
  ? Operation["parameters"]["query"]
  : never;
/**
 * Path parameters for a given operation or never, if none exist
 */
export type PathParameters<Operation> = Operation extends { parameters: { path: any } }
  ? Operation["parameters"]["path"]
  : never;

/**
 * Header parameters for a given operation or never, if none exist
 */
export type HeaderParameters<Operation> = Operation extends { parameters: { header: any } }
  ? Operation["parameters"]["header"]
  : never;

/**
 * Cookie parameters for a given operation or never, if none exist
 */
export type CookieParameters<Operation> = Operation extends { parameters: { cookie: any } }
  ? Operation["parameters"]["cookie"]
  : never;

/**
 * Request Body for a given operation or never, if none exist
 */
export type RequestBody<Operation> = Operation extends { requestBody: any } ? Operation["requestBody"] : never;

/**
 * Responses object for a given operation or never, if none exist
 */
export type Responses<Operation> = Operation extends { responses: {} } ? Operation["responses"] : never;

/**
 * Possible response status codes for a given set of responses
 */
export type ResponseStatuses<RESPONSES> = keyof RESPONSES;

export type ResponseContent<RESPONSES, STATUS extends ResponseStatuses<RESPONSES>> = RESPONSES[STATUS] extends {
  content: any;
}
  ? RESPONSES[STATUS]["content"]
  : never;

/**
 * Possible Response object types for a given set of responses, a status code, and a content type matcher (using template literal types).
 */
//TODO check if this type is correct. The typing of the openapi-fetch package is more complex
export type ResponseObject<RESPONSES, STATUS extends ResponseStatuses<RESPONSES>, CONTENT_TYPE_MATCHER> = {
  [KEY in keyof ResponseContent<RESPONSES, STATUS>]: KEY extends CONTENT_TYPE_MATCHER
    ? ResponseContent<RESPONSES, STATUS>[KEY]
    : never;
}[keyof ResponseContent<RESPONSES, STATUS>];

export type OptionalIfNoRequiredFields<PROPERTY extends string, TYPE> = RequiredKeysOf<TYPE> extends never
  ? {
      [key in PROPERTY]?: never;
    }
  : {
      [key in PROPERTY]: TYPE;
    };
