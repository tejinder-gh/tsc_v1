# Fix Plan — The Skill Corner

Derived from `AUDIT_REPORT.md` (2026-08-08). Staff-engineer ticket backlog, Phase 2 of the auto-fix pipeline.

## Requirements-of-record (Phase 3 gate — answered 2026-08-08)

1. **Ticket approval:** all 7 tickets approved as scoped (with the two rescopes below applied before implementation started).
2. **Assumption confirmations:**
   - T-001: user wants a real auth system, not Basic Auth — **rescoped to Clerk** (`@clerk/nextjs`), scoped tightly to `/dashboard/*` so its SDK doesn't add to the marketing site's JS bundle. This is the one ticket in this backlog explicitly authorized to add a new dependency.
   - T-005: user flagged the payback-period claim as a legal-wording risk and asked for "projected"/"anticipated" framing, and asked whether the underlying $7,500–$25,000 build / $1,500/month practice figures needed updating. Live 2026 market research (bespoke multi-workflow AI automation agency pricing: project fees commonly $15,000–$50,000, retainers $1,000–$7,000/month for small-to-mid business) shows the existing figures are realistic — conservative, if anything — for this category (the audit's CFO section was comparing against self-serve SaaS tools, a different category). **Dollar figures unchanged; T-005 rescoped to wording-only** ("projected"/"anticipated" register, no guarantee language).
3. **Budget/checkpoint cadence:** all approved tickets in one pass. Per the pipeline's own hard-stop rules, the Phase 4 runner still pauses after any P0 ticket (T-001, T-002) and returns to Phase 5 review before continuing — this is not overridden by the "one pass" choice.

---

## Ticket backlog, in execution order

| Seq | Ticket | Finding | Sev | Tier | Effort | Depends on |
|---|---|---|---|---|---|---|
| 1 | [T-001](tickets/T-001.md) — Auth-gate the operator dashboard | CTO §1A | P0 | SENIOR | 3h | none |
| 2 | [T-002](tickets/T-002.md) — Exclude dashboard from crawling | CTO §1A | P0 | INTERMEDIATE | 0.5h | none |
| 3 | [T-003](tickets/T-003.md) — Resolve high-severity dependency advisories | Phase 0 / CTO §1B | P1 | SENIOR | 2h | none |
| 4 | [T-004](tickets/T-004.md) — Require CRON_SECRET, fail closed | CTO §1C | P1 | INTERMEDIATE | 1h | none |
| 5 | [T-005](tickets/T-005.md) — ROI calculator payback framing (practice segment) | CFO §5B | P1 | SENIOR | 3h | none |
| 6 | [T-006](tickets/T-006.md) — FAQ: agency vs. self-serve SaaS | CPO §2B / CMO §4A | P1 | INTERMEDIATE | 1.5h | none |
| 7 | [T-007](tickets/T-007.md) — Input-border contrast fix | Design (Phase 3) | P2 | INTERMEDIATE | 1.5h | none |

**Total effort:** 8h SENIOR + 4.5h INTERMEDIATE = 12.5h.

All seven are file-independent (no ticket's IN-scope files overlap another's), so "depends on" is none across the board — the sequence above is P-severity order (P0 → P1 → P2), not a hard dependency chain. They can run in this order in one pass, or be checkpointed per the budget answer below.

---

## Deferred — not ticketed, with reason

These came out of the audit but are **not** half-day-sized engineering tickets an implementer model can execute; each needs something only the user can supply (a decision, a credential, or a scoping pass) before it becomes ticketable.

| Finding | Why deferred |
|---|---|
| Connect `LEAD_WEBHOOK_URL` + `NEXT_PUBLIC_CAL_LINK` (Executive Summary #2, CFO §5A) | Requires the user's real Zapier/Make/n8n and Cal.com account values — an ops/deployment task, not code. Already fully documented step-by-step in `LAUNCH_CHECKLIST.md` §1–3. This is the single highest-leverage item in the whole audit — flagging again here so it doesn't get lost behind the ticketed items below it. |
| `sameAs` URLs — Google Business Profile, Clutch, etc. (CMO §4A) | Needs real business profile URLs only the founder has; currently commented-out placeholders in `content/site.ts`. Content/ops task. |
| Auth-gate mechanism upgrade beyond Basic Auth (long-term, follow-on to T-001) | Basic Auth (T-001) is the right-sized fix for today's single-operator, ≤2-demo-client stage. If/when real multi-operator access is needed, this becomes a real session-auth project — track separately when that need is concrete, don't build it speculatively now. |
| Blog/content hub (CMO §4A, roadmap #10) | Multi-week content program, not a half-day ticket. Needs its own planning pass (content calendar, target queries, cadence) before it can be broken into tickets. |
| Bundle-size / `framer-motion` audit (Design, roadmap #8) | Investigative scope is unbounded until someone determines whether `framer-motion` earns its weight — that's a spike, not a fix. Ticket the spike's findings once they exist. |
| Client-facing automation-status portal (CPO §2C) | Explicit **do-not-build-now** per CEO synthesis — premature with zero real (non-demo) clients on the engine. Revisit once ≥2 real clients exist. |
| Playwright E2E suite (`TODOS.md`) | Already deferred by prior explicit decision, blocked on the site being live (which depends on the `LEAD_WEBHOOK_URL` item above). Re-confirming the existing call, not re-opening it. |
| Second lead magnet / nurture sequence (CFO §5C) | Needs a business decision on offer content and positioning before it's an engineering task; the nurture sequence itself lives outside this repo (Zapier/Make) and wasn't auditable here. |

---

## PHASE 3 GATE — questions for the user

Per the pipeline, no implementation starts until you answer these three:

1. **Approve or strike tickets.** All 7 are proposed for this run. Approve all, or list which to strike/hold.
2. **Confirm the assumptions the audit made** (full register in `AUDIT_REPORT.md` CEO §5) — most relevant to this ticket set:
   - T-001 assumes Basic Auth is the right-sized fix for now (single operator, demo-only clients) rather than full session auth. Confirm, or say if real client onboarding is close enough that this should be bigger.
   - T-005 assumes the practice pricing figures in `content/site.ts` ($7,500–$25,000 + $1,500/mo) are current and safe to reference in new payback-period copy. Confirm these are still accurate.
3. **Budget: how many tickets before you want to check in again?** All 7 in one pass (the pipeline auto-pauses after 5 accepted tickets or any P0 regardless), a checkpoint after the two P0s land, or one ticket at a time.
