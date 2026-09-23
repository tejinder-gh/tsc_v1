# Fix Plan — The Skill Corner

> Derived from `AUDIT_REPORT.md` (Updated 2026-09-23).  
> Staff-Engineer Ticket Backlog — Phase 2 of the AUTO-FIX Pipeline.

---

## Requirements-of-Record (Phase 3 Gate — Approved 2026-09-23)

1. **Ticket Approvals:** All 8 tickets (`T-008` through `T-015`) approved as refined.
2. **Assumption Confirmations:**
   - **T-008 (Next.js/Sharp CVEs):** Remediate critical CVEs via package updates while maintaining Next.js 16 and Turbopack compatibility.
   - **T-009 (Database TLS):** Enforce strict TLS certificate verification in production, while keeping development/testing functional without external CA bundles.
   - **T-010 (Bundle Splitting):** Code-split `DemonstrationView` with dynamic import to reduce initial JS payload on `/`.
   - **T-011 (WCAG Contrast):** Restore 3:1 contrast on default input borders via `--tsc-line-strong`.
   - **T-012 (Rate Limiting):** Establish production-enforced rate limiting; recognize that process-local in-memory state cannot serve as a multi-instance DDoS barrier.
   - **T-013 (Architecture Request):** Implement a truthful architecture request flow; do not claim automated PDF/document generation.
   - **T-014 (Design Docs):** Synchronize `DESIGN.md` and comment in `app/layout.tsx` with canonical Geist tokens.
   - **T-015 (Production Delivery Gate):** Prove lead delivery with real webhook in production before launch; no secrets in code or logs.
3. **Execution Cadence:** Sequential execution with staff-engineer review, auto-pausing after P0 (`T-008`) and every 5 tickets.

---

## Ticket Backlog (Cycle 2 — September 2026)

| Seq | Ticket | Finding | Sev | Tier | Effort | Depends On |
|---|---|---|---|---|---|---|
| 1 | [T-008](tickets/T-008.md) — Remediate Next.js and Sharp security vulnerabilities | CTO-01 | **P0** | SENIOR | 1.5h | None |
| 2 | [T-009](tickets/T-009.md) — Enforce production TLS certificate verification in DB client | CTO-02 | **P1** | SENIOR | 1.5h | None |
| 3 | [T-010](tickets/T-010.md) — Code-split journey demonstration view and decouple bundle exports | CTO-03 | **P1** | SENIOR | 2.5h | None |
| 4 | [T-011](tickets/T-011.md) — Restore WCAG AA 3:1 contrast on search and journey input borders | DES-01 | **P1** | INTERMEDIATE | 1.5h | None |
| 5 | [T-012](tickets/T-012.md) — Establish production-enforced rate limiting for public submission endpoints | CTO-05 | **P1** | SENIOR + FOUNDER/OPS | 1.0h | Deployment-target decision; before T-013 |
| 6 | [T-015](tickets/T-015.md) — Prove production lead delivery before public launch | CFO-01 / Roadmap | **P0** | FOUNDER/OPS | 0.5h | After T-008; blocks T-013 and public launch |
| 7 | [T-013](tickets/T-013.md) — Add a truthful architecture-request capture flow to the demonstration | CPO-01 / CFO | **P1** | SENIOR | 3.0h | After T-010, T-012, T-015 |
| 8 | [T-014](tickets/T-014.md) — Synchronize DESIGN.md specification with canonical Geist editorial tokens | DES-02 | **P2** | INTERMEDIATE | 1.0h | After T-011 |

### Effort Summary (Cycle 2)
- **Senior Developer Tier:** 8.5 hours (T-008, T-009, T-010, T-013)
- **Senior + Founder/Ops:** 1.0 hour (T-012)
- **Founder / Ops Tier:** 0.5 hour (T-015)
- **Intermediate Developer Tier:** 2.5 hours (T-011, T-014)
- **Total Estimated Effort:** **12.5 hours** across 8 tickets

---

## Deferred Work (Not Ticketed in Cycle 2)

| Item | Reason for Deferral |
|---|---|
| **Populate `sameAs` Business Profiles** | Content/marketing task. Requires live Google Business Profile and Clutch links. |
| **Operator Dashboard DB IAM Integration (CPO-02)** | Architectural migration. The Second Brain database IAM currently runs backend agent tasks; unifying the legacy file-backed dashboard (`app/dashboard/flows`) is scoped for 60-day roadmap after initial client onboarding. |
| **Playwright E2E Test Suite (`TODOS.md`)** | Pre-launch decision remains in effect: browser tests against preview/staging deploy deferred until site is live with verified webhooks. |
| **Automated Checklist Drip Sequence (CFO-03)** | Marketing automation living outside the repo (Zapier/Make/Mailchimp). |

---

## Historical Ledger (Cycle 1 — Completed 2026-08-08)

All 7 tickets from Cycle 1 (`T-001` through `T-007`) were implemented, verified, and accepted into `main`. See [PROGRESS.md](file:///Users/tejindersingh/dev/projects/TheSkillCorner/PROGRESS.md) for full execution logs.
