/**
 * What: A fixed demo instant and relative-time helpers used by the example client datasets.
 * Why: The demo and tests must be deterministic - "what fires today" can't depend on the wall
 *       clock. Anchoring sample appointments/invoices to a known NOW lets the reminder math produce
 *       the same, explainable output every run.
 * How: DEMO_NOW is a constant ISO instant; rel() offsets from it. H/D are hour/day milliseconds.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

export const DEMO_NOW = "2026-06-15T15:00:00.000Z";

export const H = 3_600_000;
export const D = 86_400_000;

/** ISO timestamp offset from DEMO_NOW by `ms` (use H/D and signs for before/after). */
export function rel(ms: number): string {
  return new Date(Date.parse(DEMO_NOW) + ms).toISOString();
}
