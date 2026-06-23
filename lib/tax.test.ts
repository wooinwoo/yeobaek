import { describe, it, expect } from "vitest";
import {
  estimateTax,
  findBracket,
  won,
  LUMP_SUM_DEDUCTION,
  SPOUSE_DEDUCTION,
} from "./tax";

const EOK = 100_000_000;

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
