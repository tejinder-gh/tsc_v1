# TheSkillCorner — Cycle 3 Fix Plan

**Status:** COMPLETED — Tickets T-016 through T-023 implemented and committed in sequence. Pending owner-run production gates.

## Objective

Make the operator surface access-controlled and truthful, remove the unsupported team-invite claim, restore the lint gate, and reduce avoidable lead PII exposure without expanding the product into multi-tenant SaaS.

## Sequence

| Order | Ticket | Tier | Estimate | Why this order |
|---:|---|---|---:|---|
| 1 | T-016 | Senior | 3.0h | Blocks unauthorized dashboard mutation and establishes the authorization invariant. |
| 2 | T-017 | Senior | 3.0h | Removes the public feature that falsely implies it grants that authorization. |
| 3 | T-018 | Senior | 3.0h | Removes TLS downgrade paths before private API/database deployment. |
| 4 | T-019 | Senior | 3.0h | Makes manual execution outcomes truthful. |
| 5 | T-020 | Intermediate | 2.0h | Makes dashboard health states truthful after execution semantics are fixed. |
| 6 | T-021 | Senior | 2.0h | Minimizes PII exposure in server logs. |
| 7 | T-022 | Intermediate | 1.5h | Restores a reliable lint gate. |
| 8 | T-023 | Intermediate | 2.0h | Makes modeled journey metrics visibly illustrative. |

**Total estimated effort:** 19.5 senior-equivalent hours. This fits a small hardening cycle; it does not justify delaying job-search priorities or building new agency infrastructure.

## Dependency graph

```text
T-016 ──> T-017
T-016 ──> T-019 ──> T-020
T-018 (independent)
T-021 (independent)
T-022 (independent)
T-023 (independent)
```

## Implementation protocol for Gemini

1. Work one ticket at a time, in the listed sequence. Read the full ticket and its cited finding first.
2. Inspect every scoped file before editing. Do not broaden scope or add dependencies.
3. Use the exact acceptance criteria and test plan. Run `npm test`, `npm run lint`, and `npx tsc --noEmit` after each ticket when practical; report build separately because this environment blocks its child process/port binding.
4. Do not claim production verification from local tests. Do not configure Clerk, Vercel, webhook, database, or send a lead without the owner’s explicit, action-time approval.
5. If an assumption is false, stop that ticket, set it to BLOCKED, and report the discrepancy. Do not invent a replacement architecture.
6. Preserve historical Cycle 2 documents in `docs/audits/archive-2026-09-23/` and `tickets/archive-2026-09-23/`. They are reference only, not proof of current acceptance.

## Release gate

All T-016 through T-023 must be accepted locally, followed by the five owner-run verification gates in `AUDIT_REPORT.md`. Until then, the dashboard remains private and production readiness is **not verified**.
