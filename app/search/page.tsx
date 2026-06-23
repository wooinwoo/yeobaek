import { Suspense } from "react";
import SearchView from "./SearchView";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

// 검색 입력/결과는 searchParams(Promise)를 use()로 읽는 클라이언트
// 컴포넌트(SearchView)이다. Next 16에서는 이런 동적 입력을 읽는 구간을
// <Suspense> 경계로 감싸 정적 셸(헤더)을 먼저 스트리밍하도록 한다.
export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="pt-24 pb-20 px-5 md:px-8">
      <div className="max-w-[820px] mx-auto">
        <h1 className="font-serif text-[26px] md:text-4xl font-semibold text-on-surface text-center mb-3 leading-snug">
          무엇이든 찾아보세요
        </h1>
        <p className="text-on-surface-variant text-center mb-8">
          가이드, 용어, 지원금, 도구까지 여백의 모든 안내를 한 곳에서 검색합니다.
        </p>

        <Suspense fallback={<SearchFallback />}>
          <SearchView searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

// 검색 UI가 준비되기 전 보여줄 단순 자리표시(레이아웃 흔들림 최소화).
function SearchFallback() {
  return (
    <p
      className="text-center text-on-surface-variant py-12 leading-relaxed"
      role="status"
      aria-live="polite"
    >
      검색을 준비하고 있어요…
    </p>
  );
}
