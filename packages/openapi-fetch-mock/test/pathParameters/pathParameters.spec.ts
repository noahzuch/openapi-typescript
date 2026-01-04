import { describe, it, expect } from "vitest";
import { typedFetchMock } from "../../src/index.js";
import { paths } from "./schemas/schema.js";
import createClient from "openapi-fetch/src/index.js";

describe("openapi-fetch-mock", () => {
  describe("Handling of path parameters", () => {
    const tfm = typedFetchMock<paths>({ baseUrl: "http://localhost:3124" });
    const client = createClient<paths>({ baseUrl: "http://localhost:3124" });

    it("correctly resolves path parameters", async () => {
      // Given
      tfm.route({
        method: "get",
        url: "/string-path-params/{string}",
        params: {
          string: "Param 1",
        },
        response: {
          status: 200,
          body: '"Response 1"',
        },
      });

      tfm.route({
        method: "get",
        url: "/string-path-params/{string}",
        params: {
          string: "Param 2",
        },
        response: {
          status: 200,
          body: '"Response 2"',
        },
      });

      // When
      // Then
      expect(
        (await client.GET("/string-path-params/{string}", { params: { path: { string: "Param 1" } } })).data,
      ).toEqual("Response 1");
      expect(
        (await client.GET("/string-path-params/{string}", { params: { path: { string: "Param 2" } } })).data,
      ).toEqual("Response 2");
    });

    it("requires string-representation when handling non-string path parameters", async () => {
      //TODO Have to think about how to handle non-string parameters!
    });
    // tfm.route({
    //     method: 'get',
    //     url: '/object-path-params/{object}',
    //     params: {
    //         object: 'foo="123",bar=456'
    //     },
    //     response: {
    //         status: 200,
    //         body: '"Response"'
    //     }
    // })
    //
    // const response = await client.GET('/object-path-params/{object}', {params: {path: {object: {foo: "123", bar: 456}}}})
    //
    // }

    it("prevents defining invalid params properties", () => {
      //@ts-expect-error as no 'params' property is provided, but is required for the defined operation
      tfm.route({
        method: "get",
        url: "/string-path-params/{string}",
        response: {
          status: 200,
          body: "First",
        },
      });

      tfm.route({
        method: "get",
        url: "/string-path-params/{string}",
        //@ts-expect-error as an empty 'params' property is provided, missing the param 'string'
        params: {},
        response: {
          status: 200,
          body: "First",
        },
      });

      tfm.route({
        method: "get",
        url: "/string-path-params/{string}",
        params: {
          string: "abc",
          //@ts-expect-error as a non-existing path parameter is present
          otherParameter: "foo",
        },
        response: {
          status: 200,
          body: "First",
        },
      });

      tfm.route({
        method: "get",
        url: "/string-path-params/{string}",
        params: {
          //@ts-expect-error as the provided path parameter is of the wrong type
          string: 123,
        },
        response: {
          status: 200,
          body: "First",
        },
      });

      tfm.route({
        method: "get",
        url: "/no-path-params",
        //@ts-expect-error as a params property is present even though the operation does not define any path parameters
        params: {},
        response: {
          status: 200,
          body: "First",
        },
      });
    });
  });
});
