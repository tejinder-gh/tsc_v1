# Gemini Implementation Plan — Production Readiness

**Project:** The Skill Corner
**Prepared:** 2026-09-25
**Source evidence:** `PRODUCTION_READINESS_AUDIT_2026-09-24.md`, current repository inspection, and current Git history.
**Status:** Planning only. No authorization is granted to deploy, modify hosted configuration, apply database migrations, send messages, or contact leads/customers.

## 1. Executive decision

### Recommended path: two explicit releases

| Path | Scope | Decision | Estimated engineering effort | What it buys |
|---|---|---:|---:|---|
| **A. Marketing-site release** | Booking intake, truthful lead/newsletter behavior, auth fail-closed behavior, headers, canonical host, lint, deploy verification | **Do first** | 14–22 hours plus owner deployment/configuration time | A credible public acquisition site without enabling unsafe customer automations. |
| **B. Automation productionization** | Durable operational state, privacy/retention controls, scheduler, provider dry-runs, outbound enablement | **Separate approval required** | 35–60 hours plus data-policy and provider work | Safe operation of real SMS/email automations for customers. |

**Do not combine A and B into one Gemini run.** The current automation implementation writes opt-outs, idempotency keys, conversations, contacts, and drafts to local JSON files. That is not safe on Vercel/serverless and must not be treated as a normal polish task.

> [GENUINE DISAGREEMENT] — “Production ready” cannot mean “all advertised automation features are live” until Path B is complete. Shipping Path A first is the smallest commercially useful route: it restores booking and lead capture without exposing customers to duplicate messages, lost opt-outs, or PII-rich logs.

## 2. Verified current baseline

### Already implemented locally; do not redo

These commits exist in the checked-out repository. Gemini must inspect them and preserve them, not recreate their tickets from old reports.

| Commit | Result | Verification still required |
|---|---|---|
| `0709f0b` | Booking fallback replaced by pre-flight intake | Deploy and make one owner-controlled test submission. |
| `59871ec` | Runtime rate-limit DDL removed | Apply/verify migration `006` in the correct production database. |
| `8b815a0` | Neon pooler settings and TLS tests added | Confirm actual production URL uses the pooler and TLS remains strict. |
| `951ecbc` | Footer expansion | Normal regression check only. |
| `2bfe644`, `d0ba45f`, `5c94649` | Error boundaries, capture modal, pricing work | Preserve; no scope expansion. |
| `app/sitemap.ts` | `lastModified` is already present | Do not add a duplicate sitemap ticket. |

### Still true from live verification

- The deployed `/book` served the **old** “Booking calendar is being initialized” fallback.
- The deployed `/sign-in` showed a local-development / “Super Administrator” screen.
- The deployed `/dashboard` returned HTTP 500 to an anonymous request.
- The public host redirects apex `theskillcorner.com` to `www.theskillcorner.com`, while sitemap/canonical data uses non-`www` URLs.
- Live root security headers include HSTS but not CSP, `nosniff`, referrer policy, permissions policy, or clickjacking protection.

### Baseline acceptance commands

Run these before editing and save their output in the implementation report. Do not treat older green results as current.

```bash
git status --short
git log --oneline -12
npm test
npx tsc --noEmit
npm run lint -- --max-diagnostics=200
npm run build
npm audit --omit=dev --json
git diff --check
```

Expected current reality: tests, TypeScript, build, and production dependency audit pass; lint needs remediation. If that differs, stop and report the delta before changing scope.

## 3. Non-negotiable Gemini operating contract

### Read before changing code

1. `agents.md`, `DESIGN.md`, `ROUTES.md`, and this plan.
2. The current Next.js 16 documentation in `node_modules/next/dist/docs/` for every Next API or convention touched. In particular, inspect the current `middleware` → `proxy` migration guidance before renaming any edge file.
3. Every file named in the selected ticket, its existing tests, and its direct callers/importers.

### Preserve and do not alter

- Existing unrelated worktree changes, including `components/home/HowWeDecide.tsx` and untracked audit/old-plan artifacts.
- `.env`, `.env.local`, production credentials, hosted Vercel/Clerk/Neon/Twilio/CRM configuration, and customer data.
- Existing routes, API handlers, dynamic slugs, redirects, pricing, footer, booking, or UI work unless that exact file is inside the approved ticket.
- `FIX_PLAN.md`, `PROGRESS.md`, and legacy `tickets/T-###.md`. This plan is deliberately separate because those files include older product-elevation work and do not represent the current production gate.

### Forbidden actions

