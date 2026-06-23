import { defineConfig, devices } from "@playwright/test";

// 여백 E2E 스모크 — sqlite 파일 모드라 외부 의존 없이 자체완결.
// DB 준비(스키마 push + 시드)는 e2e/global-setup.ts에서 webServer 기동 전에 수행한다.
const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = `http://127.0.0.1:${PORT}`;

// 테스트 전용 sqlite 파일. 매 실행 시 global-setup에서 새로 만든다.
const DATABASE_URL = "file:./e2e.db";

export default defineConfig({
  testDir: "./e2e",
  // CI에서는 .only 차단, 재시도 2회, 단일 워커로 sqlite 쓰기 충돌 방지.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  globalSetup: "./e2e/global-setup.ts",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    actionTimeout: 10_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // 프로덕션 빌드로 실제 동작에 가깝게 검증. global-setup이 먼저 DB를 준비한다.
    command: "pnpm build && pnpm start",
    url: BASE_URL,
    env: {
      DATABASE_URL,
      PORT: String(PORT),
      // 빌드/시드가 동일한 DB 파일을 바라보게 강제.
      NEXT_TELEMETRY_DISABLED: "1",
    },
    reuseExistingServer: !process.env.CI,
    // 빌드까지 포함하므로 넉넉히.
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
