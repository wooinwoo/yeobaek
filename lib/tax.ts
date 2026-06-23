// 상속세 간이 계산 — 순수 로직 (UI와 분리, 단위테스트 대상)

// 금액 단위 상수 (가독성 + 매직넘버 제거)
const EOK = 100_000_000; // 1억 원
const CHEONMAN = 10_000_000; // 1천만 원

/**
 * 상속세 누진세율 구간 (과세표준 기준): [상한(원), 세율, 누진공제(원)]
 * 상속세및증여세법 제26조 누진세율표.
 * - 1억 이하 10% / 5억 이하 20% / 10억 이하 30% / 30억 이하 40% / 30억 초과 50%
 * - 누진공제는 하위 구간 세액 차이를 보정하는 차감액.
 */
export const BRACKETS: [number, number, number][] = [
  [1 * EOK, 0.1, 0],
  [5 * EOK, 0.2, 1 * CHEONMAN],
  [10 * EOK, 0.3, 6 * CHEONMAN],
  [30 * EOK, 0.4, 16 * CHEONMAN],
  [Infinity, 0.5, 46 * CHEONMAN],
];

// 일괄공제 — 상속세및증여세법 제21조. 기초공제+인적공제 대신 정액 5억 적용 가능.
export const LUMP_SUM_DEDUCTION = 5 * EOK; // 일괄공제 5억
// 배우자 상속공제 — 같은 법 제19조의 최소 보장액 5억(실제 상속분이 적어도 5억까지 공제).
export const SPOUSE_DEDUCTION = 5 * EOK; // 배우자공제(최소) 5억

export type TaxInput = {
  asset: number; // 상속재산 총액 (원)
  debt: number; // 빚 (원)
  spouse: boolean; // 배우자 유무
};

export type TaxResult = {
  net: number; // 순재산
  deduction: number; // 적용 공제 합계
  base: number; // 과세표준
  rate: number; // 적용 세율
  tax: number; // 예상 상속세
};

const MAN = 10_000; // 1만 원

/** 한국 원화 표기. 1억 이상은 '억', 미만은 '만' 단위. */
export function won(n: number): string {
  return n >= EOK
    ? `${(n / EOK).toLocaleString("ko-KR", { maximumFractionDigits: 2 })}억 원`
    : `${Math.round(n / MAN).toLocaleString("ko-KR")}만 원`;
}

/** 과세표준에 해당하는 누진세율 구간을 찾는다. */
export function findBracket(base: number): { rate: number; prog: number } {
  for (const [cap, rt, pg] of BRACKETS) {
    if (base <= cap) return { rate: rt, prog: pg };
  }
  // BRACKETS 마지막이 Infinity라 도달하지 않지만 타입 안전상 fallback
  const [, rt, pg] = BRACKETS[BRACKETS.length - 1];
  return { rate: rt, prog: pg };
}

/** 상속세 간이 추정. 일괄공제 + 배우자공제만 반영. */
export function estimateTax({ asset, debt, spouse }: TaxInput): TaxResult {
  const net = Math.max(0, asset - debt);
  const deduction = LUMP_SUM_DEDUCTION + (spouse ? SPOUSE_DEDUCTION : 0);
  const base = Math.max(0, net - deduction);
  const { rate, prog } = findBracket(base);
  const tax = base > 0 ? Math.max(0, base * rate - prog) : 0;
  return { net, deduction, base, rate, tax };
}
