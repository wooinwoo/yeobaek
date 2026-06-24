import { describe, it, expect } from "vitest";
import {
  estimateTax,
  estimateTaxBreakdown,
  findBracket,
  won,
  wonExact,
  LUMP_SUM_DEDUCTION,
  SPOUSE_DEDUCTION,
} from "./tax";

const EOK = 100_000_000;
const CHEONMAN = 10_000_000;

describe("won", () => {
  it("1억 이상은 억 단위로 표기", () => {
    expect(won(2.5 * EOK)).toBe("2.5억 원");
    expect(won(1 * EOK)).toBe("1억 원");
  });

  it("1억 미만은 만 단위로 표기", () => {
    expect(won(5_000_000)).toBe("500만 원");
    expect(won(0)).toBe("0만 원");
  });

  it("억 단위는 소수점 둘째 자리까지 반올림", () => {
    // 1.234억 → maximumFractionDigits:2 → 1.23억
    expect(won(1.234 * EOK)).toBe("1.23억 원");
  });
});

describe("findBracket", () => {
  it("과세표준 1억 이하면 10%, 누진공제 0", () => {
    expect(findBracket(1 * EOK)).toEqual({ rate: 0.1, prog: 0 });
    expect(findBracket(0)).toEqual({ rate: 0.1, prog: 0 });
  });

  it("구간 경계값은 해당 구간(이하)에 포함된다", () => {
    // 5억은 두 번째 구간 상한 → 20%
    expect(findBracket(5 * EOK)).toEqual({ rate: 0.2, prog: 10_000_000 });
  });

  it("30억 초과는 최고세율 50%", () => {
    expect(findBracket(31 * EOK)).toEqual({ rate: 0.5, prog: 460_000_000 });
  });
});

describe("estimateTax", () => {
  it("배우자 있고 재산 10억이면 공제 10억으로 과세표준 0 → 세금 없음", () => {
    const r = estimateTax({ asset: 10 * EOK, debt: 0, spouse: true });
    expect(r.deduction).toBe(LUMP_SUM_DEDUCTION + SPOUSE_DEDUCTION);
    expect(r.base).toBe(0);
    expect(r.tax).toBe(0);
  });

  it("배우자 없으면 공제는 일괄공제 5억만 적용", () => {
    const r = estimateTax({ asset: 10 * EOK, debt: 0, spouse: false });
    expect(r.deduction).toBe(LUMP_SUM_DEDUCTION);
    // 순재산 10억 - 공제 5억 = 과세표준 5억 → 20%, 누진공제 1천만
    expect(r.base).toBe(5 * EOK);
    expect(r.rate).toBe(0.2);
    expect(r.tax).toBe(5 * EOK * 0.2 - 10_000_000); // 9천만
  });

  it("빚을 재산에서 차감해 순재산을 구한다", () => {
    const r = estimateTax({ asset: 20 * EOK, debt: 5 * EOK, spouse: true });
    expect(r.net).toBe(15 * EOK);
    // 순재산 15억 - 공제 10억 = 과세표준 5억
    expect(r.base).toBe(5 * EOK);
  });

  it("빚이 재산보다 크면 순재산은 음수가 아닌 0", () => {
    const r = estimateTax({ asset: 3 * EOK, debt: 10 * EOK, spouse: false });
    expect(r.net).toBe(0);
    expect(r.base).toBe(0);
    expect(r.tax).toBe(0);
  });

  it("고액 재산은 최고세율 구간까지 누진 적용", () => {
    // 배우자 없음, 재산 40억 → 순재산 40억 - 공제 5억 = 과세표준 35억(>30억) → 50%
    const r = estimateTax({ asset: 40 * EOK, debt: 0, spouse: false });
    expect(r.rate).toBe(0.5);
    expect(r.tax).toBe(35 * EOK * 0.5 - 460_000_000);
  });
});

