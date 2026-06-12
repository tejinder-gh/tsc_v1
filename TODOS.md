# TODOS

Deferred work with context. Groom at the 60-day tripwire review (see
`~/.gstack/projects/TheSkillCorner/admin-main-design-20260612-005022.md`).

## P3 — Playwright E2E suite for the five lead surfaces

- **What:** Browser tests that fill and submit each lead surface (contact form,
  checklist form, exit-intent modal, quick widget, ROI calculator capture) against a
  preview deploy, asserting the API accepts the payload and the success state renders.
- **Why:** Verification today is a one-time manual five-form matrix at launch
  (LAUNCH_CHECKLIST.md §3). Exit-intent timing and sessionStorage segment logic are
  the kind of behavior that silently breaks in refactors; an E2E suite re-verifies on
  every change.
- **Pros:** Permanent regression coverage for every capture surface; completes the test
  pyramid (vitest covers schemas/ROI only).
- **Cons:** Playwright setup + CI wiring; some flakiness risk around exit-intent
  trigger simulation.
- **Context:** No browser tests exist. Playwright is the house E2E framework. The
  production chain is monitored by the weekly synthetic test lead (CEO review Issue 1A),
  so this covers pre-deploy regressions, not production health. Start with
  `components/forms/` and `components/capture/`; the API contract is `lib/schemas.ts`.
- **Effort:** M (human) → S with CC
- **Priority:** P3
- **Depends on / blocked by:** Site launched (env vars + webhook live on a preview/staging
  target); honeypot field (CEO review Issue 4A) landed first so tests include its
  negative case.

*(Added 2026-06-12 by /plan-ceo-review — deferred from launch scope by explicit decision.)*
