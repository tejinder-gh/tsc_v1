/**
 * What: A Clock abstraction so "now" is injectable.
 * Why: Reminder/dunning/win-back logic is entirely about time. Tests must be able to pin the
 *      current instant to assert that exactly the right steps fire on a given day - and never
 *      depend on the wall clock. Production passes the system clock; tests pass a fixed one.
 * How: Clock is a one-method interface. systemClock reads Date.now; fixedClock returns a
 *      constant, with `at()` to advance it immutably.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import type { IsoTimestamp } from "./types";

export interface Clock {
  now(): IsoTimestamp;
}

export const systemClock: Clock = {
  now: () => new Date().toISOString(),
};

/** A clock frozen at a given instant. `at` returns a new frozen clock (immutable). */
export interface FixedClock extends Clock {
  at(instant: string): FixedClock;
}

export function fixedClock(instant: string): FixedClock {
  const iso = new Date(instant).toISOString();
  return {
    now: () => iso,
    at: (next: string) => fixedClock(next),
  };
}
