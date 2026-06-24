"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Calculator } from "lucide-react";
import { estimateTaxBreakdown, won, wonExact, BRACKETS } from "@/lib/tax";

const EOK = 100_000_000;
const CHEONMAN = 10_000_000;

// 누진세율표를 사람이 읽기 쉬운 라벨로 변환. [하한, 상한] 구간으로 재구성한다.
const BRACKET_ROWS = BRACKETS.map(([cap, rate, prog], i) => {
  const lower = i === 0 ? 0 : BRACKETS[i - 1][0];
  return {
    label:
      cap === Infinity
        ? `${lower / EOK}억 초과`
        : `${lower === 0 ? "" : `${lower / EOK}억 ~ `}${cap / EOK}억 이하`,
    rate,
    prog,
  };
});

export default function InheritanceTax() {
  const [assetEok, setAssetEok] = useState(10); // 억
  const [debtEok, setDebtEok] = useState(0);
  const [spouse, setSpouse] = useState(true);

  const r = useMemo(
    () =>
      estimateTaxBreakdown({
        asset: assetEok * EOK,
        debt: debtEok * EOK,
        spouse,
      }),
    [assetEok, debtEok, spouse],
  );

  // 현재 과세표준이 어느 세율 구간에 속하는지(표 강조용).
  const activeBracketIndex = BRACKETS.findIndex(([cap]) => r.base <= cap);

  return (
    <div className="pt-24 pb-24 px-5 md:px-8">
      <div className="max-w-[680px] mx-auto">
        <div className="text-sm text-on-surface-variant text-center mb-2">홈 · 상속세 계산기</div>
        <h1 className="font-serif text-[26px] md:text-4xl font-semibold text-on-surface text-center mb-3">
          상속세, 대략 얼마나 나올까요
        </h1>
        <p className="text-on-surface-variant text-center mb-9">
          재산과 가족 구성만 입력하면 예상 상속세를 가늠해 드립니다. (간이 추정)
        </p>

        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.12)]">
          {/* 재산 */}
          <label className="block mb-6">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-semibold">상속 재산 (총액)</span>
              <span className="font-serif text-lg text-on-surface">{won(assetEok * EOK)}</span>
            </div>
            <input type="range" min={0} max={50} step={0.5} value={assetEok}
              onChange={(e) => setAssetEok(+e.target.value)} className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-outline mt-1"><span>0</span><span>50억</span></div>
          </label>

          {/* 부채 */}
          <label className="block mb-6">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-semibold">빚 (채무)</span>
              <span className="font-serif text-lg text-on-surface">{won(debtEok * EOK)}</span>
            </div>
            <input type="range" min={0} max={Math.max(1, assetEok)} step={0.5} value={debtEok}
              onChange={(e) => setDebtEok(+e.target.value)} className="w-full accent-primary" />
          </label>

          {/* 배우자 */}
          <div className="mb-2">
            <div className="font-semibold mb-2">배우자가 있나요?</div>
            <div className="flex gap-2.5">
              {[true, false].map((v) => (
                <button key={String(v)} onClick={() => setSpouse(v)}
                  className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                    spouse === v ? "bg-primary text-on-primary border-primary" : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                  }`}>
                  {v ? "있음" : "없음"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 결과 — 예상 세액 */}
        <div className="bg-primary-fixed-dim/20 border border-primary-fixed-dim/40 rounded-3xl p-8 mt-5 text-center">
          <Calculator className="w-7 h-7 text-primary mx-auto mb-2" strokeWidth={1.6} />
          <div className="text-sm text-on-surface-variant mb-1">예상 상속세</div>
          <div className="font-serif text-4xl font-semibold text-on-surface mb-1">
            {r.tax > 0 ? won(r.tax) : "0원"}
          </div>
          {r.tax > 0 && (
            <div className="text-sm text-on-surface-variant">{wonExact(r.tax)}</div>
          )}
          {r.base === 0 && (
            <p className="text-on-surface-variant text-sm mt-3">
              공제액({won(r.deduction)})이 순재산보다 커서, 낼 상속세가 없을 가능성이 높습니다.
            </p>
          )}
        </div>

        {/* 결과 — 계산 과정 단계별 내역 */}
        <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 mt-5 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)]">
          <h2 className="font-serif text-xl font-semibold text-on-surface mb-1">계산 과정 살펴보기</h2>
          <p className="text-sm text-on-surface-variant mb-5">
            입력하신 값으로 어떻게 세액이 나오는지 단계별로 보여드려요.
          </p>

          <dl className="text-sm">
            <div className="flex justify-between items-baseline gap-4 py-2.5 border-b border-outline-variant">
              <dt className="text-on-surface-variant">상속 재산 (총액)</dt>
              <dd className="font-serif text-on-surface tabular-nums text-right">
                {wonExact(r.asset)}
                <span className="block text-xs text-outline font-sans">{won(r.asset)}</span>
              </dd>
            </div>
            <div className="flex justify-between items-baseline gap-4 py-2.5 border-b border-outline-variant">
              <dt className="text-on-surface-variant">차감: 빚 (채무)</dt>
              <dd className="font-serif text-on-surface tabular-nums text-right">
                − {wonExact(r.debt)}
                <span className="block text-xs text-outline font-sans">{won(r.debt)}</span>
              </dd>
            </div>
            <div className="flex justify-between items-baseline gap-4 py-2.5 border-b-2 border-outline">
              <dt className="font-semibold text-on-surface">순재산</dt>
              <dd className="font-serif font-semibold text-on-surface tabular-nums text-right">
                {wonExact(r.net)}
                <span className="block text-xs text-outline font-sans font-normal">{won(r.net)}</span>
              </dd>
            </div>

            {r.deductions.map((d) => (
              <div key={d.label} className="flex justify-between items-baseline gap-4 py-2.5 border-b border-outline-variant">
                <dt className="text-on-surface-variant">차감: {d.label}</dt>
                <dd className="font-serif text-on-surface tabular-nums text-right">
                  − {wonExact(d.amount)}
                  <span className="block text-xs text-outline font-sans">{won(d.amount)}</span>
                </dd>
              </div>
            ))}

            <div className="flex justify-between items-baseline gap-4 py-2.5 border-b-2 border-outline">
              <dt className="font-semibold text-on-surface">과세표준</dt>
              <dd className="font-serif font-semibold text-on-surface tabular-nums text-right">
                {wonExact(r.base)}
                <span className="block text-xs text-outline font-sans font-normal">{won(r.base)}</span>
              </dd>
            </div>

            {r.base > 0 && (
              <>
                <div className="flex justify-between items-baseline gap-4 py-2.5 border-b border-outline-variant">
                  <dt className="text-on-surface-variant">적용 세율</dt>
                  <dd className="font-serif text-on-surface tabular-nums text-right">{r.rate * 100}%</dd>
                </div>
                <div className="flex justify-between items-baseline gap-4 py-2.5 border-b border-outline-variant">
                  <dt className="text-on-surface-variant">차감: 누진공제</dt>
                  <dd className="font-serif text-on-surface tabular-nums text-right">
                    − {wonExact(r.prog)}
                    <span className="block text-xs text-outline font-sans">{won(r.prog)}</span>
                  </dd>
                </div>
                <div className="flex justify-between items-baseline gap-4 pt-3">
                  <dt className="font-semibold text-on-surface">산출세액</dt>
                  <dd className="font-serif font-semibold text-primary tabular-nums text-right">
                    {wonExact(r.tax)}
                    <span className="block text-xs text-outline font-sans font-normal">{won(r.tax)}</span>
                  </dd>
                </div>
              </>
            )}
          </dl>

          {/* 과세표준 대비 세액 비율 막대 */}
          {r.base > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-xs text-on-surface-variant mb-1.5">
                <span>과세표준 중 세금 비중</span>
                <span className="font-medium text-on-surface">{Math.round(r.taxRatio * 100)}%</span>
              </div>
              <div
                className="tax-bar"
                role="img"
                aria-label={`과세표준 ${won(r.base)} 중 산출세액 ${won(r.tax)}, 약 ${Math.round(r.taxRatio * 100)}%`}
                style={{ "--tax-fill": `${Math.round(r.taxRatio * 100)}%` } as CSSProperties}
              >
                <div className="tax-bar__fill" />
              </div>
              <p className="text-xs text-outline mt-1.5">
                산출세액은 과세표준에 직접 비례하지 않아요. 누진공제 때문에 비율은 구간마다 달라집니다.
              </p>
            </div>
          )}
        </section>

        {/* 결과 — 세율 구간표 */}
        <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 mt-5 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)]">
          <h2 className="font-serif text-xl font-semibold text-on-surface mb-1">상속세 세율 구간</h2>
          <p className="text-sm text-on-surface-variant mb-4">
            과세표준 구간에 따라 세율이 누진 적용됩니다.
            {r.base > 0 && " 현재 과세표준이 속한 구간을 강조했어요."}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <caption className="sr-only">상속세 누진세율 구간표</caption>
              <thead>
                <tr className="text-left text-on-surface-variant border-b border-outline-variant">
                  <th scope="col" className="font-medium py-2 pr-3">과세표준</th>
                  <th scope="col" className="font-medium py-2 px-3 text-right">세율</th>
                  <th scope="col" className="font-medium py-2 pl-3 text-right">누진공제</th>
                </tr>
              </thead>
              <tbody>
                {BRACKET_ROWS.map((row, i) => {
                  const active = r.base > 0 && i === activeBracketIndex;
                  return (
                    <tr
                      key={row.label}
                      aria-current={active ? "true" : undefined}
                      className={
                        active
                          ? "bg-primary-fixed-dim/30 text-on-surface font-semibold"
                          : "text-on-surface-variant"
                      }
                    >
                      <th scope="row" className="font-normal py-2 pr-3 rounded-l-lg">{row.label}</th>
                      <td className="py-2 px-3 text-right tabular-nums">{row.rate * 100}%</td>
                      <td className="py-2 pl-3 text-right tabular-nums rounded-r-lg">
                        {row.prog === 0 ? "없음" : won(row.prog)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-outline mt-3">
            산출세액 = 과세표준 × 세율 − 누진공제. {CHEONMAN.toLocaleString("ko-KR")}원 = 1천만 원 단위로 누진공제가 커집니다.
          </p>
        </section>

        {/* 설명 */}
        <div className="mt-6 text-sm text-on-surface-variant space-y-2">
          <p>· <b>일괄공제 5억 원</b>은 대부분의 상속에서 기본 적용됩니다.</p>
          <p>· <b>배우자공제</b>는 최소 5억 원(최대 30억, 법정상속분 한도)까지 받을 수 있어, 배우자가 있으면 세 부담이 크게 줄어듭니다.</p>
          <p>· 즉 <b>재산이 약 10억(배우자 있으면) 이하</b>면 상속세가 0인 경우가 많습니다.</p>
        </div>

        <div className="mt-6 text-sm text-outline bg-surface-container rounded-2xl px-4 py-3">
          본 계산은 일괄·배우자 공제만 반영한 <b>간이 추정</b>입니다. 실제 세액은 금융재산공제·동거주택공제·사전증여 등에 따라 달라지니, 신고 전 세무 전문가와 상담하세요.
        </div>

        {/* 상속세, 이것만 알아두세요 */}
        <section className="mt-12 flex flex-col gap-4">
          <h2 className="font-serif text-2xl font-semibold text-on-surface">상속세, 이것만 알아두세요</h2>

          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)]">
            <h3 className="font-semibold mb-2">무엇이 ‘상속재산’인가요</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">부동산·예금·주식·자동차 등 고인의 모든 재산에 더해, <b className="text-on-surface">사망보험금·퇴직금(간주상속재산)</b>도 포함됩니다. 또 <b className="text-on-surface">사망 전 증여</b>도 합산돼요. 상속인에게 준 건 10년, 그 외엔 5년 이내 증여분. 고인의 <b className="text-on-surface">빚·공과금·장례비</b>는 빼고(공제) 계산합니다.</p>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)]">
            <h3 className="font-semibold mb-3">주요 공제 (세금 줄여주는 항목)</h3>
            <ul className="text-on-surface-variant text-sm space-y-1.5 leading-relaxed">
              <li>· <b className="text-on-surface">일괄공제 5억</b>, 대부분 기본 적용</li>
              <li>· <b className="text-on-surface">배우자공제 5억~30억</b>, 배우자가 있으면 가장 크게 줄어듦</li>
              <li>· <b className="text-on-surface">금융재산공제</b>, 순금융재산의 일부(한도 있음)</li>
              <li>· <b className="text-on-surface">동거주택 상속공제</b>, 함께 살던 집을 자녀가 상속 시 요건 충족하면 공제</li>
              <li>· <b className="text-on-surface">장례비·채무 공제</b>, 장례비(증빙)와 고인의 빚</li>
            </ul>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)]">
            <h3 className="font-semibold mb-2">신고 · 납부</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">사망일이 속한 달의 말일부터 <b className="text-on-surface">6개월 이내</b>에 홈택스 또는 관할 세무서에 신고·납부합니다. 세액이 크면 <b className="text-on-surface">분납(2개월)·연부연납</b>(나눠 내기)도 가능해요.</p>
          </div>

          <div className="bg-error-container/30 rounded-3xl p-6">
            <h3 className="font-semibold text-error mb-2">기한 넘기면 가산세</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">신고·납부 기한(6개월)을 넘기면 무신고·납부지연 가산세가 붙습니다. 세금이 0원으로 예상돼도, 공제·재산 평가가 애매하면 <b className="text-on-surface">세무 전문가 상담 후 신고</b>하는 게 안전해요.</p>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link href="/family-guide" className="text-sm font-semibold text-primary">← 유족 길잡이로 돌아가기</Link>
        </div>
      </div>
    </div>
  );
}
