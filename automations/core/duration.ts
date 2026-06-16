/**
 * What: A tiny relative-duration type and helpers to add/compare durations against ISO times.
 * Why: Every "ladder" automation (reminders, win-back, dunning) is defined by offsets like
 *      "24 hours before" or "3 days after". Expressing those as data - not code - is what lets
 *      one engine serve every client; the offsets live in config.
 * How: Duration is a plain object of optional units; toMillis sums them (supporting negative
 *      values for "before" offsets). All math is pure and timezone-agnostic (UTC instants).
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

/** A signed, relative span. Negative units mean "before" the anchor. */
export interface Duration {
  minutes?: number;
  hours?: number;
  days?: number;
}

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/** Convert a Duration to milliseconds (may be negative). */
export function toMillis(d: Duration): number {
  return (d.minutes ?? 0) * MIN + (d.hours ?? 0) * HOUR + (d.days ?? 0) * DAY;
}

/** Return a new ISO timestamp offset from `anchor` by `d`. Pure; does not mutate. */
export function addDuration(anchor: IsoLike, d: Duration): string {
  return new Date(new Date(anchor).getTime() + toMillis(d)).toISOString();
}

/** Whole milliseconds between two ISO instants (b - a). */
export function diffMillis(a: IsoLike, b: IsoLike): number {
  return new Date(b).getTime() - new Date(a).getTime();
}

/** Human label for a Duration, used in logs and reporting tags (e.g. "-24h", "3d"). */
export function label(d: Duration): string {
  const parts: string[] = [];
  if (d.days) parts.push(`${d.days}d`);
  if (d.hours) parts.push(`${d.hours}h`);
  if (d.minutes) parts.push(`${d.minutes}m`);
  return parts.length > 0 ? parts.join("") : "0";
}

type IsoLike = string | number | Date;
