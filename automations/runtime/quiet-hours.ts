/**
 * What: Quiet-hours check - is "now" inside a client's do-not-disturb window, in their timezone?
 * Why: Texting a customer at 3am burns trust and breaks marketing rules. Reminders that fall in
 *       quiet hours should defer to the next allowed run, not send. This is a real production
 *       safety control, kept tiny and dependency-free.
 * How: Formats the instant to local "HH:MM" via Intl (timezone-aware, no tz library needed) and
 *       tests membership in [start, end), correctly handling overnight windows like 21:00–08:00.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

export interface QuietHours {
  start: string;
  end: string;
}

/** Local "HH:MM" for an ISO instant in the given IANA timezone. */
export function localHHMM(iso: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

/** True if `iso` (in `timezone`) falls within the quiet window. */
export function isQuietHours(iso: string, timezone: string, quiet: QuietHours): boolean {
  const now = toMinutes(localHHMM(iso, timezone));
  const start = toMinutes(quiet.start);
  const end = toMinutes(quiet.end);
  // Same-day window (e.g. 01:00–06:00): inside if start <= now < end.
  if (start <= end) return now >= start && now < end;
  // Overnight window (e.g. 21:00–08:00): inside if now >= start OR now < end.
  return now >= start || now < end;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
