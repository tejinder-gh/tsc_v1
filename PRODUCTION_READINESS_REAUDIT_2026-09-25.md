# TheSkillCorner Production Readiness Re-Audit — 2026-09-25

**Verdict: NO-GO for the full product.** [HIGH >90%]

The current repository is materially safer than the 2026-09-24 snapshot, but the public deployment has not received the relevant fixes. The live booking conversion path is still an unconfigured fallback, the live sign-in page exposes the old development-only UI, and `/dashboard` responds with HTTP 500. The automation subsystem also remains unsuitable for multi-instance/serverless production because its customer state is JSON-file-backed.

This is a fresh, read-only re-audit. Earlier reports and tickets were used only as leads; no production mutation, lead submission, or authenticated operation was performed.

## Scope and method

- Current local `HEAD`: `8068207` (`2026-09-25`).
- Current public origin: `https://www.theskillcorner.com`.
- Checked: source, recent commits, route inventory, local production build/type/test/dependency gates, unauthenticated live GET/HEAD probes, and every URL published in the live sitemap.
- Not checked because it would require credentials, configuration access, or create external state: Vercel deployment settings/logs, Clerk configuration, database schema/migrations, real lead/webhook delivery, Cal.com configuration, SMS/email providers, Vercel Cron execution, authenticated dashboard flows, and browser/device visual QA.

## Evidence matrix

| Area | Fresh result | Meaning |
|---|---|---|
| Unit/integration tests | **PASS** — 53 files, 467 tests | Local behavioural regression coverage passed. Test output includes intentional mock/error-path logs; these are not production delivery proof. |
| TypeScript | **PASS** — `npx tsc --noEmit` | No current TypeScript errors. |
| Production build | **PASS** — Next.js 16.3.6, 91 generated pages | The present source compiles and prerenders locally. |
| Dependency audit | **PASS** — 0 production dependency vulnerabilities | `npm audit --omit=dev --json`; does not assess application vulnerabilities. |
| Lint/format quality gate | **FAIL** — 33 errors, 68 warnings across 353 files | `npm run lint -- --max-diagnostics=200` is red. New UI/auth work added some errors; this must be returned to green before a release candidate. |
| Live sitemap | **PASS** — 67/67 URLs returned HTTP 200 | Public crawl surface is available; it does not prove conversions work. |
| Live protected endpoints | **PASS (negative access control)** — `/api/cron` 401 and internal automation status 401 without credentials | Public unauthenticated access is rejected. Authenticated correctness remains unverified. |
| Live booking | **FAIL** | `/book` returns 200 but has no current `Your Name`, `Work Email`, or `/api/lead` client marker; it displays **“Booking calendar is being initialized.”** |
| Live operator access | **FAIL** | `/sign-in` still serves **“Dev Environment Session”**; `/dashboard` is HTTP 500. |
| Live response headers | **PARTIAL** | HSTS exists. No CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, or COOP was observed on `/`, `/book`, or `/sign-in`. |

## What improved in the repository

These local changes are real and have test/build evidence, but are **not production proof** until deployed and smoke-tested.

1. **Operator auth now fails closed locally.** Commit `75682ac` replaces the permissive no-Clerk experience with production 503/neutral UI behaviour, limits dev access to explicit development opt-in, and adds auth tests. See [proxy.ts](/Users/tejindersingh/dev/projects/TheSkillCorner/proxy.ts) and [the sign-in route](/Users/tejindersingh/dev/projects/TheSkillCorner/app/(auth)/sign-in/[[...sign-in]]/page.tsx).
2. **Runtime rate-limit DDL was removed.** Commit `59871ec` no longer attempts `CREATE TABLE` from request handling. See [lib/rate-limit.ts](/Users/tejindersingh/dev/projects/TheSkillCorner/lib/rate-limit.ts).
3. **Database pooling/TLS defaults improved.** Commit `8b815a0` uses a bounded pool and rejects insecure production TLS overrides. See [the database client](/Users/tejindersingh/dev/projects/TheSkillCorner/lib/second-brain/db/client.ts).
4. **A local booking intake replaces the unconfigured calendar fallback.** Commit `0709f0b` implements an `/api/lead` intake flow. It is absent from the public `/book` deployment. See [BookingEmbed.tsx](/Users/tejindersingh/dev/projects/TheSkillCorner/components/BookingEmbed.tsx).
5. **Sitemap entries now emit `lastModified`.** This is local-only; the value is the build time rather than content-change time. See [app/sitemap.ts](/Users/tejindersingh/dev/projects/TheSkillCorner/app/sitemap.ts).

## Release blockers

### P0 — deploy and prove the actual conversion and operator paths

**Evidence:** live `/book` has the old fallback and no current intake fields; live `/sign-in` displays the former development interface; live `/dashboard` is 500.

**Required resolution:** deploy the reviewed commit to production, confirm the Vercel production deployment uses that commit, then execute these controlled smoke tests:

