# Skill Corner API & Server-Side Architecture Audit

**Status:** Completed  
**Audit Date:** 2026-09-24  
**Scope:** Complete repository survey of all HTTP route handlers, internal API endpoints, machine-readable specifications, and server actions.  
**Auditor:** Antigravity AI Engineering  
**Integrity Rule:** Audit-only analysis. Zero code modifications, renames, deletions, or cosmetic refactoring applied.

---

## High-Level API Portfolio Summary

| Area | Endpoints | Critical Issues | Consolidation Candidates | Dead / Orphaned |
| :--- | :---: | :---: | :---: | :---: |
| **Second Brain & Automation OS** | 11 | 1 | 9 | 9 *(External Unverified)* |
| **Indian Phone SMS / OTP Relay** | 1 | 1 | 1 | 0 *(Active External)* |
| **Utilities & Ingestion APIs** | 4 | 1 | 2 | 0 *(Active)* |
| **Document Routes & Server Actions** | 7 | 0 | 0 | 0 *(Active)* |
| **Total** | **23** | **3** | **12** | **9** |

---

## 1. Executive Summary

This comprehensive audit analyzed all 20 Next.js route handlers (`app/**/route.ts`), 3 Server Action modules (`app/dashboard/**/actions.ts`), and associated backend domains in TheSkillCorner codebase.

### Key Architectural Findings

