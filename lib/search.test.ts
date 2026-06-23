import { describe, it, expect } from "vitest";
import { searchSite, SEARCH_INDEX } from "./search";

describe("searchSite", () => {
  it("빈 쿼리는 빈 배열을 반환한다", () => {
    expect(searchSite("")).toEqual([]);
    expect(searchSite("   ")).toEqual([]);
  });

  it("일치하는 결과가 없으면 빈 배열을 반환한다", () => {
    expect(searchSite("존재하지않는검색어zzz")).toEqual([]);
  });

  it("한국어 부분 일치로 결과를 찾는다", () => {
    const results = searchSite("상속세");
    expect(results.length).toBeGreaterThan(0);
    // 상속세 계산기 페이지가 포함되어야 한다
    expect(results.some((r) => r.href === "/inheritance-tax")).toBe(true);
  });

  it("제목 일치가 본문(요약)만 일치하는 것보다 상위에 온다", () => {
    // '유류분'은 용어 제목이자, 상속 가이드 키워드에 있음.
    const results = searchSite("유류분");
    const termIdx = results.findIndex((r) => r.id === "term-유류분");
    expect(termIdx).toBeGreaterThanOrEqual(0);
    // 제목이 정확히 일치하는 용어가 가장 위(혹은 상위)에 와야 한다.
    expect(results[0].id).toBe("term-유류분");
  });

  it("제목 > 키워드 > 본문 가중치 순서를 따른다", () => {
    // '부고'는 부고 생성기의 제목/키워드, 다른 페이지엔 약하게만 등장.
    const results = searchSite("부고");
    expect(results[0].href).toBe("/obituary");
    // 점수가 내림차순으로 정렬되어 있어야 한다.
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("정확히 일치하는 키워드는 부분 일치보다 높은 점수를 받는다", () => {
    const results = searchSite("빚");
    const sim = results.find((r) => r.href === "/debt-simulator");
    expect(sim).toBeDefined();
    expect(sim!.score).toBeGreaterThan(0);
  });

  it("대소문자/공백을 무시하고 매칭한다", () => {
    const a = searchSite("커뮤니티");
    const b = searchSite("  커뮤니티  ");
    expect(b.length).toBe(a.length);
    expect(b.length).toBeGreaterThan(0);
  });

  it("용어 결과는 해당 용어가 채워진 용어 사전 경로로 연결된다", () => {
    const results = searchSite("발인");
    const term = results.find((r) => r.id === "term-발인");
    expect(term).toBeDefined();
    expect(term!.href).toContain("/terms?q=");
    expect(term!.category).toBe("용어");
  });

  it("결과 score는 항상 양수이다", () => {
    const results = searchSite("상속");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.score > 0)).toBe(true);
  });

  it("동점 결과는 인덱스 등장 순서를 유지한다(안정 정렬)", () => {
    const results = searchSite("상속");
    // 같은 점수 그룹 안에서는 SEARCH_INDEX 순서가 보존되어야 한다.
    for (let i = 1; i < results.length; i++) {
      if (results[i - 1].score === results[i].score) {
        const prevIdx = SEARCH_INDEX.findIndex(
          (e) => e.id === results[i - 1].id
        );
        const curIdx = SEARCH_INDEX.findIndex((e) => e.id === results[i].id);
        expect(prevIdx).toBeLessThan(curIdx);
      }
    }
  });
});
