import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { resolve } from "node:path";

// E2E용 sqlite 파일을 깨끗이 만들고 스키마 push + 시드까지 끝낸다.
// webServer(빌드/기동)가 시작되기 전에 1회 실행된다.
const DATABASE_URL = "file:./e2e.db";

export default function globalSetup() {
  const dbPath = resolve(process.cwd(), "e2e.db");
  // 이전 실행 잔여 파일 제거 → 시드가 항상 동일하게 들어가도록(시드는 글이 있으면 건너뜀).
  for (const f of [dbPath, `${dbPath}-journal`, `${dbPath}-shm`, `${dbPath}-wal`]) {
    rmSync(f, { force: true });
  }

  const env = { ...process.env, DATABASE_URL };
  const run = (cmd: string) =>
    execSync(cmd, { stdio: "inherit", env, cwd: process.cwd() });

  // 스키마 반영(마이그레이션 대신 push로 충분 — 테스트용 일회성 DB).
  // Prisma 7: --url로 datasource를 명시 지정(config의 env 의존 없이 e2e.db만 바라보게).
  run(`pnpm exec prisma db push --url="${DATABASE_URL}" --accept-data-loss`);
  // 시드(글 4건 + 댓글). seed.ts는 DATABASE_URL env를 읽는다(prisma.config.ts migrations.seed).
  run("pnpm exec prisma db seed");
}
