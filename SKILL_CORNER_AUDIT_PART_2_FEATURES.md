# TheSkillCorner Codebase Forensic Audit
## Part 2: Feature Modules, Route Inventory, API Catalog, Data Models & AI Architecture

> **Audit Type**: Read-Only Forensic Architecture Audit  
> **Auditor**: Principal Software Architect  
> **Date**: September 2026  
> **Repository**: `TheSkillCorner` (`/Users/tejindersingh/dev/projects/TheSkillCorner`)  

---

## 5. Complete Feature / Module Catalogue

Forensic mapping of every distinct product feature, functional module, and subsystem discovered in the codebase:

| Module Name | Paths / Principal Files | Purpose | User-Facing? | Entry Points | Backend / Services | Database / Stores | External Integrations | Dependencies | Dependents | Current Status | Usage Evidence | Complexity | Duplication / Overlap | Problems Observed | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Marketing Conversion Funnel** | `app/page.tsx`, `app/about/`, `app/how-it-works/`, `app/results/`, `components/home/*` | Primary agency value proposition, founder story, delivery process, and proof scenarios | Yes (Public) | `/`, `/about`, `/how-it-works`, `/results` | None (Static React Server Components) | Typed constants in `content/*.ts` | None | `components/*`, `content/*` | Web visitors | Active | Rendered on live routes | Medium | None | Relies on illustrative proof rather than measured data | HIGH |
| **Segment Personalization Engine** | `lib/segment-context.tsx`, `components/SetSegment.tsx`, `content/site.ts` | Toggles audience segment (`local` vs `practice`), personalizing pricing, pains, and proof | Yes (Public) | Client mount via `app/layout.tsx`, `/industries/[slug]` | None (Client Context) | `sessionStorage` (`tsc_segment`) | None | React Context | `PricingAnchor`, `ProblemStrip`, `ProofSection` | Active | Wraps `RootLayout`, read across pages | Low | None | Resets per session (by design) | HIGH |
| **Lead Capture Pipeline** | `app/api/lead/route.ts`, `lib/leads.ts`, `lib/schemas.ts`, `components/forms/*` | Ingests inbound inquiries from 5 form surfaces, validates via Zod + honeypot, forwards to CRM webhook | Yes (Public) | `POST /api/lead` | `app/api/lead/route.ts` | None (Ephemeral memory forwarding) | External Webhook (Zapier / Make / n8n) | `zod`, `fetch` | `ContactForm`, `ChecklistForm`, `QuickActions`, `RoiCalculator` | Active | 5 forms call `submitLead()` | Low-Med | None | Fails loud (503) in prod if `LEAD_WEBHOOK_URL` unset. No rate limiting. | HIGH |
| **ROI Payback Calculator** | `components/home/RoiCalculator.tsx`, `lib/roi.ts`, `lib/roi.test.ts` | Interactive sliders (hours/rate) calculating annual cost of manual work + practice payback period | Yes (Public) | Embedded in `/` | `submitLead()` on report capture | None (Client calculation) | External Webhook on capture | React Hook Form, Zod | Homepage visitors | Active | Rendered on `/` | Medium | None | `use-animated-number.ts` was written for it but never wired in | HIGH |
| **Checklist Lead Magnet** | `app/checklist/page.tsx`, `components/checklist/InteractiveChecklist.tsx`, `lib/checklist.ts` | 25-task interactive audit tool calculating wasted hours and dread scores, gated by email | Yes (Public) | `/checklist` | `submitLead()` | None (Client calculation) | External Webhook on gate submit | React Hook Form, Zod | Public visitors | Active | Rendered on `/checklist` | High | Duplicates form logic in `ChecklistForm.tsx` | Referenced PDF (`automation-opportunities-checklist.pdf`) missing from disk | HIGH |
| **Digital Services Hub** | `app/digital-services/`, `content/digital-services.ts` | 7 agency service pillars (AI agents, web dev, SEO/GEO, staffing, SOPs, app dev, branding) | Yes (Public) | `/digital-services`, `/digital-services/[slug]` | None (Static Server Components) | `content/digital-services.ts` (41KB typed data) | None | `components/*` | Public / LLM crawlers | Active | Rendered on public routes and sitemap | Medium | Competes conceptually with `what-we-automate` | Added in Aug 2026; bifurcates agency identity | HIGH |
| **Automation Services Catalog** | `app/what-we-automate/`, `content/services.ts` | 19 automation solutions (AI receptionist, booking, reviews, invoice dunning, etc.) | Yes (Public) | `/what-we-automate`, `/what-we-automate/[slug]` | None (Static Server Components) | `content/services.ts` (42KB typed data) | None | `components/*` | Public / LLM crawlers | Active | Rendered on public routes and sitemap | Medium | Duplicate services inside: `reviews-and-reputation` vs `feedback-and-reviews` | Broken slug: references missing `"convenience-stores"` 11 times | HIGH |
| **Industry Verticals Catalog** | `app/industries/`, `content/industries.ts` | 24 industry-specific SEO landing funnels (12 local retail/hospitality, 12 professional practices) | Yes (Public) | `/industries`, `/industries/[slug]` | None (Static Server Components) | `content/industries.ts` (86KB typed data) | None | `components/*` | Ad traffic / SEO crawlers | Active | 24 pages generated statically | High (content volume) | None | High maintenance surface (1,694 lines in one file) | HIGH |
| **Operator Dashboard** | `app/dashboard/layout.tsx`, `app/dashboard/flows/`, `app/dashboard/drafts/` | Control surface to toggle client automation recipes and approve/edit/reject AI message drafts | Internal (Operator) | `/dashboard/flows`, `/dashboard/drafts` | Server Actions (`actions.ts`) | `.automations/overrides/*.json`, `.automations/drafts/*.json` | Clerk (Session Authentication) | `@clerk/nextjs`, `lucide-react` | Agency operators | Partial / Incomplete | Protected by Clerk middleware | High | None | **Missing `app/dashboard/page.tsx` (404 on Overview link)**. Layout polluted by marketing header/footer. | HIGH |
| **Inbound SMS Processor** | `app/api/inbound/route.ts`, `automations/inbound/*` | Webhook receiver for customer SMS replies; parses intents, handles opt-outs, triggers AI replies | Internal / Partner | `POST /api/inbound` | `processInbound()` | `.automations/{client}/*.json` | Twilio SMS, Anthropic Claude | `@anthropic-ai/sdk`, Zod | Twilio webhook | Active | Tested in unit tests, wired to Twilio endpoint | High | Overlaps with `relay/` SMS gateway concept | **Fails open if `TWILIO_AUTH_TOKEN` is unset**. Hardcoded to 2 demo clients. | HIGH |
| **Outbound Scheduled Automation Engine** | `app/api/cron/route.ts`, `automations/runtime/*`, `automations/recipes/*` | Scheduled runner executing 7 communication recipes across active client rosters | Internal / System | `GET /api/cron`, `npm run automations:scheduler` | `runTick()`, `runClient()` | `.automations/{client}/*.json` | Twilio, SendGrid | `tsx`, Zod | Vercel Cron | Active | Verified via 85+ automations unit tests | High | Competing with `AutomationRepository` in `second-brain` | Only 7 of 19 marketed services have recipes. Local file writes break in serverless. | HIGH |
| **Stateless Hardware SMS Relay** | `app/api/v1/relay/route.ts`, `relay/*` | Hardened API gateway accepting HMAC-SHA256 signed SMS submissions from Android hardware | Internal / Hardware | `POST /api/v1/relay` | `handleRelayRequest()` | Zero persistence | SendGrid, Resend, Downstream Webhook | Node.js `crypto` | Android Capture App | Active | Verified via 28 relay test cases | High | Operates completely independently of `automations/` | Isolated from the rest of the application | HIGH |
| **Agent IAM & Machine Identity** | `lib/second-brain/auth/*`, `db/migrations/001-004.sql`, `db/policies/*` | Database-native IAM authenticating machine agents (Claude, ChatGPT, Muse, Runner) with zero DB exposure | Internal / Agent | `authenticateAgent()`, `authorize()` | `second_brain_security.*` (PL/pgSQL) | Neon PostgreSQL (`second_brain_security.*`) | Neon PostgreSQL | `pg`, Zod | `app/api/internal/v1/*` | Active | 36 unit tests pass | High | None | `recordAgentAudit` is never called by application code | HIGH |
| **Canonical Context RAG Engine** | `app/api/internal/v1/context/search/route.ts`, `lib/second-brain/repositories/ContextRepository.ts` | Semantic and keyword domain context lookup resolving queries to canonical Notion/Drive docs | Internal / Agent | `POST /api/internal/v1/context/search` | `ContextRepository.searchContext()` | Neon PostgreSQL (`public.resource_context_index`) | Neon PostgreSQL | `pg` | AI Agents | Active | Verified via unit tests | Medium | None | Requires external tables in `public` with no in-repo DDL migrations | HIGH |
| **Automation OS State Machine** | `app/api/internal/v1/automations/*`, `lib/second-brain/repositories/AutomationRepository.ts` | Enterprise distributed state machine for jobs, execution claims, leases, and attempt recording | Internal / Agent | 8 REST endpoints under `/api/internal/v1/automations/*` | `AutomationRepository` | Neon PostgreSQL (`public.*_automation`) | Neon PostgreSQL | `pg` | External runner daemon | Active | Verified via unit tests | Very High | Competing with `automations/core/engine.ts` | Completely disjoint from the `automations/` folder. Relies on external un-migrated DB tables. | HIGH |

