import { test, expect } from "@playwright/test";

// 커뮤니티 — 시드된 글 목록 렌더 + 댓글 토글 + 실제 글 작성(sqlite 기록) 검증.

test.describe("커뮤니티", () => {
  test("시드된 글 목록이 렌더된다", async ({ page }) => {
    await page.goto("/community");

    await expect(
      page.getByRole("heading", { level: 1, name: "마음을 나누는 공간" }),
    ).toBeVisible();

    // 시드 글 제목 중 하나가 보인다.
    await expect(
      page.getByRole("heading", { name: "오늘 문득 너무 보고 싶네요" }),
    ).toBeVisible();
  });

  test("답변(댓글)을 펼치면 시드 댓글이 보인다", async ({ page }) => {
    await page.goto("/community");

    // 한정승인 글 카드 안에서 답변 버튼을 펼친다.
    const article = page
      .getByRole("article")
      .filter({ hasText: "한정승인 절차가 너무 복잡하게" });
    await article.getByRole("button", { name: /답변/ }).click();

    // 시드 댓글 본문 노출(아코디언 로드 후).
    await expect(
      page.getByText(/법률구조공단 무료 상담부터 받아보세요/),
    ).toBeVisible();
  });

  test("글을 작성하면 목록 최상단에 반영된다(실제 DB 기록)", async ({ page }) => {
    await page.goto("/community");

    const unique = `E2E 스모크 글 ${Date.now()}`;

    // 작성 폼 열기.
    await page.getByRole("button", { name: /당신의 이야기를 들려주세요/ }).click();

    await page.getByLabel("제목").fill(unique);
    await page
      .getByLabel("내용")
      .fill("이 글은 E2E 스모크 테스트가 실제 sqlite에 기록하는 항목입니다.");
    await page.getByRole("button", { name: "올리기" }).click();

    // 새 글이 목록에 노출.
    await expect(page.getByRole("heading", { name: unique })).toBeVisible();

    // 새로고침 후에도 남아 있어 실제 영속 기록임을 확인.
    await page.reload();
    await expect(page.getByRole("heading", { name: unique })).toBeVisible();
  });
});
