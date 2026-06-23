import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yeobaek.vercel.app";
const DESCRIPTION =
  "장례 직후부터 행정 신고, 상속과 빚, 세금, 지원금까지. 유족이 가장 많이 묻는 질문을 한곳에 모아 정확하게 답했어요.";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description: DESCRIPTION,
};

type Qa = {
  q: string;
  /** 답변 본문(문장 배열). 각 항목은 한 단락으로 렌더된다. */
  a: string[];
  /** 관련 페이지 링크 */
  link?: { href: string; label: string };
};

type Group = {
  id: string;
  title: string;
  items: Qa[];
};

const GROUPS: Group[] = [
  {
    id: "funeral",
    title: "장례 직후",
    items: [
      {
        q: "가족이 막 돌아가셨어요. 가장 먼저 무엇을 해야 하나요?",
        a: [
          "병원이 아닌 자택 등에서 돌아가신 경우에는 시신을 옮기거나 정리하지 말고 112 또는 119에 먼저 신고하세요. 경찰의 검시(검안)가 끝나야 장례를 시작할 수 있습니다.",
          "병원에서 돌아가신 경우에는 사망진단서를 발급받고, 장례식장에 안치와 이송을 요청하면 됩니다.",
        ],
        link: { href: "/family-guide", label: "유족 길잡이에서 단계별로 보기" },
      },
      {
        q: "사망진단서는 몇 부나 발급받아야 하나요?",
        a: [
          "사망신고, 보험금 청구, 연금, 금융기관, 부동산 처리 등 거의 모든 절차에 원본이 필요합니다. 기관마다 원본을 요구하므로 보통 7부에서 10부 정도 넉넉히 발급받아 두는 것이 좋습니다.",
          "부족하면 재발급이 번거로우니 처음에 여유 있게 받아 두세요.",
        ],
      },
      {
        q: "상조에 가입했는지 모르겠어요. 어떻게 확인하나요?",
        a: [
          "고인이나 가족이 가입한 상조 상품이 있는지 먼저 확인하세요. 신용카드 부가서비스나 통신사 멤버십에 상조 혜택이 들어 있는 경우도 많습니다.",
          "가입돼 있다면 제공 범위(인력, 물품, 차량)를 확인해 장례식장 견적과 중복되는 항목을 빼면 비용을 아낄 수 있어요.",
        ],
      },
      {
        q: "장례 비용에서 바가지를 쓰지 않으려면 무엇을 봐야 하나요?",
        a: [
          "수의, 관, 제단, 꽃, 도우미, 버스, 접객용 일회용품(그릇, 수저, 컵 등)이 포함인지 별도인지 항목별로 구분해 받아 적으세요.",
          "일회용품은 상조나 대여 업체에서 지원되는 경우가 많으니 따로 비용이 드는지 꼭 물어보고, 견적서를 항목별로 받아 중복이나 과다 청구를 막으세요. 장례비 영수증은 지원금 청구와 상속세 공제의 증빙이 되니 반드시 보관하세요.",
        ],
        link: { href: "/etiquette", label: "조문 예절과 빈소 안내 보기" },
      },
    ],
  },
  {
    id: "admin",
    title: "행정 신고",
    items: [
      {
        q: "사망신고는 언제까지 해야 하나요?",
        a: [
          "사망 사실을 안 날부터 1개월 이내에 해야 합니다. 사망진단서를 첨부해 주민센터에 신고하면 됩니다.",
          "사망신고를 늦게 하면 과태료가 부과될 수 있습니다.",
        ],
        link: { href: "/family-guide", label: "행정 절차 체크리스트 보기" },
      },
      {
        q: "안심상속 원스톱 서비스가 뭔가요?",
        a: [
          "고인의 예금, 보험, 증권, 연금, 세금, 토지, 자동차 등 재산과 부채를 한 번에 조회하는 서비스입니다. 정부24에서 신청하며, 사망신고와 동시에 신청할 수 있습니다.",
          "상속을 단순승인할지 한정승인이나 포기할지 판단하는 기준이 되고, 가족도 몰랐던 숨은 보험이나 계좌를 찾는 출발점이 됩니다.",
        ],
        link: { href: "/family-guide", label: "유족 길잡이에서 신청 시점 확인" },
      },
      {
        q: "고인 명의의 휴대폰과 자동이체는 어떻게 정리하나요?",
        a: [
          "가족관계증명서가 있으면 통신, 인터넷, 구독 서비스를 해지할 수 있습니다. OTT, 정기결제, 간편결제 자동이체를 함께 정리해 불필요한 출금을 막으세요.",
          "고인의 휴대폰 잠금 비밀번호는 사후에 풀기 어려우니, 가능하면 가족 연락과 금융앱 확인을 위해 미리 확보해 두는 것이 좋습니다.",
        ],
      },
    ],
  },
  {
    id: "debt",
    title: "상속과 빚",
    items: [
      {
        q: "고인에게 빚이 있는데 자식이 떠안게 되나요?",
        a: [
          "상속은 재산만이 아니라 빚도 함께 물려받습니다. 빚이 더 많을 가능성이 있다면 한정승인이나 상속포기를 검토해야 합니다.",
          "안심상속 원스톱 조회로 재산과 부채를 먼저 파악한 뒤 결정하세요. 함부로 고인의 예금을 인출하거나 재산을 처분하면 단순승인으로 간주돼 빚을 떠안을 수 있습니다.",
        ],
        link: { href: "/debt-simulator", label: "빚 상속 진단으로 우리 가족 진단" },
      },
      {
        q: "한정승인과 상속포기는 언제까지 해야 하나요?",
        a: [
          "상속개시(사망)를 안 날부터 3개월 이내에 가정법원에 신고해야 합니다. 이 기간을 한정승인 또는 포기의 고려기간이라고 합니다.",
          "기간을 넘기면 원칙적으로 단순승인한 것으로 보아 빚까지 모두 상속됩니다.",
        ],
        link: { href: "/debt-simulator", label: "한정승인·상속포기 선택 알아보기" },
      },
      {
        q: "3개월이 지난 뒤에야 빚을 알게 됐어요. 방법이 없나요?",
        a: [
          "중대한 과실 없이 빚이 재산을 초과하는 사실을 몰랐던 경우라면, 그 사실을 안 날부터 3개월 이내에 특별한정승인을 신청할 수 있습니다.",
          "다만 요건이 까다로우니 가능한 한 빨리 가정법원이나 법률 전문가와 상담하세요. 대한법률구조공단(132)에서 무료 상담을 받을 수 있습니다.",
        ],
        link: { href: "/debt-simulator", label: "빚 상속 진단에서 자세히" },
      },
    ],
  },
  {
    id: "inheritance",
    title: "상속과 분할",
    items: [
      {
        q: "상속은 누가, 어떤 순서로 받나요?",
        a: [
          "1순위는 직계비속(자녀 등), 2순위는 직계존속(부모 등), 3순위는 형제자매 순입니다. 선순위가 한 명이라도 있으면 후순위는 받지 못합니다.",
          "배우자는 1순위나 2순위와 함께 공동으로 상속하고, 그들이 없으면 단독으로 상속합니다.",
        ],
        link: { href: "/inheritance", label: "상속 가이드에서 순위 보기" },
      },
      {
        q: "배우자와 자녀가 있으면 각자 얼마씩 받나요?",
        a: [
          "같은 순위끼리는 똑같이 나누되, 배우자는 다른 상속인보다 5할(1.5배)을 더 받습니다.",
          "예를 들어 배우자와 자녀 2명이면 배우자 3/7, 자녀가 각 2/7입니다. 배우자와 자녀 1명이면 배우자 3/5, 자녀 2/5입니다. 다만 유언이나 상속인 간 협의가 있으면 그것이 우선합니다.",
        ],
        link: { href: "/inheritance", label: "법정상속분 표 보기" },
      },
      {
        q: "유류분이 뭔가요? 한 사람에게 재산이 다 갔어요.",
        a: [
          "특정인에게 재산이 쏠려도 가까운 상속인은 법으로 보장된 최소한의 몫인 유류분을 돌려달라고 청구할 수 있습니다. 직계비속과 배우자는 법정상속분의 1/2, 직계존속은 법정상속분의 1/3입니다.",
          "청구 기한은 유류분 침해를 안 날부터 1년, 상속이 시작된 날부터 10년 이내입니다.",
        ],
        link: { href: "/inheritance", label: "유류분 자세히 보기" },
      },
    ],
  },
  {
    id: "tax",
    title: "세금",
    items: [
      {
        q: "상속세는 언제까지 신고하고 내야 하나요?",
        a: [
          "사망일이 속한 달의 말일부터 6개월 이내에 신고하고 납부해야 합니다. 기한을 넘기면 가산세가 붙습니다.",
          "일괄공제와 배우자공제 등 공제가 커서, 재산이 일정 금액 이하면 낼 세금이 0원인 경우도 많습니다.",
        ],
        link: { href: "/inheritance-tax", label: "상속세 계산기로 추정해 보기" },
      },
      {
        q: "재산이 많지 않은데도 상속세를 내야 하나요?",
        a: [
          "기초공제와 그 밖의 인적공제를 합한 금액과 일괄공제 5억 원 중 큰 금액을 공제받을 수 있고, 배우자가 있으면 배우자공제가 추가됩니다.",
          "이 공제만으로도 상당한 금액이 빠지기 때문에, 일반적인 규모의 재산이라면 세금이 없거나 적은 경우가 많습니다. 정확한 금액은 계산기로 추정해 보세요.",
        ],
        link: { href: "/inheritance-tax", label: "예상 상속세 계산하기" },
      },
      {
        q: "자동차나 부동산 명의는 언제까지 바꿔야 하나요?",
        a: [
          "자동차는 사망일이 속한 달의 말일부터 6개월 이내에 이전이나 말소를 해야 하며, 미이행 시 과태료가 부과됩니다.",
          "부동산 상속등기는 분할 협의가 끝난 뒤 진행하는데, 빚이 더 많을 가능성이 있다면 등기나 처분 전에 한정승인이나 상속포기부터 정하세요.",
        ],
        link: { href: "/inheritance", label: "등기와 세금 안내 보기" },
      },
    ],
  },
  {
    id: "support",
    title: "지원금",
    items: [
      {
        q: "유족이 받을 수 있는 지원금에는 어떤 것이 있나요?",
        a: [
          "국민연금 유족연금이나 사망일시금, 기초생활수급자의 장제급여(사망 1구당 80만 원), 업무상 재해라면 산재 장의비와 유족급여, 국가유공자라면 보훈 지원 등이 있습니다.",
          "대부분 자동으로 나오지 않고 직접 신청해야 받을 수 있으니, 해당되는 제도는 꼭 신청하세요.",
        ],
        link: { href: "/support", label: "지원금 안내에서 전체 보기" },
      },
      {
        q: "사망보험금은 언제까지 청구해야 하나요?",
        a: [
          "사망보험금 청구권의 소멸시효는 3년입니다. 본인이 가입한 보험뿐 아니라 직장 단체보험, 신용카드 보험, 운전자보험 등 빠뜨리기 쉬운 보험도 확인하세요.",
          "생명보험협회와 손해보험협회의 내보험찾아줌에서 고인 명의의 숨은 보험을 조회할 수 있습니다.",
        ],
        link: { href: "/support", label: "숨은 돈 찾는 방법 보기" },
      },
      {
        q: "고인이 남긴 예금이나 환급금을 한 번에 확인할 수 있나요?",
        a: [
          "금융결제원의 계좌정보통합관리(어카운트인포) 상속인 금융거래조회로 흩어진 계좌와 휴면예금을 한 번에 확인할 수 있습니다.",
          "정부24와 홈택스에서는 미환급 세금, 국민연금과 건강보험 환급금 등을 조회해 돌려받을 수 있습니다.",
        ],
        link: { href: "/support", label: "기관 연락처와 함께 보기" },
      },
    ],
  },
  {
    id: "community",
    title: "마음과 커뮤니티",
    items: [
      {
        q: "너무 힘든데 어디에 이야기할 수 있을까요?",
        a: [
          "여백 커뮤니티에서는 같은 길을 지나온 분들과 익명으로 고민과 위로를 나눌 수 있습니다.",
          "마음이 많이 무너질 때는 자살예방상담(109)이나 정신건강상담(1577-0199)에 24시간 도움을 청할 수 있습니다. 혼자 견디지 마세요.",
        ],
        link: { href: "/community", label: "커뮤니티로 가기" },
      },
      {
        q: "장례나 상속 용어가 너무 낯설어요.",
        a: [
          "빈소와 행정 창구, 상속 절차에서 마주치는 낯선 용어를 쉽게 풀어 둔 용어 사전이 있습니다.",
          "검색창에서 모르는 단어를 바로 찾아보실 수도 있어요.",
        ],
        link: { href: "/terms", label: "용어 사전 보기" },
      },
    ],
  },
];

