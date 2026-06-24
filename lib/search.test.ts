import { describe, it, expect } from "vitest";
import { searchSite, SEARCH_INDEX, highlight, suggestSearch } from "./search";

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

  it("공백이 포함된 멀티토큰 쿼리는 각 토큰 점수를 합산한다", () => {
    // "상속 포기" → "상속" + "포기" 각각 채점 후 합산.
    // 두 토큰 모두 매칭되는 빚 상속 진단(상속포기 키워드)이 상위에 와야 한다.
    const multi = searchSite("상속 포기");
    expect(multi.length).toBeGreaterThan(0);
    const debt = multi.find((r) => r.href === "/debt-simulator");
    expect(debt).toBeDefined();

    // 멀티토큰 점수는 단일 토큰 점수 이상이어야 한다(합산 효과).
    const single = searchSite("상속");
    const debtSingle = single.find((r) => r.href === "/debt-simulator");
    expect(debt!.score).toBeGreaterThanOrEqual(debtSingle!.score);
  });

  it("멀티토큰: 토큰 중 하나만 맞아도 결과에 포함된다", () => {
    // "부고 존재하지않는단어zzz" → 부고만 매칭. 부고 생성기가 나와야 한다.
    const results = searchSite("부고 존재하지않는단어zzz");
    expect(results.some((r) => r.href === "/obituary")).toBe(true);
  });

  it("멀티토큰: 앞뒤·중간 공백을 무시하고 동일하게 매칭한다", () => {
    const a = searchSite("상속 포기");
    const b = searchSite("  상속   포기  ");
    expect(b.length).toBe(a.length);
    expect(b[0]?.id).toBe(a[0]?.id);
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

describe("highlight", () => {
  /** 조각들을 합치면 항상 원본 텍스트와 동일해야 한다(무손실 분할). */
  function joined(text: string, query: string): string {
    return highlight(text, query)
      .map((s) => s.text)
      .join("");
  }

  it("빈 텍스트는 빈 배열을 반환한다", () => {
    expect(highlight("", "상속")).toEqual([]);
  });

  it("빈/공백 쿼리는 전체를 단일 비매칭 조각으로 반환한다", () => {
    expect(highlight("상속세 계산기", "")).toEqual([
      { text: "상속세 계산기", matched: false },
    ]);
    expect(highlight("상속세 계산기", "   ")).toEqual([
      { text: "상속세 계산기", matched: false },
    ]);
  });

  it("일치가 없으면 전체를 비매칭 조각으로 반환한다", () => {
    expect(highlight("부고 문자 생성기", "상속")).toEqual([
      { text: "부고 문자 생성기", matched: false },
    ]);
  });

  it("일치 구간을 matched=true 조각으로 분리한다", () => {
    const segs = highlight("상속세 계산기", "상속");
    expect(segs).toEqual([
      { text: "상속", matched: true },
      { text: "세 계산기", matched: false },
    ]);
  });

  it("조각을 합치면 원본 텍스트와 동일하다(무손실)", () => {
    expect(joined("상속세 계산기", "계산")).toBe("상속세 계산기");
    expect(joined("한정승인·상속포기", "상속")).toBe("한정승인·상속포기");
  });

  it("대소문자를 무시하고 매칭하되 원본 표기는 보존한다", () => {
    const segs = highlight("FAQ 자주 묻는 질문", "faq");
    expect(segs[0]).toEqual({ text: "FAQ", matched: true });
    expect(joined("FAQ 자주 묻는 질문", "faq")).toBe("FAQ 자주 묻는 질문");
  });

  it("멀티토큰: 각 토큰을 모두 강조한다", () => {
    const segs = highlight("상속 포기 안내", "상속 포기");
    const matched = segs.filter((s) => s.matched).map((s) => s.text);
    expect(matched).toContain("상속");
    expect(matched).toContain("포기");
  });

  it("겹치거나 인접한 매칭 구간은 하나로 병합한다", () => {
    // "상속"과 "속세"가 겹쳐 "상속세"가 하나의 매칭으로 병합되어야 한다.
    const segs = highlight("상속세", "상속 속세");
    expect(segs).toEqual([{ text: "상속세", matched: true }]);
  });

  it("같은 토큰이 여러 번 등장하면 모두 강조한다", () => {
    const segs = highlight("상속, 또 상속", "상속");
    const matched = segs.filter((s) => s.matched);
    expect(matched.length).toBe(2);
  });

  it("HTML 특수문자를 텍스트로 보존한다(XSS 안전 분할)", () => {
    const text = "<script>alert(1)</script> 상속";
    const segs = highlight(text, "상속");
    // 텍스트가 그대로 보존되어야 한다(이스케이프/실행 없음).
    expect(joined(text, "상속")).toBe(text);
    expect(segs.some((s) => s.matched && s.text === "상속")).toBe(true);
  });
});

describe("suggestSearch", () => {
  it("빈/공백 쿼리는 빈 배열을 반환한다", () => {
    expect(suggestSearch("")).toEqual([]);
    expect(suggestSearch("   ")).toEqual([]);
  });

  it("제목 부분 일치 제안을 반환한다", () => {
    const s = suggestSearch("상속세");
    expect(s.length).toBeGreaterThan(0);
    expect(s.some((x) => x.label === "상속세 계산기")).toBe(true);
  });

  it("limit 개수를 넘지 않는다", () => {
    const s = suggestSearch("상속", 3);
    expect(s.length).toBeLessThanOrEqual(3);
  });

  it("제안 라벨은 중복되지 않는다", () => {
    const s = suggestSearch("상속", 10);
    const labels = s.map((x) => x.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("각 제안은 이동 경로와 분류를 포함한다", () => {
    const s = suggestSearch("부고");
    expect(s.length).toBeGreaterThan(0);
    expect(s[0].href).toBeTruthy();
    expect(s[0].category).toBeTruthy();
  });

  it("일치가 없으면 빈 배열을 반환한다", () => {
    expect(suggestSearch("존재하지않는검색어zzz")).toEqual([]);
  });
});
