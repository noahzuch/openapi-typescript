import { describe, it, expect } from "vitest";
import { typedFetchMock } from "../../src/index.js";
import { paths } from "./schemas/schema.js";
import createClient from "openapi-fetch";

describe("openapi-fetch-mock", () => {
  describe("Handling of methods and paths", () => {
    const tfm = typedFetchMock<paths>({ baseUrl: "http://localhost:3124" });
    const client = createClient<paths>({ baseUrl: "http://localhost:3124" });

    it("allows mocking of get requests for correct path", async () => {
      // Given
      tfm.route({
        method: "get",
        url: `/get/`,
        response: { status: 204 },
      });

      // When
      // Then
      expect((await client.GET("/get/")).response.status).toEqual(204);
    });

    it("prevents mocking of get requests for incorrect paths", async () => {
      tfm.route({
        method: "get",
        // @ts-expect-error due to the provided path not having an operation for the given method
        url: `/post/`,
        response: { status: 204 },
      });
    });

    it("allows mocking of put requests for correct path", async () => {
      // Given
      tfm.route({
        method: "put",
        url: `/put/`,
        response: { status: 204 },
      });

      // When
      // Then
      expect((await client.PUT("/put/")).response.status).toEqual(204);
    });

    it("prevents mocking of put requests for incorrect paths", async () => {
      tfm.route({
        method: "put",
        // @ts-expect-error due to the provided path not having an operation for the given method
        url: `/post/`,
        response: { status: 204 },
      });
    });

    it("allows mocking of post requests for correct path", async () => {
      // Given
      tfm.route({
        method: "post",
        url: `/post/`,
        response: { status: 204 },
      });

      // When
      // Then
      expect((await client.POST("/post/")).response.status).toEqual(204);
    });

    it("prevents mocking of post requests for incorrect paths", async () => {
      tfm.route({
        method: "post",
        // @ts-expect-error due to the provided path not having an operation for the given method
        url: `/get/`,
        response: { status: 204 },
      });
    });

    it("allows mocking of delete requests for correct path", async () => {
      // Given
      tfm.route({
        method: "delete",
        url: `/delete/`,
        response: { status: 204 },
      });

      // When
      // Then
      expect((await client.DELETE("/delete/")).response.status).toEqual(204);
    });

    it("prevents mocking of delete requests for incorrect paths", async () => {
      tfm.route({
        method: "delete",
        // @ts-expect-error due to the provided path not having an operation for the given method
        url: `/post/`,
        response: { status: 204 },
      });
    });

    it("allows mocking of options requests for correct path", async () => {
      // Given
      tfm.route({
        method: "options",
        url: `/options/`,
        response: { status: 204 },
      });

      // When
      // Then
      expect((await client.OPTIONS("/options/")).response.status).toEqual(204);
    });

    it("prevents mocking of options requests for incorrect paths", async () => {
      tfm.route({
        method: "options",
        // @ts-expect-error due to the provided path not having an operation for the given method
        url: `/post/`,
        response: { status: 204 },
      });
    });

    it("allows mocking of head requests for correct path", async () => {
      // Given
      tfm.route({
        method: "head",
        url: `/head/`,
        response: { status: 204 },
      });

      // When
      // Then
      expect((await client.HEAD("/head/")).response.status).toEqual(204);
    });

    it("prevents mocking of head requests for incorrect paths", async () => {
      tfm.route({
        method: "head",
        // @ts-expect-error due to the provided path not having an operation for the given method
        url: `/post/`,
        response: { status: 204 },
      });
    });

    it("allows mocking of patch requests for correct path", async () => {
      // Given
      tfm.route({
        method: "patch",
        url: `/patch/`,
        response: { status: 204 },
      });

      // When
      // Then
      expect((await client.PATCH("/patch/")).response.status).toEqual(204);
    });

    it("prevents mocking of patch requests for incorrect paths", async () => {
      tfm.route({
        method: "patch",
        // @ts-expect-error due to the provided path not having an operation for the given method
        url: `/post/`,
        response: { status: 204 },
      });
    });
  });
});
