import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import type { PostDTO } from "@/lib/posts";
import CommunityBoard from "@/components/CommunityBoard";

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "익명으로 고민과 위로를 나누는 따뜻한 공간. 같은 길을 지나온 이들과 함께.",
};

export const dynamic = "force-dynamic";

export default async function Community() {
  // DB 조회 실패가 페이지 전체를 무너뜨리지 않도록 빈 목록으로 폴백한다.
  let posts: PostDTO[] = [];
  let loadFailed = false;
  try {
    const rows = await prisma.post.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
    posts = rows.map((r) => ({
      id: r.id,
      tag: r.tag,
      title: r.title,
      body: r.body,
      comfort: r.comfort,
      reply: r.reply,
      reported: r.reported,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch {
    loadFailed = true;
  }

  return (
    <div className="pt-24 pb-20 px-5 md:px-8">
      <div className="max-w-[1120px] mx-auto">
        <h1 className="font-serif text-[26px] md:text-5xl font-semibold text-on-surface mb-3">마음을 나누는 공간</h1>
        <p className="text-lg text-on-surface-variant mb-8 max-w-2xl">
          익명으로 고민을 나누고 서로에게 위로가 되어주는 따뜻한 커뮤니티입니다. 어떤 이야기든 편하게 남겨주세요.
        </p>

        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
          <div>
            {loadFailed && (
              <p
                role="status"
                className="mb-5 rounded-3xl bg-surface-container-lowest border border-surface-variant px-5 py-4 text-sm text-on-surface-variant"
              >
                지금은 이야기를 불러오지 못했어요. 잠시 후 다시 들러주세요. 새 글은 그대로 남길 수 있어요.
              </p>
            )}
            <CommunityBoard initialPosts={posts} />
          </div>

          <aside className="flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_8px_24px_-14px_rgba(120,82,60,0.12)]">
              <h3 className="font-semibold mb-3">이곳의 약속</h3>
              <ul className="list-disc pl-5 text-sm text-on-surface-variant space-y-1.5">
                <li>판단하지 않고 듣습니다</li>
                <li>영업·홍보 글은 금지입니다</li>
                <li>익명으로 안전하게</li>
              </ul>
            </div>
            <div className="bg-error-container/50 border border-error/20 rounded-3xl p-6">
              <h3 className="font-semibold mb-2">지금 힘드신가요?</h3>
              <p className="text-sm text-on-surface-variant mb-3">혼자 감당하기 버겁다면, 전문 상담의 도움을 받으세요.</p>
              <div className="text-sm space-y-1">
                <div><b>자살예방상담</b> · <a href="tel:109" className="text-primary font-semibold">109</a></div>
                <div><b>정신건강상담</b> · 1577-0199</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
