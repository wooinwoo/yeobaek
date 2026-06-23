"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, ArrowRight, AlertTriangle, Landmark, FileText, Clock } from "lucide-react";

type Ans = {
  debt?: "more" | "less" | "unknown";
  known?: "yes" | "no";
  heirs?: "multi" | "single" | "unknown";
};

const QUESTIONS = [
  {
    key: "debt" as const,
    q: "고인의 재산과 빚, 어느 쪽이 더 많나요?",
    opts: [
      { v: "more", t: "빚이 더 많아요", s: "대출·보증·체납 등이 재산보다 큼" },
      { v: "less", t: "재산이 더 많아요", s: "물려받을 게 남는 상황" },
      { v: "unknown", t: "비슷하거나, 잘 모르겠어요", s: "아직 파악이 안 됨" },
    ],
  },
  {
    key: "known" as const,
    q: "빚의 규모를 정확히 파악하셨나요?",
    opts: [
      { v: "yes", t: "네, 확인했어요", s: "안심상속 원스톱 등으로 조회함" },
      { v: "no", t: "아니요, 아직이요", s: "보증·숨은 빚이 있을 수 있음" },
    ],
  },
  {
    key: "heirs" as const,
    q: "나와 같은 순위 상속인이 몇 명인가요?",
    opts: [
      { v: "multi", t: "여러 명이에요", s: "예: 자녀가 둘 이상, 또는 배우자와 자녀" },
      { v: "single", t: "저 혼자예요", s: "같은 순위 상속인이 나뿐" },
      { v: "unknown", t: "잘 모르겠어요", s: "" },
    ],
  },
];

const COURT_STEPS = (limited: boolean) => [
  `고인의 마지막 주소지 관할 가정법원에 ${limited ? "한정승인" : "상속포기"} 신고`,
  "상속개시(사망)를 안 날부터 3개월 이내 신청",
  limited
    ? "상속재산 목록을 작성·첨부 (한정승인은 필수)"
    : "상속포기 신고서 제출",
  "서류 준비: (고인) 말소 주민등록·제적등본·폐쇄 가족관계/기본증명서 / (상속인) 주민등록·가족관계증명서·인감증명서·인감도장",
];

function decide(a: Ans) {
  if (a.debt === "less")
    return {
      title: "단순승인이 일반적입니다",
      badge: "단순승인",
      summary:
        "재산이 빚보다 많다면 그대로 상속받는 단순승인이 보통입니다. 이 경우 고인의 빚을 갚아도 되고, 감면·할인 조건이 있으면 챙기는 게 이득입니다.",
      steps: [
        "안심상속 원스톱으로 재산·부채를 한 번 더 확인 (특히 보증채무는 누락될 수 있어요)",
        "재산 > 빚이 확실하면 고인의 빚을 갚아도 됩니다 — ‘○일 내 갚으면 감면’ 같은 조건도 활용하세요",
        "갚은 영수증·이체내역을 꼭 보관 (상속세에서 채무로 공제됩니다)",
        "별도 신고 없이 3개월이 지나면 자동으로 단순승인됩니다",
      ],
      cautions: [
        "나중에 몰랐던 빚(특히 보증)이 드러나면 ‘특별한정승인’(안 날부터 3개월)을 검토할 수 있어요.",
        "상속인이 여러 명이면 큰 재산·빚 정리는 협의 후 진행하세요.",
      ],
      special: false,
    };

  if (a.debt === "unknown" || a.known === "no")
    return {
      title: "먼저 재산·부채부터 확정하세요",
      badge: "조회 먼저",
      summary:
        "빚 규모를 모른 채 결정하면 위험합니다. ‘안심상속 원스톱’으로 고인의 금융·세금·연금·보증을 한 번에 조회한 뒤 판단하세요.",
      steps: [
        "주민센터(또는 정부24)에서 안심상속 원스톱 신청 — 사망신고와 동시 가능",
        "조회 결과로 빚 > 재산인지 확인",
        "결정 기한은 상속개시를 안 날부터 3개월 — 촉박하면 한정승인을 먼저 신청해 두는 방법도 있습니다",
      ],
      cautions: [
        "기한(3개월)을 넘기면 자동으로 단순승인되어 빚을 떠안을 수 있으니 날짜를 꼭 확인하세요.",
        "조회 전까지 상속재산을 처분하거나 인출하지 마세요. (단순승인으로 간주될 수 있음)",
      ],
      special: true,
    };

  // debt === 'more'
  if (a.heirs === "multi")
    return {
      title: "한 명은 한정승인, 나머지는 상속포기",
      badge: "한정승인 + 포기",
      summary:
        "상속인 중 한 명만 ‘한정승인’, 나머지는 ‘상속포기’를 하세요. 한정승인한 사람이 ‘방어막’이 되어, 빚이 후순위(부모·형제·조카)로 넘어가지 않고 그 세대에서 깔끔하게 마무리됩니다.",
      steps: [
        "대표 1인 → 한정승인 신고 (상속재산 목록 첨부)",
        "나머지 상속인 → 각자 상속포기 신고",
        ...COURT_STEPS(true),
      ],
      cautions: [
        "모두가 ‘상속포기’만 하면 빚이 다음 순위로 줄줄이 내려갑니다 (손주→부모→형제자매→조카). 반드시 한 명은 한정승인하세요.",
        "신청 전 상속재산을 처분·인출하면 단순승인으로 간주될 수 있습니다.",
      ],
      special: true,
    };

  return {
    title: "한정승인이 안전합니다",
    badge: "한정승인",
    summary:
      "빚이 많고 상속인이 사실상 혼자라면 ‘한정승인’이 안전합니다. 물려받은 재산 한도 내에서만 빚을 갚으면 되고, 후순위 친족에게 빚이 넘어가지 않습니다.",
    steps: [...COURT_STEPS(true)],
    cautions: [
      "단순 ‘상속포기’만 하면 빚이 부모·형제·조카 등 후순위로 넘어갈 수 있어, 혼자일 땐 한정승인이 더 안전합니다.",
      "신청 전 상속재산을 처분·인출하면 단순승인으로 간주될 수 있습니다.",
    ],
    special: true,
  };
}