1. `/book` renders the current pre-flight form and reaches a successful lead outcome using a designated test destination; prove the receiving system got exactly one record.
2. `/sign-in` displays Clerk or the neutral unavailable state — never development operator details.
3. `/dashboard` returns a deliberate result: unauthenticated redirect/401/403 when Clerk is configured, or 503 when it is not; never 500.
4. Capture deployment ID, commit SHA, time, and sanitized result in the release evidence.

### P0 for automation/SMS commercial operation — replace file-backed customer state

**Evidence:** [automations/server/inbound-stores.ts](/Users/tejindersingh/dev/projects/TheSkillCorner/automations/server/inbound-stores.ts) defaults to `./.automations/{clientId}` and constructs `FileSuppressionStore`, `FileConversationStore`, `FileIdempotencyStore`, and `FileContactIndex`. Those stores write JSON synchronously.

**Impact:** serverless instances do not share durable local files. STOP/opt-out state, webhook idempotency, conversation history, and contact indexing can diverge or disappear across invocations. This is not suitable for handling real customer communications.

**Required resolution:** use the existing production database as the transactional, shared persistence implementation; migrate each interface; add schema migrations and concurrent-invocation/idempotency/opt-out durability tests; then demonstrate a multi-instance-safe production smoke test. Do not enable outbound customer automation before this gate passes.

### P1 — make newsletter capture truthful and durable

**Evidence:** [newsletter subscribe route](/Users/tejindersingh/dev/projects/TheSkillCorner/app/api/newsletter/subscribe/route.ts) returns `success: true` if `LEAD_WEBHOOK_URL` is absent or forwarding throws, while recording no durable subscriber record. It also logs a partially masked email and raw caught error objects.

**Required resolution:** in production, fail closed on missing/unavailable delivery or persist a queued subscription before acknowledging it; scrub structured errors; define a retention/deletion policy for the stored data and logs. Add tests for unset URL, 4xx/5xx, timeout, and retry/idempotency.

### P1 — deploy a baseline browser security policy

**Evidence:** live public routes only demonstrated HSTS among the inspected security headers. [next.config.mjs](/Users/tejindersingh/dev/projects/TheSkillCorner/next.config.mjs) has redirects but no response-header policy.

**Required resolution:** set a tested CSP appropriate for Next/Clerk/Cal/analytics, `X-Content-Type-Options: nosniff`, clickjacking protection (`frame-ancestors` in CSP and/or X-Frame-Options), Referrer-Policy, Permissions-Policy, and COOP as compatible. Verify headers on production after deployment; do not ship a guessed CSP that breaks sign-in or embeds.

### P1 — choose one canonical host

**Evidence:** `https://theskillcorner.com` redirects to `https://www.theskillcorner.com`, while [content/site.ts](/Users/tejindersingh/dev/projects/TheSkillCorner/content/site.ts), metadata, sitemap URLs, and canonical tags use the non-`www` host.

**Required resolution:** either make apex canonical without redirecting to `www`, or change `NEXT_PUBLIC_SITE_URL`, hard-coded metadata, sitemap, and JSON-LD to `https://www.theskillcorner.com`; then verify canonical/redirect consistency on a representative static page and dynamic route.

### P1 — restore the required local release gate

**Evidence:** Biome reports 33 errors and 68 warnings, including unused imports, unsafe non-null assertions, import ordering, and formatter drift.

**Required resolution:** fix the findings rather than suppressing the gate; run `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build` from a clean worktree/CI job. Keep the gate required for merges.

## Conditional release paths

| Intended release | Status | Minimum gates |
|---|---|---|
| Marketing preview (no live lead capture, no operator dashboard, no outbound automation) | **CONDITIONAL, not current production** | Deploy current reviewed marketing build; fix lint; align canonical host; baseline security headers; label/disable unavailable booking functionality. |
| Marketing lead-generation release | **NO-GO now** | All preview gates plus P0 deployment proof, one controlled end-to-end lead test, production webhook configuration, and honest newsletter delivery semantics. |
| Automation/SMS product release | **NO-GO** | All lead-generation gates plus database-backed state, durable opt-out/idempotency proof, provider configuration and signature/replay tests in production, monitoring/alerting, and an operator recovery runbook. |

## Release-owner checklist

1. Deploy the selected local commit and record the deployment-to-SHA mapping.
2. Fix all 33 lint errors, then rerun the four local gates in clean CI.
3. Resolve the booking and dashboard live smoke failures before accepting leads.
4. Verify production environment configuration without exposing secret values: Clerk, lead webhook, database/runtime role, Cron secret, and any calendar/provider keys.
5. Add and verify security headers and canonical-host consistency.
6. If automation is in scope, complete the database persistence migration before enabling real customer communication.
7. Attach sanitized production smoke evidence and rollback instructions to the release decision.

## Explicitly not proven

No conclusion above proves deployment ownership, Vercel runtime configuration, database migrations, webhook/provider delivery, email/SMS legality or consent, scheduler execution, analytics/error-monitoring ingestion, authenticated user authorization, accessibility across devices, or incident response readiness. Those require owner access and release-time evidence.
