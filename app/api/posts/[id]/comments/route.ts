import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { createCommentSchema } from "@/lib/posts";

export const dynamic = "force-dynamic";

// GET /api/posts/:id/comments — 해당 글의 댓글 목록(오래된순)
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: id },
      orderBy: { createdAt: "asc" },
      take: 200,
    });
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json(
      { error: "댓글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요." },
      { status: 503 },
    );
  }
}

// POST /api/posts/:id/comments — 댓글 작성(작성 시 글의 답변 수 +1)
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const parsed = createCommentSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." },
      { status: 422 },
    );
  }

  try {
    const [comment] = await prisma.$transaction([
      prisma.comment.create({ data: { postId: id, body: parsed.data.body } }),
      prisma.post.update({ where: { id }, data: { reply: { increment: 1 } } }),
    ]);
    return NextResponse.json(comment, { status: 201 });
  } catch (e) {
    // 존재하지 않는 글에 단 댓글: P2003(외래키 위반) 또는 P2025(글 update 대상 없음) → 404.
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      (e.code === "P2003" || e.code === "P2025")
    ) {
      return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
    }
    // 그 외(DB 장애 등) → 503.
    return NextResponse.json(
      { error: "댓글을 저장하지 못했어요. 잠시 후 다시 시도해 주세요." },
      { status: 503 },
    );
  }
}