---

## 6. User-Facing Route Inventory

Enumerate every accessible frontend route/page in `app/**/page.tsx`:

| Route Path | Source File | Layout Shell | Access Tier | Purpose & Major Components | Navigation Source | Backend Dependencies | Active Status | Forensic Flags & Health |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `app/page.tsx` | `RootLayout` | Public | **Homepage**: Hero, ProblemStrip, RoiCalculator, ProofSection, ServicesGrid, DigitalServicesTeaser, HowItWorks, PricingAnchor, Faq, FinalCta | Header Logo, Browser Root | `lib/roi.ts`, `lib/leads.ts` | Active | Healthy. Core conversion engine. |
| `/about` | `app/about/page.tsx` | `RootLayout` | Public | **Founder Story & Credentials**: AbstractVisual, founder bio, 15+ years enterprise background, agency mission | Header Nav, Footer | None | Active | Healthy. |
| `/how-it-works` | `app/how-it-works/page.tsx` | `RootLayout` | Public | **Delivery Process**: 3-stage breakdown (*Audit -> Build -> Run*), client responsibilities vs agency tasks | Footer Nav | None | Active | Healthy, but omitted from primary Header nav. |
| `/results` | `app/results/page.tsx` | `RootLayout` | Public | **Illustrative Scenarios**: Problem/build/anticipated outcome case studies | Footer Nav | None | Active | Omitted from primary Header nav. Uses illustrative claims only. |
| `/book` | `app/book/page.tsx` | `RootLayout` | Public | **Top-Rung Booking**: Cal.com embed (`BookingEmbed.tsx`) for 30-min audit | Header CTA, Mobile Sticky Bar, Footer | Cal.com API | Active | Falls back gracefully to email if `NEXT_PUBLIC_CAL_LINK` is unset. |
| `/contact` | `app/contact/page.tsx` | `RootLayout` | Public | **Quick Query**: Two-step blur-validated contact form (`ContactForm.tsx`) | Header Nav, Footer | `POST /api/lead` | Active | Healthy. Handles direct inquiries. |
| `/checklist` | `app/checklist/page.tsx` | `RootLayout` | Public | **Lead Magnet**: 25-task interactive checklist tool (`InteractiveChecklist.tsx`) | Header Nav, Footer | `POST /api/lead` | Active | Form works, but referenced downloadable PDF does not exist in `public/`. |
| `/social` | `app/social/page.tsx` | `RootLayout` | Public | **NFC / QR Business Card Target**: Mobile landing card, vCard download (`/contact.vcf`), `QuickMessageForm` | Physical NFC Cards / QR Codes | `POST /api/lead` | Active | **Not linked in Header or Footer** (accessible via direct URL / NFC card only). |
| `/digital-services` | `app/digital-services/page.tsx` | `RootLayout` | Public | **Digital Services Hub**: Grid of 7 core agency pillars | Header Nav, Footer | None | Active | Healthy. |
| `/digital-services/[slug]` | `app/digital-services/[slug]/page.tsx` | `RootLayout` | Public | **Digital Service Detail**: Deep SEO/GEO content, process steps, deliverables, FAQ | `/digital-services`, Sitemap | `content/digital-services.ts` | Active | 7 statically generated pages (`ai-agent-development`, `website-development`, etc.). |
| `/what-we-automate` | `app/what-we-automate/page.tsx` | `RootLayout` | Public | **Automation Catalog Hub**: 19 automation solutions grid | Header Nav, Footer | None | Active | Healthy. (Redirect target from legacy `/services`). |
| `/what-we-automate/[slug]` | `app/what-we-automate/[slug]/page.tsx` | `RootLayout` | Public | **Automation Detail**: Problem, what we build, tools, timeline, outcome, FAQ | `/what-we-automate`, Footer | `content/services.ts` | Active | 19 statically generated pages. **Silently drops `"convenience-stores"` from related list**. |
| `/industries` | `app/industries/page.tsx` | `RootLayout` | Public | **Industry Verticals Hub**: Segmented directory of 24 industries | Header Nav, Footer | None | Active | Healthy. (Redirect target from legacy `/for`). |
| `/industries/[slug]` | `app/industries/[slug]/page.tsx` | `RootLayout` | Public | **Industry Funnel**: Tailored pains, 3 automations with metrics, illustrative build, FAQ | `/industries`, Footer | `content/industries.ts` | Active | 24 statically generated pages. Persists segment via `<SetSegment>`. |
| `/legal/privacy` | `app/legal/privacy/page.tsx` | `RootLayout` | Public | **Privacy Policy**: PIPEDA/PHIPA compliance parameters | Footer | None | Active | Healthy. |
| `/legal/terms` | `app/legal/terms/page.tsx` | `RootLayout` | Public | **Terms of Service**: Delivery scope and service terms | Footer | None | Active | Healthy. |
| `/dashboard` | *(No file exists!)* | `DashboardLayout` | Operator (Clerk) | **Overview Dashboard**: Linked in dashboard sidebar | Sidebar Link | None | **BROKEN** | **404 Not Found**. The sidebar in `app/dashboard/layout.tsx` links to `/dashboard`, but no `app/dashboard/page.tsx` exists. |
| `/dashboard/flows` | `app/dashboard/flows/page.tsx` | `DashboardLayout` | Operator (Clerk) | **Flow Management**: List and toggle active automation recipes per client | Dashboard Sidebar | Server Action `toggleFlow` | Active | Gated behind Clerk. Renders inside marketing layout shell. |
| `/dashboard/drafts` | `app/dashboard/drafts/page.tsx` | `DashboardLayout` | Operator (Clerk) | **Draft Approval Queue**: Human-in-the-loop review for AI-drafted messages | Dashboard Sidebar | Server Actions `approveDraft`, `rejectDraft` | Active | Gated behind Clerk. Renders inside marketing layout shell. |
| `/dev/components` | `app/dev/components/page.tsx` | `RootLayout` | Developer (`noindex`) | **Component Gallery**: Visual token testing and design audit sandbox | Direct URL | None | Internal | Disallowed in `robots.ts` and marked `noindex`. |

