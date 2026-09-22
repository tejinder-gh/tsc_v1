# TheSkillCorner Codebase Forensic Audit
## Part 3: Technical Systems, UI Architecture, Security, Performance & Architectural Eras

> **Audit Type**: Read-Only Forensic Architecture Audit  
> **Auditor**: Principal Software Architect  
> **Date**: September 2026  
> **Repository**: `TheSkillCorner` (`/Users/tejindersingh/dev/projects/TheSkillCorner`)  

---

## 12. UI & Component Architecture

The frontend UI is built with React 19 and Tailwind CSS v4. Theme tokens are defined in `app/globals.css` under the `@theme` directive, with self-hosted Poppins (headings) and DM Sans (body) fonts loaded via `@font-face` rules.

### 12.1 Shared UI Primitives & Key Components

| Component | File Path | Consumers / Used By | Primary Responsibility | Architectural Observations & Duplication |
| :--- | :--- | :--- | :--- | :--- |
| `CtaLink` | `components/CtaLink.tsx` | All pages, `Header`, `Hero`, `BookingEmbed`, `PricingAnchor` | Core Button/Link primitive. Wraps `next/link`, enforces design tokens, and fires `cta_clicked` analytics. | **Excellent design**. Single source of truth for buttons. Correctly enforces 48px/44px touch targets. |
| `Header` | `components/Header.tsx` | `app/layout.tsx` (RootLayout) | Sticky top navigation (72px), scroll-triggered hairline border, accessible full-screen mobile menu overlay with focus trap. | Rendered unconditionally in `RootLayout`, bleeding into the operator `/dashboard` shell. |
| `Footer` | `components/Footer.tsx` | `app/layout.tsx` (RootLayout) | 4-column footer, dynamic service/industry link grids, four-office locality rail (`TORONTO · SURREY · CALIFORNIA · LUDHIANA`). | Rendered unconditionally in `RootLayout`, bleeding below the `/dashboard` workspace. |
| `Faq` | `components/Faq.tsx` | `app/page.tsx`, `what-we-automate/[slug]`, `industries/[slug]` | Accessible single-open accordion primitive. Emits `FAQPage` JSON-LD schema dynamically. | Replaced native `<details>` in Aug 2026. Ensures SEO schema matches visible DOM. |
| `AbstractVisual` | `components/AbstractVisual.tsx` | `Hero`, `about`, `checklist`, `contact`, `digital-services`, `industries` | Inline SVG node-graph illustrations for 5 page variants (`home`, `services`, `for`, `about`, `contact`, `checklist`). | Large file (301 lines). Heavy inline SVG path data instead of external optimized SVGs. |
| `BookingEmbed` | `components/BookingEmbed.tsx` | `app/book/page.tsx` | Embeds Cal.com calendar widget. Shows graceful fallback card if `NEXT_PUBLIC_CAL_LINK` is unset. | Clean fallback behavior. README documents migration to Calendly if needed. |
| `ContactForm` | `components/forms/ContactForm.tsx` | `app/contact/page.tsx` | Two-step quick query form. Blur-validated via React Hook Form and Zod. | Complex manual validation logic (`form.trigger()` + `watch()`) spanning 354 lines. |
| `ChecklistForm` | `components/forms/ChecklistForm.tsx` | `components/capture/ExitIntentModal.tsx` | Email gate form for the checklist lead magnet. | **Duplicates form fields and schema logic** from `InteractiveChecklist.tsx`. Default `leadSource="checklist_page"` is unreachable. |
| `InteractiveChecklist`| `components/checklist/InteractiveChecklist.tsx` | `app/checklist/page.tsx` | 25-task self-scoring checklist audit tool with live calculation of wasted hours and dread scores. | Large component (421 lines). Contains an inline email form that duplicates `ChecklistForm`. |
| `RoiCalculator` | `components/home/RoiCalculator.tsx` | `app/page.tsx` | Dual-slider ROI calculator computing annual cost of manual work and practice payback period. | High conversion utility. Designed to use `useAnimatedNumber`, but the hook was never imported. |
| `ExitIntentModal` | `components/capture/ExitIntentModal.tsx` | `app/layout.tsx` (RootLayout) | Desktop exit-intent popup triggered on top mouse-out; embeds `ChecklistForm`. | Focus-trapped and session-limited (`tsc_exit_shown`). Bleeds into `/dashboard`. |
| `QuickActions` | `components/capture/QuickActions.tsx` | `app/layout.tsx` (RootLayout) | Floating bottom-right speed-dial widget (Book call, Quick question form, Free checklist). | Session-dismissible. Bleeds into `/dashboard`. |
| `MobileStickyBar` | `components/capture/MobileStickyBar.tsx` | `app/layout.tsx` (RootLayout) | Mobile bottom bar with quick "Call" (`tel:`) and "Book" buttons. | Hidden when mobile menu opens. Bleeds into `/dashboard` on mobile. |
| `ServicesGrid` | `components/ServicesGrid.tsx` | `app/page.tsx`, `app/what-we-automate/page.tsx` | Responsive grid of automation service cards with Framer Motion staggered scroll reveals. | Clean reusable component. |
| `PricingAnchor` | `components/PricingAnchor.tsx` | `app/page.tsx`, `industries/[slug]` | Segment-aware pricing cards (Local packages vs Practice custom ranges). | Prevents practice prospects from seeing $395/mo local pricing. |
| `SegmentRouter` | `components/home/SegmentRouter.tsx` | **NONE (0 callers)** | Two-card selector under hero ("I run a local business" vs "I run a practice"). | **100% ORPHANED**. Removed from homepage during redesign; never deleted. Points to obsolete `/for` paths. |

