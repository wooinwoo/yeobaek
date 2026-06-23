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

const MS_PER_DAY = 86_400_000; // 24*60*60*1000
const URGENT_THRESHOLD_DAYS = 7; // 남은 일수가 7일 이하면 긴급 표시

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
  // eom(말일 기준): 기준월 + months 이후 '그 달의 말일'을 잡는다.
  //   day=0 + (month +1) → 해당 월의 말일이 되어, setMonth가 31일 등에서
  //   다음 달로 넘어가던 오버플로우 버그를 피한다.
  // eom 아님: 사망일 그대로 month만 더한다(연/월 캐리는 Date가 처리).
  const t = rule.eom
    ? new Date(base.getFullYear(), base.getMonth() + rule.months + 1, 0)
    : new Date(base.getFullYear(), base.getMonth() + rule.months, base.getDate());
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const dd = Math.ceil((t.getTime() - today.getTime()) / MS_PER_DAY);
  const text = dd > 0 ? `D-${dd}` : dd === 0 ? "D-DAY" : `${-dd}일 지남`;
  return { text, urgent: dd <= URGENT_THRESHOLD_DAYS };
}
