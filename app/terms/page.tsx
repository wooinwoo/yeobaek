import { Suspense } from "react";
import TermsView from "./TermsView";

type TermsProps = {
  searchParams: Promise<{ q?: string }>;
};

// 검색/필터 UI는 searchParams(Promise)를 use()로 읽는 클라이언트
// 컴포넌트(TermsView)이다. Next 16 규약에 맞춰 <Suspense> 경계로 감싸
// 정적 셸(헤더)을 먼저 스트리밍한다.
export default function Terms({ searchParams }: TermsProps) {
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

        <Suspense fallback={<TermsFallback />}>
          <TermsView searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

// 용어 목록이 준비되기 전 보여줄 단순 자리표시.
function TermsFallback() {
  return (
    <p
      className="text-center text-on-surface-variant py-16"
      role="status"
      aria-live="polite"
    >
      용어 사전을 준비하고 있어요…
    </p>
  );
}