---

## 13. State Management & Data Flow

### 13.1 State Systems Inventory
The application avoids heavyweight state libraries (no Redux, Zustand, or Jotai) in favor of localized patterns:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   STATE MANAGEMENT LAYERS                                        │
├─────────────────────┬─────────────────────────────────┬──────────────────────────────────────────┤
│ Scope               │ Mechanism                       │ Files & Purpose                          │
├─────────────────────┼─────────────────────────────────┼──────────────────────────────────────────┤
│ Browser Session     │ `sessionStorage`                │ `tsc_segment` (Audience segment)         │
│                     │                                 │ `tsc_widget_dismissed` (Floating widget) │
│                     │                                 │ `tsc_exit_shown` (Exit-intent modal)     │
├─────────────────────┼─────────────────────────────────┼──────────────────────────────────────────┤
│ React Tree (Client) │ React Context                   │ `SegmentProvider` (`lib/segment-context`)|
├─────────────────────┼─────────────────────────────────┼──────────────────────────────────────────┤
│ Component Local     │ React `useState` / `useRef`     │ Sliders, accordions, modals, form steps  │
├─────────────────────┼─────────────────────────────────┼──────────────────────────────────────────┤
│ Form State          │ React Hook Form + Zod           │ Validation, dirty state, error tracking  │
├─────────────────────┼─────────────────────────────────┼──────────────────────────────────────────┤
│ Server Ephemeral    │ Local Filesystem (`.automations`)JSON files for drafts, claims, overrides  │
├─────────────────────┼─────────────────────────────────┼──────────────────────────────────────────┤
│ Server Durable      │ Neon Serverless PostgreSQL      │ Agent IAM, principal grants, context RAG │
└─────────────────────┴─────────────────────────────────┴──────────────────────────────────────────┤
```

### 13.2 Primary Runtime Data Flows

#### Flow 1: Lead Capture Form Submission
```text
Browser User
   ↓ Enters email + details in ContactForm / RoiCalculator / ChecklistForm
React Hook Form (zodResolver with client-side schema)
   ↓ Validates on blur / submit
submitLead() in lib/leads.ts
   ↓ Appends window.location.pathname as page metadata
POST /api/lead (Next.js Route Handler)
   ├─ Checks Honeypot field `website` ──▶ If filled: 200 { ok: true, delivered: false } (Drops bot)
   ├─ Validates payload against server leadSchema
   └─ Forwards JSON to LEAD_WEBHOOK_URL (Zapier / Make / n8n) with 8s timeout
         ├─ Unset in production ──▶ 503 Service Unavailable (Loud failure)
         ├─ Unset in dev/preview ──▶ 200 { ok: true, delivered: false }
         └─ 2xx Response ──▶ 200 { ok: true, delivered: true }
Client fires analytics event `lead_captured` (Plausible / GA4)
```

#### Flow 2: Inbound SMS Processing Loop
```text
Twilio Inbound SMS Webhook
   ↓ POST /api/inbound
validateTwilioSignature()
   ├─ Invalid signature ──▶ 403 Forbidden
   └─ (WARNING: If TWILIO_AUTH_TOKEN is unset, validation is completely bypassed!)
