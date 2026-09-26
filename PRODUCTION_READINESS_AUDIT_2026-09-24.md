# Production Readiness Audit — 2026-09-24

## Verdict

**BLOCKED — do not call the current public release production-ready.** `[HIGH >90%]`

The checked-out application builds and its automated tests pass, but the deployed site is not the reviewed release and has two reproduced public failures: booking is a dead-end fallback and the operator dashboard returns HTTP 500. The automation subsystem also cannot safely run on Vercel while its suppression, conversation, draft, and idempotency state are file-backed.

This report is independent of the existing untracked `AUDIT_REPORT.md`; that file was not used as evidence and was left unchanged.

## Evidence collected

| Check | Result | Boundary |
|---|---|---|
| `npm test` | PASS — 50 files, 450 tests | Unit/integration tests only; no real providers or database |
| `npx tsc --noEmit` | PASS | Static type check |
| `npm run build` | PASS — 91 pages generated | Used local `.env`/`.env.local`, not production configuration |
| `npm run lint` | FAIL — 9 errors, 54 warnings | Release quality gate is red |
| `npm audit --omit=dev --json` | PASS — 0 production dependency vulnerabilities | Registry audit at audit time |
| `https://www.theskillcorner.com/book` | FAIL — serves "Booking calendar is being initialized" | Live, observed 2026-09-24 |
| `https://www.theskillcorner.com/dashboard` | FAIL — HTTP 500 | Live, unauthenticated, observed 2026-09-24 |
| Internal / cron unauthenticated probes | PASS — return 401 | Does not prove valid credential or database behavior |

## Release blockers

### PR-001 — Public deployment does not contain the reviewed booking release

