"use client";

import { use, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TERMS, CATEGORIES } from "@/lib/terms";

type TermsProps = {
  searchParams: Promise<{ q?: string }>;
};

export default function Terms({ searchParams }: TermsProps) {
  const { q: initialQ } = use(searchParams);
  const [q, setQ] = useState(initialQ ?? "");
  const [cat, setCat] = useState<string>("전체");

  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    return TERMS.filter(
      (t) =>
        (cat === "전체" || t.cat === cat) &&
        (!k || t.term.toLowerCase().includes(k) || t.desc.toLowerCase().includes(k))
    );
  }, [q, cat]);

  return (
    <div className="pt-24 pb-20 px-5 md:px-8">
      <div className="max-w-[1120px] mx-auto">
        <h1 className="font-serif text-[26px] md:text-5xl font-semibold text-on-surface text-center mb-3 leading-snug">
          어려운 장례·상속 용어,
          <br />
          쉽게 풀어드립니다
        </h1>
        <p className="text-on-surface-variant text-center mb-8">
          빈소에서, 행정 창구에서, 상속 절차에서 마주하는 낯선 단어들. 여백이 알기 쉽게 설명해 드릴게요.
        </p>

        {/* 검색 */}
        <div className="relative max-w-md mx-auto mb-7">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" aria-hidden="true" />
          <input
            aria-label="용어 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="궁금한 용어를 검색해보세요"
            className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-2xl outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* 카테고리 칩 */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                cat === c
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface-container border-outline-variant text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* 결과 개수 */}
        <div className="text-center text-sm text-outline mb-6">
          {q || cat !== "전체" ? `${list.length}개의 용어` : `총 ${TERMS.length}개의 용어를 담았어요`}
        </div>

        {/* 카드 그리드 */}
        {list.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((t) => (
              <article
                key={t.term}
                className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)] hover:shadow-[0_16px_38px_-16px_rgba(120,82,60,0.22)] transition-shadow flex flex-col gap-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <h2 className="font-serif text-xl font-semibold text-on-surface">{t.term}</h2>
                  <span className="shrink-0 text-xs px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant">
                    {t.cat}
                  </span>
                </div>
                <p className="text-on-surface-variant text-[15px] leading-relaxed">{t.desc}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-outline py-16">검색 결과가 없어요.</p>
        )}
      </div>
    </div>
  );
}