parseTwilioInbound() ──▶ Normalizes sender, recipient, and message body
   ↓
resolveClientByNumber() ──▶ Matches destination number to knownClients roster
   ↓
processInbound() in automations/server/process-inbound.ts
   ├─ rulesInterpreter (Exact STOP / START / YES match) ──▶ Opt-out / Confirm (No LLM called)
   └─ llmInterpreter (Calls Claude Opus with JSON schema) ──▶ Classifies intent, drafts reply
         ↓
If Intent is "question" with drafted reply:
   ↓
FileDraftStore.save() ──▶ Writes draft to `.automations/drafts/{clientId}.json`
   ↓
Operator logs into /dashboard/drafts (Clerk authenticated)
   ↓ Reviews, edits, and clicks "Approve"
Server Action approveDraft()
   ↓ Dispatches outbound SMS via TwilioSmsSender
Draft removed from store
```

#### Flow 3: Autonomous Agent IAM & Context RAG
```text
External AI Agent (ChatGPT / Claude / Muse)
   ↓ Request with `Authorization: Bearer <key_id>.<secret>`
POST /api/internal/v1/context/search
   ↓
authenticateAgent() in lib/second-brain/auth/authenticate.ts
   ↓ Calls PostgreSQL procedure `second_brain_security.authenticate_agent(keyId, secret)`
   ↓ Validates SHA-256 hash, active status, expiration, and revocation
   ↓ Returns AuthenticatedContext (Principal + Grants + Credential Scopes)
authorize() in lib/second-brain/auth/authorize.ts
   ↓ Enforces: Principal Grants ∩ Credential Scopes ∩ Action ("context.read")
   ├─ Denied ──▶ 403 Forbidden
   └─ Allowed
         ↓
ContextRepository.searchContext()
   ↓ Runs parameterized SQL query on `public.resource_context_index`
   ↓ Ranks matches: exact route -> is_primary -> priority -> keyword match
