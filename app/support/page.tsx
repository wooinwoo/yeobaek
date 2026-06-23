import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "지원금 안내",
  description: "국민연금·장제급여·산재·보훈 등 받을 수 있는 지원과, 바로 거는 주요 기관 연락처를 모았어요.",
};

type Program = {
  tag: string;
  name: string;
  target: string;
  amount: string;
  agency: string;
  docs: string;
  deadline: string;
  tip?: string;
};

const PROGRAMS: Program[] = [
  {
    tag: "국민연금",
    name: "유족연금",
    target: "가입기간 10년 이상인 가입자, 또는 노령·장애연금(2급↑) 수급자가 사망 시 — 생계를 함께한 유족(배우자→자녀→부모 순 최우선자)",
    amount: "기본연금액의 40~60% + 부양가족연금액 (가입기간에 따라)",
    agency: "국민연금공단 (지사 방문·우편·일부 온라인)",
    docs: "사망진단서, 사망자·청구인 가족관계증명서, 청구인 신분증, 본인 통장",
    deadline: "수급권 발생일부터 5년 이내 청구",
    tip: "안심상속 원스톱 조회에 연금 가입 내역이 함께 나옵니다.",
  },
  {
    tag: "국민연금",
    name: "사망일시금",
    target: "국민연금 가입자(였던 자)가 사망했으나, 유족연금·반환일시금을 받을 유족이 없을 때 — 더 넓은 범위의 유족",
    amount: "가입자의 반환일시금에 상당하는 금액 (장제부조 성격)",
    agency: "국민연금공단",
    docs: "사망진단서, 가족관계증명서, 신분증, 통장",
    deadline: "수급권 발생일부터 5년 이내 청구",
  },
  {
    tag: "기초생활보장",
    name: "장제급여",
    target: "생계·의료·주거급여 수급자가 사망한 경우, 장제를 실제로 치른 사람",
    amount: "사망자 1구당 80만 원",
    agency: "관할 읍·면·동 주민센터",
    docs: "사망진단서, 장제를 행한 사실 확인 서류, 신청인 신분증·통장",
    deadline: "사망(장제) 후 신청 — 주민센터 확인",
  },
  {
    tag: "긴급복지",
    name: "긴급복지 장제비",
    target: "주소득자의 사망 등 갑작스러운 위기로 생계가 곤란해진 가구 (소득·재산 기준 있음)",
    amount: "장제비 약 80만 원 (그 밖에 생계·주거 등 긴급지원도 가능)",
    agency: "주민센터 · 보건복지상담센터 129",
    docs: "위기상황 확인 서류, 신분증, 통장 등",
    deadline: "위기 발생 후 신속히 (선지원 후 사후조사)",
    tip: "수급자가 아니어도, 갑작스러운 사망으로 생계가 막막하면 129에 먼저 문의하세요.",
  },
  {
    tag: "산재",
    name: "장의비 · 유족급여",
    target: "업무상 재해(사고·질병)로 사망한 근로자의 유족",
    amount: "장의비(평균임금 약 120일분 범위) + 유족급여(연금 또는 일시금)",
    agency: "근로복지공단",
    docs: "사망진단서, 가족관계증명서, 재해 경위 자료 등",
    deadline: "산재보험급여 청구권 시효 5년",
  },
  {
    tag: "보훈",
    name: "보훈 대상자 장례·유족 지원",
    target: "국가유공자·보훈보상대상자 등이 사망한 경우",
    amount: "대상·등급에 따라 장례·유족 지원 상이",
    agency: "국가보훈부 (관할 보훈지청)",
    docs: "사망진단서, 가족관계증명서, 보훈 대상 확인 서류",
    deadline: "기관 확인",
  },
  {
    tag: "한부모",
    name: "한부모가족 지원",
    target: "배우자 사망으로 홀로 아이를 키우게 된 경우 (소득 기준 충족 시)",
    amount: "아동양육비 등 (소득·자녀 연령에 따라)",
    agency: "관할 읍·면·동 주민센터",
    docs: "가족관계증명서, 소득 증빙, 신분증 등",
    deadline: "상시 신청",
  },
  {
    tag: "국세청",
    name: "근로·자녀장려금 정산",
    target: "고인이 근로·자녀장려금 대상이었다면, 상속인이 대신 신청·수령할 수 있음",
    amount: "고인의 산정액",
    agency: "국세청 홈택스 · 세무서",
    docs: "상속 사실 확인 서류 등",
    deadline: "정산 신청 기한 있음 — 세무서 확인",
  },
];

const HIDDEN = [
  { name: "숨은 보험금 찾기", how: "생명·손해보험협회 ‘내보험찾아줌’에서 고인 명의 보험(단체·카드보험 포함)을 조회. 사망보험금 청구 시효는 3년." },
  { name: "휴면예금·미수령 계좌", how: "금융결제원 ‘계좌정보통합관리(어카운트인포)’의 상속인 금융거래조회로 흩어진 계좌·휴면예금을 한 번에 확인." },
  { name: "정부·세금 미환급금", how: "정부24·홈택스에서 미환급 세금, 국민연금·건강보험 환급금 등을 조회해 돌려받기." },
  { name: "통신·공과금 보증금", how: "휴대폰·인터넷·도시가스·전기의 미환급 요금·보증금, 카드 포인트도 해지 시 함께 정산." },
];

