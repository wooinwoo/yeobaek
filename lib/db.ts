import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// libSQL 어댑터: 로컬은 file:, 프로덕션은 Turso(libsql://) — 같은 코드로 동작.
// - 로컬:      DATABASE_URL="file:./prisma/dev.db" (authToken 불필요)
// - 프로덕션:  DATABASE_URL="libsql://<db>-<org>.turso.io" + TURSO_AUTH_TOKEN
const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

// 원격(Turso) 연결일 때만 authToken을 어댑터에 전달한다.
// file: 모드에서는 authToken이 필요 없으므로 url만 넘긴다(로컬 동작 유지).
const isRemote = /^(libsql|wss?|https?):/.test(url);
const adapter = new PrismaLibSql(
  isRemote
    ? { url, authToken: process.env.TURSO_AUTH_TOKEN }
    : { url },
);

// 개발 중 핫리로드로 커넥션이 무한 생성되는 것 방지(싱글톤).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
