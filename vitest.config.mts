import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // tsconfig의 paths(@/*)를 네이티브로 해석
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Playwright E2E 스펙(e2e/*.spec.ts)은 vitest 대상에서 제외(별도 pnpm e2e로 실행).
    exclude: ["e2e/**", "node_modules/**", "dist/**", ".next/**"],
  },
});
