# Fix Plan — The Skill Corner

> Derived from `AUDIT_REPORT.md` (Updated 2026-09-23).  
> Staff-Engineer Ticket Backlog — Phase 2 of the AUTO-FIX Pipeline.

---

## Requirements-of-Record (Phase 3 Gate — Awaiting User Approval)

*To be recorded upon user response to Phase 3 Gate questions below.*

1. **Ticket Approvals:** Pending user confirmation.
2. **Assumption Confirmations:**
   - **Ops Prerequisite:** `LEAD_WEBHOOK_URL` and `NEXT_PUBLIC_CAL_LINK` in `.env` require the founder's real Zapier/Make and Cal.com production endpoints. Code handles missing keys safely (503 in prod), but real URLs are required for lead delivery.
   - **T-008 (Dependencies):** Updating `next` to >= 16.3.3 resolves critical RCE CVEs without breaking Next.js App Router or Turbopack APIs.
   - **T-009 (Database TLS):** Enforcing `rejectUnauthorized: true` on PostgreSQL connections in production matches cloud database standards (Neon, RDS, Supabase).
   - **T-010 (Bundle Splitting):** Code-splitting `DemonstrationView` lazy-loads 130KB+ of scenario configs until the user reaches the solution stage.
3. **Budget & Checkpoint Cadence:** Pending user selection (single-pass or pause after P0/P1 milestones).

---

## Ticket Backlog (Cycle 2 — September 2026)

| Seq | Ticket | Finding | Sev | Tier | Effort | Depends On |
|---|---|---|---|---|---|---|
| 1 | [T-008](tickets/T-008.md) — Remediate Next.js and Sharp security vulnerabilities | CTO-01 | **P0** | SENIOR | 1.5h | None |
| 2 | [T-009](tickets/T-009.md) — Enforce production TLS certificate verification in DB client | CTO-02 | **P1** | SENIOR | 1.5h | None |
| 3 | [T-010](tickets/T-010.md) — Code-split journey demonstration view and decouple bundle exports | CTO-03 | **P1** | SENIOR | 2.5h | None |
| 4 | [T-011](tickets/T-011.md) — Restore WCAG AA 3:1 contrast on search and journey input borders | DES-01 | **P1** | INTERMEDIATE | 1.5h | None |
| 5 | [T-012](tickets/T-012.md) — Add IP-based sliding-window rate limiting to public APIs | CTO-05 | **P1** | SENIOR | 2.5h | None |
| 6 | [T-013](tickets/T-013.md) — Add blueprint capture form to journey demonstration completion | CPO-01 / CFO | **P1** | SENIOR | 3.0h | T-010 |
| 7 | [T-014](tickets/T-014.md) — Synchronize DESIGN.md specification with canonical Geist tokens | DES-02 | **P2** | INTERMEDIATE | 1.0h | None |

### Effort Summary (Cycle 2)
- **Senior Developer Tier:** 11.0 hours (5 tickets: T-008, T-009, T-010, T-012, T-013)
- **Intermediate Developer Tier:** 2.5 hours (2 tickets: T-011, T-014)
- **Total Estimated Effort:** **13.5 hours** across 7 tickets

---

## Deferred Work (Not Ticketed in Cycle 2)

| Item | Reason for Deferral |
|---|---|
| **Configure Production Webhook (`LEAD_WEBHOOK_URL`)** | Ops / environment task. Requires the founder's real Zapier/Make webhook URL and Cal.com link outside code. Steps documented in `LAUNCH_CHECKLIST.md`. |
| **Populate `sameAs` Business Profiles** | Content/marketing task. Requires live Google Business Profile and Clutch links. |
| **Operator Dashboard DB IAM Integration (CPO-02)** | Architectural migration. The Second Brain database IAM currently runs backend agent tasks; unifying the legacy file-backed dashboard (`app/dashboard/flows`) is scoped for 60-day roadmap after initial client onboarding. |
| **Playwright E2E Test Suite (`TODOS.md`)** | Pre-launch decision remains in effect: browser tests against preview/staging deploy deferred until site is live with verified webhooks. |
| **Automated Checklist Drip Sequence (CFO-03)** | Marketing automation living outside the repo (Zapier/Make/Mailchimp). |

---

## Historical Ledger (Cycle 1 — Completed 2026-08-08)

All 7 tickets from Cycle 1 (`T-001` through `T-007`) were implemented, verified, and accepted into `main`. See [PROGRESS.md](file:///Users/tejindersingh/dev/projects/TheSkillCorner/PROGRESS.md) for full execution logs.

---

## PHASE 3 GATE — Questions for the User (Hard Stop)

Before any small model implementation begins, the AUTO-FIX protocol requires your explicit answers to these three gates:

1. **Approve or Strike Tickets:**
   - Proposing all 7 tickets (`T-008` through `T-014`). Do you approve all 7, or would you like to strike, modify, or re-prioritize any?
2. **Confirm Critical Assumptions:**
   - **T-008:** Confirm proceeding with Next.js patch update to resolve the image optimization RCE CVE.
   - **T-009:** Confirm enforcing strict TLS certificate verification in production DB client.
   - **T-010 & T-013:** Confirm adding dynamic code-splitting and an "Email Me This Blueprint" capture form to the interactive demonstration.
3. **Execution Budget & Checkpoint Cadence:**
   - How would you like to execute Phase 4 implementation?
     - **Option A (Recommended):** Run all approved tickets in order with automatic pause and review after P0 (`T-008`) and every 5 completed tickets.
     - **Option B:** Checkpoint after each ticket individually for review.
     - **Option C:** Execute only P0/P1 tickets (T-008 through T-013) and hold P2 polish (T-014).
