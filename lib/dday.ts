// 유족 길잡이 — 사망일 기준 법정 기한 D-day 계산 (UI와 분리, 단위테스트 대상)

// 사망일 기준 법정 기한 (월 오프셋, eom=말일 기준 여부)
export const DEADLINES: Record<
  string,
  { months: number; eom?: boolean; label: string }
> = {
  "t-report": { months: 1, label: "사망신고" },
  "t-inherit": { months: 3, label: "상속 결정" },
  "t-tax": { months: 6, eom: true, label: "상속세 신고" },
  "t-onestop": { months: 12, eom: true, label: "안심상속" },
  "t-car": { months: 6, eom: true, label: "자동차 이전" },
};

export type DdayBadge = { text: string; urgent: boolean };

/**
 * 사망일(deathDate, YYYY-MM-DD)과 항목 id로 남은 기한 배지를 계산한다.
 * - eom: true면 사망일이 속한 달의 말일을 기준으로 months를 더한다.
 * - urgent는 남은 일수가 7일 이하일 때 true.
 * @param now 기준 '오늘' (테스트 주입용, 기본값은 현재 시각)
 */
export function ddayBadge(
  deathDate: string,
  id: string,
  now: Date = new Date(),
): DdayBadge | null {
  const rule = DEADLINES[id];
  if (!deathDate || !rule) return null;
  const base = new Date(deathDate);
  if (isNaN(base.getTime())) return null;
  const t = rule.eom
    ? new Date(base.getFullYear(), base.getMonth() + 1, 0)
    : new Date(base);
  t.setMonth(t.getMonth() + rule.months);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const dd = Math.ceil((t.getTime() - today.getTime()) / 86_400_000);
  const text = dd > 0 ? `D-${dd}` : dd === 0 ? "D-DAY" : `${-dd}일 지남`;
  return { text, urgent: dd <= 7 };
}
