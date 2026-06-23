"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ddayBadge } from "@/lib/dday";

type Task = {
  id: string;
  title: string;
  desc: string;
  badge: string;
  urgent?: boolean;
  show?: "home" | "recipient";
};
type Stage = { n: number; title: string; tasks: Task[] };

const STAGES: Stage[] = [
  {
    n: 1,
    title: "임종 직후 (24시간 이내)",
    tasks: [
      { id: "t-112", title: "112·119 신고, 그리고 현장 보존", desc: "병원 밖(자택 등)에서 돌아가신 경우 경찰 검시(검안)가 먼저입니다. 시신을 옮기거나 정리하지 말고 기다리세요. 검안·인도가 끝나야 장례를 시작할 수 있습니다.", badge: "가장 먼저", urgent: true, show: "home" },
      { id: "t-cert", title: "사망진단서(사체검안서) 발급, 넉넉히", desc: "모든 행정·금융·보험 처리의 필수 서류. 기관마다 원본을 요구하니 넉넉히(보통 7~10부) 발급받아 두세요. 부족하면 재발급이 번거롭습니다.", badge: "오늘", urgent: true },
      { id: "t-funeral", title: "장례식장 선정 · 시신 운구 연락", desc: "병원 장례식장 또는 전문 장례식장에 연락해 안치·이송을 요청합니다. 거리·시설·빈소 규모를 함께 확인하세요.", badge: "오늘" },
      { id: "t-sangjo", title: "상조 가입 여부 확인", desc: "고인·가족이 가입한 상조 상품이 있는지 먼저 확인하세요. 가입돼 있으면 제공 범위(인력·물품·차량)를 쓰고 중복 결제를 피합니다. 신용카드·통신사 부가서비스에 상조 혜택이 있는 경우도 많습니다.", badge: "오늘" },
      { id: "t-photo", title: "영정 사진 준비", desc: "고인의 생전 사진을 골라 둡니다. 장례식장·사진관에서 보정·인화가 가능합니다.", badge: "1일차" },
      { id: "t-phone", title: "고인 휴대폰 잠금·비밀번호 확인", desc: "지문·얼굴 잠금은 사후에 풀 수 없습니다. 가족 연락·사진·금융앱·각종 가입 내역 확인을 위해 가능하면 미리 비밀번호를 확보하세요.", badge: "중요" },
      { id: "t-notify", title: "가까운 가족·친지에게 부고", desc: "우선 가까운 분들께 알리고, 빈소가 정해지면 부고 문자를 보냅니다.", badge: "오늘" },
    ],
  },
  {
    n: 2,
    title: "장례 진행 (1~3일)",
    tasks: [
      { id: "t-binso", title: "장례 형식 · 빈소 규모 결정", desc: "가족장 / 일반장 / 무빈소(직장) 중 고인 뜻과 형편에 맞게 정합니다. 종교가 있다면 의식 방식도 함께 정합니다.", badge: "1일차" },
      { id: "t-cost", title: "장례식장 제공 품목·비용 꼼꼼히 확인", desc: "수의·관·제단·꽃·도우미·버스·접객용 일회용품(그릇·수저·컵 등)이 ‘포함’인지 ‘별도’인지 반드시 구분해 받아 적으세요. 일회용품은 상조·대여 업체에서 지원·대여되는 경우가 많으니 ‘이거 따로 돈 드나요? 지원되는 거 없나요?’ 라고 꼭 물어보세요. 견적서를 항목별로 받아 중복·과다 청구를 막습니다.", badge: "꼭 확인", urgent: true },
      { id: "t-crem", title: "화장·봉안(또는 매장) 예약", desc: "공설 화장시설은 예약 경쟁이 있어 서둘러야 합니다. e하늘 장사정보시스템에서 예약·시간 확인이 가능합니다.", badge: "~내일", urgent: true },
      { id: "t-anchi", title: "안치 장소 결정 (봉안·자연장·매장)", desc: "봉안당·자연장·수목장·매장 중 결정하고 필요한 서류(화장·사용 계약)를 준비합니다.", badge: "2일차" },
      { id: "t-bui", title: "부의금·조문객 장부 관리", desc: "부의금 봉투와 방명록을 정리해 두면 이후 답례·정산에 도움이 됩니다.", badge: "진행 중" },
      { id: "t-jangje", title: "장제급여 신청 확인 (수급자)", desc: "기초생활수급자였다면 장제급여(사망 1구당 80만 원)를 받을 수 있습니다. 관할 주민센터에 확인하세요.", badge: "지원금", show: "recipient" },
      { id: "t-receipt", title: "장례비용 계약서·영수증 보관", desc: "장례비 영수증은 지원금 청구, 상속세 공제, 소득공제의 증빙이 됩니다. 항목별 계약서와 함께 반드시 보관하세요.", badge: "보관" },
    ],
  },
  {
    n: 3,
    title: "사망신고 · 기본 행정 (~1개월)",
    tasks: [
      { id: "t-report", title: "사망신고", desc: "사망 사실을 안 날부터 1개월 이내. 사망진단서를 첨부해 주민센터에 신고합니다. ‘안심상속 원스톱’을 함께 신청하면 편합니다.", badge: "1개월" },
      { id: "t-onestop", title: "안심상속 원스톱, 재산·부채 통합조회", desc: "고인의 예금·보험·증권·연금·세금·토지·자동차를 한 번에 조회(정부24). 상속 방식 판단과 숨은 보험·계좌 찾기의 기준이 됩니다. 사망신고와 동시 신청 가능.", badge: "권장" },
      { id: "t-sedae", title: "세대주 변경 (고인이 세대주였다면)", desc: "남은 가족 중 새 세대주로 변경합니다. 주민센터에서 처리.", badge: "1개월" },
      { id: "t-telco", title: "휴대폰·인터넷·구독 해지, 자동이체 정리", desc: "가족관계증명서로 해지 가능. 통신·OTT·정기결제·간편결제 자동이체를 정리해 불필요한 출금을 막습니다.", badge: "이후" },
    ],
  },
  {
    n: 4,
    title: "보험 · 연금 · 환급 청구 (놓치기 쉬움)",
    tasks: [
      { id: "t-insurance", title: "사망보험금 청구 (시효 3년)", desc: "생명·상해보험 사망보험금을 청구하세요. 본인 가입분뿐 아니라 직장 단체보험·신용카드 보험·운전자보험 등 빠뜨리기 쉽습니다. 생명·손해보험협회 ‘내보험찾아줌’으로 숨은 보험을 조회할 수 있어요. 청구권 소멸시효는 3년.", badge: "시효 3년" },
      { id: "t-policyholder", title: "고인 명의 보험 계약자 변경·정리", desc: "고인이 ‘계약자’인 보험(예: 자녀를 피보험자로 둔 보험)은 계약이 유지됩니다. 이때 계약자 지위(해약환급금 청구권 등)는 상속재산이라 상속인에게 상속돼요. 보험사에 계약자 명의변경(승계)하거나 해지·환급 처리하세요. 방치하면 보험료 미납으로 실효될 수 있고, 해약환급금은 상속세 대상이 됩니다.", badge: "명의변경" },
      { id: "t-nps", title: "국민연금 유족연금 / 사망일시금 (시효 5년)", desc: "국민연금공단에 청구. 생계를 함께한 유족에게 유족연금이, 해당 유족이 없으면 사망일시금이 지급됩니다. 청구 시효 5년.", badge: "시효 5년" },
      { id: "t-pension2", title: "공무원·사학·군인 연금 / 퇴직금 확인", desc: "고인이 공무원·교직원·군인이었거나 재직 중이었다면 해당 연금공단·직장·근로복지공단에 유족급여·퇴직금(퇴직연금)을 확인하세요.", badge: "해당 시" },
      { id: "t-sanjae", title: "산재 유족급여·장의비 (업무상 사망)", desc: "업무상 재해로 사망한 경우 근로복지공단에서 유족급여와 장의비를 받을 수 있습니다.", badge: "해당 시" },
      { id: "t-refund", title: "각종 환급금·보증금 정리", desc: "건강보험·통신·도시가스·전기 보증금/미환급 요금, 카드 포인트, 정부·금융 미환급금(정부24, 금융결제원 ‘계좌정보통합관리’)을 조회해 돌려받으세요.", badge: "확인" },
      { id: "t-bank", title: "예금·증권 등 금융재산 정리", desc: "안심상속 결과를 토대로 각 금융기관에서 상속인 협의 후 인출·해지·명의이전을 진행합니다. (상속인 무단 인출은 분쟁 위험)", badge: "협의 후" },
    ],
  },
  {
    n: 5,
    title: "상속 결정 · 세금 (3~6개월)",
    tasks: [
      { id: "t-inherit", title: "상속 결정, 단순승인 / 한정승인 / 포기", desc: "재산·부채를 파악한 뒤 3개월 이내에 결정합니다. 빚이 많을 때 잘못 포기하면 형제·조카에게 빚이 넘어가니, ‘빚 상속 진단’으로 우리 가족에 맞는 방법을 확인하세요.", badge: "3개월", urgent: true },
      { id: "t-car", title: "자동차 상속 이전·말소 등록", desc: "고인 명의 차량은 사망일이 속한 달 말일부터 6개월 이내에 이전(또는 말소)해야 합니다. 미이행 시 과태료가 부과됩니다.", badge: "6개월" },
      { id: "t-realty", title: "부동산 상속등기 · 취득세", desc: "상속 부동산은 등기 이전과 취득세 신고가 필요합니다. 분할 협의 결과를 반영하세요.", badge: "협의 후" },
      { id: "t-tax", title: "상속세 신고·납부", desc: "사망일이 속한 달의 말일부터 6개월 이내. 재산이 일정액(일괄·배우자 공제) 이하면 세금이 없을 수 있으니 ‘상속세 계산기’로 가늠해 보세요.", badge: "6개월" },
    ],
  },
  {
    n: 6,
    title: "마무리 · 디지털 · 애도",
    tasks: [
      { id: "t-digital", title: "SNS·이메일·클라우드 계정 정리", desc: "추모 계정 전환 또는 삭제, 사진·문서 백업. 플랫폼별 신청 방법이 다릅니다.", badge: "이후" },
      { id: "t-pay", title: "간편결제·포인트·마일리지 정리", desc: "페이·항공 마일리지·포인트 등 남은 자산을 확인하고 가능한 범위에서 정리·승계합니다.", badge: "이후" },
      { id: "t-belongings", title: "유품 정리", desc: "서두르지 않아도 됩니다. 마음이 준비됐을 때, 필요하면 유품정리 전문 업체의 도움을 받을 수 있습니다.", badge: "천천히" },
      { id: "t-memorial", title: "삼우제 · 49재 등 추모", desc: "장례 후 셋째 날 삼우제, 불교식은 49재 등 가풍·종교에 맞춰 추모를 이어갑니다.", badge: "이후" },
      { id: "t-fund", title: "받을 수 있는 지원금 재확인", desc: "국민연금 사망일시금·유족연금, 장제급여, 보훈·산재 등 빠뜨린 지원이 없는지 ‘지원금’ 페이지에서 다시 확인하세요.", badge: "지원금" },
    ],
  },
];

