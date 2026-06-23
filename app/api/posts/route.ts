import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createPostSchema, POST_TAGS } from "@/lib/posts";

export const dynamic = "force-dynamic";

// GET /api/posts?tag=상속고민 — 최신순 목록
export async function GET(req: Request) {
  const tag = new URL(req.url).searchParams.get("tag");
  const where = tag && (POST_TAGS as readonly string[]).includes(tag) ? { tag } : undefined;
  try {
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: "글 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요." },
      { status: 503 },
    );
  }
}

// POST /api/posts — 새 글 작성
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청 형식입니다." }, { status: 400 });
  }

  const parsed = createPostSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." },
      { status: 422 },
    );
  }

  try {
    const post = await prisma.post.create({ data: parsed.data });
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "글을 저장하지 못했어요. 잠시 후 다시 시도해 주세요." },
      { status: 503 },
    );
  }
}
