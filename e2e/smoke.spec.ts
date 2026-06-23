import { test, expect } from "@playwright/test";

// 여백 핵심 사용자 플로우 스모크. sqlite 파일 모드라 외부 의존 없이 자체완결.

test.describe("홈", () => {
  test("히어로와 주요 기능 카드, 네비가 보인다", async ({ page }) => {
    await page.goto("/");

    // 히어로 제목(개행이 섞여 있어 부분 매칭).
    await expect(
      page.getByRole("heading", { level: 1, name: /혼자 감당하지/ }),
    ).toBeVisible();

    // 주요 기능 카드 일부 노출(역할 기반 링크).
    await expect(
      page.getByRole("link", { name: "유족 길잡이" }).first(),
    ).toBeVisible();

    // 데스크탑 네비에 핵심 메뉴 노출.
    const nav = page.getByRole("navigation").first();
    await expect(nav.getByRole("link", { name: "커뮤니티" })).toBeVisible();
  });

  test("히어로 CTA로 유족 길잡이로 이동한다", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /지금 필요한 도움 받기/ }).click();
    await expect(page).toHaveURL(/\/family-guide$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /무엇부터/ }),
    ).toBeVisible();
  });
});

test.describe("통합 검색", () => {
  test("쿼리 파라미터로 진입하면 결과가 노출된다", async ({ page }) => {
    await page.goto("/search?q=상속");

    // 결과 건수 안내(status 영역)가 노출되고 건수가 1건 이상.
    const status = page.getByRole("status");
    await expect(status).toContainText(/검색 결과/);
    await expect(status).not.toContainText(/검색 결과가 없어요/);

    // 결과 카테고리 섹션과 항목 링크가 적어도 하나는 존재.
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();
  });

  test("검색창에 입력해 제출하면 결과 페이지로 이동한다", async ({ page }) => {
    await page.goto("/search");
    const input = page.getByRole("searchbox", { name: "사이트 통합 검색" });
    await input.fill("상속포기");
    await page.getByRole("button", { name: "검색" }).click();

    await expect(page).toHaveURL(/\/search\?q=/);
    await expect(page.getByRole("status")).toContainText(/검색 결과/);
  });
});

test.describe("유족 길잡이", () => {
  test("체크박스를 토글하면 진행률이 올라간다", async ({ page }) => {
    await page.goto("/family-guide");

    // 초기 진행률 0%.
    await expect(page.getByText("0%", { exact: true })).toBeVisible();

    // 첫 체크박스 토글.
    const firstCheckbox = page.getByRole("checkbox").first();
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();

    // 진행률이 0%에서 변동(0% 텍스트가 사라짐).
    await expect(page.getByText("0%", { exact: true })).toHaveCount(0);

    // localStorage에 진행 상황이 저장됐는지 확인.
    const stored = await page.evaluate(() =>
      window.localStorage.getItem("yeobaek-guide"),
    );
    expect(stored ?? "").toContain("checked");
  });
});

test.describe("FAQ", () => {
  test("아코디언을 펼치면 답변이 보인다", async ({ page }) => {
    await page.goto("/faq");

    await expect(
      page.getByRole("heading", { level: 1, name: "자주 묻는 질문" }),
    ).toBeVisible();

    // 첫 질문(details/summary) 펼치기.
    const firstSummary = page
      .getByText("가장 먼저 무엇을 해야 하나요?")
      .first();
    await firstSummary.click();

    // 답변 본문 노출 확인.
    await expect(page.getByText(/112 또는 119에 먼저 신고/)).toBeVisible();
  });
});
