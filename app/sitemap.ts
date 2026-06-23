import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yeobaek.vercel.app";

// 매 요청마다 현재 시각을 쓰면 lastModified가 늘 갱신돼 크롤러 신뢰를 떨어뜨린다.
// 빌드 시점에 고정되는 상수로 두어 배포할 때만 바뀌게 한다.
const LAST_MODIFIED = new Date();

type Route = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

// 랜딩과 핵심 도구를 상위 우선순위로, 참고용 정적 문서는 하위로 둔다.
const ROUTES: Route[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "family-guide", changeFrequency: "monthly", priority: 0.9 },
  { path: "debt-simulator", changeFrequency: "monthly", priority: 0.8 },
  { path: "inheritance", changeFrequency: "monthly", priority: 0.8 },
  { path: "inheritance-tax", changeFrequency: "monthly", priority: 0.8 },
  { path: "obituary", changeFrequency: "monthly", priority: 0.7 },
  { path: "etiquette", changeFrequency: "monthly", priority: 0.7 },
  { path: "support", changeFrequency: "monthly", priority: 0.7 },
  { path: "faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "terms", changeFrequency: "monthly", priority: 0.6 },
  { path: "community", changeFrequency: "daily", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: path ? `${SITE_URL}/${path}` : SITE_URL,
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
  }));
}