- Do not send email/SMS, submit a real lead/newsletter form, call real CRM webhooks, enable a provider, apply a migration, deploy, buy a service, or rotate/reveal credentials.
- Do not weaken TLS, authentication, `DASHBOARD_OPERATOR_USER_IDS`, rate limits, or replay protection to make a test pass.
- Do not use `biome --write .`, mass-format the repository, delete broad directories, or rewrite unrelated code to silence lint.
- Do not claim a provider integration, Vercel Cron, error monitor, analytics, or session replay is live without a live owner-run check.

### Implementation discipline

- One ticket per branch/commit. Stop after every ticket for review.
- Touch only ticket `IN` files. If the real code invalidates the ticket's premise, stop with `BLOCKED`; do not improvise.
- Use npm commands, not Bun commands; this repository's documented test command is `npm test`.
- Any route/API handler/redirect change requires `ROUTES.md` to be updated in the same commit.
- Every behavioral change requires a focused test plus the full test suite.
- Keep production errors generic to clients and diagnostic details out of logs.

## 4. Dependencies and execution order

```text
PATH A — marketing release

A0 baseline + worktree isolation
 │
 ├── A1 production auth fail-closed ──┐
 ├── A2 PII-safe logging ─────────────┼── A6 lint + CI gate ── A7 owner deploy + smoke
 ├── A3 newsletter delivery truth ────┤
 ├── A4 security headers ─────────────┤
 └── A5 canonical-host alignment ─────┘

PATH B — automation release (requires separate approval)

B0 data-policy decision
 │
B1 durable-state schema/contract
 │
B2 repository implementations + atomic idempotency
 │
B3 replace file-store call sites + integration tests
 │
B4 scheduler and provider dry-run verification
 │
B5 owner-approved outbound enablement
```

## 5. Path A tickets — safe public marketing release

### A0 — Freeze the correct release candidate

**Assigned tier:** Senior / release owner
**Effort:** 0.5–1 hour
**Sequence:** first

**What**

Create a clean, reviewable branch from the intended release commit. Record the current `HEAD`, all pre-existing dirty files, and the deployed production behavior. Do not absorb unrelated worktree changes.

**Why**

The live site is behind local `HEAD`. Without a known release candidate, a later deployment cannot be verified against the code Gemini reviewed.

**IN**

- Git metadata and a new implementation report only, if a report is requested.

**OUT**

- Application code, environment files, external systems, and existing plan/ticket files.

**Acceptance criteria**

- [ ] A release-candidate commit SHA is recorded.
- [ ] Pre-existing dirty paths are listed and excluded from the release unless their owner explicitly includes them.
- [ ] Live `/book`, `/sign-in`, and `/dashboard` status/text are captured as before-state evidence.
- [ ] No remote push, deployment, or external mutation is performed by Gemini.

**Test / verification**

```bash
git status --short
git rev-parse HEAD
curl -sS -o /dev/null -w '%{http_code}\n' https://www.theskillcorner.com/book
curl -sS -o /dev/null -w '%{http_code}\n' https://www.theskillcorner.com/dashboard
```

**Rollback**

No code change; discard only the local implementation-report artifact if it is unwanted.

---

### A1 — Fail closed when production Clerk configuration is absent

**Source finding:** PR-002
**Assigned tier:** Senior
**Effort:** 3–4 hours
**Sequence:** after A0; independent of A2–A5

**What**

Make missing Clerk configuration a deliberate, safe production state:

1. In production, `/dashboard(.*)` must return a generic 503/unavailable response or a safe static unavailable page if Clerk keys are absent; it must never render the dashboard shell, a dev session, or a “Super Administrator” claim.
2. In production, `/sign-in` with missing Clerk configuration must show a neutral “operator access temporarily unavailable” message without a dashboard-entry link and without exposing local development details.
3. When both Clerk keys exist, preserve Clerk sign-in and middleware protection.
4. Keep the existing `DASHBOARD_OPERATOR_USER_IDS` allowlist as the authorization layer. An authenticated Clerk user who is not allowlisted must remain denied.
5. Permit the existing development bypass only when **both** `NODE_ENV === "development"` and `ALLOW_DEV_OPERATOR_AUTH === "true"`; no other environment may render it.
6. Migrate from deprecated `middleware.ts` to the Next 16-supported `proxy` convention only after reading the installed documentation. If the migration changes matcher behavior, update `ROUTES.md`.

**Why**

The live deployment publicly advertises a local privileged session and returns 500 for the protected dashboard. Authentication must fail closed and must not depend on an accidental environment state.

**IN**

