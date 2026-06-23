import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7: 마이그레이션용 연결 URL은 여기서 관리합니다.
// 런타임 PrismaClient는 lib/db.ts에서 libSQL 어댑터로 연결합니다.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
