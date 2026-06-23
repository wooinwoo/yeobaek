import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";

// POST /api/posts/:id/report — 부적절한 글 신고(누적 +1)
export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { reported: { increment: 1 } },
      select: { id: true, reported: true },
    });
    return NextResponse.json(post);
  } catch (e) {
    // P2025: 대상 레코드 없음 → 404. 그 외(DB 장애 등) → 503.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요." },
      { status: 503 },
    );
  }
}
