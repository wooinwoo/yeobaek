// 상속세 간이 계산 — 순수 로직 (UI와 분리, 단위테스트 대상)

// 누진세율 (과세표준 기준): [상한(원), 세율, 누진공제]
export const BRACKETS: [number, number, number][] = [
  [100_000_000, 0.1, 0],
  [500_000_000, 0.2, 10_000_000],
  [1_000_000_000, 0.3, 60_000_000],
  [3_000_000_000, 0.4, 160_000_000],
  [Infinity, 0.5, 460_000_000],
];

export const LUMP_SUM_DEDUCTION = 500_000_000; // 일괄공제 5억
export const SPOUSE_DEDUCTION = 500_000_000; // 배우자공제(최소) 5억

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

/** 한국 원화 표기. 1억 이상은 '억', 미만은 '만' 단위. */
export function won(n: number): string {
  return n >= 100_000_000
    ? `${(n / 100_000_000).toLocaleString("ko-KR", { maximumFractionDigits: 2 })}억 원`
    : `${Math.round(n / 10_000).toLocaleString("ko-KR")}만 원`;
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
