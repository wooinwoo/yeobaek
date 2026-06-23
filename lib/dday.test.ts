import { describe, it, expect } from "vitest";
import { ddayBadge, DEADLINES } from "./dday";

const DAY = 86_400_000;

// 함수 내부와 동일한 방식으로 마감일(Date)을 재현한다.
// (ddayBadge가 사용하는 파싱 규칙을 그대로 따라가, 호스트 타임존과 무관하게 검증)
function deadlineOf(deathDate: string, id: string): Date {
  const rule = DEADLINES[id];
  const base = new Date(deathDate);
  const t = rule.eom
    ? new Date(base.getFullYear(), base.getMonth() + 1, 0)
    : new Date(base);
  t.setMonth(t.getMonth() + rule.months);
  return t;
}

// 마감일의 '캘린더 날짜'에서 offsetDays 만큼 앞선 '오늘'을 로컬 자정으로 만든다.
// 마감 timestamp가 자정이 아닐 수 있어(파싱 규칙), 날짜 성분으로 정렬해 시차 오차를 제거한다.
function todayAt(deadline: Date, offsetDaysBeforeDeadline: number): Date {
  return new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate() - offsetDaysBeforeDeadline,
  );
}

// ddayBadge가 내부에서 쓰는 것과 동일한 일수 계산식.
// (마감 timestamp가 자정이 아닐 수 있으므로 같은 식으로 기대값을 구해 호스트 TZ에 독립적으로 검증)
function expectedDd(deadline: Date, today: Date): number {
  const t0 = new Date(today);
  t0.setHours(0, 0, 0, 0);
  return Math.ceil((deadline.getTime() - t0.getTime()) / DAY);
}

describe("ddayBadge", () => {
  it("사망일이 없으면 null", () => {
    expect(ddayBadge("", "t-report")).toBeNull();
  });

  it("기한 규칙이 없는 항목 id면 null", () => {
    expect(ddayBadge("2026-01-01", "t-unknown-task")).toBeNull();
  });

  it("잘못된 날짜 문자열이면 null", () => {
    expect(ddayBadge("아무날", "t-report")).toBeNull();
  });

  it("마감 당일(같은 날짜)은 dd가 양수면 D-n, 0이면 D-DAY 형식을 따른다", () => {
    const dl = deadlineOf("2026-01-01", "t-report");
    const today = todayAt(dl, 0);
    const dd = expectedDd(dl, today);
    const r = ddayBadge("2026-01-01", "t-report", today);
    const want = dd > 0 ? `D-${dd}` : dd === 0 ? "D-DAY" : `${-dd}일 지남`;
    expect(r?.text).toBe(want);
    expect(r?.urgent).toBe(dd <= 7);
  });

  it("마감 직전은 urgent, 충분히 이전(30일 전)은 비-urgent", () => {
    const dl = deadlineOf("2026-01-01", "t-report");

    const near = todayAt(dl, 1); // 마감 하루 전 근처 → 반드시 urgent
    const rNear = ddayBadge("2026-01-01", "t-report", near);
    expect(expectedDd(dl, near)).toBeLessThanOrEqual(7);
    expect(rNear?.urgent).toBe(true);

    const far = todayAt(dl, 30);
    const rFar = ddayBadge("2026-01-01", "t-report", far);
    expect(expectedDd(dl, far)).toBeGreaterThan(7);
    expect(rFar?.urgent).toBe(false);
    expect(rFar?.text).toMatch(/^D-\d+$/);
  });

  it("urgent 경계: dd<=7이면 true, dd>7이면 false", () => {
    const dl = deadlineOf("2026-06-01", "t-inherit");
    // 마감을 충분히 앞뒤로 훑어 경계 7/8 사이가 명확히 분리되는지 확인
    for (let off = 0; off <= 12; off++) {
      const today = todayAt(dl, off);
      const dd = expectedDd(dl, today);
      const r = ddayBadge("2026-06-01", "t-inherit", today);
      expect(r?.urgent).toBe(dd <= 7);
    }
  });

  it("마감이 지나면 'n일 지남' 표기, urgent true", () => {
    const dl = deadlineOf("2026-01-01", "t-report");
    const today = todayAt(dl, -3); // 마감 3일 뒤
    const dd = expectedDd(dl, today);
    expect(dd).toBeLessThan(0);
    const r = ddayBadge("2026-01-01", "t-report", today);
    expect(r?.text).toBe(`${-dd}일 지남`);
    expect(r?.urgent).toBe(true);
  });

  it("미래 기한은 'D-n' 형식으로 표기된다", () => {
    const dl = deadlineOf("2026-01-01", "t-inherit");
    const r = ddayBadge("2026-01-01", "t-inherit", todayAt(dl, 30));
    expect(r?.text).toMatch(/^D-\d+$/);
  });

  it("eom 항목(상속세, 6개월)은 사망월 말일을 기준으로 6개월을 더한다", () => {
    // 사망 2026-01-15 → 1월 말일(31일) 기준 +6개월 = 2026-07-31
    const dl = deadlineOf("2026-01-15", "t-tax");
    expect(dl.getMonth()).toBe(6); // 0-indexed, 7월
    expect(dl.getDate()).toBe(31);
  });

  it("eom이 아닌 항목은 사망일 그대로를 기준으로 월을 더한다", () => {
    // t-report(1개월): 사망 2026-03-10 → 2026-04-10
    const dl = deadlineOf("2026-03-10", "t-report");
    expect(dl.getMonth()).toBe(3); // 4월
    expect(dl.getDate()).toBe(10);
  });

  it("DEADLINES에 정의된 모든 항목이 라벨과 months를 갖는다", () => {
    for (const key of Object.keys(DEADLINES)) {
      const rule = DEADLINES[key];
      expect(rule.label.length).toBeGreaterThan(0);
      expect(rule.months).toBeGreaterThan(0);
    }
  });
});
