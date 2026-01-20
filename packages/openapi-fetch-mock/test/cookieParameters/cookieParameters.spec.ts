import { describe, it, expect } from "vitest";
import { typedFetchMock } from "../../src/index.js";
import { paths } from "./schemas/schema.js";
import createClient from "openapi-fetch/src/index.js";

describe("openapi-fetch-mock", () => {
  //TODO Cookie parameters need reconsiderations. They is also an open issue regarding cookies here: https://github.com/openapi-ts/openapi-typescript/issues/1771
  describe("Handling of cookie parameters", () => {
    const tfm = typedFetchMock<paths>({ baseUrl: "http://localhost:3124" });
    const client = createClient<paths>({ baseUrl: "http://localhost:3124" })

    client.use({
      onRequest: (options)=> {
        if(options.params.cookie && Object.keys(options.params.cookie).length > 0){
          options.request.headers.set('cookie',Object.entries(options.params.cookie).reduce(
              (acc, item) => `${acc}${acc ? "; " : ""}${item[0]}=${item[1]}`,
              '',
          ))
        }
      }
    });

    it("correctly distinguishes calls based on a cookie parameter difference", async () => {
      // Given
      tfm.route({
        method: "get",
        url: "/cookie-parameter",
        cookies: {
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
        url: "/cookie-parameter",
        cookies: {
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
        (await client.GET("/cookie-parameter", { params: { cookie: {
              paramA: "Param A",
              paramB: "Param B",
              paramC: "Param C1",
            } } })).data,
      ).toEqual("Response 1");
      expect(
        (await client.GET("/cookie-parameter", { params: { cookie: {
              paramA: "Param A",
              paramB: "Param B",
              paramC: "Param C2",
            } } })).data,
      ).toEqual("Response 2");
    });

    it("ignores order of declared cookies", async () => {
      // Given
      tfm.route({
        method: "get",
        url: "/cookie-parameter",
        cookies: {
          paramA: "Param A",
          paramB: "Param B",
          paramC: "Param C1",
        },
        response: {
          status: 200,
          body: '"Response"',
        },
      });

      // When
      // Then
      expect(
          (await client.GET("/cookie-parameter", { params: { cookie: {
                paramA: "Param A",
                paramB: "Param B",
                paramC: "Param C1",
              } } })).data,
      ).toEqual("Response");
      expect(
          (await client.GET("/cookie-parameter", { params: { cookie: {
                paramB: "Param B",
                paramA: "Param A",
                paramC: "Param C2",
              } } })).data,
      ).toEqual("Response");
    });

    it("correctly distinguishes calls based on a missing optional cookie parameter", async () => {
      // Given

      //Declare fallback catch for calls not matching the route
      const error = new Error('Fallback');
      tfm.catch({throws: error})

      tfm.route({
        method: "get",
        url: "/cookie-parameter",
        cookies: {
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

      // TODO unspecified cookie parameter should result on not matching a route that specifies the parameter
      // // paramC is specified -> route should not match and catch should throw error
      // expect(async () => (
      //     (await client.GET("/cookie-parameter", {
      //       params: {
      //         cookie: {
      //           paramA: "Param A",
      //           paramB: "Param B",
      //           paramC: "Param C1",
      //         }
      //       }
      //     })).data),
      // ).toThrowError(error)

      //TODO Remove, once above is implemented
      expect((await client.GET("/cookie-parameter", {
                params: {
                  cookie: {
                    paramA: "Param A",
                    paramB: "Param B",
                    paramC: "Param C1",
                  }
                }
              })).data,
          ).toEqual("Response");

      // paramC is not specified and other cookie params match -> should return mocked response
      expect(
          (await client.GET("/cookie-parameter", {
            params: {
              cookie: {
                paramA: "Param A",
                paramB: "Param B",
              }
            }
          })).data,
      ).toEqual("Response");

      // paramC is not specified but other cookie params don't match -> route should not match and catch should throw error
      expect(async () => (
          (await client.GET("/cookie-parameter", {
            params: {
              cookie: {
                paramA: "Param A",
                paramB: "Param Other",
              }
            }
          })).data),
      ).rejects.toThrowError(error)
    })

    it("string-representation when handling non-string cookie parameters", async () => {
      //TODO Have to think about how to handle non-string parameters!
    });


    it("prevents defining invalid cookies properties", () => {
      //@ts-expect-error as no 'params' property is provided, but is required for the defined operation
      tfm.route({
        method: "get",
        url: "/cookie-parameter",
        response: {
          status: 200,
          body: "First",
        },
      });

      tfm.route({
        method: "get",
        url: "/cookie-parameter",
        //@ts-expect-error as an empty 'cookie' property is provided, missing the required cookie parameters
        cookies: {},
        response: {
          status: 200,
          body: "First",
        },
      });

      tfm.route({
        method: "get",
        url: "/cookie-parameter",
        //@ts-expect-error as not all required cookie parameters are provided
        cookies: {
          paramA: "ParamA",
        },
        response: {
          status: 200,
          body: "First",
        },
      });

      tfm.route({
        method: "get",
        url: "/cookie-parameter",
        cookies: {
          paramA: "ParamA",
          paramB: "ParamB",
          //@ts-expect-error as a non-existing cookie parameter is present
          otherParameter: "foo",
        },
        response: {
          status: 200,
          body: "First",
        },
      });

      tfm.route({
        method: "get",
        url: "/cookie-parameter",
        cookies: {
          //@ts-expect-error as the provided cookie parameter is of the wrong type
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
        url: "/no-cookie-params",
        //@ts-expect-error as a cookie property is present even though the operation does not define any cookie parameters
        cookies: {},
        response: {
          status: 200,
          body: "First",
        },
      });
    });
  });

  //TODO Test combination of cookie and header parameters
});
