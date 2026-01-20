import fetchMock from "fetch-mock";
import {TypedFetchMock} from "./redefinitions/FetchMock.js";

export type WrapperConfig = {
  /**
   * A base url, e.g. http://localhost:3000 defining the common root URL for all API requests.
   * Any mocked route will be prefixed with this baseUrl. Omit this property, If you want to mock the relative URLs of the openapi spec.
   */
  baseUrl?: string;
};

/**
 * Creates an instance of the TypedFetchMock class for a given schema wrapping the default fetchMock instance from the
 * fetch-mock library.
 */
export function typedFetchMock<PATHS extends {}>(config?: WrapperConfig) {
  return new TypedFetchMock<PATHS>(fetchMock, config);
}
