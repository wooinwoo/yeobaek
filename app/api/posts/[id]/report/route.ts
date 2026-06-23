import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
  } catch {
    return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  }
}