describe("wonExact", () => {
  it("정확한 원 단위에 자릿수 콤마를 병기", () => {
    expect(wonExact(123_456_789)).toBe("123,456,789원");
    expect(wonExact(0)).toBe("0원");
    expect(wonExact(5 * EOK)).toBe("500,000,000원");
  });

  it("소수는 반올림해 정수 원으로 표기", () => {
    expect(wonExact(1000.4)).toBe("1,000원");
    expect(wonExact(1000.5)).toBe("1,001원");
  });
});

describe("estimateTaxBreakdown", () => {
  const input = { asset: 40 * EOK, debt: 0, spouse: false };

  it("estimateTax와 동일한 핵심 결과를 회귀 없이 유지한다", () => {
    const base = estimateTax(input);
    const bd = estimateTaxBreakdown(input);
    expect(bd.net).toBe(base.net);
    expect(bd.deduction).toBe(base.deduction);
    expect(bd.base).toBe(base.base);
    expect(bd.rate).toBe(base.rate);
    expect(bd.tax).toBe(base.tax);
  });

  it("입력값(asset/debt)을 그대로 노출한다", () => {
    const bd = estimateTaxBreakdown({ asset: 20 * EOK, debt: 5 * EOK, spouse: true });
    expect(bd.asset).toBe(20 * EOK);
    expect(bd.debt).toBe(5 * EOK);
  });

  it("배우자 없으면 공제 항목은 일괄공제 하나", () => {
    const bd = estimateTaxBreakdown({ asset: 10 * EOK, debt: 0, spouse: false });
    expect(bd.deductions).toEqual([{ label: "일괄공제", amount: LUMP_SUM_DEDUCTION }]);
  });

  it("배우자 있으면 공제 항목에 배우자공제가 추가된다", () => {
    const bd = estimateTaxBreakdown({ asset: 10 * EOK, debt: 0, spouse: true });
    expect(bd.deductions).toEqual([
      { label: "일괄공제", amount: LUMP_SUM_DEDUCTION },
      { label: "배우자공제(최소)", amount: SPOUSE_DEDUCTION },
    ]);
    // 공제 항목 합계는 deduction과 일치
    const sum = bd.deductions.reduce((acc, d) => acc + d.amount, 0);
    expect(sum).toBe(bd.deduction);
  });

  it("적용 구간의 누진공제(prog)를 노출한다", () => {
    // 과세표준 35억(>30억) → 누진공제 4.6억
    const bd = estimateTaxBreakdown({ asset: 40 * EOK, debt: 0, spouse: false });
    expect(bd.prog).toBe(460_000_000);
  });

  it("taxRatio = 산출세액 / 과세표준", () => {
    // 배우자 없음, 재산 10억 → 과세표준 5억, 세율 20%, 누진공제 1천만 → 세액 9천만
    const bd = estimateTaxBreakdown({ asset: 10 * EOK, debt: 0, spouse: false });
    expect(bd.base).toBe(5 * EOK);
    expect(bd.tax).toBe(9 * CHEONMAN);
    expect(bd.taxRatio).toBeCloseTo((9 * CHEONMAN) / (5 * EOK), 10);
  });

  it("과세표준이 0이면 taxRatio는 0 (0으로 나눔 방지)", () => {
    const bd = estimateTaxBreakdown({ asset: 10 * EOK, debt: 0, spouse: true });
    expect(bd.base).toBe(0);
    expect(bd.taxRatio).toBe(0);
  });

  it("단계 산식이 일관된다: 순재산 = asset - debt, 과세표준 = 순재산 - 공제합계", () => {
    const bd = estimateTaxBreakdown({ asset: 20 * EOK, debt: 3 * EOK, spouse: true });
    expect(bd.net).toBe(bd.asset - bd.debt);
    const dedSum = bd.deductions.reduce((acc, d) => acc + d.amount, 0);
    expect(bd.base).toBe(Math.max(0, bd.net - dedSum));
    // 산출세액 = 과세표준 × 세율 − 누진공제
    expect(bd.tax).toBe(Math.max(0, bd.base * bd.rate - bd.prog));
  });
});
