import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// 각 테스트 후 렌더된 DOM을 정리해 테스트 간 간섭을 막는다.
afterEach(() => {
  cleanup();
});
