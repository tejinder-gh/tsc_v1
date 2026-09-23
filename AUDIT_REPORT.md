# TheSkillCorner — Auto-Fix Audit, Cycle 3

**Audit date:** 2026-09-23
**Audited revision:** `672fd37` (working tree includes this audit only)
**Method:** independent code, configuration, test, dependency, documentation, and market review. Historical Cycle 2 records are preserved under `docs/audits/archive-2026-09-23/`; their acceptance statements were not accepted as current evidence.

## Executive verdict

**NOT READY for a public operator deployment.** The marketing site can continue to collect interest only after the lead-delivery and abuse-prevention production gates below are verified. The dashboard must not be exposed until T-016, T-017, and T-018 are accepted.

The strongest commercial path is still a focused GTA/Canadian small-business automation diagnostic and paid implementation path. Canadian business AI use is growing, but adoption remains limited: Statistics Canada reports 12.2% of firms used AI to produce goods/services in 2025 and 14.5% planned adoption in the following 12 months. That supports a trust-first, narrow offer—not claims of a fully operating multi-client automation platform. [Statistics Canada](https://www150.statcan.gc.ca/n1/pub/36-28-0001/2026004/article/00002-eng.htm)

**Confidence:** [HIGH >90%] for the code findings and local verification below; [MED 50–90%] for market positioning; [LOW <50%] for live readiness because deployment configuration and production traffic were not available for inspection.

## What was verified

| Area | Result | Evidence / boundary |
|---|---|---|
| Unit/integration tests | PASS | `npm test`: 39 files, 340 tests passed. These are local tests; they do not prove deployment, Clerk, Twilio, database, or webhook integration. |
| TypeScript | PASS | `npx tsc --noEmit` exited 0. |
| Lint | FAIL | `npm run lint`: 9 errors, 62 warnings. Generated `.automations/**` JSON is scanned and two source files have import-order errors. |
| Production build | BLOCKED ENV | `npm run build` reached Next 16.3.6 but Turbopack failed while creating a process/binding a port: `Operation not permitted`. This sandbox restriction is not evidence of a source build defect or a passing build. |
| SCA | BLOCKED ENV | `npm audit --omit=dev` could not resolve `registry.npmjs.org`. Installed versions are `next@16.3.6`, `sharp@0.35.4`; both are newer than the prior Next/Sharp advisories’ fixed versions, but a current advisory scan still must run in a networked environment. |
| Dependency spot check | PASS, bounded | `next@16.3.6` and `sharp@0.35.4` are beyond the versions fixed by the reviewed Next AVIF/Windows and Sharp advisories. [GitHub advisory: Next AVIF](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4), [Next Windows](https://github.com/advisories/GHSA-p293-qw3h-jr36), [Sharp](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c) |

## Findings

### F-01 — Every signed-in Clerk user is an operator

**Severity:** P0 | **Class:** BROKEN | **Ticket:** T-016

`middleware.ts` protects `/dashboard` with `auth.protect()`, which establishes a session only. `app/dashboard/auth-guard.ts` then returns success for every non-null `userId`; it does not check an allowlist, organization membership, role, or permission. All state-changing dashboard actions depend on this guard, including flow changes, draft approval, scheduler ticks, and operational data reads.

The development bypass is also unsafe as written: `ALLOW_DEV_OPERATOR_AUTH=true` succeeds even outside development. Clerk distinguishes authentication from authorization and documents role/permission checks for access control. [Clerk authorization checks](https://clerk.com/docs/guides/secure/authorization-checks)

### F-02 — The team invitation feature does not grant or restrict access

**Severity:** P1 | **Class:** BROKEN | **Ticket:** T-017

`lib/team/store.ts` writes invite tokens, email addresses, and invented roles to ignored local JSON. Redeeming `/invite/[token]` only adds a record to that JSON; it neither creates a Clerk user nor adds the person to a Clerk organization nor informs F-01’s access decision. The public UI claims role-based access control and secure onboarding, but those roles are unenforced. This should be removed for the current single-operator product, not expanded into an unvalidated RBAC system. Clerk Organizations is a later alternative when multi-operator access is a paid, real requirement. [Clerk roles and permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions)

### F-03 — Production database TLS verification is bypassable

**Severity:** P1 | **Class:** BROKEN | **Ticket:** T-018

`resolveDatabaseSslConfig()` reads `SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED=false` before checking production, returning `rejectUnauthorized: false`. `lib/second-brain/admin/lifecycle.ts` unconditionally sets the same insecure setting. The existing unit test explicitly accepts the production override, contradicting Cycle 2’s “strict production TLS” acceptance claim.

### F-04 — Workflow console reports work that it did not execute

**Severity:** P1 | **Class:** BROKEN | **Ticket:** T-019

`triggerSimulatedLead()` never calls `/api/lead` or a webhook but returns `delivered: true`, `status: "delivered"`, and “queued for webhook delivery.” If the database call fails, `triggerSecondBrainContextSearch()` returns `ok: true` and a fabricated registry fallback while exposing the raw database error. The workflow page calls this “live JSON telemetry.” Operator controls must distinguish simulated, executed, and unavailable states.

### F-05 — Dashboard health is derived from static configuration, not telemetry

**Severity:** P1 | **Class:** BROKEN | **Ticket:** T-020

`getDashboardOverviewMetrics()` labels subsystems `operational`/`active` and the UI states “Live Observability,” “Scheduler Healthy,” and “IAM Authorized.” No health probe, successful scheduled run, webhook validation, database query, or authorization verification produces those states. A timestamp generated at render time is not telemetry.

### F-06 — Lead payloads containing PII are logged in clear text

**Severity:** P1 | **Class:** BROKEN | **Ticket:** T-021

`app/api/lead/route.ts` logs honeypot lead payloads and logs the full record when production webhook configuration is missing. Records can contain name, email, company, and notes. This conflicts with the marketing privacy statement’s transit-only/purged-log language and makes third-party runtime logs an unnecessary PII store.

### F-07 — The lint gate is not executable after normal runtime/test activity

**Severity:** P1 | **Class:** BROKEN | **Ticket:** T-022

Biome includes `**` and does not exclude the generated, ignored `.automations/**` store. It consequently emits seven formatter errors for runtime JSON. It also reports import-organization errors in `app/dashboard/drafts/page.tsx` and `app/invite/[token]/invite-card.tsx`. A green test suite cannot compensate for a red CI quality gate.

### F-08 — Some illustrative demonstrations state unverified operational outcomes as facts

**Severity:** P2 | **Class:** SUBOPTIMAL | **Ticket:** T-023

The journey disclaimer says the presentation is illustrative, but demonstration values still say rate limiting is active, delivery is 100%, and a briefing reached 450 operators with a 54% open rate. The repository has no evidence for those performance figures and its lead endpoint has no deployed rate-limit proof. The disclosure needs to travel with modeled metrics, not only appear once at the top of a long interactive sequence.

## Product, design, and commercial review

### CPO / Design

The marketing experience has a credible “diagnose, explain, request architecture” journey. The dashboard is overbuilt for its current business state: it reads like a multi-client SaaS control plane despite file-backed demo clients and unverified integrations. This creates trust debt and distracts from the narrower conversion loop: diagnostic request → scoped build → proof of one customer outcome.

**Recommendation:** maintain the public diagnostic as the product surface; make the dashboard a private single-operator tool until a paying multi-operator workflow justifies Clerk Organizations and durable storage.

### CMO

There is a real adoption window, but not evidence that prospects want a broad “AI platform.” The strongest message is a low-risk, scoped operating bottleneck assessment for practices and local service businesses: connect existing tools, retain approval control, and measure one operational outcome. Competitors also position around starting with a single workflow rather than a platform replacement. [Runway’s automation-service positioning](https://www.businessautomationagency.ca/)

Do not publish fabricated delivery, telemetry, or benchmark claims to compensate for the lack of case-study evidence. Collect consented proof from a pilot instead.

### CFO

Revenue, CAC, traffic, booked-call rate, and delivery margin are **unavailable** in the repository. No credible revenue forecast can be calculated from the audited artifacts. The cheapest validation is one narrow paid pilot with pre/post baseline metrics, rather than more dashboard capability.

### CEO decision

**Decision: CONDITIONAL GO for lead generation; NO-GO for public operator dashboard.**

The security and truthfulness fixes are small enough to complete. After them, the remaining gating work is operational: configure real owner IDs, configure and test a production webhook, add endpoint protection, run a networked SCA scan, and complete a production smoke test with non-customer test data.

## Out-of-repo verification gates

These are not code tickets because a coding agent cannot truthfully complete them without live-account access and explicit authority.

1. Set `DASHBOARD_OPERATOR_USER_IDS` with the owner’s real Clerk user ID; verify an allowed and disallowed account in the deployed environment.
2. Configure `LEAD_WEBHOOK_URL`; submit one test lead to the real receiver, confirm exactly one received record, then delete/mark the test record according to the receiver’s retention process.
3. Configure a Vercel WAF rate-limit rule for `POST /api/lead` (and any other public form/webhook endpoint justified by traffic). Vercel documents WAF custom rules and rate limiting as an immediate deployment-side control. [Vercel rate limiting](https://vercel.com/kb/guide/add-rate-limiting-vercel)
4. Run `npm audit --omit=dev` in a networked, writable environment and attach the output to the release evidence.
5. Run `npm run build` and production smoke tests outside this sandbox; record the deployed commit, URL, UTC time, and result.

## Deliberately deferred

- Clerk Organizations, custom roles, and invite delivery: defer until a real paid multi-operator requirement exists.
- Replacing all 62 non-blocking Biome warnings: defer until after the blocking lint errors; it does not improve first-customer probability.
- Next’s middleware-to-proxy migration: no current failure was observed; schedule before the next Next.js major upgrade, not ahead of the P0/P1 work.
- Broad dashboard redesign: defer; truthful labeling and access control are the smallest correct changes.