1. **Subsystem Disconnect in Automation Operations:**
   The repository contains two parallel, uncoupled automation systems:
   - The **Active In-Process Engine** ([`automations/`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/automations)), powered by file-backed stores ([`.automations/`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/.automations)), pinged by [`GET /api/cron`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/cron/route.ts), and reacting to customer texts via [`POST /api/inbound`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/inbound/route.ts).
   - The **Second Brain Database State Machine** ([`lib/second-brain/repositories/AutomationRepository.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/second-brain/repositories/AutomationRepository.ts)), backed by Neon PostgreSQL (`public.jobs_automation`, etc.) and exposed via 9 HTTP endpoints under [`/api/internal/v1/automations/...`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations).
   **Zero lines of active application code call the 9 database automation endpoints.** They exist solely for an external machine agent (`automation-os`), creating an unverified, fragmented attack and maintenance surface.

2. **Indian SMS Relay Cryptographic Strength vs. Replay Boundary:**
   The Indian SMS Relay ([`POST /api/v1/relay`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/v1/relay/route.ts)) implements exemplary cryptographic verification (HMAC-SHA256 canonical request signing, constant-time comparison, strict Zod schema validation, zero persistence, and complete exclusion of sensitive message bodies from logs). However, because it is purely stateless and does not track nonces, **any valid signed request can be replayed within the 300-second timestamp window**, enabling potential denial-of-wallet / duplicate email flooding attacks.

3. **Duplicated Email Delivery Subsystems:**
   Two distinct, independent email delivery implementations exist in the repository:
   - [`relay/adapters/EmailDeliveryAdapter.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/relay/adapters/EmailDeliveryAdapter.ts) (SendGrid & Resend direct HTTP fetch for SMS relay forwarding)
   - [`automations/channels/email-sendgrid.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/automations/channels/email-sendgrid.ts) (SendGrid direct HTTP fetch for client marketing/operational automations)
   Neither uses a shared service, leading to duplicated SendGrid payload generation, disconnected timeout handling, and redundant provider environment configurations.

4. **Public Ingestion Abuse Risk:**
   Public write endpoints ([`POST /api/lead`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/lead/route.ts) and [`POST /api/newsletter/subscribe`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/newsletter/subscribe/route.ts)) rely exclusively on honeypot fields for bot mitigation. Neither implements IP/client rate limiting at the route handler level, leaving downstream webhooks (Zapier/Make/n8n) exposed to quota consumption by headless bot traffic.

5. **Local-Only Tooling Boundary Intact:**
   Zero endpoints or network adapters expose the ChatGPT ↔ Antigravity local pairing integration. The boundary is strictly enforced.

---

## 2. Current API Architecture

```text
                                  CLIENTS & TRAFFIC SOURCES
     ┌──────────────────────┬──────────────────────┬──────────────────────┬──────────────────────┐
     │ Public Web Browsers  │ Indian Android Phone │ Twilio SMS Gateway   │ External AI / Agents │
     └──────────┬───────────┴──────────┬───────────┴──────────┬───────────┴──────────┬───────────┘
                │                      │                      │                      │
                ▼                      ▼                      ▼                      ▼
     ┌───────────────────────────────────────────────────────────────────────────────────────────┐
     │                                    NEXT.JS EDGE & ROUTING                                 │
     │  middleware.ts (Clerk Protected: /dashboard/* only; /api/* passes unauthenticated)        │
     └──────────┬──────────────────────┬──────────────────────┬──────────────────────┬───────────┘
                │                      │                      │                      │
┌───────────────┴───────────────┐      │                      │                      │
│ Public Ingestion & Docs       │      │                      │                      │
│  - POST /api/lead             │      │                      │                      │
│  - POST /api/newsletter/sub   │      │                      │                      │
│  - GET  /api/cron             │      │                      │                      │
│  - GET  /pricing.md, llms.txt │      │                      │                      │
└───────────────┬───────────────┘      │                      │                      │
                │                      │                      │                      │
                │                      ▼                      ▼                      │
                │             ┌─────────────────┐   ┌──────────────────┐             │
                │             │ POST /api/v1/   │   │ POST /api/inbound│             │
                │             │ relay           │   │ (Twilio Webhook) │             │
                │             └────────┬────────┘   └────────┬─────────┘             │
                │                      │                     │                       │
                │                      │ HMAC-SHA256         │ Twilio Signature      │
                │                      ▼                     ▼                       │
                │             ┌─────────────────┐   ┌──────────────────┐             │
                │             │ relay/handler.ts│   │automations/server│             │
                │             │ (Strict Zod +   │   │process-inbound.ts│             │
                │             │  zero persist)  │   │(NLP + rules)     │             │
                │             └────────┬────────┘   └────────┬─────────┘             │
                │                      │                     │                       │
                ▼                      ▼                     ▼                       │
     ┌──────────────────────┐ ┌─────────────────┐   ┌──────────────────┐             │
     │ LEAD_WEBHOOK_URL     │ │ DeliveryAdapter │   │ File Stores      │             │
     │ (Zapier / Make / n8n)│ │ SendGrid/Resend │   │ .automations/*   │             │
     └──────────────────────┘ └────────┬────────┘   └──────────────────┘             │
                                       │                                             │
                                       ▼                                             │
                              ┌─────────────────┐                                    │
                              │ Canadian Inbox  │                                    │
                              └─────────────────┘                                    │
                                                                                     │
                                                                                     ▼
                                                              ┌──────────────────────────────────┐
                                                              │ /api/internal/v1/... (11 routes) │
                                                              │  - /endpoints                    │
                                                              │  - /context/search               │
                                                              │  - /automations/* (9 endpoints)  │
                                                              └────────────────┬─────────────────┘
                                                                               │
                                                                               ▼
                                                              ┌──────────────────────────────────┐
                                                              │ Second Brain Database IAM        │
                                                              │  - authenticateAgent()           │
                                                              │  - authorize()                   │
                                                              └────────────────┬─────────────────┘
                                                                               │
                                                                               ▼
                                                              ┌──────────────────────────────────┐
                                                              │ Neon PostgreSQL                  │
                                                              │  - resource_context_index        │
                                                              │  - jobs_automation / schedules   │
                                                              └──────────────────────────────────┘
```

---

## 3. Complete API Inventory

The table below catalogs every server-side callable HTTP route handler and Server Action module across the repository.

| Category | Route | Method | Source File | Purpose | Caller(s) | Consumer | Authentication | Authorization | Validation | Database Access | External Dependencies | Sensitive Data | Side Effects | Error Handling | Rate Limiting | Idempotency | Logging | Status | Risk | Recommendation |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Indian SMS Relay** | `/api/v1/relay` | POST | [`app/api/v1/relay/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/v1/relay/route.ts#L13-L15) | Verifies signed SMS events from Android phone and delivers downstream | Indian Android SMS service | Android physical device | HMAC-SHA256 Canonical Signing (`X-Relay-Signature`) | Relay ID + Device ID allowlist | Strict Zod schema + 16KB limit | None (strictly stateless) | SendGrid / Resend API or Webhook | Raw SMS message body, OTP tokens, sender phone, SIM slot | Forwards email/webhook | Shielded codes (`401 AUTHENTICATION_FAILED`, `502`, `503`) | None (Timestamp ±300s window) | None (Server permits replay within 300s) | Zero body/credential logging | Active | Medium | Keep; add in-memory or Redis nonce deduplication |
| **Utility** | `/api/lead` | POST | [`app/api/lead/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/lead/route.ts#L39-L135) | Ingests business leads, validates schema, drops bots | [`lib/leads.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/leads.ts#L32) (`ContactForm`, `InteractiveChecklist`, `BlueprintCaptureModal`) | Web browser | None (Public) | None | Zod `leadSchema` + 32KB limit + Honeypot | None | `LEAD_WEBHOOK_URL` (Zapier/Make/n8n) | Lead email, name, company, phone, notes | Dispatches JSON to CRM webhook | Friendly shielded message; 503 if misconfigured in prod | Missing at route level | Missing | Logs event metrics; scrubs PII | Active | Medium | Keep; add route rate-limiting |
| **Utility** | `/api/newsletter/subscribe` | POST | [`app/api/newsletter/subscribe/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/newsletter/subscribe/route.ts#L15-L116) | Ingests newsletter email subscriptions | [`NewsletterSubscribeForm.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/features/newsletters/components/NewsletterSubscribeForm.tsx#L36) | Web browser | None (Public) | None | Zod `SubscribeSchema` + 32KB limit + Honeypot | None | `LEAD_WEBHOOK_URL` (Optional) | Subscriber email | Logs subscription; forwards to CRM webhook | JSON `{ error, details }` with status 400/404/500 | Missing at route level | Missing | Logs masked email (`abc***@domain.com`) | Active | Low | Consolidate lead-forwarding logic with `/api/lead` |
| **Utility** | `/api/inbound` | POST | [`app/api/inbound/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/inbound/route.ts#L41-L125) | Receives customer SMS replies from Twilio | External Twilio Messaging Webhook | Twilio server | Twilio HMAC signature (`X-Twilio-Signature`) | Destination phone number mapping | URL-encoded / FormData parsing + 32KB limit | None (uses local JSON files) | Twilio API | Customer SMS reply text, customer phone number | Updates conversation history, suppression, queues drafts | Returns empty TwiML; 500 on unhandled error to trigger Twilio retry | Twilio upstream | Message ID deduplication | Logs intent & phone; avoids message text | Active | Medium | Keep; transition file stores to Postgres |
| **Utility** | `/api/cron` | GET | [`app/api/cron/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/cron/route.ts#L24-L38) | Executes scheduled automation tick across all clients | Vercel Cron (`vercel.json`) | Vercel Cron runner | Bearer Secret (`CRON_SECRET`) | Token match | None (HTTP GET) | None (uses local JSON files) | Twilio / SendGrid (via dispatch) | None directly | Dispatches outbound SMS/emails for due automations | JSON error report on failure | Controlled by cron cadence | Engine-level idempotency stores | Logs client tick summaries | Active | Low | Keep; maintain secret protection |
| **Second Brain** | `/api/internal/v1/endpoints` | GET | [`app/api/internal/v1/endpoints/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/endpoints/route.ts#L19-L131) | Introspection catalog & OpenAPI 3.0 dynamic exporter | External agents | Machine Agent | Database Agent Token (`Bearer <key_id>.<secret>`) | Action: `meta.endpoints.read` | Manual query param check (`format`) | `agent_api_credentials`, `agent_principals` | Neon PostgreSQL | Endpoint descriptions, caller principal metadata | None | JSON error response via `internalApiErrorResponse` | None | N/A (Idempotent GET) | Error logs only | Active | Low | Keep; canonical agent discovery entry point |
| **Second Brain** | `/api/internal/v1/context/search` | POST | [`app/api/internal/v1/context/search/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/context/search/route.ts#L18-L93) | Hierarchical context RAG search | External agents | Machine Agent | Database Agent Token (`Bearer <key_id>.<secret>`) | Action: `context.read` on `SECOND_BRAIN_DOMAIN` | Manual `typeof` object checks | `resource_context_index`, `resource_registry`, `locations` | Neon PostgreSQL | Playbook titles, Notion/Drive URLs | None | JSON error response via `internalApiErrorResponse` | None | N/A (Read-only POST) | Error logs only | Active | Low | Keep; replace manual parsing with Zod |
| **Second Brain** | `/api/internal/v1/automations/status` | GET | [`app/api/internal/v1/automations/status/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/status/route.ts#L13-L37) | Reads runtime operational status & active claims | External agent (`automation-os`) | Machine Agent | Database Agent Token (`Bearer <key_id>.<secret>`) | Action: `automation.status.read` | None (HTTP GET) | `execution_claims_automation`, `occurrences_automation` | Neon PostgreSQL | Job counts, cycle statistics | None | JSON error response via `internalApiErrorResponse` | None | N/A (Read-only) | Error logs only | Uncertain | Low | Consolidate or internalize |
| **Second Brain** | `/api/internal/v1/automations/due-jobs` | GET | [`app/api/internal/v1/automations/due-jobs/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/due-jobs/route.ts#L13-L40) | Evaluates due scheduled jobs | External agent (`automation-os`) | Machine Agent | Database Agent Token (`Bearer <key_id>.<secret>`) | Action: `automation.evaluate` | None (HTTP GET) | `jobs_automation`, `schedules_automation`, `policy` | Neon PostgreSQL | Automation schedule configurations | None | JSON error response via `internalApiErrorResponse` | None | N/A (Read-only) | Error logs only | Uncertain | Low | Consolidate into unified automation RPC |
| **Second Brain** | `/api/internal/v1/automations/jobs/[key]` | GET | [`app/api/internal/v1/automations/jobs/[key]/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/jobs/%5Bkey%5D/route.ts#L13-L48) | Reads detailed job configuration & targets | External agent (`automation-os`) | Machine Agent | Database Agent Token (`Bearer <key_id>.<secret>`) | Action: `automation.read` on `job:[key]` | Path param extraction | `jobs_automation`, `job_targets_automation`, `dependencies` | Neon PostgreSQL | Target resource IDs, prompt references | None | JSON error response via `internalApiErrorResponse` | None | N/A (Read-only) | Error logs only | Uncertain | Low | Consolidate into unified automation RPC |
| **Second Brain** | `/api/internal/v1/automations/occurrences/ensure` | POST | [`app/api/internal/v1/automations/occurrences/ensure/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/occurrences/ensure/route.ts#L13-L52) | Idempotently creates job occurrence slot | External agent (`automation-os`) | Machine Agent | Database Agent Token (`Bearer <key_id>.<secret>`) | Action: `automation.occurrence.write` | Manual `if (!jobId \|\| !occurrenceKey)` | `occurrences_automation` | Neon PostgreSQL | Job IDs, occurrence keys | Inserts/updates occurrence slot | JSON error response via `internalApiErrorResponse` | None | Idempotent via `(job_id, occurrence_key)` conflict | Error logs only | Uncertain | Low | Consolidate into unified automation RPC |
| **Second Brain** | `/api/internal/v1/automations/claims/acquire` | POST | [`app/api/internal/v1/automations/claims/acquire/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/claims/acquire/route.ts#L13-L52) | Acquires timed lease on occurrence | External agent (`automation-os`) | Machine Agent | Database Agent Token (`Bearer <key_id>.<secret>`) | Action: `automation.claim.acquire` | Manual `if (!occurrenceId \|\| !claimedBy)` | `execution_claims_automation` | Neon PostgreSQL | Worker IDs, occurrence IDs | Inserts execution claim | JSON error response via `internalApiErrorResponse` | None | Timed lease semantics | Error logs only | Uncertain | Low | Consolidate into unified automation RPC |
| **Second Brain** | `/api/internal/v1/automations/claims/release` | POST | [`app/api/internal/v1/automations/claims/release/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/claims/release/route.ts#L13-L54) | Releases active lease claim | External agent (`automation-os`) | Machine Agent | Database Agent Token (`Bearer <key_id>.<secret>`) | Action: `automation.claim.release` | Manual `if (!claimId)` | `execution_claims_automation` | Neon PostgreSQL | Claim IDs | Sets `released_at = now()` | JSON error response via `internalApiErrorResponse` | None | Idempotent UPDATE | Error logs only | Uncertain | Low | Consolidate into unified automation RPC |
| **Second Brain** | `/api/internal/v1/automations/attempts/start` | POST | [`app/api/internal/v1/automations/attempts/start/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/attempts/start/route.ts#L13-L55) | Logs beginning of job execution attempt | External agent (`automation-os`) | Machine Agent | Database Agent Token (`Bearer <key_id>.<secret>`) | Action: `automation.attempt.write` | Manual `if (!occurrenceId \|\| attemptNumber === undefined)` | `occurrence_attempts_automation` | Neon PostgreSQL | Occurrence IDs, attempt sequence | Inserts execution attempt | JSON error response via `internalApiErrorResponse` | None | Idempotent via `ON CONFLICT` | Error logs only | Uncertain | Low | Consolidate into unified automation RPC |
| **Second Brain** | `/api/internal/v1/automations/attempts/finish` | POST | [`app/api/internal/v1/automations/attempts/finish/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/attempts/finish/route.ts#L13-L58) | Records attempt status & disposition | External agent (`automation-os`) | Machine Agent | Database Agent Token (`Bearer <key_id>.<secret>`) | Action: `automation.attempt.write` | Manual `if (!attemptId \|\| !status)` | `occurrence_attempts_automation` | Neon PostgreSQL | Attempt error messages, dispositions | Updates attempt completion | JSON error response via `internalApiErrorResponse` | None | Idempotent UPDATE | Error logs only | Uncertain | Low | Consolidate into unified automation RPC |
| **Second Brain** | `/api/internal/v1/automations/cycles/upsert` | POST | [`app/api/internal/v1/automations/cycles/upsert/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/cycles/upsert/route.ts#L13-L50) | Upserts batch cycle statistics | External agent (`automation-os`) | Machine Agent | Database Agent Token (`Bearer <key_id>.<secret>`) | Action: `automation.cycle.write` | Manual `if (!automationCycleKey \|\| !legacyRunId)` (passes raw `body`) | `runner_cycles_automation` | Neon PostgreSQL | Cycle statistics, target resource keys | Upserts cycle record | JSON error response via `internalApiErrorResponse` | None | Idempotent via `ON CONFLICT` | Error logs only | Uncertain | Medium | Validate body with Zod; consolidate |
| **Other / Doc** | `/pricing.md` | GET | [`app/pricing.md/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/pricing.md/route.ts#L43-L47) | Dynamic markdown pricing sheet for buying agents | Web crawlers, AI assistants | Autonomous buying agents | None (Public) | None | None | None | None | Public pricing | None | None (Static generation) | N/A | Idempotent | None | Active | Low | Keep; valid machine-readable document |
| **Other / Doc** | `/llms.txt` | GET | [`app/llms.txt/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/llms.txt/route.ts#L81-L85) | Machine-readable service summary (llmstxt.org) | Generative AI search engines | LLM crawlers | None (Public) | None | None | None | None | Public capability copy | None | None (Static generation) | N/A | Idempotent | None | Active | Low | Keep; valid machine-readable document |
| **Other / Doc** | `/llms-full.txt` | GET | [`app/llms-full.txt/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/llms-full.txt/route.ts#L167-L171) | Full depth textual catalog export for RAG | Generative AI models | LLM crawlers | None (Public) | None | None | None | None | Full catalog textual specs | None | None (Static generation) | N/A | Idempotent | None | Active | Low | Keep; valid machine-readable document |
| **Other / Doc** | `/contact.vcf` | GET | [`app/contact.vcf/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/contact.vcf/route.ts#L39-L46) | Downloadable vCard 3.0 organization card | Scanned physical business card | Mobile phone browsers | None (Public) | None | None | None | None | Public company contact details | None | None (Static generation) | N/A | Idempotent | None | Active | Low | Keep; valid document route |
| **Server Action** | `app/dashboard/actions.ts` | POST (RPC) | [`app/dashboard/actions.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/actions.ts#L1) | Operator Command Center metrics & test simulations | Operator Dashboard UI components | Operator browser | Clerk Operator Session | Allowlist `DASHBOARD_OPERATOR_USER_IDS` | Param validation + `assertValidClientId` | Direct Neon SQL via `ContextRepository` (in `triggerSecondBrainContextSearch`) | Twilio / SendGrid / Neon | Client configs, test lead/SMS data | Revalidates Next.js cache; runs simulated scheduler tick | Throws standard Next.js Server Action exceptions | Session protected | Varies per action | Logs operator simulation events | Active | Medium | Remediate direct DB call; enforce IAM |
| **Server Action** | `app/dashboard/flows/actions.ts` | POST (RPC) | [`app/dashboard/flows/actions.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/flows/actions.ts#L1) | Reads clients & toggles automation flow overrides | [`app/dashboard/flows/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/flows/page.tsx) | Operator browser | Clerk Operator Session | Allowlist `DASHBOARD_OPERATOR_USER_IDS` | `assertValidClientId` + string check | None (writes to `.automations/overrides/*.json`) | None | Client configuration overrides | Writes disk JSON overrides | Throws on unknown automation ID | Session protected | Idempotent toggle | None | Active | Low | Keep |
| **Server Action** | `app/dashboard/drafts/actions.ts` | POST (RPC) | [`app/dashboard/drafts/actions.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/drafts/actions.ts#L1) | Reviews, approves, or rejects pending AI drafts | [`app/dashboard/drafts/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/drafts/page.tsx) | Operator browser | Clerk Operator Session | Allowlist `DASHBOARD_OPERATOR_USER_IDS` | `assertValidClientId` + string check | None (writes to `.automations/drafts/*.json`) | Twilio / SendGrid (upon approval) | Outbound draft messages, contact phone numbers | Dispatches message on approval, clears draft | Throws on missing draft | Session protected | Idempotency key per send | Logs outbound dispatch | Active | Low | Keep |

---

## 4. Second Brain API Deep Audit

### Architectural Boundary Analysis

The intended architecture for the Second Brain requires:
```text
Browser / Agent Client
       ↓
Skill Corner HTTP API (/api/internal/v1/...)
       ↓
Authentication (authenticateAgent)
       ↓
Authorization (authorize)
       ↓
Repository Layer (ContextRepository / AutomationRepository)
       ↓
Neon Database (restricted skill_corner_runtime role)
```

### Audit Findings

1. **HTTP Layer Compliance:**
   All 11 endpoints under `app/api/internal/v1/...` strictly adhere to this pipeline:
   - They extract `Authorization: Bearer <key_id>.<secret>` or `x-api-key`.
   - They query `second_brain_security.authenticate_agent($1, $2)` via [`lib/second-brain/auth/authenticate.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/second-brain/auth/authenticate.ts#L59-L98).
   - They evaluate fine-grained permissions via [`lib/second-brain/auth/authorize.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/second-brain/auth/authorize.ts#L96-L206).
   - They return standardized, shielded errors using [`internalApiErrorResponse`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/second-brain/http.ts#L8-L21).

2. **Dashboard Direct-Query Shortcut (Boundary Breach):**
   In [`app/dashboard/actions.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/actions.ts#L340-L383), the server action `triggerSecondBrainContextSearch`:
   ```typescript
   // app/dashboard/actions.ts:353
   const results = await ContextRepository.searchContext({
     domain,
     subdomain,
     keywords,
     limit: 3,
   });
   ```
   **Finding:** The operator dashboard verifies Clerk authentication, but calls `ContextRepository.searchContext` **directly** using the database pool. It completely bypasses `authenticateAgent` and `authorize`.
   *Assessment:* While the operator is an authenticated administrator, bypassing the IAM layer means this query produces **zero Second Brain audit log entries** and circumvents domain-level IAM access controls.

3. **Database Credentials & Connection Isolation:**
   - **Runtime Connection:** [`lib/second-brain/db/client.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/second-brain/db/client.ts#L66) connects using `SECOND_BRAIN_DATABASE_URL` (restricted `skill_corner_runtime` PostgreSQL role).
   - **Admin Connection:** [`lib/second-brain/admin/lifecycle.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/second-brain/admin/lifecycle.ts#L25) connects using `SECOND_BRAIN_ADMIN_DATABASE_URL` (`neondb_owner`).
   - **Isolation Status:** Clean. The administrative pool is strictly isolated inside `lifecycle.ts`, which is **never imported by any HTTP route handler**. Only unit tests and maintenance scripts touch it.

4. **SSL Enforcement:**
   [`resolveDatabaseSslConfig`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/second-brain/db/client.ts#L13-L61) strictly enforces `{ rejectUnauthorized: true }` in production (`NODE_ENV === "production"` or `VERCEL_ENV === "production"`). Any attempt to supply `sslmode=disable` or set `SECOND_BRAIN_DB_SSL_REJECT_UNAUTHORIZED=false` in production throws an immediate configuration exception.

---

## 5. Indian Phone SMS / OTP Relay Deep Audit

The Indian SMS Relay is a dedicated, security-critical hardware integration designed to capture SMS and OTP messages received on an Indian Android smartphone and relay them to Canadian destination endpoints.

### 5.1 End-to-End Request Pipeline

```text
Indian Android Device
  │
  ├─ Hardware SMS BroadcastReceiver (Dual SIM aware)
  ├─ Raw payload constructed: { eventId, sender, body, receivedAt, sim }
  ├─ Computes SHA256(raw_http_body_bytes)
  ├─ Builds Canonical String (VERSION, METHOD, PATH, RELAY_ID, DEVICE_ID, TIMESTAMP, NONCE, BODY_HASH)
  ├─ Signs HMAC-SHA256 with SMS_RELAY_HMAC_SECRET
  └─ Dispatches HTTPS POST to /api/v1/relay
        ↓
Next.js Server (/api/v1/relay/route.ts -> relay/handler.ts)
  │
  ├─ 1. Method Check (POST only; others return 405 Method Not Allowed)
  ├─ 2. Content-Type Check (application/json)
  ├─ 3. Content-Length Check (max 16KB)
  ├─ 4. Header Format Verification:
  │      X-Relay-Version: === "1"
  │      X-Relay-Nonce: ^[0-9a-fA-F]{32}$
  │      X-Relay-Signature: ^[0-9a-fA-F]{64}$
  │      X-Relay-ID: === SMS_RELAY_ID
  │      X-Relay-Device: in SMS_RELAY_DEVICE_ID list
  ├─ 5. Freshness Window: abs(serverTime - requestTimestamp) <= 300s
  ├─ 6. Raw ArrayBuffer Body Read & SHA-256 Hashing
  ├─ 7. Canonical String Reconstruction & HMAC-SHA256 Generation
  ├─ 8. Constant-Time Signature Comparison (crypto.timingSafeEqual via safeEqualHex)
  ├─ 9. Strict Zod Schema Validation (relayPayloadSchema.strict())
  ├─ 10. Normalized Message Construction (buildRelayMessage)
  └─ 11. Delivery Adapter Dispatch (EmailDeliveryAdapter / WebhookDeliveryAdapter)
        ↓
Downstream Delivery (SendGrid / Resend API)
  │
  └─ Transmits plain text email to SMS_RELAY_EMAIL_TO
        ↓
HTTP Response to Android Device
  ├─ 200 OK: { success: true, eventId, provider } (Do not retry)
  ├─ 401 Unauthorized: { success: false, code: "AUTHENTICATION_FAILED" } (Permanent error)
  ├─ 422 Unprocessable: { success: false, code: "INVALID_PAYLOAD" } (Schema failure)
  ├─ 502 Bad Gateway: { success: false, retryable: false, code: "DELIVERY_REJECTED" } (Permanent provider 4xx)
  └─ 503 Service Unavailable: { success: false, retryable: true, code: "DELIVERY_TEMPORARILY_UNAVAILABLE" } (Retry)
```

### 5.2 Cryptographic & Replay Evaluation

1. **HMAC Signature Primitive:**
   Uses Node.js `crypto.createHmac("sha256", secret)` over a strict 8-line canonical string ([`relay/auth/canonicalRequest.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/relay/auth/canonicalRequest.ts#L46-L53)).
2. **Byte-Level Integrity:**
   Computes SHA-256 over raw `ArrayBuffer` bytes ([`relay/auth/verifyRelayRequest.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/relay/auth/verifyRelayRequest.ts#L134-L143)). Prevents JSON deserialization whitespace or key-reordering tampering.
3. **Constant-Time Comparison:**
   [`relay/auth/safeEqualHex.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/relay/auth/safeEqualHex.ts#L10-L24) enforces equal byte length before invoking `crypto.timingSafeEqual`.
4. **Replay Vulnerability (Confirmed):**
   *Evidence:* In [`relay/auth/verifyRelayRequest.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/relay/auth/verifyRelayRequest.ts#L101), `x-relay-nonce` is checked against `/^[0-9a-fA-F]{32}$/`, but the nonce is **never recorded or tracked** in memory, Redis, or a database.
   *Impact:* An attacker intercepting a valid request over an untrusted proxy or hostile network can replay the exact same signed request repeatedly within the 300-second window. The server will authenticate every duplicate and deliver duplicate emails for each request.
   *Mitigation:* Store seen `eventId` or `nonce` in an in-memory LRU cache or Redis with a TTL of 300 seconds.

### 5.3 Data Exposure & Persistence

- **Persistence:** **Zero.** The relay does not persist SMS messages, OTP codes, or phone numbers to Neon PostgreSQL, local JSON files, or cache.
- **Log Exposure:** **Zero.** Neither `relay/handler.ts`, `verifyRelayRequest.ts`, nor `EmailDeliveryAdapter.ts` emit console logs or telemetry containing message bodies, OTPs, or phone numbers.
- **Email Subject Exposure:**
  In [`relay/adapters/EmailDeliveryAdapter.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/relay/adapters/EmailDeliveryAdapter.ts#L45-L46):
  ```typescript
  const cleanPreview = message.body.split("\n")[0].trim().slice(0, 40);
  const subject = `[SMS] ${message.sender}${simText}: ${cleanPreview}${message.body.length > 40 ? "..." : ""}`;
  ```
  *Finding:* The first 40 characters of the SMS body (which frequently contains OTP digits, e.g., *"Your OTP is 492014"*) are placed directly into the email subject line. Email subject lines are often unencrypted in transit between mail transfer agents and visible in mobile push notification previews.
  *Recommendation:* Avoid placing message body excerpts in the email subject. Use `[SMS Relay] New message from ${message.sender}` as the subject, keeping OTP codes exclusively in the email body.

---

## 6. Utility API Audit

### 6.1 `POST /api/lead`
- **Location:** [`app/api/lead/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/lead/route.ts)
- **Primary Consumer:** Web browser ([`components/forms/ContactForm.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/components/forms/ContactForm.tsx), [`components/checklist/InteractiveChecklist.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/components/checklist/InteractiveChecklist.tsx), [`components/journey/demonstration/BlueprintCaptureModal.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/components/journey/demonstration/BlueprintCaptureModal.tsx)).
- **Auth/Authz:** None (Public).
- **Validation:** Bounded by [`readBoundedBody(request, 32 * 1024)`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/request-limit.ts#L33) (32KB); parsed with Zod `leadSchema`. Strips invisible `website` honeypot field.
- **Delivery:** Dispatches JSON payload to `LEAD_WEBHOOK_URL` with an 8-second timeout (`AbortSignal.timeout(8000)`).
- **Failsafe:** Fails loud (503) if `LEAD_WEBHOOK_URL` is unset in production. Returns 200 with `{ delivered: false }` in non-production.
- **Assessment:** Well-engineered defense against payload stuffing and bot traps, but lacks IP-based rate limiting.

### 6.2 `POST /api/newsletter/subscribe`
- **Location:** [`app/api/newsletter/subscribe/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/newsletter/subscribe/route.ts)
- **Primary Consumer:** Web browser ([`features/newsletters/components/NewsletterSubscribeForm.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/features/newsletters/components/NewsletterSubscribeForm.tsx)).
- **Auth/Authz:** None (Public).
- **Validation:** Bounded to 32KB; parsed with Zod `SubscribeSchema`; validates that `newsletterSlug` exists in [`features/newsletters/data/newsletters.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/features/newsletters/data/newsletters.ts).
- **Delivery:** Forwards to `LEAD_WEBHOOK_URL` if configured.
- **Privacy:** Masks email in server logs (`abc***@example.com`).
- **Assessment:** Clean implementation, but duplicates the webhook dispatch logic from `/api/lead`.

### 6.3 `POST /api/inbound`
- **Location:** [`app/api/inbound/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/inbound/route.ts)
- **Primary Consumer:** Twilio Messaging Webhook.
- **Auth/Authz:** Validates `X-Twilio-Signature` using `TWILIO_AUTH_TOKEN`. Fails closed (500) if token is unset in production.
- **Validation:** 32KB payload bounding; urlencoded / multipart parsing via [`parseTwilioInbound`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/automations/inbound/webhook.ts).
- **Delivery & Persistence:** Delegates to [`processInbound`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/automations/server/process-inbound.ts), which records state to local files (`.automations/radiance-salon/conversation.json`, etc.).
- **Assessment:** Operates as a reliable edge webhook. Storage should eventually migrate from local disk JSON files to PostgreSQL.

### 6.4 `GET /api/cron`
- **Location:** [`app/api/cron/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/cron/route.ts)
- **Primary Consumer:** Vercel Cron.
- **Auth/Authz:** Bearer token (`CRON_SECRET`).
- **Function:** Runs [`runTick`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/automations/server/run-tick.ts) across all active client automation flows.
- **Assessment:** Standard serverless cron runner. Clean, minimal, and secure.

---

## 7. Email System Deep Audit

### Inventory of Email-Sending Implementations

| Subsystem | File Path | Mechanism | Provider(s) | Destination | Subject Handling |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SMS Relay Adapter** | [`relay/adapters/EmailDeliveryAdapter.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/relay/adapters/EmailDeliveryAdapter.ts#L23) | Direct `fetch()` to REST API | SendGrid (`/v3/mail/send`) or Resend (`/emails`) | `SMS_RELAY_EMAIL_TO` (env configured) | Custom formatted `[SMS] sender: preview...` |
| **Automation Engine** | [`automations/channels/email-sendgrid.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/automations/channels/email-sendgrid.ts#L22) | Direct `fetch()` to REST API | SendGrid (`/v3/mail/send`) | Customer email address | Dynamic per template / campaign |

### Analysis of Email Fragmentation

1. **Why Multiple Implementations Exist:**
   The SMS Relay was architected as an isolated, zero-dependency sub-package (`relay/`), while the Automation Engine was developed under `automations/channels/`. Neither shared a common utility.
2. **Duplication Identified:**
   Both modules independently construct SendGrid v3 JSON bodies (`{ personalizations, from, subject, content }`) and perform raw `fetch("https://api.sendgrid.com/v3/mail/send")`.
3. **Security Assessment:**
   - **Arbitrary Recipient Injection:** Neither endpoint allows arbitrary client-controlled recipients. The relay sends strictly to `SMS_RELAY_EMAIL_TO`; the automation engine sends to validated contacts in the client store.
   - **Header Injection:** In `EmailDeliveryAdapter`, message preview is extracted via `.split("\n")[0]`. However, carriage return characters (`\r`) are not stripped, which could permit CRLF injection in unhardened email parsers.

### Recommended Target: Unified `EmailService`

```text
lib/email/
  ├── EmailService.ts          (Unified client with sendTransactionalEmail, sendRelayNotice)
  ├── providers/
  │     ├── SendGridProvider.ts (Shared HTTP fetch, auth, error mapping)
  │     └── ResendProvider.ts   (Resend HTTP adapter)
  └── sanitize.ts              (CRLF stripping for subjects & headers)
```

---

## 8. Authentication & Authorization Matrix

| Endpoint / Action | Auth Strategy | Auth Header / Token | Principal | Scopes / Permissions | Failure Status | Bypass Paths |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| `POST /api/v1/relay` | HMAC-SHA256 | `X-Relay-Signature`, `X-Relay-Timestamp`, `X-Relay-Nonce` | Device (`X-Relay-Device`) | Allowlist matching `SMS_RELAY_DEVICE_ID` | 401 | None |
| `POST /api/lead` | None (Public) | None | Anonymous Web Visitor | None | 400 / 503 | Honeypot only |
| `POST /api/newsletter/subscribe`| None (Public) | None | Anonymous Web Visitor | None | 400 / 404 | Honeypot only |
| `POST /api/inbound` | Twilio HMAC | `X-Twilio-Signature` | Twilio Service | Valid phone number routing | 403 / 500 | `ALLOW_UNSIGNED_TWILIO_WEBHOOKS_DEV` (Dev only) |
| `GET /api/cron` | Bearer Token | `Authorization: Bearer <CRON_SECRET>` | Scheduler Cron | Token match | 401 | None |
| `GET /api/internal/v1/endpoints` | Database IAM Token | `Authorization: Bearer <key>.<secret>` or `x-api-key` | Agent Principal (`chatgpt`, `claude`, etc.) | `meta.endpoints.read` | 401 / 403 | None |
| `POST /api/internal/v1/context/search` | Database IAM Token | `Authorization: Bearer <key>.<secret>` or `x-api-key` | Agent Principal | `context.read` on `SECOND_BRAIN_DOMAIN` | 401 / 403 | None |
| `/api/internal/v1/automations/*` (9 routes) | Database IAM Token | `Authorization: Bearer <key>.<secret>` or `x-api-key` | Agent Principal (`automation-os`) | Specific actions (`automation.*`) | 401 / 403 | None |
| `app/dashboard/actions.ts` | Clerk Session | Cookie / Clerk Auth Header | Clerk User | `DASHBOARD_OPERATOR_USER_IDS` allowlist | 401 / 403 | `ALLOW_DEV_OPERATOR_AUTH` (Dev only) |
| `app/dashboard/flows/actions.ts` | Clerk Session | Cookie / Clerk Auth Header | Clerk User | `DASHBOARD_OPERATOR_USER_IDS` allowlist | 401 / 403 | `ALLOW_DEV_OPERATOR_AUTH` (Dev only) |
| `app/dashboard/drafts/actions.ts` | Clerk Session | Cookie / Clerk Auth Header | Clerk User | `DASHBOARD_OPERATOR_USER_IDS` allowlist | 401 / 403 | `ALLOW_DEV_OPERATOR_AUTH` (Dev only) |

---

## 9. Input Validation Audit

| Route | Validation Engine | Max Payload Boundary | Unknown Properties | Type Safety | Flaws / Vulnerabilities |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `/api/v1/relay` | Zod (`relayPayloadSchema`) | 16 KB enforced before crypto | Rejected (`.strict()`) | Strong TypeScript types | None; exemplary schema hardening |
| `/api/lead` | Zod (`leadSchema`) | 32 KB via `readBoundedBody` | Stripped / rejected | Strong TypeScript types | None |
| `/api/newsletter/subscribe` | Zod (`SubscribeSchema`) | 32 KB via `readBoundedBody` | Stripped | Strong TypeScript types | None |
| `/api/inbound` | Manual URL/FormData parser | 32 KB via `readBoundedBody` | Ignored | Normalised `InboundMessage` | Missing strict Zod schema on Twilio fields |
| `/api/cron` | None (GET) | N/A | N/A | N/A | None |
| `/api/internal/v1/endpoints` | Manual query check | N/A (GET) | Ignored | Typed | None |
| `/api/internal/v1/context/search`| Manual `typeof` & array checks | Framework default | Allowed | Ad-hoc casting | Missing Zod schema; manual parameter checking |
| `/api/internal/v1/automations/*` (9 routes) | Ad-hoc `if (!param)` checks | Framework default | Allowed | Partial | **Unchecked `body` passed directly to DB queries** in `cycles/upsert` |

---

## 10. Security Findings

### Confirmed Vulnerabilities

1. **SMS Relay Window Replay Attack (Vulnerability — Severity: Medium)**
   - **Evidence:** [`relay/auth/verifyRelayRequest.ts:101-131`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/relay/auth/verifyRelayRequest.ts#L101-L131). The nonce is verified against a regex but never stored.
   - **Impact:** An attacker who intercepts a valid signed request can replay it repeatedly within the 300-second window, forcing the backend to send duplicate emails and incur provider costs (SendGrid/Resend denial-of-wallet).
   - **Remediation:** Implement in-memory or Redis-based deduplication on `eventId` and `nonce` with a 300s TTL.

2. **Second Brain IAM Bypass in Operator Action (Vulnerability — Severity: Low)**
   - **Evidence:** [`app/dashboard/actions.ts:353`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/actions.ts#L353). Server action executes `ContextRepository.searchContext()` directly via SQL pool without authenticating an IAM agent principal.
   - **Impact:** Direct database query occurs without IAM grant evaluation or audit logging.
   - **Remediation:** Refactor `triggerSecondBrainContextSearch` to call through the standard IAM pipeline or execute as a declared internal operator principal.

### Potential Vulnerabilities

3. **Public Ingestion Abuse on Lead & Newsletter Routes (Severity: Medium)**
   - **Evidence:** [`app/api/lead/route.ts:40`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/lead/route.ts#L40) and [`app/api/newsletter/subscribe/route.ts:18`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/newsletter/subscribe/route.ts#L18). Both routes lack IP rate limiting.
   - **Impact:** Headless scrapers can bypass the CSS-hidden honeypot and flood the downstream Zapier webhook, exhausting task quotas.
   - **Remediation:** Implement Upstash Redis rate limiting or Vercel WAF IP rate limit rules.

4. **Raw Body Injection into Database in Automation Cycles Upsert (Severity: Low)**
   - **Evidence:** [`app/api/internal/v1/automations/cycles/upsert/route.ts:45`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/cycles/upsert/route.ts#L45). The handler passes unvalidated `body` directly to `AutomationRepository.upsertRunnerCycle(body)`.
   - **Impact:** Undeclared fields or malformed data types could cause runtime SQL casting exceptions.
   - **Remediation:** Wrap the request body in a strict Zod schema.

### Hardening Opportunities

5. **CRLF Sanitization in Relay Email Subject (Hardening):**
   - Strip `\r` and `\n` from sender names before concatenating into the email subject line in [`EmailDeliveryAdapter.ts:46`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/relay/adapters/EmailDeliveryAdapter.ts#L46).
6. **Masking OTP Codes in Relay Email Subject (Hardening):**
   - Eliminate message body previews from the email subject line to prevent OTP leakage into unencrypted mail headers and lockscreen notifications.

---

## 11. API Caller Graph

```text
[Browser: ContactForm / Checklist / Modal] ──▶ fetch("/api/lead") ──▶ Zapier / Make / n8n
[Browser: NewsletterSubscribeForm] ─────────▶ fetch("/api/newsletter/subscribe") ──▶ Zapier / Make
[Twilio Inbound SMS Webhook] ───────────────▶ POST /api/inbound ──▶ processInbound() ──▶ Disk JSON
[Vercel Platform Cron] ─────────────────────▶ GET /api/cron ──▶ runTick() ──▶ Twilio / SendGrid
[Indian Android Phone] ─────────────────────▶ POST /api/v1/relay ──▶ EmailDeliveryAdapter ──▶ Canadian Inbox

[Autonomous AI Agents (Claude / ChatGPT)] ──▶ GET /api/internal/v1/endpoints ──▶ Introspection Catalog
[Autonomous AI Agents] ─────────────────────▶ POST /api/internal/v1/context/search ──▶ ContextRepository ──▶ Neon DB
[External Automation OS Agent] ─────────────▶ /api/internal/v1/automations/* (9 APIs) ──▶ AutomationRepository ──▶ Neon DB

[Dashboard UI: /dashboard/workflows] ───────▶ Server Actions: triggerSimulated...() ──▶ runTick() / processInbound()
[Dashboard UI: /dashboard/flows] ───────────▶ Server Actions: toggleFlow() ──▶ .automations/overrides/*.json
[Dashboard UI: /dashboard/drafts] ──────────▶ Server Actions: approveDraft() ──▶ dispatch() ──▶ Twilio
```

---

## 12. API Consolidation Candidates

### Candidate 1: Inbound Lead & Newsletter Subscription Endpoints
- **Current:**
  - `POST /api/lead` ([`app/api/lead/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/lead/route.ts))
  - `POST /api/newsletter/subscribe` ([`app/api/newsletter/subscribe/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/newsletter/subscribe/route.ts))
- **Shared Responsibility:** Both endpoints perform payload bounding (32KB), JSON parsing, honeypot evaluation, PII masking, and forwarding to `LEAD_WEBHOOK_URL`.
- **Target Architecture:** Consolidate CRM forwarding logic into a shared server utility `lib/crm/forwardLead.ts`. Keep distinct route paths for REST semantics, or merge into `POST /api/intake` with an intake type discriminator.
- **Migration Risk:** Low.
- **Expected Simplification:** Eliminates ~70 lines of duplicate webhook-forwarding and error-shielding boilerplate.

### Candidate 2: Dual Email Sending Implementations
- **Current:**
  - `relay/adapters/EmailDeliveryAdapter.ts`
  - `automations/channels/email-sendgrid.ts`
- **Shared Responsibility:** HTTP POST dispatch to SendGrid v3 mail API with error handling.
- **Target Architecture:** Unified `lib/email/EmailService.ts` supporting SendGrid and Resend providers.
- **Migration Risk:** Low.
- **Expected Simplification:** Standardizes timeout, retry, and error classification across both subsystems.

### Candidate 3: Nine Discrete Automation OS State Machine APIs
- **Current:** 9 individual HTTP routes under `/api/internal/v1/automations/*` (`status`, `due-jobs`, `jobs/[key]`, `occurrences/ensure`, `claims/acquire`, `claims/release`, `attempts/start`, `attempts/finish`, `cycles/upsert`).
- **Why Duplication Exists:** Built as fine-grained REST endpoints for an external runner agent.
- **Target Architecture:** Consolidate into a single command dispatcher endpoint:
  ```text
  POST /api/internal/v1/automations/rpc
  Body: { action: "claims.acquire" | "attempts.start" | ..., params: { ... } }
  ```
- **Migration Risk:** Moderate (requires updating external agent caller contract).
- **Expected Simplification:** Reduces 9 route handlers to 1, eliminating 8 routing files, duplicated authentication boilerplate, and disparate error handlers.

---

## 13. APIs That Should Not Be APIs

1. **Machine-Readable Static Documents as Route Handlers:**
   - [`app/pricing.md/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/pricing.md/route.ts)
   - [`app/llms.txt/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/llms.txt/route.ts)
   - [`app/llms-full.txt/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/llms-full.txt/route.ts)
   - [`app/contact.vcf/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/contact.vcf/route.ts)
   *Assessment:* These 4 handlers are marked `export const dynamic = "force-static"`. They do not accept client input, perform mutations, or interact with databases. They function as dynamically generated static files.
   *Recommendation:* Retain them as route handlers because Next.js App Router uses `route.ts` for text/plain document exports, but classify them in documentation as **Document Generators**, not interactive network APIs.

2. **Dashboard Server Actions Calling Internal APIs:**
   *Finding:* The dashboard server actions ([`app/dashboard/actions.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/actions.ts)) correctly avoid making HTTP roundtrips to `/api/cron` or `/api/internal/...`. They invoke server functions directly (`runTick()`, `processInbound()`, `ContextRepository.searchContext()`). This avoids unnecessary same-application HTTP hops.

---

## 14. Dead / Orphaned API Analysis

| Endpoint / Subsystem | Status | Internal References | External Callers | Evidence |
| :--- | :--- | :---: | :---: | :--- |
| `POST /api/internal/v1/automations/status` | **EXTERNAL USAGE UNVERIFIED** | 0 callers | Expected: `automation-os` agent | Zero calls in UI or server engines; tested only via repository unit tests |
| `GET /api/internal/v1/automations/due-jobs` | **EXTERNAL USAGE UNVERIFIED** | 0 callers | Expected: `automation-os` agent | Same as above |
| `GET /api/internal/v1/automations/jobs/[key]` | **EXTERNAL USAGE UNVERIFIED** | 0 callers | Expected: `automation-os` agent | Same as above |
| `POST /api/internal/v1/automations/occurrences/ensure` | **EXTERNAL USAGE UNVERIFIED** | 0 callers | Expected: `automation-os` agent | Same as above |
| `POST /api/internal/v1/automations/claims/acquire` | **EXTERNAL USAGE UNVERIFIED** | 0 callers | Expected: `automation-os` agent | Same as above |
| `POST /api/internal/v1/automations/claims/release` | **EXTERNAL USAGE UNVERIFIED** | 0 callers | Expected: `automation-os` agent | Same as above |
| `POST /api/internal/v1/automations/attempts/start` | **EXTERNAL USAGE UNVERIFIED** | 0 callers | Expected: `automation-os` agent | Same as above |
| `POST /api/internal/v1/automations/attempts/finish` | **EXTERNAL USAGE UNVERIFIED** | 0 callers | Expected: `automation-os` agent | Same as above |
| `POST /api/internal/v1/automations/cycles/upsert` | **EXTERNAL USAGE UNVERIFIED** | 0 callers | Expected: `automation-os` agent | Same as above |
| `POST /api/v1/relay` | **ACTIVE** | 0 callers (by design) | Indian Android Phone | Target endpoint for physical capture hardware |
| `POST /api/lead` | **ACTIVE** | 3 UI forms | Web visitors | Linked in all contact/lead forms |
| `POST /api/newsletter/subscribe` | **ACTIVE** | 1 UI form | Newsletter subscribers | Linked in newsletter subscription forms |
| `POST /api/inbound` | **ACTIVE** | 0 callers (by design) | Twilio Webhook | Target webhook for incoming SMS |
| `GET /api/cron` | **ACTIVE** | 0 callers (by design) | Vercel Cron | Target route for scheduled cron ping |

---

## 15. Environment Variable & Secret Architecture

| Variable | Consumer(s) | Scope | Sensitivity | Classification & Risk |
| :--- | :--- | :---: | :---: | :--- |
| `SMS_RELAY_HMAC_SECRET` | [`relay/config/relayConfig.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/relay/config/relayConfig.ts#L36) | Server | **High** | Secret key for Android HMAC verification. Min 16 chars required. |
| `SMS_RELAY_ID` | `relay/config/relayConfig.ts` | Server | Low | Logical relay identifier (e.g. `india-sms`). |
| `SMS_RELAY_DEVICE_ID` | `relay/config/relayConfig.ts` | Server | Medium | Allowed physical device IDs (comma-separated). |
| `SMS_RELAY_EMAIL_TO` | `relay/adapters/EmailDeliveryAdapter.ts` | Server | Medium | Destination email address in Canada. |
| `SMS_RELAY_EMAIL_FROM` | `relay/adapters/EmailDeliveryAdapter.ts` | Server | Low | Verified sender address. |
| `SMS_RELAY_SENDGRID_API_KEY` | `relay/adapters/createDeliveryAdapter.ts` | Server | **High** | SendGrid API key for SMS relay. Reuses `SENDGRID_API_KEY` as fallback. |
| `SMS_RELAY_RESEND_API_KEY` | `relay/adapters/createDeliveryAdapter.ts` | Server | **High** | Resend API key for SMS relay. Reuses `RESEND_API_KEY` as fallback. |
| `SMS_RELAY_WEBHOOK_URL` | `relay/adapters/WebhookDeliveryAdapter.ts` | Server | Medium | Downstream webhook URL. |
| `SMS_RELAY_WEBHOOK_TOKEN` | `relay/adapters/WebhookDeliveryAdapter.ts` | Server | **High** | Bearer token for downstream webhook. |
| `SECOND_BRAIN_DATABASE_URL` | `lib/second-brain/db/client.ts` | Server | **High** | Neon PostgreSQL runtime URL (restricted `skill_corner_runtime` role). |
| `SECOND_BRAIN_ADMIN_DATABASE_URL`| `lib/second-brain/admin/lifecycle.ts` | Server (Admin) | **Critical** | Neon PostgreSQL admin URL (`neondb_owner`). Never imported in API routes. |
| `LEAD_WEBHOOK_URL` | `app/api/lead/route.ts`, `app/api/newsletter/subscribe/route.ts` | Server | Medium | CRM catch webhook (Zapier / Make / n8n). |
| `CRON_SECRET` | `app/api/cron/route.ts` | Server | **High** | Bearer secret for Vercel Cron ticks. |
| `TWILIO_AUTH_TOKEN` | `app/api/inbound/route.ts` | Server | **High** | Secret used to verify `X-Twilio-Signature`. |
| `DASHBOARD_OPERATOR_USER_IDS` | `app/dashboard/auth-guard.ts` | Server | Medium | Allowlist of authorized Clerk user IDs. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`| Client/Browser | Public | Low | Clerk frontend key. |
| `CLERK_SECRET_KEY` | Server | Server | **High** | Clerk backend secret. |

---

## 16. API Error Handling

### Response Shape Inconsistencies

The codebase exhibits minor variations in error response contracts across different primary domains:

1. **Utility APIs (`/api/lead`):**
   ```json
   { "ok": false, "error": "Lead delivery failed. Please try again, or email us directly." }
   ```
2. **Newsletter API (`/api/newsletter/subscribe`):**
   ```json
   { "error": "Validation failed", "details": { "fieldErrors": { "email": ["Invalid email address"] } } }
   ```
3. **SMS Relay API (`/api/v1/relay`):**
   ```json
   { "success": false, "code": "AUTHENTICATION_FAILED", "error": { "code": "AUTHENTICATION_FAILED" } }
   ```
4. **Second Brain APIs (`/api/internal/v1/...`):**
   ```json
   { "error": "Forbidden", "code": "FORBIDDEN", "reason": "Not authorized to access context domain: finance" }
   ```

### Evaluation
While each domain is internally consistent, utility routes mix `ok: false` with `success: false`. The Second Brain and Relay error shapes are strictly shielded against stack trace or database credential leakage.

---

## 17. Observability & Telemetry

| Route | Metrics / Events Emitted | Log Stream | PII / Secret Sanitization |
| :--- | :--- | :--- | :--- |
| `/api/lead` | `lead_delivery_succeeded`, `lead_delivery_failed` | Console & Telemetry | Fully scrubbed; honeypot drops logged without lead data |
| `/api/newsletter/subscribe` | None | Console JSON | Masked email (`abc***@domain.com`); slug & source context logged |
| `/api/inbound` | None | Console JSON | Destination phone & intent logged; body excluded |
| `/api/v1/relay` | None | None | **Zero console logging; zero message content or credential emission** |
| `/api/cron` | None | Console JSON | Client counts, sent/suppressed counts logged |
| `/api/internal/v1/*` | None | Console on error | Internal error details masked via `internalApiErrorResponse` |

---

## 18. Test Coverage Matrix

| Route / Subsystem | Unit Tests | Integration Tests | Security / Negative Tests | Test File Location |
| :--- | :---: | :---: | :---: | :--- |
| `POST /api/v1/relay` | Yes | Yes | Yes (13 tests) | [`app/api/v1/relay/route.test.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/v1/relay/route.test.ts) |
| Relay Subsystem Modules | Yes | Yes | Yes (52 tests) | [`relay/__tests__/*`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/relay/__tests__) (6 test suites) |
| `POST /api/lead` | Yes | Yes | Yes (15 tests) | [`app/api/lead/route.test.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/lead/route.test.ts) |
| `POST /api/newsletter/subscribe` | Yes | Yes | Yes (6 tests) | [`app/api/newsletter/subscribe/route.test.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/newsletter/subscribe/route.test.ts) |
| `POST /api/inbound` | Yes | Yes | Yes (11 tests) | [`app/api/inbound/route.test.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/inbound/route.test.ts) |
| `GET /api/cron` | Yes | Yes | Yes (4 tests) | [`app/api/cron/route.test.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/cron/route.test.ts) |
| `GET /api/internal/v1/endpoints` | Yes | Yes | Yes (4 tests) | [`lib/second-brain/__tests__/endpoints-introspection.test.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/second-brain/__tests__/endpoints-introspection.test.ts) |
| `POST /api/internal/v1/context/search`| Yes | Yes | Yes (2 tests) | [`lib/second-brain/__tests__/context-rag.test.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/second-brain/__tests__/context-rag.test.ts) |
| `/api/internal/v1/automations/*` (9 routes) | No | No | **None (0 tests)** | **Missing HTTP route-level tests** (only repository is tested) |
| Document Routes (`/pricing.md`, `/llms.txt`, etc.) | No | No | None | Missing content assertion tests |
| Dashboard Server Actions | Yes | Yes | Yes (32 tests) | [`app/dashboard/actions.test.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/actions.test.ts) |

---

## 19. Local-Only ChatGPT ↔ Antigravity Boundary Check

### Scope Verification
A comprehensive search was performed across all routes, middleware, utilities, and configuration files for references to Antigravity, ChatGPT relays, or local IDE communication hooks.

### Findings
1. **Network Exposure:** **None.** There are zero public endpoints, route handlers, webhooks, or cloud services configured to expose or relay ChatGPT ↔ Antigravity interactions.
2. **Database IAM Machine Principal:** In [`db/policies/chatgpt.policy.json`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/db/policies/chatgpt.policy.json) and [`db/migrations/004_provision_principals.sql`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/db/migrations/004_provision_principals.sql#L13), `chatgpt` is defined as a machine principal granted read-only access to Second Brain context. This is strictly for authenticated knowledge retrieval via `/api/internal/v1/context/search`.
3. **Status:**
   ```text
   LOCAL-ONLY TOOLING — OUTSIDE HOSTED API SURFACE
   Status: Correctly isolated — no change recommended.
   ```

---

## 20. Target API Architecture

```text
PROPOSED TARGET API SURFACE

├── Inbound & Public Ingestion
│   ├── POST /api/lead                   (Unified intake with rate limiting)
│   ├── POST /api/newsletter/subscribe   (Thin wrapper over shared CRM service)
│   ├── POST /api/inbound                (Twilio webhook with strict Zod validation)
│   └── GET  /api/cron                   (Bearer authenticated scheduler tick)
│
├── Indian Phone SMS / OTP Relay
│   └── POST /api/v1/relay               (Stateless HMAC relay with 300s in-memory nonce cache)
│
├── Second Brain Context & Agents
│   ├── GET  /api/internal/v1/endpoints  (Dynamic authorized OpenAPI catalog)
│   ├── POST /api/internal/v1/context/search (Zod validated Context RAG)
│   └── POST /api/internal/v1/automations/rpc (Consolidated Automation OS dispatcher)
│
├── Shared Server Services (Not APIs)
│   ├── lib/email/EmailService           (Consolidated SendGrid/Resend transport)
│   ├── lib/crm/LeadForwarder            (Shared CRM webhook dispatch logic)
│   └── lib/second-brain/IAM             (Centralized authorization engine)
│
└── Machine-Readable Document Exports
    ├── GET /pricing.md                  (Static pricing summary)
    ├── GET /llms.txt                    (Static llmstxt.org specification)
    ├── GET /llms-full.txt               (Static full catalog specification)
    └── GET /contact.vcf                 (Static vCard 3.0 export)
```

---

## 21. Prioritized Recommendations

### P0 — Security & Correctness (Immediate Action)

1. **Implement In-Memory Nonce / Event Deduplication on SMS Relay**
   - **Problem:** Stateless relay allows any valid signed payload to be replayed within the 300-second freshness window.
   - **Evidence:** [`relay/auth/verifyRelayRequest.ts:101-131`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/relay/auth/verifyRelayRequest.ts#L101-L131).
   - **Impact:** Replay attacks cause duplicate email deliveries and denial-of-wallet on SendGrid/Resend.
   - **Recommended Change:** Implement a simple in-memory LRU cache (or Redis if multi-instance) storing `eventId` with 300s TTL. Reject already-seen IDs with HTTP 409 or 200 idempotent response.
   - **Files Affected:** `relay/auth/verifyRelayRequest.ts`, `relay/handler.ts`.
   - **Risk:** Very low.
   - **Expected Benefit:** Eliminates replay window vulnerability entirely.

2. **Add IP-Based Rate Limiting on Public Ingestion Endpoints**
   - **Problem:** `/api/lead` and `/api/newsletter/subscribe` have no rate limiting.
   - **Evidence:** [`app/api/lead/route.ts:40`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/lead/route.ts#L40).
   - **Impact:** Automated spam scripts can burn downstream Zapier/Make execution quotas.
   - **Recommended Change:** Add sliding-window rate limiting (e.g. 5 requests/min per IP) via Upstash or edge middleware.
   - **Files Affected:** `app/api/lead/route.ts`, `app/api/newsletter/subscribe/route.ts`.
   - **Risk:** Low.
   - **Expected Benefit:** Protects downstream webhook quotas from spam bursts.

### P1 — Architectural Cleanup (Consolidation & Boundary Correction)

3. **Consolidate 9 Automation OS Endpoints into Single RPC Handler**
   - **Problem:** 9 fine-grained REST endpoints under `/api/internal/v1/automations/*` have 0 internal repository callers and duplicate auth/error handling boilerplate.
   - **Evidence:** [`app/api/internal/v1/automations/`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations).
   - **Impact:** High surface area maintenance cost.
   - **Recommended Change:** Merge the 9 route handlers into `POST /api/internal/v1/automations/rpc` with action-based dispatching.
   - **Files Affected:** Delete 9 route files; create 1 unified route.
   - **Risk:** Moderate (external agent configuration must update).
   - **Expected Benefit:** Eliminates 8 route files and ~350 lines of duplicate boilerplate.

4. **Remediate Dashboard Direct-Query Bypass of Second Brain IAM**
   - **Problem:** `triggerSecondBrainContextSearch` server action queries `ContextRepository` directly without going through Second Brain IAM.
   - **Evidence:** [`app/dashboard/actions.ts:353`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/actions.ts#L353).
   - **Impact:** Bypasses domain IAM grants and Second Brain audit logging.
   - **Recommended Change:** Have the dashboard execute the query with an operator machine token or invoke the IAM authorize method explicitly.
   - **Files Affected:** `app/dashboard/actions.ts`.
   - **Risk:** Low.
   - **Expected Benefit:** Restores architectural layering and audit integrity.

5. **Consolidate Email Sending into Unified `EmailService`**
   - **Problem:** SendGrid REST API integration is duplicated across `relay/adapters/EmailDeliveryAdapter.ts` and `automations/channels/email-sendgrid.ts`.
   - **Evidence:** Both construct raw fetch payloads to `https://api.sendgrid.com/v3/mail/send`.
   - **Impact:** Duplicate provider configurations, divergent timeout behaviors.
   - **Recommended Change:** Create `lib/email/EmailService.ts` to power both the SMS relay email adapter and the automation channel sender.
   - **Files Affected:** `relay/adapters/EmailDeliveryAdapter.ts`, `automations/channels/email-sendgrid.ts`.
   - **Risk:** Low.
   - **Expected Benefit:** Single source of truth for email transport and CRLF sanitization.

### P2 — Maintainability & Standards

6. **Adopt Zod Schema Validation for Second Brain Endpoints**
   - **Problem:** Second Brain routes use ad-hoc `typeof` checks; `cycles/upsert` passes raw unvalidated `body` to the database.
   - **Evidence:** [`app/api/internal/v1/automations/cycles/upsert/route.ts:45`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/cycles/upsert/route.ts#L45).
   - **Recommended Change:** Define Zod schemas for all Second Brain input bodies.
   - **Files Affected:** `app/api/internal/v1/**/*.ts`.
   - **Risk:** Low.
   - **Expected Benefit:** Type-safe runtime validation matching the high standard of `relay/` and `lead/`.

7. **Add HTTP Route Integration Tests for Second Brain Endpoints**
   - **Problem:** The 9 internal automation routes have unit tests for the repository, but zero integration tests for the HTTP route handlers.
   - **Evidence:** [`lib/second-brain/__tests__/automation-os.test.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/second-brain/__tests__/automation-os.test.ts).
   - **Recommended Change:** Add Vitest route tests asserting HTTP 401, 403, and 200 response contracts.
   - **Files Affected:** `lib/second-brain/__tests__/`.
   - **Risk:** Zero.
   - **Expected Benefit:** Complete verification coverage across all hosted routes.

### P3 — Minor Polish

8. **Mask OTP Previews in SMS Relay Email Subject**
   - **Problem:** Email subject contains first 40 chars of SMS body, exposing sensitive OTPs on lockscreen previews.
   - **Evidence:** [`relay/adapters/EmailDeliveryAdapter.ts:46`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/relay/adapters/EmailDeliveryAdapter.ts#L46).
   - **Recommended Change:** Change subject to `[SMS Relay] New SMS from ${message.sender}`, keeping OTP text strictly inside the message body.
   - **Files Affected:** `relay/adapters/EmailDeliveryAdapter.ts`.
   - **Risk:** Low.
   - **Expected Benefit:** Enhanced operational privacy.

---

## 22. API Reduction Metrics

| Metric | Current State | Target State | Net Change |
| :--- | :---: | :---: | :---: |
| **Total Hosted HTTP Route Handlers** | 20 | 12 | **-8 (-40%)** |
| **Second Brain Endpoints** | 11 | 3 | **-8 (-72%)** |
| **Indian SMS Relay Endpoints** | 1 | 1 | 0 |
| **Utility Endpoints** | 4 | 4 | 0 |
| **Machine-Readable Document Handlers** | 4 | 4 | 0 |
| **Server Action Modules** | 3 | 3 | 0 |
| **Endpoints Lacking Zod Validation** | 11 | 0 | **-11 (-100%)** |
| **Independent Email Sending Transports** | 2 | 1 | **-1 (-50%)** |
| **Orphaned / Unverified Endpoints** | 9 | 0 | **-9 (-100%)** |
| **Approximate Total API Handler LOC** | ~1,455 | ~950 | **-505 LOC (-35%)** |

---

## 23. Proposed Implementation Sequence

```text
PHASE 1: Security & Defenses (Immediate)
  ├── 1. Add in-memory 300s nonce/eventId LRU cache to relay/handler.ts
  ├── 2. Mask OTP previews from SMS relay email subject line
  └── 3. Add IP-based rate limiting to /api/lead and /api/newsletter/subscribe

PHASE 2: Email & Ingestion Service Consolidation
  ├── 4. Create lib/email/EmailService.ts with SendGrid/Resend adapters
  ├── 5. Refactor relay/adapters/EmailDeliveryAdapter to use EmailService
  ├── 6. Refactor automations/channels/email-sendgrid.ts to use EmailService
  └── 7. Extract shared CRM webhook forwarder for /api/lead and /api/newsletter/subscribe

PHASE 3: Second Brain Consolidation & Hardening
  ├── 8. Add Zod schemas to /api/internal/v1/context/search and endpoints
  ├── 9. Consolidate 9 /api/internal/v1/automations/* routes into /api/internal/v1/automations/rpc
  ├── 10. Refactor app/dashboard/actions.ts:triggerSecondBrainContextSearch to enforce IAM
  └── 11. Add integration tests for all remaining internal HTTP route handlers
```
