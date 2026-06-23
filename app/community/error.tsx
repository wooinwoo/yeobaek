"use client"; // 에러 경계는 클라이언트 컴포넌트여야 한다.

import { useEffect } from "react";
import { RotateCw } from "lucide-react";

// 커뮤니티 세그먼트 전용 에러 폴백.
// 유족을 마주하는 공간인 만큼, 책망하지 않고 다정하게 안내한다.
export default function CommunityError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="pt-24 pb-20 px-5 md:px-8">
      <div className="max-w-[640px] mx-auto text-center">
        <h1 className="font-serif text-[26px] md:text-4xl font-semibold text-on-surface mb-4">
          잠시 이야기를 불러오지 못했어요
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-8">
          일시적인 문제로 화면을 보여드리지 못했어요. 당신의 잘못이 아니에요.
          잠시 숨을 고른 뒤 다시 시도해 주세요.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="inline-flex items-center gap-2 min-h-[44px] bg-primary-container text-on-primary px-6 py-3 rounded-full font-semibold text-base hover:bg-primary transition-colors"
        >
          <RotateCw className="w-4 h-4" aria-hidden="true" />
          다시 시도하기
        </button>

        <div className="mt-10 bg-error-container/50 border border-error/20 rounded-3xl p-6 text-left">
          <h2 className="font-semibold mb-2">지금 많이 힘드신가요?</h2>
          <p className="text-sm text-on-surface-variant mb-3">
            혼자 감당하기 버겁다면, 전문 상담의 도움을 받으세요.
          </p>
          <div className="text-sm space-y-1">
            <div>
              <b>자살예방상담</b> ·{" "}
              <a href="tel:109" className="text-primary font-semibold">
                109
              </a>
            </div>
            <div>
              <b>정신건강상담</b> · 1577-0199
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
