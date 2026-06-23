import { describe, it, expect } from "vitest";
import { decide, COURT_STEPS, type Ans } from "./debt";

describe("COURT_STEPS", () => {
  it("한정승인이면 한정승인 신고 + 재산 목록 첨부 안내를 포함한다", () => {
    const steps = COURT_STEPS(true);
    expect(steps[0]).toContain("한정승인");
    expect(steps[2]).toContain("상속재산 목록");
  });

  it("상속포기면 상속포기 신고 + 신고서 제출 안내를 포함한다", () => {
    const steps = COURT_STEPS(false);
    expect(steps[0]).toContain("상속포기");
    expect(steps[2]).toContain("상속포기 신고서");
  });
});

describe("decide", () => {
  it("재산이 더 많으면(less) 단순승인 — special 아님", () => {
    const r = decide({ debt: "less" });
    expect(r.badge).toBe("단순승인");
    expect(r.special).toBe(false);
  });

  it("재산이 더 많으면 known/heirs 값과 무관하게 단순승인 (debt가 최우선 분기)", () => {
    const r = decide({ debt: "less", known: "no", heirs: "multi" });
    expect(r.badge).toBe("단순승인");
  });

  it("빚 규모를 모르면(unknown) 조회 먼저", () => {
    expect(decide({ debt: "unknown" }).badge).toBe("조회 먼저");
  });

  it("빚이 많아도(more) 규모 미파악(known=no)이면 조회 먼저가 우선", () => {
    const r = decide({ debt: "more", known: "no", heirs: "single" });
    expect(r.badge).toBe("조회 먼저");
    expect(r.special).toBe(true);
  });

  it("빚이 많고 규모 확인됐고 상속인 여러 명이면 한정승인 + 포기", () => {
    const r = decide({ debt: "more", known: "yes", heirs: "multi" });
    expect(r.badge).toBe("한정승인 + 포기");
    // 대표 1인 한정승인 + 나머지 포기 + 법원 절차(한정승인 기준)
    expect(r.steps[0]).toContain("한정승인");
    expect(r.steps[1]).toContain("상속포기");
    expect(r.steps).toContain(COURT_STEPS(true)[0]);
  });

  it("빚이 많고 규모 확인됐고 혼자면(single) 한정승인", () => {
    const r = decide({ debt: "more", known: "yes", heirs: "single" });
    expect(r.badge).toBe("한정승인");
    expect(r.steps).toEqual(COURT_STEPS(true));
  });

  it("빚이 많고 heirs 미지정이면 기본값으로 한정승인(single 경로) 처리", () => {
    const r = decide({ debt: "more", known: "yes" });
    expect(r.badge).toBe("한정승인");
  });

  it("빈 입력은 debt가 less/unknown도 아니고 known도 no가 아니라 마지막 분기(한정승인)로 떨어진다", () => {
    // debt undefined → less 아님, unknown 아님, known no 아님, heirs multi 아님 → 기본 한정승인
    expect(decide({} as Ans).badge).toBe("한정승인");
  });

  it("모든 결과는 steps와 cautions를 비어있지 않게 제공한다", () => {
    const cases: Ans[] = [
      { debt: "less" },
      { debt: "unknown" },
      { debt: "more", known: "yes", heirs: "multi" },
      { debt: "more", known: "yes", heirs: "single" },
    ];
    for (const a of cases) {
      const r = decide(a);
      expect(r.steps.length).toBeGreaterThan(0);
      expect(r.cautions.length).toBeGreaterThan(0);
      expect(r.title.length).toBeGreaterThan(0);
    }
  });
});
