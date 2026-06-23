import { TERMS } from "./terms";

export type SearchCategory =
  | "가이드"
  | "도구"
  | "예절"
  | "지원금"
  | "FAQ"
  | "용어"
  | "커뮤니티";

export type SearchEntry = {
  /** 결과 식별자 (중복 방지) */
  id: string;
  /** 결과 제목 */
  title: string;
  /** 한 줄 요약 */
  summary: string;
  /** 검색 가중치를 위한 키워드 */
  keywords: string[];
  /** 이동할 페이지 경로 */
  href: string;
  /** 분류 */
  category: SearchCategory;
};

export type SearchResult = SearchEntry & {
  /** 관련도 점수 (높을수록 상위) */
  score: number;
};

/**
 * 페이지/도구 단위의 정적 검색 인덱스.
 * 용어(terms.ts)는 별도로 합쳐 SEARCH_INDEX 를 구성한다.
 */
const PAGE_ENTRIES: SearchEntry[] = [
  {
    id: "page-family-guide",
    title: "유족 길잡이",
    summary:
      "사망일을 입력하면 무엇을 언제까지 해야 하는지 D-day와 함께 단계별로 안내합니다.",
    keywords: [
      "유족",
      "길잡이",
      "장례",
      "사망신고",
      "임종",
      "체크리스트",
      "할 일",
      "절차",
      "순서",
      "디데이",
      "기한",
      "안심상속",
    ],
    href: "/family-guide",
    category: "가이드",
  },
  {
    id: "page-debt-simulator",
    title: "빚 상속 진단",
    summary:
      "가족 구성을 입력하면 단순승인·한정승인·상속포기 중 우리 가족에 맞는 선택을 알려드립니다.",
    keywords: [
      "빚",
      "채무",
      "상속포기",
      "한정승인",
      "단순승인",
      "특별한정승인",
      "3개월",
      "기한",
      "가정법원",
      "신고",
    ],
    href: "/debt-simulator",
    category: "도구",
  },
  {
    id: "page-inheritance",
    title: "상속 가이드",
    summary:
      "상속 순위·법정상속분·유류분·등기와 세금까지, 누가 얼마나 받는지 분쟁 없이 정리했어요.",
    keywords: [
      "상속",
      "상속인",
      "상속 순위",
      "법정상속분",
      "유류분",
      "협의분할",
      "상속등기",
      "취득세",
      "배우자",
      "직계비속",
      "직계존속",
    ],
    href: "/inheritance",
    category: "가이드",
  },
  {
    id: "page-inheritance-tax",
    title: "상속세 계산기",
    summary: "재산과 가족 구성을 입력하면 예상 상속세를 간이 추정해 드립니다.",
    keywords: [
      "상속세",
      "세금",
      "계산기",
      "공제",
      "일괄공제",
      "배우자공제",
      "금융재산공제",
      "간주상속재산",
      "신고",
      "납부",
      "6개월",
      "홈택스",
      "가산세",
    ],
    href: "/inheritance-tax",
    category: "도구",
  },
  {
    id: "page-obituary",
    title: "부고 문자 생성기",
    summary: "빈칸만 채우면 단정한 부고 문구를 만들어 바로 복사할 수 있어요.",
    keywords: [
      "부고",
      "부고 문자",
      "부고 문구",
      "고인",
      "향년",
      "빈소",
      "발인",
      "장지",
      "상주",
      "부의금 계좌",
      "조문 안내",
    ],
    href: "/obituary",
    category: "도구",
  },
  {
    id: "page-etiquette",
    title: "조문 예절",
    summary:
      "빈소에 들어서는 순간부터 나오는 순간까지, 분향·절·부의금·종교별 예절을 빠짐없이 안내합니다.",
    keywords: [
      "조문",
      "예절",
      "빈소",
      "분향",
      "헌화",
      "절",
      "재배",
      "맞절",
      "공수",
      "부의금",
      "조의금",
      "복장",
      "상복",
      "위로의 말",
      "종교별",
    ],
    href: "/etiquette",
    category: "예절",
  },
  {
    id: "page-support",
    title: "지원금 안내",
    summary:
      "국민연금·장제급여·산재·보훈 등 받을 수 있는 지원과, 바로 거는 주요 기관 연락처를 모았어요.",
    keywords: [
      "지원금",
      "유족연금",
      "국민연금",
      "사망일시금",
      "장제급여",
      "산재",
      "보훈",
      "긴급복지",
      "한부모",
      "휴면예금",
      "미환급금",
      "숨은 돈",
      "기관 연락처",
    ],
    href: "/support",
    category: "지원금",
  },
  {
    id: "page-terms",
    title: "용어 사전",
    summary:
      "빈소·행정 창구·상속 절차에서 마주하는 낯선 장례·상속 용어를 쉽게 풀어드립니다.",
    keywords: [
      "용어",
      "사전",
      "뜻",
      "의미",
      "장례 용어",
      "상속 용어",
      "검색",
    ],
    href: "/terms",
    category: "가이드",
  },
  {
    id: "page-faq",
    title: "자주 묻는 질문",
    summary:
      "장례 직후부터 행정 신고, 상속과 빚, 세금, 지원금까지 유족이 가장 많이 묻는 질문을 모았어요.",
    keywords: [
      "FAQ",
      "자주 묻는 질문",
      "질문",
      "궁금",
      "Q&A",
      "문답",
      "사후 절차",
      "사망 후",
    ],
    href: "/faq",
    category: "FAQ",
  },
  {
    id: "faq-debt-3months",
    title: "한정승인·상속포기는 언제까지 하나요",
    summary:
      "상속개시를 안 날부터 3개월 이내에 가정법원에 신고해야 합니다. 넘기면 단순승인으로 봅니다.",
    keywords: ["한정승인", "상속포기", "3개월", "기한", "빚", "단순승인", "특별한정승인"],
    href: "/faq#debt",
    category: "FAQ",
  },
  {
    id: "faq-death-report",
    title: "사망신고는 언제까지 해야 하나요",
    summary:
      "사망 사실을 안 날부터 1개월 이내에 사망진단서를 첨부해 주민센터에 신고합니다.",
    keywords: ["사망신고", "1개월", "기한", "주민센터", "사망진단서", "안심상속"],
    href: "/faq#admin",
    category: "FAQ",
  },
  {
    id: "faq-tax-deadline",
    title: "상속세는 언제까지 신고하나요",
    summary:
      "사망일이 속한 달 말일부터 6개월 이내 신고·납부. 공제가 커서 0원인 경우도 많습니다.",
    keywords: ["상속세", "6개월", "신고", "납부", "가산세", "공제", "세금"],
    href: "/faq#tax",
    category: "FAQ",
  },
  {
    id: "faq-support-claim",
    title: "유족이 받을 수 있는 지원금이 뭔가요",
    summary:
      "유족연금·장제급여·산재·보훈 등. 대부분 직접 신청해야 받고, 보험금 시효는 3년입니다.",
    keywords: ["지원금", "유족연금", "장제급여", "사망보험금", "시효", "산재", "보훈"],
    href: "/faq#support",
    category: "FAQ",
  },
  {
    id: "page-community",
    title: "커뮤니티",
    summary:
      "익명으로 고민과 위로를 나누는 따뜻한 공간. 같은 길을 지나온 이들과 함께.",
    keywords: [
      "커뮤니티",
      "위로",
      "공감",
      "익명",
      "고민",
      "심리",
      "상담",
      "자살예방",
      "정신건강",
    ],
    href: "/community",
    category: "커뮤니티",
  },
];

