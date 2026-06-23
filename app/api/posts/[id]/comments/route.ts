import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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
  } catch {
    return NextResponse.json(
      { error: "댓글을 저장하지 못했어요. 잠시 후 다시 시도해 주세요." },
      { status: 503 },
    );
  }
}