const ALL_TASKS = STAGES.flatMap((s) => s.tasks);
const STORE_KEY = "yeobaek-guide";

export default function FamilyGuide() {
  const [place, setPlace] = useState<"hospital" | "home">("hospital");
  const [recipient, setRecipient] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [deathDate, setDeathDate] = useState<string>("");

  // 복원
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        /* eslint-disable react-hooks/set-state-in-effect -- localStorage 복원은 마운트 후에만 가능(SSR 안전) */
        setPlace(s.place ?? "hospital");
        setRecipient(!!s.recipient);
        setChecked(s.checked ?? {});
        setDeathDate(s.deathDate ?? "");
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      // localStorage 접근 실패(시크릿 모드·차단 등)나 손상된 JSON은 무시하고 기본값 유지
    }
  }, []);
  // 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ place, recipient, checked, deathDate }));
    } catch {
      // 저장 실패(용량 초과·차단 등)는 진행에 지장이 없으므로 무시
    }
  }, [place, recipient, checked, deathDate]);

  const visible = (t: Task) =>
    !t.show || (t.show === "home" && place === "home") || (t.show === "recipient" && recipient);

  const visibleTasks = ALL_TASKS.filter(visible);
  const doneCount = visibleTasks.filter((t) => checked[t.id]).length;
  const pct = visibleTasks.length ? Math.round((doneCount / visibleTasks.length) * 100) : 0;

  const C = 2 * Math.PI * 44;
  const dash = useMemo(() => C - (pct / 100) * C, [pct, C]);

  return (
    <div className="pt-24 pb-20 px-5 md:px-8">
      <div className="max-w-[1120px] mx-auto">
        {/* 헤더 */}
        <div className="mb-2 text-sm text-on-surface-variant">홈 · 유족 길잡이</div>
        <h1 className="font-serif text-[26px] md:text-5xl font-semibold text-on-surface mb-3">
          지금, 무엇부터 하면 될까요
        </h1>
        <p className="text-lg text-on-surface-variant mb-6 max-w-2xl">
          혼란스러우실 겁니다. 급한 것부터 순서대로 정리해 두었어요. 하나씩만 따라오시면 됩니다.
        </p>

        {/* 잠깐, 위로 한 줄 */}
        <div className="border-l-2 border-primary-fixed-dim pl-4 py-1 mb-8 max-w-2xl">
          <p className="text-on-surface-variant leading-relaxed">
            <b className="text-on-surface">울고 싶으면 우셔도 괜찮아요.</b> 슬픔을 미루지 않아도 됩니다. 급한 일들은 여기 정리해 뒀으니, 마음이 조금 추슬러지면 천천히 하나씩 따라오시면 돼요.
          </p>
        </div>

        {/* 상황 맞춤 */}
        <div className="bg-surface-container rounded-3xl p-6 mb-6">
          <div className="font-semibold mb-3 text-sm">
            어떤 상황이신가요?{" "}
            <span className="text-on-surface-variant font-normal">선택하면 필요한 항목만 보여드려요</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {(["hospital", "home"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlace(p)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  place === p
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-variant"
                }`}
              >
                {p === "hospital" ? "병원에서 임종" : "자택·병원 밖에서 임종"}
              </button>
            ))}
            <span className="w-3" />
            <button
              onClick={() => setRecipient((v) => !v)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                recipient
                  ? "bg-primary text-on-primary border-primary"
                  : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-variant"
              }`}
            >
              기초생활수급자였음
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-surface-variant flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold">사망일</span>
            <input
              type="date"
              value={deathDate}
              onChange={(e) => setDeathDate(e.target.value)}
              className="px-3 py-2 bg-surface border border-outline-variant rounded-lg text-sm outline-none focus:border-primary"
            />
            <span className="text-sm text-on-surface-variant">
              {deathDate ? "입력하면 각 항목에 남은 기한(D-day)이 표시돼요." : "입력하면 사망신고·상속·상속세 기한을 계산해 드려요."}
            </span>
          </div>
        </div>

        {/* 진행률 */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-7 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.12)] flex items-center gap-6 mb-9">
          <div className="relative w-[88px] h-[88px] shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-surface-variant)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="44" fill="none"
                stroke="var(--color-primary)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={dash}
                style={{ transition: "stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)" }}
              />
            </svg>
            <span className="absolute inset-0 grid place-items-center font-serif text-lg text-on-surface">{pct}%</span>
          </div>
          <div>
            <div className="font-serif text-xl text-on-surface">
              {doneCount === 0
                ? "할 일을 하나씩 확인해 보세요"
                : doneCount === visibleTasks.length
                ? "모두 확인하셨어요. 정말 수고 많으셨습니다."
                : `${visibleTasks.length}가지 중 ${doneCount}가지를 확인했어요`}
            </div>
            <p className="text-on-surface-variant text-sm mt-1">완료한 항목은 체크하면 진행률이 올라가요.</p>
          </div>
          <Link href="/debt-simulator" className="ml-auto hidden sm:inline-flex text-sm font-semibold text-primary border border-outline-variant rounded-full px-4 py-2 hover:bg-surface-container">
            빚이 걱정되세요? →
          </Link>
        </div>

        {/* 단계별 체크리스트 */}
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
          {STAGES.map((stage) => {
            const tasks = stage.tasks.filter(visible);
            if (!tasks.length) return null;
            return (
              <section key={stage.n}>
                <h2 className="flex items-center gap-3 font-serif text-xl text-on-surface mb-4">
                  <span className="grid place-items-center w-7 h-7 rounded-full bg-primary text-on-primary text-sm font-bold not-italic" style={{ fontFamily: "var(--font-sans)" }}>
                    {stage.n}
                  </span>
                  {stage.title}
                </h2>
                <div className="flex flex-col gap-3">
                  {tasks.map((t) => {
                    const on = !!checked[t.id];
                    const dd = ddayBadge(deathDate, t.id);
                    return (
                      <label
                        key={t.id}
                        className={`flex gap-3.5 items-start rounded-2xl p-4 cursor-pointer border transition-all duration-200 ${
                          on
                            ? "bg-surface-container/50 border-transparent"
                            : "bg-surface-container-lowest border-surface-variant hover:border-primary/40 hover:shadow-[0_8px_22px_-16px_rgba(120,82,60,0.45)]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => setChecked((c) => ({ ...c, [t.id]: !c[t.id] }))}
                          className="mt-1 w-5 h-5 accent-primary shrink-0"
                        />
                        <div className="min-w-0">
                          <div className={`font-semibold ${on ? "line-through text-outline" : ""}`}>{t.title}</div>
                          <div className="text-on-surface-variant text-sm mt-0.5">{t.desc}</div>
                        </div>
                        <span
                          className={`ml-auto shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                            (dd?.urgent ?? t.urgent) ? "bg-error-container text-error" : "bg-surface-variant text-on-surface-variant"
                          }`}
                        >
                          {dd ? dd.text : t.badge}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
