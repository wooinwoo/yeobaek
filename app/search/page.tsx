"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  searchSite,
  CATEGORY_ORDER,
  type SearchCategory,
  type SearchResult,
} from "@/lib/search";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const { q: queryParam } = use(searchParams);
  const query = (queryParam ?? "").trim();
  const router = useRouter();
  const [input, setInput] = useState(query);

  const results = useMemo(() => searchSite(query), [query]);

  const grouped = useMemo(() => {
    const map = new Map<SearchCategory, SearchResult[]>();
    for (const r of results) {
      const list = map.get(r.category) ?? [];
      list.push(r);
      map.set(r.category, list);
    }
    return CATEGORY_ORDER.filter((c) => map.has(c)).map((c) => ({
      category: c,
      items: map.get(c)!,
    }));
  }, [results]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = input.trim();
    if (next) {
      router.push(`/search?q=${encodeURIComponent(next)}`);
    } else {
      router.push("/search");
    }
  }

  return (
    <div className="pt-24 pb-20 px-5 md:px-8">
      <div className="max-w-[820px] mx-auto">
        <h1 className="font-serif text-[26px] md:text-4xl font-semibold text-on-surface text-center mb-3 leading-snug">
          무엇이든 찾아보세요
        </h1>
        <p className="text-on-surface-variant text-center mb-8">
          가이드, 용어, 지원금, 도구까지 여백의 모든 안내를 한 곳에서 검색합니다.
        </p>

        <form onSubmit={handleSubmit} role="search" className="mb-10">
          <label htmlFor="site-search" className="sr-only">
            사이트 통합 검색
          </label>
          <div className="relative max-w-xl mx-auto">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline"
              aria-hidden="true"
            />
            <input
              id="site-search"
              type="search"
              name="q"
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예: 상속포기, 부의금, 상속세, 안심상속"
              className="w-full min-h-[44px] pl-12 pr-24 py-3.5 text-base bg-surface-container-lowest border border-outline-variant rounded-2xl outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[40px] px-4 rounded-xl bg-primary text-on-primary text-sm font-medium transition-colors hover:bg-primary/90"
            >
              검색
            </button>
          </div>
        </form>

        {query ? (
          <div
            className="text-center text-sm text-outline mb-8"
            role="status"
            aria-live="polite"
          >
            {results.length
              ? `‘${query}’ 검색 결과 ${results.length}건`
              : `‘${query}’에 대한 검색 결과가 없어요`}
          </div>
        ) : null}

        {!query ? (
          <p className="text-center text-on-surface-variant py-12 leading-relaxed">
            궁금한 단어를 입력해 보세요.
            <br />
            장례 절차, 상속 용어, 받을 수 있는 지원금까지 찾아드립니다.
          </p>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-on-surface-variant leading-relaxed mb-6">
              찾으시는 내용이 없네요.
              <br />
              다른 단어로 검색하거나 아래에서 둘러보세요.
            </p>
            <ul className="flex flex-wrap justify-center gap-2.5">
              <li>
                <Link
                  href="/family-guide"
                  className="inline-flex min-h-[44px] items-center px-5 rounded-full text-sm font-medium border border-outline-variant bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-variant"
                >
                  유족 길잡이
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="inline-flex min-h-[44px] items-center px-5 rounded-full text-sm font-medium border border-outline-variant bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-variant"
                >
                  용어 사전
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="inline-flex min-h-[44px] items-center px-5 rounded-full text-sm font-medium border border-outline-variant bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-variant"
                >
                  지원금 안내
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map(({ category, items }) => (
              <section key={category} aria-labelledby={`cat-${category}`}>
                <h2
                  id={`cat-${category}`}
                  className="text-sm font-semibold text-outline mb-4 pb-2 border-b border-outline-variant"
                >
                  {category}
                  <span className="ml-2 font-normal">{items.length}</span>
                </h2>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="block p-5 rounded-2xl bg-surface-container-lowest border border-transparent transition-colors hover:border-outline-variant focus-visible:border-primary"
                      >
                        <span className="block font-serif text-lg font-semibold text-on-surface">
                          {item.title}
                        </span>
                        <span className="block mt-1.5 text-[15px] leading-relaxed text-on-surface-variant">
                          {item.summary}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