/** FAQPage 구조화 데이터 (SEO). 답변 단락은 공백으로 이어 붙인다. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  inLanguage: "ko-KR",
  url: `${SITE_URL}/faq`,
  mainEntity: GROUPS.flatMap((g) =>
    g.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a.join(" "),
      },
    }))
  ),
};

const NAV = GROUPS.map((g) => [g.id, g.title] as const);

export default function Faq() {
  return (
    <div className="pt-24 pb-20 px-5 md:px-8">
      <JsonLd data={faqJsonLd} />
      <div className="max-w-[820px] mx-auto">
        <div className="text-center mb-8">
          <div className="text-sm text-on-surface-variant mb-2">홈 · 자주 묻는 질문</div>
          <h1 className="font-serif text-[26px] md:text-5xl font-semibold text-on-surface mb-4">자주 묻는 질문</h1>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            막막한 순간에 가장 많이 물으시는 것들을 모았어요. 궁금한 주제로 바로 이동하거나, 질문을 눌러 답을 펼쳐 보세요.
          </p>
        </div>

        <nav aria-label="질문 분류" className="flex flex-wrap justify-center gap-2 mb-12">
          {NAV.map(([id, title]) => (
            <a
              key={id}
              href={`#${id}`}
              className="px-3.5 py-1.5 rounded-full text-sm border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
            >
              {title}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-12">
          {GROUPS.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-24">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-on-surface mb-5">{group.title}</h2>
              <ul className="flex flex-col gap-3 list-none p-0 m-0">
                {group.items.map((item) => (
                  <li key={item.q}>
                    <details className="group bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden">
                      <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-on-surface flex justify-between items-center gap-3">
                        {item.q}
                        <ChevronDown
                          className="w-4 h-4 text-outline group-open:rotate-180 transition-transform shrink-0"
                          aria-hidden="true"
                        />
                      </summary>
                      <div className="px-5 pb-5 flex flex-col gap-2">
                        {item.a.map((para, i) => (
                          <p key={i} className="text-on-surface-variant text-sm leading-relaxed">
                            {para}
                          </p>
                        ))}
                        {item.link && (
                          <Link
                            href={item.link.href}
                            className="text-primary font-semibold text-sm hover:underline mt-1"
                          >
                            {item.link.label}
                          </Link>
                        )}
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="bg-surface-container rounded-3xl p-6 mt-12">
          <p className="text-on-surface-variant text-sm leading-relaxed">
            제도와 기한은 변동될 수 있어, 신청이나 신고 전에 해당 기관에 한 번 더 확인하시길 권합니다. 더 자세한 안내가 필요하면{" "}
            <Link href="/family-guide" className="text-primary font-semibold">유족 길잡이</Link>나{" "}
            <Link href="/inheritance" className="text-primary font-semibold">상속 가이드</Link>를 참고하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