---

## 7. API Inventory

Enumerate every HTTP route handler in `app/**/route.ts`:

| Method | Endpoint | Source File | Auth / Security | Purpose | Called By | Data Store / Provider | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/lead` | `app/api/lead/route.ts` | Honeypot field + Zod parsing | Ingests lead submissions; forwards to external webhook | `submitLead()` from all 5 form surfaces | Zapier / Make / n8n Webhook | Active |
| `POST` | `/api/inbound` | `app/api/inbound/route.ts` | Twilio Signature (`x-twilio-signature`) | Ingests incoming SMS from customers via Twilio; parses intent | External Twilio SMS Webhook | Local JSON in `.automations/{client}/` | **Vulnerable** (Fails open if auth token unset) |
| `GET` | `/api/cron` | `app/api/cron/route.ts` | Bearer Token (`CRON_SECRET`) | Triggers scheduled runner tick across all active clients | Vercel Cron (`* /5 * * * *`) | Local JSON in `.automations/{client}/` | Active (Fails closed if secret unset) |
| `POST` | `/api/v1/relay` | `app/api/v1/relay/route.ts` | HMAC-SHA256 + Timestamp + Nonce | Stateless hardware SMS gateway for Android capture devices | Physical Android phone app | SendGrid, Resend, or Webhook adapter | Active |
| `GET` | `/api/internal/v1/endpoints` | `app/api/internal/v1/endpoints/route.ts` | Bearer `key.secret` (`meta.endpoints.read`) | Self-documenting introspection catalog and dynamic OpenAPI export | Autonomous AI Agents | Neon PostgreSQL (`second_brain_security`) | Active |
| `POST` | `/api/internal/v1/context/search` | `app/api/internal/v1/context/search/route.ts` | Bearer `key.secret` (`context.read`) | Semantic & keyword RAG lookup for authoritative documentation | Autonomous AI Agents | Neon PostgreSQL (`public.resource_context_index`) | Active |
| `GET` | `/api/internal/v1/automations/status` | `app/api/internal/v1/automations/status/route.ts` | Bearer `key.secret` (`automation.status.read`) | Real-time health check (active claims, backlog, cycles) | Automation OS Runner / Monitor | Neon PostgreSQL (`public.*_automation`) | Active |
| `GET` | `/api/internal/v1/automations/due-jobs` | `app/api/internal/v1/automations/due-jobs/route.ts` | Bearer `key.secret` (`automation.evaluate`) | Evaluates scheduled jobs and returns due jobs ordered by priority | Automation OS Runner | Neon PostgreSQL (`public.jobs_automation`) | Active |
| `GET` | `/api/internal/v1/automations/jobs/[key]` | `app/api/internal/v1/automations/jobs/[key]/route.ts` | Bearer `key.secret` (`automation.read`) | Loads job configuration, policies, prompts, declared targets | Automation OS Runner | Neon PostgreSQL (`public.jobs_automation`) | Active |
| `POST` | `/api/internal/v1/automations/occurrences/ensure` | `app/api/internal/v1/automations/occurrences/ensure/route.ts` | Bearer `key.secret` (`automation.occurrence.write`) | Idempotently creates or returns occurrence slot for scheduled run | Automation OS Runner | Neon PostgreSQL (`public.occurrences_automation`) | Active |
| `POST` | `/api/internal/v1/automations/claims/acquire` | `app/api/internal/v1/automations/claims/acquire/route.ts` | Bearer `key.secret` (`automation.claim.acquire`) | Atomically acquires timed lease claim to prevent concurrent runs | Automation OS Runner | Neon PostgreSQL (`public.execution_claims_automation`) | Active |
| `POST` | `/api/internal/v1/automations/claims/release` | `app/api/internal/v1/automations/claims/release/route.ts` | Bearer `key.secret` (`automation.claim.release`) | Releases active execution lease claim on finish or error | Automation OS Runner | Neon PostgreSQL (`public.execution_claims_automation`) | Active |
| `POST` | `/api/internal/v1/automations/attempts/start` | `app/api/internal/v1/automations/attempts/start/route.ts` | Bearer `key.secret` (`automation.attempt.write`) | Logs start timestamp and attempt sequence number | Automation OS Runner | Neon PostgreSQL (`public.occurrence_attempts_automation`) | Active |
| `POST` | `/api/internal/v1/automations/attempts/finish` | `app/api/internal/v1/automations/attempts/finish/route.ts` | Bearer `key.secret` (`automation.attempt.write`) | Records completion status (`succeeded`, `failed`, `deferred`) | Automation OS Runner | Neon PostgreSQL (`public.occurrence_attempts_automation`) | Active |
| `POST` | `/api/internal/v1/automations/cycles/upsert` | `app/api/internal/v1/automations/cycles/upsert/route.ts` | Bearer `key.secret` (`automation.cycle.write`) | Upserts runner batch cycle summaries and evaluation metrics | Automation OS Runner | Neon PostgreSQL (`public.runner_cycles_automation`) | Active |
| `GET` | `/llms.txt` | `app/llms.txt/route.ts` | None (Public) | Compact summary of services and pricing for LLM crawlers | AI Assistants (Perplexity, ChatGPT, Claude) | `content/*.ts` (Static Text) | Active |
| `GET` | `/llms-full.txt` | `app/llms-full.txt/route.ts` | None (Public) | Full-depth textual catalog export of all frameworks and SOPs | AI Assistants / Deep Crawlers | `content/*.ts` (Static Text) | Active |
| `GET` | `/pricing.md` | `app/pricing.md/route.ts` | None (Public) | Markdown pricing sheet for autonomous AI buying agents | AI Buying Agents | `content/site.ts` (Static Text) | Active |
| `GET` | `/contact.vcf` | `app/contact.vcf/route.ts` | None (Public) | Downloadable vCard 3.0 file (`X-ABShowAs:COMPANY`) | NFC card scans from `/social` | `content/site.ts` (Static Text) | Active |

---

## 8. Database & Data Model

The application references two distinct data architectures: PostgreSQL tables (in Neon) and file-backed JSON stores (in `.automations/`).

### 8.1 Dedicated Security Schema (`second_brain_security.*`)
Created via `db/migrations/001_second_brain_security.sql` and `002_security_definer_functions.sql`. Owned by `neondb_owner`. Runtime access is restricted to `skill_corner_runtime` via `SECURITY DEFINER` procedures:

| Table / Model | Schema | Primary Key | Key Relationships | Purpose | Active Status | Security & Architectural Invariants |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `agent_principals` | `second_brain_security` | `principal_id` (UUID) | 1:M to `agent_credentials`, `agent_principal_grants` | Durable machine identity records (ChatGPT, Claude, Muse, etc.) | Active | Read-only to runtime role. Modified only via admin migrations. |
| `agent_credentials` | `second_brain_security` | `credential_id` (UUID) | M:1 to `agent_principals`, 1:M to `agent_credential_scopes` | Cryptographic API key metadata. Stores only SHA-256 digests (`secret_hash`). | Active | Plaintext secrets are returned once at creation and never stored. Secret hashes are immutable. |
| `agent_principal_grants` | `second_brain_security` | `grant_id` (UUID) | M:1 to `agent_principals` | Maximum capability ceiling for a principal identity | Active | Evaluated in `authorize.ts`. Actions and resources support wildcards (`*`). |
| `agent_credential_scopes` | `second_brain_security` | `scope_id` (UUID) | M:1 to `agent_credentials` | Capability restrictions applied to a specific API key | Active | Can narrow principal grants, but can **never broaden** them. |
| `agent_audit` | `second_brain_security` | `audit_id` (UUID) | M:1 to `agent_principals`, `agent_credentials` | Tamper-evident audit log for security events | Partially Active | Populated on DB auth failures; **application authorization decisions are currently not recorded**. |

### 8.2 Canonical Public Schema (`public.*`)
Referenced by `lib/second-brain/repositories/*` and permissions granted in `003_permissions_hardening.sql`. **Crucial Finding: There are zero DDL migration files in this repository creating these tables.** They exist externally in Neon PostgreSQL:

| Table / Model | Schema | Purpose | Used By | Active Status | Concerns |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `resource_context_index` | `public` | RAG context routing entries (domain, subdomain, priority, keywords) | `ContextRepository.searchContext` | Active | Schema not defined in repository migrations |
| `resource_registry` | `public` | Canonical document registry (Notion/Drive docs, SOPs, playbooks) | `ContextRepository.searchContext` | Active | Schema not defined in repository migrations |
| `resource_locations` | `public` | Provider URLs and locators for canonical resources | `ContextRepository.searchContext` | Active | Schema not defined in repository migrations |
| `resource_aliases` | `public` | Synonyms and routing keywords | `003_permissions_hardening.sql` | Unknown | Referenced in grants, not in repo code |
| `jobs_automation` | `public` | Master scheduled automation job definitions and metadata | `AutomationRepository` | Active | Completely disconnected from `automations/` recipes |
| `schedules_automation` | `public` | Cron expressions, frequencies, timezones, run hours | `AutomationRepository.evaluateDueJobs` | Active | Schema not defined in repository migrations |
| `job_execution_policy_automation`| `public` | Criticality, priority, execution budget, retry policies | `AutomationRepository` | Active | Schema not defined in repository migrations |
| `job_dependencies_automation` | `public` | Inter-job prerequisites and mandatory dependencies | `AutomationRepository.getJobConfiguration` | Active | Schema not defined in repository migrations |
| `job_targets_automation` | `public` | Declared target resources a job is authorized to mutate | `AutomationRepository.getJobConfiguration` | Active | Schema not defined in repository migrations |
| `job_prompt_refs_automation` | `public` | References to prompt templates used by the job | `003_permissions_hardening.sql` | Unknown | Referenced in grants, not queried in repo |
| `job_report_delivery_automation` | `public` | Output notification channels and email targets | `AutomationRepository.getJobConfiguration` | Active | Schema not defined in repository migrations |
| `occurrences_automation` | `public` | Time-slot occurrences for scheduled job instances | `AutomationRepository.ensureOccurrence` | Active | Stores execution slot state |
| `execution_claims_automation` | `public` | Distributed leases preventing concurrent job execution | `AutomationRepository.acquireClaim` | Active | Lease expiration timeouts enforced |
| `occurrence_attempts_automation` | `public` | Execution attempt logs, durations, and exit statuses | `AutomationRepository.startAttempt/finish` | Active | Stores runner execution metrics |
| `runner_cycles_automation` | `public` | Batch cycle run records and runner health stats | `AutomationRepository.upsertCycle` | Active | Stores heartbeat summaries |
| `runner_cycle_jobs_automation` | `public` | Join table associating jobs evaluated per runner cycle | `003_permissions_hardening.sql` | Unknown | Referenced in grants, not queried in repo |

### 8.3 File-Backed JSON Datastores (`.automations/`)
Used exclusively by Subsystem 2 (`automations/` and `app/dashboard/`):

| File Path Pattern | Data Structure | Purpose | Lifecycle & Risk |
| :--- | :--- | :--- | :--- |
| `.automations/overrides/{clientId}.json` | Array of `{ automationId: string, enabled: boolean }` | Stores toggle overrides set by operator in `/dashboard/flows` | Ephemeral in serverless (lost on container restart) |
| `.automations/drafts/{clientId}.json` | Array of `DraftAction` objects | Stores AI-generated customer messages awaiting operator approval | Ephemeral in serverless (lost on container restart) |
| `.automations/idempotency/{clientId}.json`| Array of string keys with timestamps | Prevents duplicate outbound SMS/email dispatches | Ephemeral in serverless (risk of duplicate sends) |
| `.automations/{clientId}/suppression.json`| Array of opt-out phone numbers / emails | Enforces legal compliance for STOP / UNSUBSCRIBE | Ephemeral in serverless (severe legal compliance risk) |
| `.automations/{clientId}/conversation.json`| Array of inbound/outbound SMS message threads | Thread history for LLM context in two-way texting | Ephemeral in serverless |
| `.automations/{clientId}/contacts.json` | Key-value map of phone numbers to client identifiers | Destination routing for multi-tenant inbound messages | Ephemeral in serverless |

---

## 9. External Integrations

Exhaustive audit of every third-party service provider integrated into the repository:

| Provider | Purpose | Code Paths | Environment Variables | Active Status | Architectural Concerns & Risks |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Clerk** | Authentication & session management for `/dashboard/*` | `middleware.ts`, `app/dashboard/layout.tsx` | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Configured | Without env vars, `/dashboard` fails closed. Server Actions lack internal caller checks. |
| **Twilio** | Inbound SMS webhook ingestion & outbound SMS dispatch | `app/api/inbound/route.ts`, `automations/channels/sms-twilio.ts` | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `PUBLIC_INBOUND_URL` | Configured | **`/api/inbound` fails open if `TWILIO_AUTH_TOKEN` is unset**. |
| **SendGrid** | Outbound transactional email for automations and SMS relay | `automations/channels/email-sendgrid.ts`, `relay/adapters/EmailDeliveryAdapter.ts` | `SENDGRID_API_KEY`, `SMS_RELAY_SENDGRID_API_KEY` | Configured | Used by both `automations/` and `relay/` under different config names. |
| **Resend** | Secondary outbound email adapter for SMS relay | `relay/adapters/EmailDeliveryAdapter.ts` | `RESEND_API_KEY`, `SMS_RELAY_RESEND_API_KEY` | Configured | Alternative to SendGrid in `relay/`. |
| **Anthropic (Claude)** | Natural language intent classification and reply drafting | `automations/inbound/models/anthropic.ts`, `automations/inbound/llm-interpreter.ts` | `ANTHROPIC_API_KEY`, `INTERPRETER_MODEL` | Configured | Hardcoded to model `claude-opus-4-8`. Uses official SDK with structured JSON schemas. |
| **Cal.com** | Free automation audit calendar scheduling widget | `components/BookingEmbed.tsx`, `content/site.ts` | `NEXT_PUBLIC_CAL_LINK` | Configured | Defaults to fallback email card if link is unset. |
| **Neon PostgreSQL** | Serverless database hosting Agent IAM & Automation OS | `lib/second-brain/db/client.ts`, `lib/second-brain/admin/lifecycle.ts` | `SECOND_BRAIN_DATABASE_URL`, `SECOND_BRAIN_ADMIN_DATABASE_URL` | Configured | Runtime role uses `skill_corner_runtime`. Admin role uses `neondb_owner`. |
| **Zapier / Make / n8n**| Catch hook for all public form lead captures | `app/api/lead/route.ts`, `lib/leads.ts` | `LEAD_WEBHOOK_URL` | Configured | Fails loud with 503 in production if unset; accepts quietly in preview/dev. |
| **Plausible Analytics**| Privacy-first web analytics | `app/layout.tsx`, `lib/analytics.ts` | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | Takes precedence over Google Analytics if both are defined. |
| **Google Analytics 4** | Web traffic and conversion measurement | `app/layout.tsx`, `lib/analytics.ts` | `NEXT_PUBLIC_GA_ID` | Optional | Used only if Plausible is unset. |
| **Ollama / OpenAI** | Dev/local alternative LLM providers for SMS interpreter | `automations/inbound/models/ollama.ts`, `openai-compatible.ts` | `INTERPRETER_PROVIDER`, `OLLAMA_HOST`, `OPENAI_BASE_URL`, `OPENAI_API_KEY` | Supported | Enables offline testing without Anthropic API keys. |

---

## 10. AI & Agent Architecture

The repository contains multiple layers of AI integration spanning customer-facing messaging, autonomous agents, and AI crawler optimization:

### 10.1 Inbound SMS Intent Interpreter & Reply Drafting
```text
Inbound SMS Payload (Twilio)
       ↓
Deterministic Carrier Rules Interpreter (STOP, START, YES, CANCEL)
       ├─ (Exact match: confidence 1.0) ──▶ Opt-out / Confirmation (No LLM called)
       └─ (Unresolved: confidence 0.0)
               ↓
LlmInterpreter (Claude Opus / Ollama / OpenAI)
       ↓ Structured Output JSON Schema (intent, confidence, requestedTimeText, reply)
       ↓ Zod Schema Validation
Intent Dispatched (reschedule, question, handoff)
       ↓
If "question": AI drafted reply sent to Operator Review Queue (.automations/drafts/)
```
- **Prompting Location**: `automations/inbound/llm-interpreter.ts` (lines 75–110).
- **System Prompt**: Enforces client brand voice, concise SMS length (<160 chars), factual ground truth based on business profile, and refusal to hallucinate.
- **Model Inversion**: Uses `@anthropic-ai/sdk` with JSON schema structured output (`effort: "low"`).

### 10.2 Database-Native Agent IAM ("Second Brain")
- **Identities**: Defined in `db/migrations/004_provision_principals.sql`:
  - `chatgpt` (Reasoning assistant)
  - `claude` (Strategy and architecture agent)
  - `muse` (Creative and social agent)
  - `automation-os` (Scheduled workflow runner daemon)
  - `skill-corner-internal` (System orchestrator)
- **Principle**: Strict Default Deny. Machine agents receive zero database passwords and zero direct SQL access. All actions are mediated through authenticated REST endpoints (`/api/internal/v1/*`) verifying HMAC/digest tokens against PL/pgSQL procedures.

### 10.3 Canonical Context RAG Engine
- **Endpoint**: `POST /api/internal/v1/context/search`
- **Algorithm**: Multi-tier weighted ranking in `lib/second-brain/repositories/ContextRepository.ts`:
  `Domain + Subdomain + Keywords -> Exact Route Match -> is_primary -> Priority -> Keyword Fit -> Top 2 Canonical Documents`
- **Output**: Resolves abstract agent queries to authoritative Notion/Drive documents and SOP guidelines.

### 10.4 Autonomous Buyer & AI Crawler Optimization
- **`app/robots.ts`**: Explicit allowlist for 13 AI user agents (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Applebot-Extended`, etc.).
- **`app/llms.txt`**: Conforms to `llmstxt.org` specification; compact business summary, pricing anchors, and canonical URLs.
- **`app/llms-full.txt`**: Comprehensive textual catalog export of all frameworks, SOPs, and service lines for deep LLM retrieval.
- **`app/pricing.md`**: Machine-readable markdown pricing sheet for autonomous buying agents.

---

## 11. Automation Systems & Schedulers

The repository contains **two completely separate, competing automation engines**:

### Engine A: The In-Memory / File-Backed Recipe Engine (`automations/`)
- **Trigger**: `GET /api/cron` (pinged by Vercel Cron every 5 minutes) or `npm run automations:scheduler`.
- **Implementation**: `automations/server/run-tick.ts` -> `automations/runtime/run.ts` -> `RecipeRegistry`.
- **Active Recipes (7)**:
  1. `booking-reminders`: Time-staggered appointment reminders (7d, 24h, 2h).
  2. `invoice-reminders`: Dunning sequences for overdue accounts.
  3. `lead-responder`: Immediate reply to new inbound leads with urgent-keyword escalation.
  4. `no-show-rebook`: Outreach sequence to patients/clients who missed visits.
  5. `review-booster`: Post-service review requests via SMS.
  6. `review-responder`: AI-drafted replies to Google/Yelp reviews.
  7. `win-back`: Re-engagement outreach to dormant customers (60–90 days inactive).
- **Roster**: Hardcoded demo clients in `automations/clients/index.ts` (`radiance-salon`, `brightsmile-dental`).
- **Persistence**: File stores in `.automations/`.

### Engine B: The Database-Native Automation OS (`lib/second-brain/repositories/AutomationRepository.ts`)
- **Trigger**: Managed via 8 internal REST APIs (`/api/internal/v1/automations/*`).
- **Implementation**: Distributed state machine backed by PostgreSQL tables (`jobs_automation`, `schedules_automation`, `occurrences_automation`, `execution_claims_automation`).
- **Capabilities**: Timed execution lease claims, attempt tracking, dependency graph resolution, priority scheduling, runner cycle summaries.
- **Current State**: Fully implemented in repository classes and unit tests, but **completely disconnected** from Engine A and without DDL migrations for its database tables in the repo.