/** 용어 사전 항목을 검색 인덱스 항목으로 변환 */
const TERM_ENTRIES: SearchEntry[] = TERMS.map((t) => ({
  id: `term-${t.term}`,
  title: t.term,
  summary: t.desc,
  keywords: [t.term, t.cat],
  // 용어 사전 페이지로 보내되, 해당 용어를 미리 채워 둔다.
  href: `/terms?q=${encodeURIComponent(t.term)}`,
  category: "용어" as const,
}));

/** 사이트 전역 검색 인덱스 (페이지 + 용어) */
export const SEARCH_INDEX: SearchEntry[] = [...PAGE_ENTRIES, ...TERM_ENTRIES];

/** 가중치: 제목 > 키워드 > 본문(요약) */
const WEIGHT_TITLE = 10;
const WEIGHT_KEYWORD = 5;
const WEIGHT_SUMMARY = 2;
/** 제목/키워드가 정확히 일치하면 추가 가산 */
const WEIGHT_EXACT_BONUS = 8;

function normalize(value: string): string {
  return value.normalize("NFC").trim().toLowerCase();
}

/**
 * 단일 항목에 대한 쿼리 점수를 계산한다.
 * 한국어 부분 일치(includes) 기준. 일치가 전혀 없으면 0.
 */
function scoreEntry(entry: SearchEntry, q: string): number {
  const title = normalize(entry.title);
  const summary = normalize(entry.summary);
  const keywords = entry.keywords.map(normalize);

  let score = 0;

  if (title.includes(q)) {
    score += WEIGHT_TITLE;
    if (title === q) score += WEIGHT_EXACT_BONUS;
  }

  for (const kw of keywords) {
    if (kw.includes(q)) {
      score += WEIGHT_KEYWORD;
      if (kw === q) score += WEIGHT_EXACT_BONUS;
    }
  }

  if (summary.includes(q)) {
    score += WEIGHT_SUMMARY;
  }

  return score;
}

/**
 * 사이트 전역 검색.
 * - 빈/공백 쿼리는 빈 배열 반환
 * - 공백이 포함된 쿼리는 토큰으로 분리해 각 토큰 점수를 합산
 *   (예: "상속 포기" → "상속" + "포기" 각각 채점 후 합)
 * - 한국어 부분 일치, 가중치(제목 > 키워드 > 본문)
 * - 관련도 내림차순, 동점이면 인덱스 등장 순서 유지(안정 정렬)
 */
export function searchSite(query: string): SearchResult[] {
  const q = normalize(query ?? "");
  if (!q) return [];

  // 공백 기준 토큰 분리(다중 공백 허용). 빈 토큰 제거.
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];
  for (const entry of SEARCH_INDEX) {
    // 각 토큰 점수를 합산. 토큰 중 하나라도 맞으면 결과에 포함.
    let score = 0;
    for (const token of tokens) {
      score += scoreEntry(entry, token);
    }
    if (score > 0) {
      results.push({ ...entry, score });
    }
  }

  // 점수 내림차순. 동점은 원래 순서 유지(Array.sort 안정성, ES2019+).
  results.sort((a, b) => b.score - a.score);
  return results;
}

/** 카테고리 표시 순서 */
export const CATEGORY_ORDER: SearchCategory[] = [
  "가이드",
  "도구",
  "예절",
  "지원금",
  "FAQ",
  "용어",
  "커뮤니티",
];
