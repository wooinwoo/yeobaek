import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "상속 가이드",
  description: "상속 순위·법정상속분·유류분·등기와 세금까지, 누가 얼마나 받는지 분쟁 없이 정리했어요.",
};

const card = "bg-surface-container-lowest rounded-3xl p-7 md:p-8 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)]";
const h2 = "font-serif text-2xl md:text-3xl font-semibold text-on-surface mb-5 scroll-mt-24";

const TOC = [
  ["order", "상속 순위"],
  ["share", "법정상속분"],
  ["divide", "재산 분할"],
  ["yuryu", "유류분"],
  ["reg", "등기·세금"],
];

export default function Inheritance() {
  return (
    <div className="pt-24 pb-20 px-5 md:px-8">
      <div className="max-w-[820px] mx-auto">
        <div className="text-center mb-8">
          <div className="text-sm text-on-surface-variant mb-2">홈 · 상속 가이드</div>
          <h1 className="font-serif text-[26px] md:text-5xl font-semibold text-on-surface mb-4">상속, 누가 얼마나 받나요</h1>
          <p className="text-lg text-on-surface-variant">
            상속 순위부터 나누는 법, 최소한의 몫(유류분), 등기·세금까지 — 분쟁 없이 정리하도록 차근차근 안내합니다.
          </p>
        </div>

        {/* 빠른 이동 */}
        <nav className="flex flex-wrap justify-center gap-2 mb-12">
          {TOC.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="px-3.5 py-1.5 rounded-full text-sm border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-12">
          {/* 상속 순위 */}
          <section id="order">
            <h2 className={h2}>누가 상속인이 되나요 (순위)</h2>
            <div className={`${card} mb-4`}>
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium mb-4">
                {["1순위 직계비속 (자녀→손주)", "2순위 직계존속 (부모→조부모)", "3순위 형제자매", "4순위 4촌 이내 방계"].map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface">{s}</span>
                    {i < 3 && <span className="text-outline">→</span>}
                  </span>
                ))}
              </div>
              <p className="text-on-surface-variant text-[15px] leading-relaxed">
                선순위가 한 명이라도 있으면 후순위는 상속받지 못합니다. <b className="text-on-surface">배우자</b>는 1·2순위(자녀·부모)와 <b className="text-on-surface">공동 상속</b>하고, 그들이 없으면 <b className="text-on-surface">단독</b>으로 상속합니다.
              </p>
            </div>
          </section>

          {/* 법정상속분 */}
          <section id="share">
            <h2 className={h2}>얼마씩 받나요 (법정상속분)</h2>
            <div className={`${card} mb-4`}>
              <p className="text-on-surface-variant text-[15px] leading-relaxed mb-4">
                같은 순위 상속인끼리는 <b className="text-on-surface">똑같이 나눕니다(균분).</b> 단, <b className="text-on-surface">배우자는 다른 상속인보다 5할(1.5배)을 더</b> 받습니다.
              </p>
              <div className="overflow-hidden rounded-2xl border border-surface-variant text-sm">
                <table className="w-full">
                  <thead><tr className="bg-surface-container text-left"><th className="px-4 py-3 font-semibold">상황</th><th className="px-4 py-3 font-semibold">나누는 비율</th></tr></thead>
                  <tbody className="text-on-surface-variant">
                    {[
                      ["배우자 + 자녀 2명", "배우자 1.5 : 자녀 1 : 자녀 1 → 배우자 3/7, 자녀 각 2/7"],
                      ["배우자 + 자녀 1명", "배우자 1.5 : 자녀 1 → 배우자 3/5, 자녀 2/5"],
                      ["자녀만 2명 (배우자 없음)", "각 1/2"],
                      ["배우자 + 부모 (자녀 없음)", "배우자 1.5 : 부모 각 1 → 배우자 3/7, 부모 각 2/7"],
                      ["배우자만 (자녀·부모 없음)", "배우자 100%"],
                    ].map((r, i) => (
                      <tr key={i} className={i % 2 ? "bg-surface-container-low" : "bg-surface-container-lowest"}>
                        <td className="px-4 py-3 font-semibold text-on-surface align-top whitespace-nowrap">{r[0]}</td>
                        <td className="px-4 py-3">{r[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-outline text-sm mt-3">※ 유언이나 상속인 간 협의가 있으면 그게 우선이고, 법정상속분은 협의가 안 될 때의 기준입니다.</p>
            </div>
          </section>

          {/* 재산 분할 */}
          <section id="divide">
            <h2 className={h2}>어떻게 나누나요 (분할)</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                ["① 유언", "유효한 유언이 있으면 가장 먼저 따릅니다. (단, 유류분은 침해 못 함)"],
                ["② 협의분할", "상속인 전원이 합의해 자유롭게 나눕니다. ‘상속재산 분할협의서’에 전원이 인감으로 날인."],
                ["③ 법원", "협의가 안 되면 가정법원에 상속재산분할 심판을 청구합니다."],
              ].map(([t, d], i) => (
                <div key={i} className={card}>
                  <h3 className="font-serif text-lg font-semibold text-on-surface mb-2">{t}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <p className="text-on-surface-variant text-sm mt-4">대부분 <b className="text-on-surface">②협의분할</b>로 정리됩니다. 분할협의서는 부동산 등기·예금 인출 등에 두루 쓰이니 잘 보관하세요.</p>
          </section>

          {/* 유류분 */}
          <section id="yuryu">
            <h2 className={h2}>최소한의 몫 — 유류분</h2>
            <div className={`${card} mb-4`}>
              <p className="text-on-surface-variant text-[15px] leading-relaxed mb-4">
                특정인에게 재산이 쏠려도, 가까운 상속인은 <b className="text-on-surface">법으로 보장된 최소한의 몫(유류분)</b>을 돌려달라 청구할 수 있습니다.
              </p>
              <div className="overflow-hidden rounded-2xl border border-surface-variant text-sm mb-4">
                <table className="w-full">
                  <tbody className="text-on-surface-variant">
                    {[
                      ["직계비속(자녀 등) · 배우자", "법정상속분의 1/2"],
                      ["직계존속(부모 등)", "법정상속분의 1/3"],
                      ["형제자매", "없음 (2024.4 헌재 위헌 → 폐지)"],
                    ].map((r, i) => (
                      <tr key={i} className={i % 2 ? "bg-surface-container-low" : "bg-surface-container-lowest"}>
                        <td className="px-4 py-3 font-semibold text-on-surface">{r[0]}</td>
                        <td className="px-4 py-3">{r[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-on-surface-variant text-sm">청구 기한: 유류분 침해를 <b className="text-on-surface">안 날부터 1년</b>, 상속이 시작된 날부터 <b className="text-on-surface">10년</b> 이내.</p>
            </div>
          </section>

          {/* 등기·세금 */}
          <section id="reg">
            <h2 className={h2}>등기 · 세금</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className={card}>
                <h3 className="font-serif text-lg font-semibold text-on-surface mb-2">명의 이전</h3>
                <ul className="text-on-surface-variant text-sm space-y-1.5 leading-relaxed">
                  <li>· <b className="text-on-surface">부동산</b> — 상속등기로 명의 이전 + 취득세 신고·납부</li>
                  <li>· <b className="text-on-surface">자동차</b> — 사망일이 속한 달 말일부터 6개월 내 이전·말소 (미이행 과태료)</li>
                  <li>· <b className="text-on-surface">예금·주식</b> — 분할협의서로 각 기관에서 명의이전·인출</li>
                </ul>
              </div>
              <div className={card}>
                <h3 className="font-serif text-lg font-semibold text-on-surface mb-2">상속세</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-3">사망일이 속한 달 말일부터 <b className="text-on-surface">6개월 이내</b> 신고·납부. 일괄·배우자 공제가 커서 재산이 일정액 이하면 0원인 경우도 많습니다.</p>
                <Link href="/inheritance-tax" className="text-sm font-semibold text-primary">→ 상속세 계산기</Link>
              </div>
            </div>
            <div className="bg-error-container/30 rounded-3xl p-6 mt-4">
              <p className="text-[15px] leading-relaxed">
                <span className="font-semibold text-error">빚이 더 많다면?</span> 분할·등기 전에 한정승인/상속포기부터 정하세요(3개월). 잘못 처분하면 단순승인으로 간주돼 빚을 떠안을 수 있어요.{" "}
                <Link href="/debt-simulator" className="font-semibold text-primary">→ 빚 상속 진단</Link>
              </p>
            </div>
          </section>
        </div>

        <div className="bg-surface-container rounded-3xl p-6 mt-12">
          <p className="text-on-surface-variant text-sm leading-relaxed">
            상속분·유류분·분할은 가족 상황(기여분·사전증여·공동명의 등)에 따라 복잡해질 수 있습니다. 분쟁이 우려되면 신고·합의 전에 변호사와 상담하세요. 제도·기한은 변동될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