- **Severity:** P0
- **Class:** BROKEN
- **Confidence:** `[HIGH >90%]`
- **Evidence:** Local `HEAD` is `0709f0b feat(booking): replace unconfigured calendar fallback with interactive pre-flight intake`; [`components/BookingEmbed.tsx`](components/BookingEmbed.tsx#L69) replaces the fallback. The live `/book` still renders the exact old text, "Booking calendar is being initialized."
- **Impact:** A high-intent discovery CTA has no working scheduling or intake path on the deployed site.
- **Required release gate:** Deploy the intended commit, then manually submit the booking preflight to a non-customer test destination and verify exactly one accepted CRM record and the expected user success state.

### PR-002 — Operator authentication is unconfigured in production and `/dashboard` crashes

- **Severity:** P0
- **Class:** BROKEN
- **Confidence:** `[HIGH >90%]` for the observed failure; `[MED 50–90%]` that missing Clerk variables are the immediate cause because production logs were unavailable.
- **Evidence:** Live `/sign-in` announces "Clerk API credentials are unconfigured in local development," exposes a “Super Administrator” dev-session screen, and links to `/dashboard`; live `/dashboard` returns HTTP 500. Source falls back to that dev UI whenever Clerk keys are absent, with no production fail-closed branch in [`app/(auth)/sign-in/[[...sign-in]]/page.tsx`](app/(auth)/sign-in/[[...sign-in]]/page.tsx#L11). The dashboard middleware calls Clerk protection at [`middleware.ts`](middleware.ts#L7), which is incompatible with a missing Clerk setup.
- **Impact:** The protected operator surface is unavailable and publicly presents an inaccurate local-development access state.
- **Required release gate:** Configure valid Clerk production keys and `DASHBOARD_OPERATOR_USER_IDS`; change the missing-config production branch to return a neutral unavailable response (never a dev access surface); smoke-test anonymous redirect, allowlisted sign-in, and a signed-in but unallowlisted denial.

### PR-003 — Automation state is file-backed and unsuitable for the Vercel deployment

- **Severity:** P0
- **Class:** BROKEN
- **Confidence:** `[HIGH >90%]`
- **Evidence:** [`automations/server/inbound-stores.ts`](automations/server/inbound-stores.ts#L36) defaults to `./.automations` and constructs JSON file stores for suppression, conversation history, contact mapping, and idempotency. [`automations/core/idempotency.ts`](automations/core/idempotency.ts#L49) writes synchronously to that filesystem; [`automations/core/drafts.ts`](automations/core/drafts.ts#L41) does the same for human-approval drafts. The live host is Vercel.
- **Impact:** On serverless instances this state is not shared or durably writable. Opt-outs and idempotency can disappear or diverge, allowing repeat sends; drafts and conversation data are not production-safe persistence.
- **Required release gate:** Replace all production automation state with a shared durable store, use atomic idempotency claims, migrate or explicitly retire any existing state, and prove duplicate webhook + multi-instance behavior before enabling outbound delivery.

### PR-004 — Customer contact data and message bodies are written to application logs

- **Severity:** P0
- **Class:** BROKEN
- **Confidence:** `[HIGH >90%]`
- **Evidence:** [`automations/inbound/handle.ts`](automations/inbound/handle.ts#L103) logs a contact identifier. [`automations/channels/console.ts`](automations/channels/console.ts#L19) logs recipient, subject, and body. [`automations/runtime/dispatch.ts`](automations/runtime/dispatch.ts#L197) logs approval-draft contact IDs and bodies. [`automations/core/logger.ts`](automations/core/logger.ts#L21) emits all fields directly to stdout/stderr.
- **Impact:** Phone numbers, message content, and potentially health/legal/business-sensitive data can enter Vercel logs. This conflicts with the privacy-safe telemetry policy and makes retention/access controls materially harder.
- **Required release gate:** Implement structured logging with field allowlists/redaction; prohibit recipient addresses, bodies, handoff summaries, provider responses, and raw exceptions from logs; add regression tests for each outbound/inbound log path.

## Must-fix before a public release

### PR-005 — Lint gate fails

- **Severity:** P1
- **Class:** BROKEN
- **Confidence:** `[HIGH >90%]`
- **Evidence:** `npm run lint` exits non-zero with 9 errors and 54 warnings, including unsafe non-null assertions in [`app/dashboard/actions.ts`](app/dashboard/actions.ts#L202) and [`relay/adapters/EmailDeliveryAdapter.ts`](relay/adapters/EmailDeliveryAdapter.ts#L83), plus formatting and unused-import errors.
- **Required release gate:** Resolve errors, decide and enforce an allowed warning budget, and make lint mandatory in CI.

### PR-006 — Newsletter subscribes can claim success when nothing is delivered

- **Severity:** P1
- **Class:** BROKEN
- **Confidence:** `[HIGH >90%]`
- **Evidence:** [`app/api/newsletter/subscribe/route.ts`](app/api/newsletter/subscribe/route.ts#L89) treats the webhook as optional and returns a successful subscriber confirmation even when it is unset or delivery fails (lines 90–126). It also logs a partially masked address at lines 72–87.
- **Impact:** A visitor can consent to a newsletter that has not been stored anywhere; a partial email identifier still enters logs.
- **Required release gate:** In production, fail closed on missing/failed durable subscription delivery, expose a truthful retryable error, and replace email logging with non-identifying delivery metrics.

### PR-007 — Production browser security headers are absent

- **Severity:** P1
- **Class:** MISSING
- **Confidence:** `[HIGH >90%]`
- **Evidence:** Live root headers include HSTS but not `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, or clickjacking protection. No header policy is defined in [`next.config.mjs`](next.config.mjs#L1).
- **Required release gate:** Add a tested, nonce-compatible CSP for Next.js plus `nosniff`, strict referrer policy, permissions policy, and `frame-ancestors`/equivalent clickjacking protection; verify they do not break Clerk, Cal.com, telemetry, or the booking flow.

### PR-008 — Canonical host and sitemap contradict the deployed redirect

- **Severity:** P1
- **Class:** BROKEN
- **Confidence:** `[HIGH >90%]`
- **Evidence:** `https://theskillcorner.com/` redirects to `https://www.theskillcorner.com/`, while the live sitemap's 67 URLs and page canonicals use non-`www`. [`content/site.ts`](content/site.ts#L27) defaults to the non-`www` host.
- **Impact:** Search engines receive contradictory canonical signals; the official host is ambiguous.
- **Required release gate:** Select one canonical host, configure a single-hop redirect toward it, then update `NEXT_PUBLIC_SITE_URL`, sitemap, JSON-LD, canonical metadata, Open Graph URLs, and `robots.txt` consistently.

## Release gates that remain unverified

These are not claims of failure; they lack production evidence.

1. Confirm the production environment holds valid, least-privilege values for lead webhook, Clerk, Second Brain runtime database, Twilio signature verification, relay HMAC, and any enabled email/SMS provider.
2. Apply and verify every database migration, particularly [`db/migrations/006_relay_nonces_and_rate_limits.sql`](db/migrations/006_relay_nonces_and_rate_limits.sql#L1), against the production database. Runtime still attempts `CREATE TABLE` at [`lib/rate-limit.ts`](lib/rate-limit.ts#L70), despite the migration granting only DML permissions at migration lines 24–30.
3. Verify a real scheduled runner exists. `/api/cron` is correctly protected, but this repository has no `vercel.json` cron declaration; platform-side scheduling was not accessible for this audit.
4. Complete authenticated browser smoke tests for dashboard authorization, lead delivery, newsletter persistence, Twilio signature validation, relay replay rejection, and post-deploy error monitoring.
5. Resolve the Next 16 middleware-to-proxy deprecation reported by the otherwise successful production build.

## Strengths verified

- The checked-out code compiles, type-checks, and produces a Next.js production build.
- Public write endpoints bound request bodies and validate schemas; unauthenticated probes of cron and internal IAM APIs returned 401.
- `npm audit --omit=dev` found zero production dependency vulnerabilities at audit time.
- The site labels modeled outcome examples as illustrative rather than client proof.

## Ship decision

| Option | Decision | Trade-off |
|---|---|---|
| Deploy now | **Reject** | Keeps the public site live but preserves a dead booking CTA, a broken dashboard, and unsafe automation foundations. |
| Marketing-only release | **Conditional** | First deploy the current booking fix, correct auth fallback/headers/canonical host, and keep all automations and newsletter capture disabled until their durable-state and privacy gates pass. |
| Full automation release | **Not approved** | Requires PR-003 and PR-004 plus the unverified integration gates; this is the correct path only when real client messaging is in scope. |
