"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import {
  searchSite,
  CATEGORY_ORDER,
  type SearchCategory,
  type SearchResult,
} from "@/lib/search";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import Highlight from "@/components/Highlight";

type SearchViewProps = {
  searchParams: Promise<{ q?: string }>;
};

export default function SearchView({ searchParams }: SearchViewProps) {
  const { q: queryParam } = use(searchParams);
  const query = (queryParam ?? "").trim();

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

  return (
    <>
      <div className="relative max-w-xl mx-auto mb-10">
        <SearchAutocomplete defaultValue={query} inputId="site-search" />
      </div>

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
                        <Highlight text={item.title} query={query} />
                      </span>
                      <span className="block mt-1.5 text-[15px] leading-relaxed text-on-surface-variant">
                        <Highlight text={item.summary} query={query} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