const card = "bg-surface-container-lowest rounded-3xl p-7 md:p-8 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.12)]";

export default function DebtSimulator() {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<Ans>({});

  const pick = (key: keyof Ans, v: string) => {
    setAns({ ...ans, [key]: v });
    setStep((s) => s + 1);
  };
  const reset = () => {
    setAns({});
    setStep(0);
  };
  const result = step >= QUESTIONS.length ? decide(ans) : null;

  return (
    <div className="pt-24 pb-24 px-5 md:px-8">
      <div className="max-w-[760px] mx-auto">
        <div className="text-sm text-on-surface-variant text-center mb-2">홈 · 빚 상속 진단</div>
        <h1 className="font-serif text-[26px] md:text-4xl font-semibold text-on-surface text-center mb-3">
          빚, 우리 가족은 어떻게 해야 하나요
        </h1>
        <p className="text-on-surface-variant text-center mb-9 max-w-xl mx-auto">
          상속포기를 잘못하면 빚이 형제·조카까지 넘어갑니다. 세 가지만 답하면 우리 가족에 맞는 방법과 <b>실제 신청 절차</b>까지 안내해 드려요.
        </p>

        <div className="flex justify-center gap-2 mb-7">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`w-2 h-2 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-surface-variant"}`} />
          ))}
        </div>

        {!result ? (
          <div className={card}>
            <div className="text-sm font-semibold tracking-wide uppercase text-primary mb-3">질문 {step + 1} / {QUESTIONS.length}</div>
            <h2 className="font-serif text-2xl font-semibold mb-7">{QUESTIONS[step].q}</h2>
            <div className="flex flex-col gap-3">
              {QUESTIONS[step].opts.map((o) => (
                <button key={o.v} onClick={() => pick(QUESTIONS[step].key, o.v)}
                  className="group w-full text-left bg-surface border border-outline-variant rounded-2xl px-5 py-4 hover:border-primary hover:bg-surface-container-low transition-all flex justify-between items-center gap-3">
                  <span>
                    <span className="font-semibold">{o.t}</span>
                    {o.s && <span className="block text-sm text-on-surface-variant mt-0.5">{o.s}</span>}
                  </span>
                  <ArrowRight className="w-5 h-5 text-outline group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </div>
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="mt-5 text-sm text-on-surface-variant hover:text-on-surface">← 이전</button>
            )}
          </div>
        ) : (
          <div className={card}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-fixed-dim/40 grid place-items-center shrink-0">
                <Scale className="w-6 h-6 text-primary" strokeWidth={1.6} />
              </div>
              <div>
                <div className="text-xs font-semibold text-primary">진단 결과</div>
                <span className="inline-block mt-1 text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-on-primary">{result.badge}</span>
              </div>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-3">{result.title}</h2>
            <p className="leading-relaxed text-on-surface-variant mb-6">{result.summary}</p>

            <div className="mb-5">
              <h3 className="flex items-center gap-2 font-semibold mb-2"><Landmark className="w-4 h-4 text-primary" /> 이렇게 진행하세요</h3>
              <ol className="list-decimal pl-5 space-y-1.5 text-[15px] text-on-surface-variant">
                {result.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </div>

            <div className="mb-5">
              <h3 className="flex items-center gap-2 font-semibold mb-2 text-error"><AlertTriangle className="w-4 h-4" /> 꼭 주의하세요</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-on-surface-variant">
                {result.cautions.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>

            {result.special && (
              <div className="text-sm bg-surface-container rounded-2xl px-4 py-3 mb-5 text-on-surface-variant">
                <b>특별한정승인</b> — 빚이 더 많은 줄 ‘중대한 과실 없이’ 몰랐다가 뒤늦게 안 경우, 그 사실을 안 날부터 3개월 안에 한정승인을 할 수 있습니다.
              </div>
            )}

            <div className="text-sm text-outline bg-surface-container rounded-2xl px-4 py-3 mb-6">
              본 진단은 참고용이며 법적 효력이 없습니다. 보증·공동명의·기여분 등에 따라 달라지니, 신고 전 반드시 법률 전문가(변호사·법무사)와 상담하세요.
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={reset} className="text-sm font-semibold border border-outline-variant rounded-full px-5 py-2.5 hover:bg-surface-container">다시 진단하기</button>
              <Link href="/family-guide" className="text-sm font-semibold bg-primary-container text-on-primary rounded-full px-5 py-2.5 hover:bg-primary transition-colors">유족 길잡이로</Link>
            </div>
          </div>
        )}

        {/* ── 항상 보이는 상세 자료 ── */}
        <div className="mt-14 flex flex-col gap-10">
          {/* 세 가지 방법 비교 (반응형 카드) */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-on-surface mb-4">세 가지 방법, 한눈에</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { name: "단순승인", rows: [["뜻", "재산·빚 다 물려받음"], ["빚 책임", "전부 부담"], ["후순위로?", "—"], ["신청", "신고 불필요 (3개월 무대응 시 자동)"], ["추천 상황", "재산 > 빚"]] },
                { name: "한정승인", hl: true, rows: [["뜻", "재산 한도로만 빚 갚음"], ["빚 책임", "재산 한도까지만"], ["후순위로?", "안 넘어감"], ["신청", "가정법원 신고"], ["추천 상황", "빚 > 재산 / 불확실"]] },
                { name: "상속포기", rows: [["뜻", "상속 자체를 포기"], ["빚 책임", "없음"], ["후순위로?", "넘어감"], ["신청", "가정법원 신고"], ["추천 상황", "다른 상속인이 한정승인할 때"]] },
              ].map((m) => (
                <div key={m.name} className={`rounded-3xl p-5 border ${m.hl ? "bg-primary-fixed-dim/20 border-primary-fixed-dim/50" : "bg-surface-container-lowest border-surface-variant"}`}>
                  <h3 className="font-serif text-lg font-semibold text-on-surface mb-3">{m.name}</h3>
                  <dl className="space-y-2.5">
                    {m.rows.map(([k, v]) => (
                      <div key={k} className="text-sm">
                        <dt className="text-on-surface-variant text-xs mb-0.5">{k}</dt>
                        <dd className="text-on-surface">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>

          {/* 빚이 넘어가는 순서 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-on-surface mb-4">빚은 이 순서로 넘어갑니다</h2>
            <div className={card}>
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium mb-4">
                {["①직계비속 (자녀→손주)", "②직계존속 (부모→조부모)", "③형제자매", "④4촌 이내 방계"].map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-surface-container text-on-surface">{s}</span>
                    {i < 3 && <ArrowRight className="w-4 h-4 text-outline" />}
                  </span>
                ))}
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                선순위가 <b>모두 상속포기</b>하면 빚이 다음 순위로 그대로 내려갑니다. 그래서 영문도 모르던 고인의 형제·조카가 빚 독촉을 받는 일이 생깁니다. <b>배우자</b>는 1·2순위와 함께 공동상속하며, 없으면 단독으로 받습니다. → 그래서 <b>‘한 명 한정승인 + 나머지 포기’</b> 조합으로 이 흐름을 끊는 것이 핵심입니다.
              </p>
            </div>
          </section>

          {/* 준비 서류 / 비용·기간 */}
          <section className="grid md:grid-cols-2 gap-4">
            <div className={card}>
              <h3 className="flex items-center gap-2 font-semibold mb-3"><FileText className="w-4 h-4 text-primary" /> 준비 서류 (예시)</h3>
              <div className="text-sm text-on-surface-variant space-y-2">
                <div><b className="text-on-surface">고인</b> — 말소자 주민등록등(초)본, 제적등본, 폐쇄 가족관계·기본증명서</div>
                <div><b className="text-on-surface">상속인</b> — 주민등록등(초)본, 가족관계증명서, 인감증명서·인감도장</div>
                <div><b className="text-on-surface">한정승인</b> — 위 서류 + <b>상속재산 목록</b></div>
                <p className="text-xs text-outline pt-1">※ 법원·상황에 따라 다를 수 있어 관할 가정법원에 확인하세요.</p>
              </div>
            </div>
            <div className={card}>
              <h3 className="flex items-center gap-2 font-semibold mb-3"><Clock className="w-4 h-4 text-primary" /> 기한 · 비용 · 기간</h3>
              <div className="text-sm text-on-surface-variant space-y-2">
                <div><b className="text-on-surface">기한</b> — 상속개시를 안 날부터 <b>3개월</b> (엄수)</div>
                <div><b className="text-on-surface">접수처</b> — 고인의 마지막 주소지 관할 가정법원</div>
                <div><b className="text-on-surface">비용</b> — 인지·송달료(소액). 변호사·법무사 대행 시 별도</div>
                <div><b className="text-on-surface">처리</b> — 보통 신고 후 1~2개월 내 심판(수리)</div>
              </div>
            </div>
          </section>

          {/* 빚 갚기 전 꼭 알아둘 것 */}
          <section>
            <h2 className="font-serif text-2xl font-semibold text-on-surface mb-4">빚 갚기 전, 꼭 알아둘 것</h2>
            <div className="bg-error-container/30 rounded-3xl p-7 md:p-8 flex flex-col gap-4 text-[15px] leading-relaxed">
              <p><span className="font-semibold text-error">상속 방식을 정하기 전엔, 고인 재산으로 빚을 갚지 마세요.</span> 일부라도 갚으면 ‘재산 처분’으로 보여 <b>단순승인으로 간주</b>될 수 있고, 그러면 한정승인·포기 권리를 잃습니다. (단, 재산 &gt; 빚이라 어차피 단순승인할 상황이면 갚아도 괜찮습니다.)</p>
              <p><span className="font-semibold text-on-surface">장례비는 예외.</span> 사회통념상 적정한 장례비를 상속재산에서 쓰는 것은 단순승인으로 보지 않습니다.</p>
              <p><span className="font-semibold text-on-surface">일부 변제 = 채무 인정.</span> 조금이라도 갚으면 ‘그 빚을 인정’한 게 되어, 이미 지난 소멸시효가 다시 시작될 수 있습니다.</p>
              <p><span className="font-semibold text-on-surface">‘○일 내 갚으면 감면’ 미끼 주의.</span> 결정 기한(3개월)보다 짧은 데드라인으로 변제를 유도하는 경우가 있어요. <b>빚 &gt; 재산이면 응하지 말고</b> 한정승인/포기부터. 단순승인이 확실할 때만 감면을 활용하세요.</p>
              <p><span className="font-semibold text-on-surface">갚을 땐 영수증 보관.</span> 고인의 빚은 상속세에서 채무로 공제되니, 영수증·이체내역을 남겨두세요.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