- `middleware.ts` and/or the Next 16 replacement `proxy.ts`
- `app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- `app/dashboard/layout.tsx`
- `app/dashboard/auth-guard.ts`
- New focused tests under `app/dashboard/` or `lib/` only if a small pure config helper is introduced
- `ROUTES.md` only if route behavior/matcher documentation changes

**OUT**

- Clerk dashboard settings and production keys — owner action only.
- Dashboard business features, server actions, client authorization design, and unrelated marketing UI.

**Acceptance criteria**

- [ ] In `production` with both Clerk keys absent, requesting a dashboard URL does not return 500 and never renders dashboard HTML.
- [ ] In `production` with keys absent, `/sign-in` contains none of: `Dev Environment Session`, `Super Administrator`, `theskillcorner:local`, `operator@local`, or a link that enters `/dashboard`.
- [ ] In `development` with explicit `ALLOW_DEV_OPERATOR_AUTH=true`, the local behavior remains available for tests only.
- [ ] In `development` without that explicit opt-in, dashboard access is denied.
- [ ] With a Clerk session, `assertOperatorAuthenticated` still rejects a user absent from `DASHBOARD_OPERATOR_USER_IDS`.
- [ ] Build passes without the Next middleware deprecation warning if the migration is performed.

**Focused test plan**

```bash
npm test -- app/dashboard/actions.test.ts
npx tsc --noEmit
npm run lint -- --max-diagnostics=200
npm run build
```

Add environment-matrix tests that do not require real Clerk keys. Do not test with actual identities.

**Rollback**

Revert the ticket commit. If deployed and Clerk is misconfigured, the safe unavailable response is preferable to reviving a development-access surface.

**Blocked protocol**

If the installed Clerk/Next API cannot conditionally initialize safely at the proxy boundary, stop. Report the exact framework constraint and propose either a platform-level route protection solution or a dedicated static unavailable route; do not remove protection.

---

### A2 — Redact automation and webhook logs

**Source finding:** PR-004
**Assigned tier:** Senior
**Effort:** 3–4 hours
**Sequence:** after A0; complete before any automation provider is enabled

**What**

Replace PII-bearing operational logs with an allowlisted event schema. The safe event payload may include timestamp, level, event name, client configuration ID, automation ID, channel, delivery outcome, HTTP status class, and an opaque correlation ID. It must not include a phone/email/address, message/subject/body, inbound handoff summary, raw request/provider body, API key, webhook URL, database connection string, or raw error object.

Centralize the enforcement at the logging boundary and also remove known unsafe call-site fields. Convert errors to a non-sensitive error code/category before writing them.

**Why**

Current outbound, inbound, draft, and console sender logs can write message bodies and contact identifiers into Vercel logs. This is a production privacy breach, not a cosmetic concern.

**IN**

- `automations/core/logger.ts`
- `automations/channels/console.ts`
- `automations/inbound/handle.ts`
- `automations/runtime/dispatch.ts`
- `app/api/inbound/route.ts`
- `app/api/lead/route.ts` only if needed to eliminate raw caught-error logging
- `lib/second-brain/db/client.ts` only if needed to avoid raw database-error logging
- Existing tests for these modules plus focused new logging tests

**OUT**

- Provider transport payloads and business behavior — do not change a message sent to a provider.
- Telemetry provider enablement, retention policy, OpenReplay, GlitchTip, Plausible, or external logging accounts.

**Acceptance criteria**

- [ ] A recursive redaction/allowlist test proves that fields named `body`, `messageBody`, `subject`, `email`, `phone`, `to`, `from`, `contact`, `authorization`, `apiKey`, `token`, `url`, and raw `Error` metadata do not appear in emitted output.
- [ ] Known inbound, dispatch, draft, and console-sender paths emit no customer identifiers or content.
- [ ] Failure logs preserve only safe correlation and classification data needed to diagnose the fault.
- [ ] Dry-run behavior remains a dry run; it does not become a real provider send.
- [ ] Existing unit tests and full suite pass.

**Focused test plan**

```bash
npm test -- automations/__tests__/inbound.test.ts automations/__tests__/inbound-infra.test.ts
npm test -- app/api/inbound/route.test.ts app/api/lead/route.test.ts
npm test
```

Capture logger output in tests and assert the prohibited test values are absent. Do not use snapshot tests that accidentally store PII-shaped fixtures.

**Rollback**

Revert the commit. Do not re-enable prior detailed logs in production; use a local test logger to investigate instead.

---

### A3 — Make newsletter subscription delivery truthful

**Source finding:** PR-006
**Assigned tier:** Senior
**Effort:** 2–3 hours
**Sequence:** after A0; independent of A1/A2/A4/A5

**What**

Align newsletter subscription behavior with the existing lead-delivery contract:

1. In production, a missing `LEAD_WEBHOOK_URL` returns a generic 503 and does not claim the user has subscribed.
2. A downstream non-2xx response or network failure returns a generic 502 and does not claim success.
3. A delivered subscription returns success only after a 2xx webhook response.
4. The honeypot remains a silent success and makes no external call.
5. Remove partial-email logging. Emit only a safe aggregate event such as `newsletter_delivery_succeeded` / `newsletter_delivery_failed`, with newsletter slug and reason category, never an address or raw exception.
6. Keep the present JSON response shape compatible where truthful; update the client only if it currently displays a success message solely from an HTTP 200.

**Why**

The current endpoint can say "You've been added" while nothing was persistently delivered. Consent and acquisition data must not be represented as stored when they are not.

**IN**

- `app/api/newsletter/subscribe/route.ts`
- `app/api/newsletter/subscribe/route.test.ts`
- `lib/telemetry/*` only if an existing safe event helper is required
- Newsletter client component only if needed to render the new truthful failure state

**OUT**

- CRM/Zapier/Make/n8n configuration, provider accounts, database schema, newsletter content, and public route inventory.

**Acceptance criteria**

- [ ] Production + missing webhook returns 503 and no success confirmation.
- [ ] Production + webhook 5xx or throw returns 502 and no success confirmation.
- [ ] Webhook 2xx returns 200 with `delivered: true`.
- [ ] Honeypot returns the existing generic success without invoking `fetch`.
- [ ] Logs and telemetry test fixtures contain no email address or raw error body.
- [ ] Existing `/api/lead` semantics are not regressed.

**Focused test plan**

```bash
npm test -- app/api/newsletter/subscribe/route.test.ts
npm test -- app/api/lead/route.test.ts
npm test
```

**Rollback**

Revert the commit. Do not compensate by showing a success response for failed delivery.

---

### A4 — Add baseline browser security headers

**Source finding:** PR-007
**Assigned tier:** Senior
**Effort:** 2–3 hours for baseline headers; CSP enforcement is separately gated below
**Sequence:** after A0; independent of A1–A3/A5

**What**

Add a centrally tested response-header policy using current Next 16 configuration conventions:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY` and/or CSP `frame-ancestors 'none'`
- A restrictive `Permissions-Policy` that disables unneeded browser capabilities; do not disable a capability that a verified feature needs.
- Preserve HSTS at the hosting layer; do not attempt to set it for local HTTP development.

Add a **report-only CSP** only after generating a concrete production-origin inventory. Do not enforce CSP from guessed Clerk, Cal.com, analytics, Sentry, OpenReplay, font, image, or webhook origins.

**Why**

The live site has HSTS only. Baseline headers reduce content-sniffing, referrer leakage, framing, and unnecessary browser privilege without causing the production integrations to fail.

**IN**

- `next.config.mjs`
- Header-focused tests or a lightweight testable policy module if necessary
- `ROUTES.md` only if a redirect changes (headers alone do not require a catalog change)

**OUT**

- Vercel dashboard security configuration, DNS, provider enablement, and CSP enforcement before an owner-approved origin inventory exists.

**Acceptance criteria**

- [ ] The headers above appear on `/`, `/book`, `/sign-in`, and a representative API 401 response in a production build/start smoke.
- [ ] Existing redirect behavior remains unchanged except where A5 explicitly changes canonical host behavior.
- [ ] `npm run build` passes.
- [ ] No public route starts returning 500 due to headers.

**CSP gate — do not skip**

Before enforcing CSP, Gemini must present the exact allowlist derived from current enabled production integrations and obtain owner confirmation. If nonce-based CSP is selected, it must be designed together with A1's Next 16 proxy behavior and browser-tested. `unsafe-inline` is not an acceptable permanent substitute for that design.

**Focused test plan**

```bash
npm run build
npm start
curl -sS -D - -o /dev/null http://localhost:3000/ | rg -i 'x-content-type-options|referrer-policy|x-frame-options|permissions-policy'
```

Use a temporary local process only; stop it after testing. Do not claim the Vercel header layer is verified until owner deployment.

**Rollback**

Revert the header commit if it breaks a verified application flow. Retain the incident evidence and narrow the policy rather than removing all headers.

---

### A5 — Align the canonical host

**Source finding:** PR-008
**Assigned tier:** Intermediate for code; owner for domain settings
**Effort:** 1–2 hours plus owner confirmation
**Sequence:** after A0; deploy with A4

**Required owner decision before implementation**

Choose the one canonical origin. The observed apex-to-`www` redirect makes `https://www.theskillcorner.com` the recommended choice, but this is a domain/SEO decision and must be explicitly confirmed before changing source defaults.

**What**

Once confirmed, set the chosen host as the only source of truth for `NEXT_PUBLIC_SITE_URL` documentation/default and all generated `site.url` consumers. Ensure sitemap, robots, canonical metadata, Open Graph URLs, JSON-LD, and deployed redirects converge on it.

**IN**

- `content/site.ts`
- `.env.example`
- `app/sitemap.ts`, `app/robots.ts`, metadata tests only if a source change is required
- `next.config.mjs` and `ROUTES.md` only if application-level redirect logic is added

**OUT**

- Registrar/Vercel domain configuration — owner action.
- Content redesign, service routes, and unrelated SEO additions.

**Acceptance criteria**

- [ ] The selected origin is defined once and drives sitemap, robots, canonical metadata, Open Graph, and JSON-LD.
- [ ] The non-canonical origin performs exactly one permanent redirect to the canonical equivalent path.
- [ ] Sitemap contains zero non-canonical URLs.
- [ ] No internal canonical URL points to an origin that immediately redirects.
- [ ] `ROUTES.md` reflects any new app-level redirect.

**Owner-run live test**

```bash
curl -sSIL https://theskillcorner.com/book
curl -sSIL https://www.theskillcorner.com/book
curl -sS https://www.theskillcorner.com/sitemap.xml | rg -o '<loc>[^<]+'
```

**Rollback**

Revert the source commit and restore the previous Vercel domain redirect only if the selected host has a verified DNS/certificate failure.

---

### A6 — Restore the lint gate and add a narrow CI workflow

**Source finding:** PR-005
**Assigned tier:** Intermediate
**Effort:** 3–5 hours
**Sequence:** after A1–A5 code changes; before release-candidate deployment

**What**

Make the current codebase pass its documented quality gate without mechanical, repository-wide formatting:

1. Run `npm run lint -- --max-diagnostics=200` and enumerate every current error and warning.
2. Fix each diagnostic only in the file it identifies; preserve behavior unless the diagnostic reveals an unsafe behavior (for example a non-null assertion on an operator action path).
3. For each touched behavior file, add or retain focused tests.
4. Add a minimal CI workflow that runs exactly: `npm ci`, `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, and `npm audit --omit=dev --json`.

**Why**

Current lint is red. A release cannot be confidently reproduced if CI allows type, lint, build, or production dependency checks to drift.

**IN**

- Only files reported by the current lint run
- `.github/workflows/ci.yml` (new)
- Related focused tests only when behavior changes

**OUT**

- `package.json` dependency upgrades, mass formatting, lockfile churn, unrelated user modifications, and external CI secrets.

**Acceptance criteria**

- [ ] `npm run lint` exits 0 with zero errors.
- [ ] All warning fixes are either resolved or documented as a deliberate, reviewed exception; no broad suppression is added.
- [ ] CI uses `npm ci`, not `npm install`.
- [ ] CI has no credentials and does not execute live deploy, webhook, SMS, or email calls.
- [ ] `npm test`, TypeScript, build, and production dependency audit still pass locally.

**Focused test plan**

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
npm audit --omit=dev --json
git diff --check
```

**Rollback**

Revert the ticket commit. Do not disable lint or remove CI to avoid fixing diagnostics.

---

### A7 — Owner-run production deployment and smoke gate

**Assigned tier:** Owner / release operator; Gemini may provide a checklist only
**Effort:** 1–2 hours
**Sequence:** after A1–A6 are accepted

**Owner actions before deployment**

1. Confirm the release commit SHA and ensure only reviewed changes are included.
2. Configure production values without exposing them in chat/logs:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `DASHBOARD_OPERATOR_USER_IDS`
   - `LEAD_WEBHOOK_URL` pointing to a controlled test-capable CRM/webhook route
   - `NEXT_PUBLIC_SITE_URL` matching the owner-approved canonical host
   - `SECOND_BRAIN_DATABASE_URL` using the least-privilege, pooler-backed production role with verified TLS
3. Keep real SMS/email automation provider credentials and scheduled execution disabled unless Path B is complete.
4. Deploy through the normal Vercel pipeline.

**Mandatory live smoke matrix**

| Check | Expected result |
|---|---|
| `/` and `/book` | HTTP 200; no legacy “Booking calendar is being initialized” text |
| Booking preflight | One controlled submission creates exactly one CRM/test-webhook record; browser gets truthful success |
| `/sign-in` with Clerk configured | Real Clerk UI; no dev-local labels |
| `/dashboard` anonymous | Redirect/unauthorized behavior; never HTTP 500 |
| `/dashboard` allowlisted operator | Access works |
| `/dashboard` authenticated non-allowlisted user | Denied |
| `/api/cron` without Authorization | HTTP 401 |
| `/api/internal/v1/automations/status` without key | HTTP 401 |
| Headers | HSTS + A4 headers appear |
| `/sitemap.xml` | Only canonical URLs; canonical host is not redirecting |
| Logs | No test email, phone, or message body appears |

**Ship rule**

Path A is complete only if every row passes and the owner confirms the tested deployment is the reviewed SHA. A passing local build is not a substitute.

## 6. Path B — automation productionization (separate authorization)

### B0 — Make the data boundary decision before code

**Assigned tier:** Owner + Senior engineer
**Effort:** 1–2 hours of decision work
**Sequence:** mandatory first step of Path B

**Decision required**

The current code stores message bodies and contact information in local files. The project rules also prohibit using Second Brain/Neon as a dumping ground for full email bodies or long-form content. Before a schema is written, the owner must approve all of the following:

| Decision | Required answer |
|---|---|
| Operating database | A dedicated application operational datastore or a strictly separated PII schema/role; do not silently reuse Second Brain corpus tables. |
| Data classification | Exact fields allowed: hashed contact key, provider message ID, consent state, idempotency key, schedule metadata, encrypted content if truly necessary. |
| Content retention | Whether inbound/outbound content is retained at all; default is no persistent body storage unless a documented operational need exists. |
| PII protection | Encryption, role separation, access logging, backup policy, deletion/export path, and test-data policy. |
| Consent/compliance | Jurisdiction, consent capture, STOP/START handling, quiet hours, and human approval policy. |
| Provider release | Whether the first production release is dry-run only or permits any outbound channel. Default: dry-run only. |

**Hard stop**

Gemini must not create a PII schema, migration, retention policy, or provider sender until B0 is owner-approved in writing.

---

### B1 — Define the durable automation-state contract

**Assigned tier:** Senior
**Effort:** 4–6 hours
**Sequence:** after approved B0

**What**

Define repository interfaces and a migration plan for the minimum durable state required to safely operate automations across multiple serverless instances:

- Consent/suppression state keyed by a privacy-preserving contact identifier.
- Atomic idempotency claims with unique constraints; no check-then-write race.
- Provider-message deduplication keyed by client/provider/message ID.
- Draft metadata and approval status, but not bodies unless B0 explicitly allows encrypted, retention-bound content.
- Contact address mapping only where policy permits; otherwise use a protected provider lookup boundary.
- Conversation metadata/history policy with hard retention/deletion behavior.

**IN**

- New ADR/contract document
- New migration file(s) in the approved operational database area
- New repository interfaces/types and tests
- Relevant policy documentation

**OUT**

- Existing file stores, route behavior, provider sends, Vercel Cron, dashboard UI, and real data migration.

**Acceptance criteria**

- [ ] Schema uses client/workspace scoping in every table and query.
- [ ] Idempotency and inbound provider IDs are constrained atomically by the database.
- [ ] No plaintext message body is introduced unless B0 explicitly authorizes it and documents encryption/retention.
- [ ] Runtime role has only required DML permissions; migration/admin role is not available to web runtime.
- [ ] Migration has forward-only, rollback, and test-database verification instructions.

**Test plan**

- Migration applies to an isolated disposable test database only.
- Parallel claim tests prove one winner / one loser for the same idempotency key.
- Cross-client tests prove a client cannot read/write another client's state.

---

### B2 — Implement Postgres-backed automation stores

**Assigned tier:** Senior
**Effort:** 8–12 hours
**Sequence:** after B1

**What**

Implement repository-backed counterparts to `FileSuppressionStore`, `FileIdempotencyStore`, `FileConversationStore`, `FileContactIndex`, and `FileDraftStore`. Preserve domain interfaces where they remain correct, but make all I/O asynchronous if required by the database contract. Default production wiring must use durable stores; file stores remain test/local-dev fixtures only behind an explicit development/test guard.

**IN**

- `automations/server/inbound-stores.ts`
- `automations/core/idempotency.ts`
- `automations/inbound/suppression.ts`
- `automations/inbound/conversation.ts`
- `automations/inbound/contact-index.ts`
- `automations/core/drafts.ts`
- New repository modules, migration-backed integration tests, and minimal call-site changes required to await I/O

**OUT**

- LLM provider behavior, message-copy changes, dashboard redesign, database admin credential lifecycle, and any production outbound credential.

**Acceptance criteria**

- [ ] Production mode rejects file-backed stores rather than silently using `./.automations`.
- [ ] Two parallel process simulations cannot both claim/send the same idempotency key.
- [ ] Opt-out survives process restart and is enforced before outbound dispatch.
- [ ] A duplicate inbound provider message produces no duplicate action.
- [ ] Draft approval/rejection is atomic and cannot double-send.
- [ ] All queries bind parameters and scope by client ID.
- [ ] No new logs expose PII or message content.

**Test plan**

- Unit tests for every repository method.
- Integration tests against an isolated test database with migrations applied.
- At least one concurrency test with `Promise.all` for duplicate claim and duplicate inbound message.
- Full suite, TypeScript, lint, and build.

---

### B3 — Replace runtime file-store usage and prove fail-closed production behavior

**Assigned tier:** Senior
**Effort:** 4–6 hours
**Sequence:** after B2

**What**

Wire inbound webhook processing, scheduled runs, dashboard draft actions, and manual simulation paths to the durable stores. In production, missing operational database configuration must fail closed before accepting/processsing an automation message. Development/test may use explicit in-memory fixtures only.

**IN**

- `app/api/inbound/route.ts`
- `automations/server/process-inbound.ts`
- `automations/server/run-tick.ts`
- `app/dashboard/actions.ts`
- `app/dashboard/drafts/actions.ts`
- `app/dashboard/flows/actions.ts`
- Their focused tests

**OUT**

- Provider credentials, real outbound sends, customer records, and generic marketing lead routes.

**Acceptance criteria**

- [ ] Production missing durable-store configuration returns a safe 503/500 before any side effect; it does not fall back to files or memory.
- [ ] Test/dev behavior is explicit and cannot activate merely because credentials are absent.
- [ ] Dashboard simulations are labelled simulation and do not create external sends.
- [ ] Draft mutations remain protected by Clerk allowlist and client ID validation.
- [ ] End-to-end test flow covers inbound -> opt-out -> attempted scheduled send -> suppression, across a simulated restart.

**Test plan**

Run full local tests plus integration tests against a disposable database. No tests may use a production database or live provider credentials.

---

### B4 — Establish scheduler and provider release gates

**Assigned tier:** Senior + owner
**Effort:** 4–8 hours
**Sequence:** after B3; dry run before any live send

**What**

1. Decide and document the scheduler platform/cadence. If Vercel Cron is chosen, add the verified configuration and retain the `/api/cron` bearer-secret gate.
2. Add idempotent run observability with safe aggregate metrics only: jobs evaluated, planned, suppressed, deferred, sent, failed, and duration.
3. Configure a non-customer staging/sandbox provider path and run dry-run tests first.
4. Add operator runbook: incident stop switch, provider disablement, idempotency/opt-out diagnosis, and rollback.

**Owner-required actions**

- Approve the schedule/cost.
- Create platform configuration and sandbox credentials.
- Verify Twilio signature settings, `PUBLIC_INBOUND_URL`, provider sender identities, consent policy, and emergency stop process.
- Approve any transition from dry-run to a small internal canary. Gemini must not perform this transition.

**Acceptance criteria**

- [ ] Scheduler cannot run without a valid cron secret.
- [ ] A duplicate cron delivery does not duplicate an outbound action.
- [ ] Failure metrics are safe aggregates with no PII/content.
- [ ] Dry-run verifies the complete pipeline without sending to a customer.
- [ ] Owner signs off on a reversible canary plan before a real outbound send.

---

### B5 — Owner-approved outbound canary

**Assigned tier:** Owner / release operator; Gemini may prepare evidence only
**Effort:** Owner-controlled
**Sequence:** after B4 and explicit written owner approval

**What**

Run the smallest possible reversible canary using an internal, consented test recipient or sandbox endpoint. Confirm one message, one provider receipt, one durable idempotency record, one safe aggregate log event, and a working STOP/opt-out path. Do not target a customer during this gate.

**Acceptance criteria**

- [ ] Owner explicitly approves the channel, recipient/sandbox, provider, and rollback point at action time.
- [ ] Exactly one canary delivery occurs after two duplicate trigger attempts.
- [ ] The opt-out test prevents a subsequent non-transactional send.
- [ ] The owner verifies no sensitive body/contact data appears in platform logs.
- [ ] The provider is disabled again unless the owner separately approves wider rollout.

## 7. Cross-ticket test matrix

| Layer | Required test |
|---|---|
| Unit | All changed branches and error paths, especially production-vs-development configuration guards. |
| Privacy | Assert known email, phone, body, token, URL, and error-fixture values are absent from log output. |
| Auth | Missing Clerk config, signed-out, allowlisted, and signed-in-but-not-allowlisted cases. |
| Data | Parameter binding, tenant/client isolation, duplicate idempotency claim, duplicate inbound delivery, restart persistence. |
| HTTP | Body limit, malformed payload, 401/403/429/502/503 contracts, generic server failures. |
| Build | `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm audit --omit=dev --json`, `git diff --check`. |
| Browser | Desktop and 390px mobile: booking, newsletter errors, sign-in missing-config state, headers, error boundary. |
| Live | Only owner-run after deploy; use test identities/endpoints and collect timestamps, commit SHA, and result codes. |

## 8. Required implementation report from Gemini

After **each** ticket, Gemini must return this exact structure:

~~~~markdown
## <ticket ID> — COMPLETED | PARTIAL | BLOCKED

### What changed
- Exact behavioral summary.

### Files changed
- `path` — reason.

### Acceptance criteria
- AC1 — PASS/FAIL with command or reproduction evidence.

### Verification
```text
<exact commands and condensed output>
```

### Not verified / owner actions
- Explicit deployment, credential, database, provider, or browser checks Gemini cannot perform.

### Rollback
- Commit SHA and exact revert strategy.

### Scope check
- Confirm no out-of-scope files changed; if they did, list why and stop for review.
~~~~

Never write "production ready" until A7 passes, and never write "automations live" until B5 receives explicit owner authorization.

## 9. Copy/paste prompt for Gemini

```text
You are implementing one ticket from GEMINI_PRODUCTION_IMPLEMENTATION_PLAN_2026-09-25.md in /Users/tejindersingh/dev/projects/TheSkillCorner.

Read agents.md, DESIGN.md, ROUTES.md, this plan, the selected ticket, its direct callers, existing tests, and relevant Next.js 16 docs before editing. Start by recording git status and current HEAD. Preserve all unrelated dirty/untracked files and do not edit FIX_PLAN.md, PROGRESS.md, legacy tickets, .env files, or hosted configuration.

Implement ONLY ticket <TICKET_ID>. Do not expand scope, deploy, apply migrations, write credentials, send email/SMS, call real CRM webhooks, enable a provider, or run destructive commands. If the ticket relies on an owner decision or external environment, stop with BLOCKED after completing only the safe invariant work.

Use npm, not Bun. For any route/API/redirect change update ROUTES.md. Add focused tests, then run the ticket-specific tests plus npm test, npx tsc --noEmit, npm run lint, npm run build, npm audit --omit=dev --json, and git diff --check when appropriate. Do not mass-format the repository.

Return the exact implementation report required by section 8. Claim only what the commands or inspection prove; list all owner-run production checks separately.
```

## 10. Explicitly deferred work

| Work | Why it is deferred | Revisit when |
|---|---|---|
| ROI calculator and other conversion features | They do not remove a production blocker and risk diverting work from booking/auth/privacy. | Path A is live and acquisition metrics justify it. |
| Full OpenReplay/GlitchTip/Plausible activation | Existing integrations are default-off; replay needs consent, masking, retention, operator-route exclusion, backups, and incident ownership. | A written telemetry privacy spec and owner-run provider verification exist. |
| CMS, custom calendar, WebGL/3D redesign | No evidence they improve the immediate lead-to-booking loop. | A measured acquisition/conversion gap justifies them. |
| Real outbound automation | Unsafe before B0–B4. | Durable state, privacy boundary, dry-run, and owner-approved canary are complete. |

## 11. Load-bearing assumptions

1. **The intended canonical host is `www`.** The observed redirect supports this, but the owner must confirm before A5 writes it into source/configuration.
2. **Path A is sufficient for near-term commercial validation.** If the business needs real SMS/email automation immediately, Path B cannot be skipped.
3. **The existing lead webhook is the intended durable lead/subscribe system of record.** If it is not, pause A3 and select a durable consent store before showing a success state.
4. **No production automation data is yet stored in the local `.automations` directory.** If it is, do not delete or migrate it blindly; inventory and approve a retention/migration procedure first.
5. **Clerk production keys and at least one allowlisted operator can be configured by the owner.** If not, keep the dashboard safely unavailable rather than inventing a replacement auth system.

## 12. Definition of done

### Marketing-site production ready (Path A)

- A1–A6 accepted with clean local evidence.
- A7 owner-run deployment and every live smoke-matrix row passes on the intended commit SHA.
- The public booking path produces a verified test delivery and no false success message.
- Dashboard fails closed when configuration is absent and behaves correctly for the three tested identity states.
- No PII/message content is emitted by covered application logs.
- Canonical origin, headers, sitemap, robots, JSON-LD, and redirects agree.

### Full automation production ready (Path B)

- Path A remains green.
- B0 owner data-policy approval exists.
- B1–B4 are accepted against a dedicated/testable durable store with concurrency and restart proof.
- Provider integration has passed dry-run and a documented, owner-approved, reversible canary gate.
- No claim of compliance, deliverability, or production throughput is made without corresponding live evidence.