Returns Top 2 Canonical Resource Documents as JSON
```

---

## 14. Authentication & Authorization Architecture

The repository employs **five distinct, non-overlapping authentication mechanisms**:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                AUTHENTICATION MECHANISMS MAP                                     │
├─────────────────────┬───────────────────────┬────────────────────────────┬───────────────────────┤
│ Target Surface      │ Mechanism             │ Enforcement Location       │ Failure Behavior      │
├─────────────────────┼───────────────────────┼────────────────────────────┼───────────────────────┤
│ `/dashboard/*`      │ Clerk Session JWT     │ `middleware.ts`            │ Redirects to sign-in  │
│ `/api/cron`         │ Bearer Shared Secret  │ `app/api/cron/route.ts`    │ Returns 401 (Closed)  │
│ `/api/inbound`      │ Twilio HMAC Signature │ `app/api/inbound/route.ts` │ **FAILS OPEN** if unset│
│ `/api/v1/relay`     │ Hardware HMAC-SHA256  │ `relay/auth/*`             │ Returns 401 (Generic) │
│ `/api/internal/v1/*`│ Database-side IAM     │ `lib/second-brain/auth/*`  │ Returns 401 / 403     │
└─────────────────────┴───────────────────────┴────────────────────────────┴───────────────────────┘
```

### Critical Authorization Invariants & Weaknesses

1. **Missing Authorization Inside Dashboard Server Actions**:
   - `app/dashboard/flows/actions.ts` (`toggleFlow`) and `app/dashboard/drafts/actions.ts` (`approveDraft`, `rejectDraft`) rely solely on Clerk middleware protecting the route.
   - There are **no internal session or role checks inside the action functions themselves**. If a user has a valid Clerk session, they can toggle flows or approve outbound SMS for *any* `clientId` passed in the arguments, without ownership validation.

2. **The Inbound Webhook Fail-Open Flaw**:
   - In `app/api/inbound/route.ts` (lines 50–58):
     ```typescript
     const authToken = process.env.TWILIO_AUTH_TOKEN;
     if (authToken) {
       if (!validateTwilioSignature(url, record, signature, authToken)) {
         return new Response("Invalid signature", { status: 403 });
       }
     }
     ```
   - **Vulnerability**: If `TWILIO_AUTH_TOKEN` is unset in the deployment environment, the entire block is skipped! Any anonymous caller on the internet can POST arbitrary SMS payloads to `/api/inbound` and trigger backend automation workflows.

3. **Database-Side Capability Intersections**:
   - In `lib/second-brain/auth/authorize.ts`:
     `Principal Grants ∩ Credential Scopes ∩ Action ∩ Resource ∩ Constraints = Effective Access`
   - Default deny is enforced. Explicit deny overrides allow.
   - However, **audit logging of authorization decisions is dead code**: `lib/second-brain/auth/audit.ts` defines `recordAgentAudit()`, but it is **never imported or invoked** in `authorize.ts` or in any of the 11 `/api/internal/v1/*` route handlers.

---

## 15. Dependency Analysis

Inventory and classification of all 22 declared dependencies in `package.json`:

| Package Name | Version | Classification | Primary Use / Code Location | Architectural Assessment |
| :--- | :--- | :--- | :--- | :--- |
| `next` | `^16.1.0` | Core / Runtime | Whole application (App Router) | **Vulnerable**: High-severity advisories present in this release line (SSRF, RCE). |
| `react` | `^19.2.0` | Core / Runtime | Whole application | Modern React 19 baseline. |
| `react-dom` | `^19.2.0` | Core / Runtime | Whole application | Standard pairing with React 19. |
| `typescript` | `^5.7.0` | Tooling | TypeScript compilation | Strict mode enabled. |
| `@clerk/nextjs` | `^6.0.0` | Authentication | `middleware.ts`, `app/dashboard/layout.tsx` | Added in ticket T-001. Scoped to dashboard layout. |
| `@anthropic-ai/sdk` | `^0.104.2` | AI / LLM | `automations/inbound/models/anthropic.ts` | Used solely for inbound intent classification. |
| `@calcom/embed-react` | `^1.5.3` | UI / Integration | `components/BookingEmbed.tsx` | Cal.com booking calendar embed. |
| `framer-motion` | `^12.40.0` | UI / Animation | `components/RevealCascade.tsx`, `Hero.tsx` | **Heavyweight**: Contributes significantly to the 241 KiB JS bundle on `/` for simple scroll fades. |
| `lucide-react` | `^1.17.0` | UI / Icons | `Header`, `Footer`, `SegmentRouter`, `Dashboard` | Standard modern icon library. |
| `pg` | `^8.23.0` | Database | `lib/second-brain/db/client.ts`, `lifecycle.ts` | Node.js PostgreSQL client for Neon. |
| `react-hook-form` | `^7.54.2` | Forms | All form components | Form state and validation driver. |
| `@hookform/resolvers`| `^5.2.0` | Forms / Validation | Connects Zod to React Hook Form | Standard pairing. |
| `zod` | `^3.25.0` | Validation | `lib/schemas.ts`, `automations`, `relay` | Shared validation across client and server boundaries. |
| `tsx` | `^4.22.4` | Tooling / CLI | `package.json` automations scripts | Used to run CLI scripts (`automations:demo`, `automations:scheduler`). |
| `@biomejs/biome` | `^2.1.0` | Dev / Tooling | Linter & Formatter (`biome.json`) | Replaces ESLint + Prettier. Ultra-fast execution. |
| `tailwindcss` | `^4.1.0` | Dev / Styling | Tailwind CSS v4 runtime | Uses `@theme` directive in CSS (no `tailwind.config.js`). |
| `@tailwindcss/postcss`| `^4.1.0` | Dev / Styling | PostCSS build integration | Integrates Tailwind v4 into Next.js pipeline. |
| `vitest` | `^3.2.0` | Dev / Testing | Test runner (`vitest run`) | Fast, modern test execution (195 tests in 546ms). |
| `@types/node` | `^22.10.0` | Dev / Types | Node.js typings | Standard dev dependency. |
| `@types/pg` | `^8.23.1` | Dev / Types | PostgreSQL driver typings | Standard dev dependency. |
| `@types/react` | `^19.0.0` | Dev / Types | React 19 typings | Standard dev dependency. |
| `@types/react-dom` | `^19.0.0` | Dev / Types | React DOM 19 typings | Standard dev dependency. |

### Redundant / Suspicious Dependency Patterns
- **Heavy Animation Runtime vs. Actual Usage**: `framer-motion` (v12) is loaded on the homepage exclusively to run basic opacity/transform reveals (`RevealCascade.tsx`). The UX audit already flagged `/` as exceeding the 150 KiB JS budget (measured at **241.8 KiB**), with `framer-motion` identified as the single largest contributor.
- **SDK Inconsistency**: While Anthropic uses `@anthropic-ai/sdk`, OpenAI and Ollama models (`automations/inbound/models/openai-compatible.ts`, `ollama.ts`) use native `fetch()`.

---

## 20. Code Quality Hotspots

Code analysis highlighting high-complexity files, large components, and TypeScript diagnostic clusters:

| File Path | Metric / Finding | Risk Level | Forensic Details |
| :--- | :--- | :--- | :--- |
| `content/industries.ts` | **1,694 lines** | Medium | Massive static file containing 24 industry funnels. High maintenance burden; prone to typo errors. |
| `content/services.ts` | **936 lines** | Medium | Contains 19 service definitions, broken slug references (`"convenience-stores"`), and duplicate services. |
| `db/migrations/002_security_definer_functions.sql` | **726 lines** | High | Massive PL/pgSQL procedural file. Difficult to test and version without dedicated DB test harnesses. |
| `components/checklist/InteractiveChecklist.tsx` | **421 lines** | High | God component handling state for 25 tasks, dread scores, live math, email gating, and lead submission. |
| `components/forms/ContactForm.tsx` | **354 lines** | Medium | Complex two-step form requiring manual `form.trigger()` calls and a `watch()` subscription to clear errors. |
| `lib/second-brain/*` and `app/api/internal/v1/*` | **53 Biome Warnings** | Medium | Biome check reports 53 `lint/suspicious/noExplicitAny` warnings across internal agent IAM route handlers. |
| `automations/server/run-tick.ts` | Dynamic Import Hack | Low-Med | Uses lazy dynamic `await import("../runtime/run")` (line 65) to bypass circular module dependency cycles. |

---

## 21. Static Security Observations

Evidence-based static security findings across API endpoints and configurations:

1. **[HIGH] `/api/inbound` Webhook Fails Open When Unconfigured**:
   - Location: `app/api/inbound/route.ts:50-58`
   - Detail: The Twilio signature validation check only executes `if (authToken)`. If `TWILIO_AUTH_TOKEN` is unset in `.env`, the endpoint processes arbitrary incoming POST requests without authentication.
   - Recommended Action: Require `TWILIO_AUTH_TOKEN` in production environments, failing loud with 500/503 if missing.

2. **[HIGH] Ephemeral Local Storage in Serverless Environments**:
   - Location: `.automations/` referenced across `automations/core/drafts.ts`, `idempotency.ts`, `inbound-stores.ts`, and `app/dashboard/*/actions.ts`.
   - Detail: Vercel serverless lambdas run in read-only filesystems (except `/tmp`) with ephemeral container lifecycles. Writing opt-out suppressions (`suppression.json`) or AI draft queues (`drafts/*.json`) to local disk means **state is wiped on container recycling**. An opt-out sent by a customer may be lost, creating legal compliance liability.

3. **[HIGH] Server Action Caller Ownership Gaps**:
   - Location: `app/dashboard/flows/actions.ts:18` (`toggleFlow`) and `app/dashboard/drafts/actions.ts:24` (`approveDraft`).
   - Detail: Actions accept `clientId` and `editedBody` directly from client invocations. While Clerk protects the route, any authenticated user can toggle automations or dispatch messages for any `clientId` without verifying whether they own that client workspace.

4. **[MED] Un-Audited Agent Authorization Decisions**:
   - Location: `lib/second-brain/auth/authorize.ts` and `app/api/internal/v1/*`.
   - Detail: While `second_brain_security.authenticate_agent` logs auth failures, application-level authorization evaluations (ALLOW / DENY decisions) are never logged to `second_brain_security.agent_audit` because `recordAgentAudit()` is never called.

5. **[MED] Public Lead Endpoint Lacks Rate Limiting**:
   - Location: `app/api/lead/route.ts`
   - Detail: Spam defense relies solely on the invisible honeypot field (`website`). Direct programmatic POST requests bypassing HTML forms can spam `LEAD_WEBHOOK_URL` and deplete third-party webhook quotas (Zapier task limits).

---

## 22. Architectural Performance Observations

1. **Marketing Homepage Bundle Over Budget**:
   - Budget: 150 KiB (per design brief).
   - Measured: **241.8 KiB** (reported in `AUDIT_REPORT.md` Phase 3).
   - Root Cause: `framer-motion` v12 runtime bundled into client chunks for simple opacity/transform animations that could be achieved with native CSS.

2. **Dashboard UI Shell Pollution**:
   - `app/layout.tsx` is the root layout for all routes in `app/`.
   - Because no route groups (e.g. `(marketing)` vs `(dashboard)`) were established, `/dashboard/*` pages render inside the public `<Header />`, `<Footer />`, `<ExitIntentModal />`, `<QuickActions />`, and `<MobileStickyBar />` components. This injects unnecessary marketing scripts and DOM nodes into the internal operator tool.

3. **Client-Side Heavy Computation in Lead Magnet**:
   - `/checklist` renders `InteractiveChecklist.tsx` which calculates min/max hours, dread factors, top 3 priority rankings, and diagnosis strings on every checkbox click client-side across 25 items. While computationally fast, bundling this logic into the client increases hydration time.

---

## 23. Build & Deployment Architecture

- **Deployment Platform**: Designed for [Vercel](https://vercel.com) (`next build` / `next start`).
- **Configuration Files**:
  - `next.config.mjs`: Strict React mode enabled; 6 permanent 301 redirects for legacy routes (`/services` -> `/what-we-automate`, `/for` -> `/industries`, `/privacy` -> `/legal/privacy`, `/terms` -> `/legal/terms`).
  - `postcss.config.mjs`: `@tailwindcss/postcss`.
  - `biome.json`: Biome 2.1 linting and formatting rules.
- **Build Scripts**:
  - `npm run build`: Standard Next.js production bundle build. All 63 public pages are statically prerendered at build time.
  - `npm run dev`: Starts local Next.js dev server.
  - `npm test`: Runs Vitest over 28 test suites in pure Node.js (546ms).
  - `automations:*`: Local background worker CLI commands (`tsx automations/runtime/scheduler.ts`).

---

## 24. Architectural Eras & Migration Residue

Forensic analysis of git history, comments, and structure reveals that the repository spans **four distinct architectural generations**:

```text
Era 1 (June 2026)          Era 2 (June-July 2026)     Era 3 (August 2026)        Era 4 (September 2026)
Pure Marketing Funnel      Automation Engine & Demo   Redesign, Digital Services  Database-Native Agent IAM
─────────────────────      ────────────────────────   & Android SMS Relay        & Automation OS
• App Router pages         • automations/* folder     • Renamed /services, /for  • Neon PostgreSQL DB
• /services & /for routes  • Twilio & SendGrid        • Self-hosted fonts WOFF2  • second_brain_security.*
• Typed content in content/• In-memory demo clients   • 7 Digital Service pillars• 11 /api/internal/v1/*
• Zapier webhook lead sink • .automations/ JSON files • relay/* hardware gateway• Autonomous AI Agents
• Segment personalization  • Unauthenticated dashboard• Clerk auth on /dashboard • Context RAG Engine
```

### Forensic Residue from Partially Completed Migrations

1. **The SegmentRouter Abandonment**:
   - `components/home/SegmentRouter.tsx` was built in Era 1 to allow visitors to self-select (`local` vs `practice`).
   - In Era 3's redesign, the hero was reorganized and the segment router was removed from `app/page.tsx`.
   - Residue: `SegmentRouter.tsx` and its data array `segmentCards` in `content/home.ts` were left orphaned in the repository, still referencing outdated Era 1 paths (`/for#local-businesses`).

2. **The "No Database" Documentation Contradiction**:
   - `README.md` (written in Era 1/2) explicitly states:
     > *"No CMS, no database - all copy in typed constants under /content"*
   - In Era 4, a complete database architecture was introduced (`db/migrations/`, `pg` driver, Neon PostgreSQL, 21 tables referenced).
   - Residue: The repository documentation directly contradicts the actual codebase.

3. **Two Competing Service Concepts**:
   - Era 1 created `content/services.ts` (19 automation services for local businesses and clinics).
   - Era 3 introduced `content/digital-services.ts` (7 high-level digital agency services: web dev, branding, staffing, documentation, etc.).
   - Residue: The site simultaneously presents itself as a specialized "AI Automation Agency" and a full-service "Digital Agency", creating duplicated services (`reviews-and-reputation` vs `feedback-and-reviews`).

4. **Two Competing Automation Engines**:
   - Era 2 created the file-backed recipe engine in `automations/` with 7 hardcoded recipes and demo clients.
   - Era 4 introduced the database-native Automation OS in `lib/second-brain/repositories/AutomationRepository.ts` querying PostgreSQL tables (`jobs_automation`, `schedules_automation`).
   - Residue: Two completely different automation scheduling state machines exist in the same codebase with zero communication between them.