const card = "bg-surface-container-lowest rounded-3xl p-7 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)] hover:shadow-[0_16px_38px_-16px_rgba(120,82,60,0.2)] transition-shadow flex flex-col";
const row = (label: string, value: string) => (
  <div>
    <dt className="text-on-surface-variant text-xs mb-0.5">{label}</dt>
    <dd className="text-on-surface">{value}</dd>
  </div>
);

export default function Support() {
  return (
    <div className="pt-24 pb-20 px-5 md:px-8">
      <div className="max-w-[1120px] mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-[26px] md:text-5xl font-semibold text-on-surface mb-4">지원금 안내</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            받을 수 있는데 <b className="text-on-surface">몰라서 못 받는</b> 경우가 정말 많습니다. 고인·유족 상황에 따라 받을 수 있는 국가 지원과 신청 방법을 빠짐없이 정리했어요.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMS.map((p) => (
            <article key={p.name} className={card}>
              <span className="self-start text-xs px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant mb-3">{p.tag}</span>
              <h2 className="font-serif text-2xl font-semibold text-on-surface mb-4">{p.name}</h2>
              <dl className="space-y-3 text-sm flex-1">
                {row("대상", p.target)}
                {row("금액", p.amount)}
                {row("신청처", p.agency)}
                {row("필요 서류", p.docs)}
                {row("기한", p.deadline)}
              </dl>
              {p.tip && (
                <p className="mt-4 pt-4 border-t border-surface-variant text-sm text-on-surface-variant">{p.tip}</p>
              )}
            </article>
          ))}
        </div>

        {/* 숨은 돈 찾기 */}
        <section className="mt-14">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-on-surface mb-2">흩어진 ‘숨은 돈’ 찾기</h2>
          <p className="text-on-surface-variant mb-6">고인이 들어둔 보험·예금·환급금은 가족도 모르는 경우가 많습니다. 아래로 한 번에 확인하세요.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {HIDDEN.map((h) => (
              <div key={h.name} className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)]">
                <h3 className="font-serif text-lg font-semibold text-on-surface mb-2">{h.name}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{h.how}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 주요 기관 연락처 */}
        <section className="mt-14">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-on-surface mb-2">바로 거는 곳 — 주요 기관 연락처</h2>
          <p className="text-on-surface-variant mb-6">어디에 물어야 할지 막막할 때. 대표번호를 모아뒀어요. (국번 없이)</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { who: "정부24 (사망신고·안심상속)", tel: "1588-2188" },
              { who: "국민연금공단 (유족연금)", tel: "1355" },
              { who: "국민건강보험공단", tel: "1577-1000" },
              { who: "근로복지공단 (산재)", tel: "1588-0075" },
              { who: "보건복지상담 (긴급복지)", tel: "129" },
              { who: "국세청 홈택스 (상속세)", tel: "126" },
              { who: "금융감독원 (상속인 금융조회)", tel: "1332" },
              { who: "대한법률구조공단 (무료 법률상담)", tel: "132" },
              { who: "자살예방상담", tel: "109", urgent: true },
            ].map((c) => (
              <a
                key={c.tel}
                href={`tel:${c.tel.replace(/-/g, "")}`}
                className={`flex items-center justify-between gap-3 rounded-2xl px-5 py-4 border transition-colors ${
                  c.urgent
                    ? "bg-error-container/40 border-error/20 hover:border-error/40"
                    : "bg-surface-container-lowest border-outline-variant hover:border-primary"
                }`}
              >
                <span className="text-sm text-on-surface-variant">{c.who}</span>
                <span className={`font-serif text-lg font-semibold whitespace-nowrap ${c.urgent ? "text-error" : "text-primary"}`}>{c.tel}</span>
              </a>
            ))}
          </div>
          <p className="text-xs text-outline mt-3">번호를 누르면 바로 전화가 걸립니다. 운영시간·메뉴는 기관마다 다를 수 있어요.</p>
        </section>

        {/* 신청 전 알아둘 것 */}
        <section className="mt-10 bg-surface-container rounded-3xl p-7">
          <h2 className="font-serif text-xl font-semibold text-on-surface mb-3">신청 전 알아둘 것</h2>
          <ul className="text-on-surface-variant text-sm space-y-2 leading-relaxed">
            <li>· <b className="text-on-surface">대부분 신청해야 받습니다.</b> 자동으로 나오지 않으니 해당되는 건 꼭 직접 신청하세요.</li>
            <li>· <b className="text-on-surface">기한(시효)이 있습니다.</b> 연금 5년, 보험 3년 등 — 늦으면 권리가 사라져요.</li>
            <li>· <b className="text-on-surface">사망진단서·가족관계증명서</b>는 거의 모든 신청에 필요하니 넉넉히 준비하세요.</li>
            <li>· 과거 건강보험 ‘장제비’는 2008년 폐지되었습니다.</li>
            <li>· 금액·요건은 해마다 바뀌니, 신청 전 각 기관(국민연금공단·주민센터·129 등)에 한 번 더 확인하세요.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
