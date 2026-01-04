import fetchMock from "fetch-mock";
import { afterEach } from "vitest";

globalThis.fetch = fetchMock.fetchHandler;

afterEach(() => {
  fetchMock.removeRoutes();
  fetchMock.clearHistory();
});
