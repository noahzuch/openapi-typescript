import { describe, it, expect } from "vitest";
import { typedFetchMock } from "../../src/index.js";
import { paths } from "./schemas/schema.js";
import createClient from "openapi-fetch/src/index.js";

describe("openapi-fetch-mock", () => {
  describe("Handling of query parameters", () => {
    const tfm = typedFetchMock<paths>({ baseUrl: "http://localhost:3124" });
    const client = createClient<paths>({ baseUrl: "http://localhost:3124" });

    it("correctly distinguishes calls based on a query parameter difference", async () => {
      // Given
      tfm.route({
        method: "get",
        url: "/query-parameter",
        query: {
          paramA: "Param A",
          paramB: "Param B",
          paramC: "Param C1",
        },
        response: {
          status: 200,
          body: '"Response 1"',
        },
      });

      tfm.route({
        method: "get",
        url: "/query-parameter",
        query: {
          paramA: "Param A",
          paramB: "Param B",
          paramC: "Param C2",
        },
        response: {
          status: 200,
          body: '"Response 2"',
        },
      });

      // When
      // Then
      expect(
        (await client.GET("/query-parameter", { params: { query: {
              paramA: "Param A",
              paramB: "Param B",
              paramC: "Param C1",
            } } })).data,
      ).toEqual("Response 1");
      expect(
        (await client.GET("/query-parameter", { params: { query: {
              paramA: "Param A",
              paramB: "Param B",
              paramC: "Param C2",
            } } })).data,
      ).toEqual("Response 2");
    });

    it("correctly distinguishes calls based on a missing optional query parameter", async () => {
      // Given

      //Declare fallback catch for calls not matching the route
      const error = new Error('Fallback');
      tfm.catch({throws: error})

      tfm.route({
        method: "get",
        url: "/query-parameter",
        query: {
          paramA: "Param A",
          paramB: "Param B",
          // Optional paramC is omitted -> should only match calls, where paramC is not provided
          // paramC: "Param C1",
        },
        response: {
          status: 200,
          body: '"Response"',
        },
      });


      // When
      // Then

      // TODO unspecified query parameter should result on not matching a route that specifies the parameter
      // // paramC is specified -> route should not match and catch should throw error
      // expect(async () => (
      //     (await client.GET("/query-parameter", {
      //       params: {
      //         query: {
      //           paramA: "Param A",
      //           paramB: "Param B",
      //           paramC: "Param C1",
      //         }
      //       }
      //     })).data),
      // ).toThrowError(error)

      //TODO Remove, once above is implemented
      expect((await client.GET("/query-parameter", {
                params: {
                  query: {
                    paramA: "Param A",
                    paramB: "Param B",
                    paramC: "Param C1",
                  }
                }
              })).data,
          ).toEqual("Response");

      // paramC is not specified and other query params match -> should return mocked response
      expect(
          (await client.GET("/query-parameter", {
            params: {
              query: {
                paramA: "Param A",
                paramB: "Param B",
              }
            }
          })).data,
      ).toEqual("Response");

      // paramC is not specified but other query params don't match -> route should not match and catch should throw error
      expect(async () => (
          (await client.GET("/query-parameter", {
            params: {
              query: {
                paramA: "Param A",
                paramB: "Param Other",
              }
            }
          })).data),
      ).rejects.toThrowError(error)
    })

    it("string-representation when handling non-string query parameters", async () => {
      //TODO Have to think about how to handle non-string parameters!
    });


    it("prevents defining invalid query properties", () => {
      //@ts-expect-error as no 'params' property is provided, but is required for the defined operation
      tfm.route({
        method: "get",
        url: "/query-parameter",
        response: {
          status: 200,
          body: "First",
        },
      });

      tfm.route({
        method: "get",
        url: "/query-parameter",
        //@ts-expect-error as an empty 'query' property is provided, missing the required query parameters
        query: {},
        response: {
          status: 200,
          body: "First",
        },
      });

      tfm.route({
        method: "get",
        url: "/query-parameter",
        //@ts-expect-error as not all required query parameters are provided
        query: {
          paramA: "ParamA",
        },
        response: {
          status: 200,
          body: "First",
        },
      });

      tfm.route({
        method: "get",
        url: "/query-parameter",
        query: {
          paramA: "ParamA",
          paramB: "ParamB",
          //@ts-expect-error as a non-existing query parameter is present
          otherParameter: "foo",
        },
        response: {
          status: 200,
          body: "First",
        },
      });

      tfm.route({
        method: "get",
        url: "/query-parameter",
        query: {
          //@ts-expect-error as the provided query parameter is of the wrong type
          paramA: 123,
          paramB: "ParamB",
        },
        response: {
          status: 200,
          body: "First",
        },
      });

      tfm.route({
        method: "get",
        url: "/no-query-params",
        //@ts-expect-error as a query property is present even though the operation does not define any query parameters
        query: {},
        response: {
          status: 200,
          body: "First",
        },
      });
    });
  });
});
