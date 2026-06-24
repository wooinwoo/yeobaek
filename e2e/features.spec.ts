import { test, expect } from "@playwright/test";

// 신규 기능 플로우 스모크 — smoke.spec.ts(검색 진입/폼 제출, FAQ 펼침, 길잡이 진행률)와
// 겹치지 않는 동작만 검증한다. 하이라이트(mark)·자동완성·상속세 계산기 breakdown 중심.

test.describe("통합 검색 — 하이라이트와 자동완성", () => {
  test("결과의 일치 부분이 mark로 강조된다", async ({ page }) => {
    await page.goto("/search?q=상속");

    // 결과 영역이 준비될 때까지 대기(status 노출).
    await expect(page.getByRole("status")).toContainText(/검색 결과/);

    // 결과 링크 안의 <mark>만 본다. 자동완성 리스트박스(hidden)에도 mark가 있어 스코프를 좁힌다.
    const resultMark = page.getByRole("link").locator("mark").first();
    await expect(resultMark).toBeVisible();
    await expect(resultMark).toContainText("상속");
  });

  test("검색창에 입력하면 자동완성 제안이 뜨고 선택하면 해당 페이지로 이동한다", async ({
    page,
  }) => {
    await page.goto("/search");

    const input = page.getByRole("combobox", { name: "사이트 통합 검색" });
    await input.fill("상속세");

    // 콤보박스가 펼쳐지고 제안 리스트박스가 노출된다.
    await expect(input).toHaveAttribute("aria-expanded", "true");
    const listbox = page.getByRole("listbox", { name: "검색 제안" });
    await expect(listbox).toBeVisible();

    // 첫 제안(option)을 선택하면 라우팅된다(검색 외 페이지로 이동 가능).
    const firstOption = listbox.getByRole("option").first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    // 제안 선택 후 URL이 바뀌어 어딘가로 이동했다(콤보박스 동작 확인).
    await expect(page).not.toHaveURL(/\/search$/);
  });
});

test.describe("상속세 계산기", () => {
  test("재산·배우자 입력에 따라 예상 세액과 계산 과정(breakdown)이 노출된다", async ({
    page,
  }) => {
    await page.goto("/inheritance-tax");

    await expect(
      page.getByRole("heading", { level: 1, name: /상속세/ }),
    ).toBeVisible();

    // 재산 슬라이더(첫 번째 range)를 최대치(50억)로, 배우자 '없음'으로 설정해 과세표준이 생기게 한다.
    const assetSlider = page.getByRole("slider").first();
    // range input은 fill로 값 주입 + input 이벤트 발생.
    await assetSlider.fill("50");
    await page.getByRole("button", { name: "없음" }).click();

    // 결과 카드 — 예상 상속세 라벨(정확 일치, 안내 문단의 부분 매칭 제외).
    await expect(page.getByText("예상 상속세", { exact: true })).toBeVisible();

    // 계산 과정(breakdown) 섹션 — 과세표준 항목이 노출된다.
    await expect(
      page.getByRole("heading", { name: "계산 과정 살펴보기" }),
    ).toBeVisible();

    // breakdown은 페이지 내 유일한 <dl>. 표 헤더의 '과세표준'(th)과 충돌을 피해 dl로 스코프.
    const dl = page.locator("dl");
    await expect(dl.getByText("과세표준", { exact: true })).toBeVisible();

    // 과세표준이 양수면 '적용 세율'·'산출세액' 행이 렌더된다.
    await expect(dl.getByText("적용 세율", { exact: true })).toBeVisible();
    await expect(dl.getByText("산출세액", { exact: true })).toBeVisible();

    // 세율 구간표 — 현재 과세표준이 속한 구간이 aria-current로 강조된다.
    await expect(
      page.getByRole("heading", { name: "상속세 세율 구간" }),
    ).toBeVisible();
    await expect(page.locator("tr[aria-current='true']")).toHaveCount(1);
  });

  test("배우자가 있고 재산이 적으면 낼 세금이 없을 수 있다고 안내한다", async ({
    page,
  }) => {
    await page.goto("/inheritance-tax");

    // 배우자 '있음'(기본) + 재산을 낮춰(예: 3억) 과세표준 0 유도.
    const assetSlider = page.getByRole("slider").first();
    await assetSlider.fill("3");
    await page.getByRole("button", { name: "있음" }).click();

    // 공제가 순재산보다 커서 상속세가 없을 가능성 안내가 노출.
    await expect(
      page.getByText(/낼 상속세가 없을 가능성/),
    ).toBeVisible();
  });
});

test.describe("FAQ — 그룹별 아코디언", () => {
  test("'장례 직후' 외 그룹 질문을 펼치면 답변이 보인다", async ({ page }) => {
    await page.goto("/faq");

    // smoke.spec과 겹치지 않는 다른 질문(사망진단서 발급 부수)을 펼친다.
    const summary = page
      .getByText("사망진단서는 몇 부나 발급받아야 하나요?")
      .first();
    await summary.click();

    // 답변 본문(7부~10부 안내)이 노출된다.
    await expect(page.getByText(/7부에서 10부/)).toBeVisible();
  });
});
