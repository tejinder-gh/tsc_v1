# Routes & API Directory — TheSkillCorner

> **Living Catalog**: This document is the single-source-of-truth inventory for all UI routes, API endpoints, dynamic content slugs, machine-readable specifications, and URL redirects in TheSkillCorner application.
> **Maintenance Rule**: Whenever any UI page (`app/**/page.tsx`), route handler (`app/**/route.ts`), or redirect (`next.config.mjs`) is added, updated, or removed, this file **MUST** be updated in the same change.

---

## 1. UI Routes (Pages)

### 1.1 Core Marketing & Conversion Pages

Scoped within the `app/(marketing)` route group layout ([`app/(marketing)/layout.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/layout.tsx)), ensuring global conversion surfaces (Header, Footer, QuickActions, ExitIntentModal, MobileStickyBar) are encapsulated and isolated from operator tooling.

| Route | File Path | Access | Purpose & Conversion Role |
| :--- | :--- | :--- | :--- |
| `/` | [`app/(marketing)/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/page.tsx) | Public | **Homepage**: Editorial Studio narrative (Global Masthead, Intent Router & Live Observed System, 02 System Studies, 03 How We Decide, 04 Founder POV, 05 Curated Explore, 06 Open Prompt, Minimal Footer). |
| `/about` | [`app/(marketing)/about/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/about/page.tsx) | Public | **About**: Founder story, practical engineering philosophy, and 5 operating principles applied to real work. |
| `/how-it-works` | [`app/(marketing)/how-it-works/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/how-it-works/page.tsx) | Public | **Delivery Process**: Explicit 3-stage breakdown (*Audit → Build → Run*) detailing what The Skill Corner handles vs. what the client does to eliminate adoption friction. |
| `/results` | [`app/(marketing)/results/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/results/page.tsx) | Public | **Results & Scenarios**: Illustrative problem/build/anticipated outcome scenarios with transparent non-fabricated claims. |
| `/book` | [`app/(marketing)/book/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/book/page.tsx) | Public | **Audit Booking**: Top conversion rung. Embeds Cal.com calendar for a free 30-minute AI Automation Audit ("leave with 3 ideas whether you hire us or not"). |
| `/contact` | [`app/(marketing)/contact/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/contact/page.tsx) | Public | **Quick Query & Contact**: Contact form + sidebar booking links for visitors with questions who aren't ready to book a live call. |
| `/library` | [`app/(marketing)/library/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/library/page.tsx) | Public | **Explore / Library**: Useful systems, tools, and field notes. Editorial publication index + technical catalog with outcome filters and dense listings. |
| `/checklist` | [`app/(marketing)/checklist/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/checklist/page.tsx) | Public | **Lead Magnet**: Interactive Automation Opportunities Checklist covering 25 business tasks, calculating hours saved, gated by email capture. |
| `/social` | [`app/(marketing)/social/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/social/page.tsx) | Public | **Physical Business Card Landing Page**: Mobile-first landing target for NFC cards and QR codes. Features quick messaging form and `/contact.vcf` download link. |

---

### 1.2 Catalogs & Dynamic Landing Hubs

#### A. Digital Services Hub (Work)
* **Hub Route**: `/digital-services` — [`app/(marketing)/digital-services/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/digital-services/page.tsx)
  * **Role**: **Work Hub**: Broad capability index organized across four editorial bands: `01 / AUTOMATE`, `02 / BUILD`, `03 / GROW`, `04 / OPERATE`, with a 4-step engagement methodology.
* **Dynamic Route**: `/digital-services/[slug]` — [`app/(marketing)/digital-services/[slug]/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/digital-services/[slug]/page.tsx)
  * **Role**: Authored capability specification detailing the operational problem, outcome changes, execution pipeline, deliverables, and fit assessment.
* **Source of Truth**: [`content/digital-services.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/content/digital-services.ts)
* **Active Slugs (7 Pillars)**:
  1. `ai-agent-development`: Custom autonomous voice/chat AI agents & automation workflows.
  2. `website-development`: High-performance Next.js marketing and B2B websites.
  3. `digital-marketing`: Search engine optimization (SEO) and generative engine optimization (GEO).
  4. `staffing`: Dedicated tech talent, software engineers, and automation specialists.
  5. `documentation`: Business process documentation, Standard Operating Procedures (SOPs), and manuals.
  6. `application-development`: Custom web and mobile software development.
  7. `rebranding`: Brand identity, visual design systems, and positioning.

#### B. Automation Services Catalog (Automation Index)
* **Hub Route**: `/what-we-automate` — [`app/(marketing)/what-we-automate/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/what-we-automate/page.tsx)
  * **Role**: **Automation Index**: Focused directory of concrete systems for communication, intake, scheduling, documents, and recurring operational work.
* **Dynamic Route**: `/what-we-automate/[slug]` — [`app/(marketing)/what-we-automate/[slug]/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/what-we-automate/[slug]/page.tsx)
  * **Role**: Automation specification detailing the bottleneck, workflow pipeline, deliverables, and fit assessment.
* **Source of Truth**: [`content/services.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/content/services.ts)
* **Active Slugs (18 Canonical Automation Solutions)**:
  `ai-receptionist`, `booking-and-reminders`, `intake-and-documents`, `reviews-and-reputation`, `follow-up-automation`, `reporting-dashboards`, `inventory-and-supplier-ordering`, `client-onboarding-portals`, `dispatch-and-routing`, `invoice-and-payments`, `lead-qualification`, `social-media-automation`, `customer-win-back`, `newsletter-compiler`, `contract-automation`, `expense-matching`, `staff-scheduling`, `client-notifications`.
  *(Note: Legacy slug `feedback-and-reviews` is permanently redirected to canonical `reviews-and-reputation` via HTTP 308 permanent redirect).*

#### C. Industry Solutions Catalog (Sector Index)
* **Hub Route**: `/industries` — [`app/(marketing)/industries/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/industries/page.tsx)
  * **Role**: **Sector Index**: Systems tailored to how local businesses and professional practices operate.
* **Dynamic Route**: `/industries/[slug]` — [`app/(marketing)/industries/[slug]/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/industries/[slug]/page.tsx)
  * **Role**: Sector narrative detailing the recurring week, where systems help, illustrative scenario, and prioritization.
* **Source of Truth**: [`content/industries.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/content/industries.ts)
* **Active Slugs (24 Industry Verticals)**:
  * **Local Businesses**: `retail-stores`, `restaurants`, `salons-spas`, `gyms-fitness`, `auto-repair`, `pet-grooming-boarding`, `residential-cleaning`, `boutique-retail`, `photography-studios`, `catering-services`, `landscaping-gardening`, `construction-trades`.
  * **Professional Practices**: `medical-clinics`, `dental-offices`, `law-firms`, `accounting-firms`, `real-estate`, `veterinary-clinics`, `physiotherapy-clinics`, `optometry-clinics`, `mental-health-practices`, `insurance-agencies`, `mortgage-brokerages`, `tutoring-centers`.

#### D. Newsletters & Market Intelligence Hub (Briefings)
* **Hub Route**: `/newsletters` — [`app/(marketing)/newsletters/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/newsletters/page.tsx)
  * **Role**: **Briefings Hub**: Signal, without the feed. Curated technical briefings and recurring market radars.
* **Dynamic Route**: `/newsletters/[slug]` — [`app/(marketing)/newsletters/[slug]/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/newsletters/[slug]/page.tsx)
  * **Role**: Briefing specification, subscription dispatch, sample issue reader, and methodology.
* **Source of Truth**: [`features/newsletters/data/newsletters.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/features/newsletters/data/newsletters.ts)
* **Active Publications (3 Canonical Radars)**:
  1. `tech-founder-briefing`: Actionable AI & engineering shifts, distilled weekly for founders and CTOs.
  2. `ontario-opportunity-monitor`: Daily deal radar for Ontario businesses, distressed assets, and auctions.
  3. `tender-brief`: Curated municipal & provincial procurement opportunities matching SMB capabilities.

---

### 1.3 Operator Dashboard (Clerk Protected)

Enforced via [`middleware.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/middleware.ts) for `/dashboard(.*)` and isolated from the marketing layout shell.

| Route | File Path | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `/dashboard` | [`app/dashboard/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/page.tsx) | Operator Auth (Clerk) | Dashboard entry point; automatically redirects to `/dashboard/flows`. |
| `/dashboard/catalog` | [`app/dashboard/catalog/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/catalog/page.tsx) | Operator Auth (Clerk) | Unified catalog control plane: view, filter, and audit status, pricing, and visibility of all 34 canonical offerings. |
| `/dashboard/newsletters` | [`app/dashboard/newsletters/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/newsletters/page.tsx) | Operator Auth (Clerk) | Newsletter operations control plane: manage subscribers, publication cadence, AI compilation schedules, and issue counts. |
| `/dashboard/newsletters/[slug]` | [`app/dashboard/newsletters/[slug]/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/newsletters/[slug]/page.tsx) | Operator Auth (Clerk) | Single newsletter management: compile new AI drafts, review takeaways, edit markdown body, and approve/publish editions. |
| `/dashboard/flows` | [`app/dashboard/flows/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/flows/page.tsx) | Operator Auth (Clerk) | Manage and toggle client-specific agentic automation flows and recipe triggers. |
| `/dashboard/drafts` | [`app/dashboard/drafts/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/drafts/page.tsx) | Operator Auth (Clerk) | Human-in-the-loop review queue to approve, edit, or reject AI-drafted customer outbound SMS/messages. |

---

### 1.4 Internal Review & Developer Tools

| Route | File Path | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `/dev/components` | [`app/(dev)/dev/components/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(dev)/dev/components/page.tsx) | Developer (`noindex`) | Live component gallery rendering all design tokens, buttons, accordions, and cards at 1:1 scale for design audits. |

---

### 1.5 Legal Pages

| Route | File Path | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `/legal/privacy` | [`app/(marketing)/legal/privacy/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/legal/privacy/page.tsx) | Public | Privacy policy and PIPEDA/PHIPA compliance guidelines. |
| `/legal/terms` | [`app/(marketing)/legal/terms/page.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/legal/terms/page.tsx) | Public | Standard terms of service and delivery parameters. |

---

## 2. Public & Edge API Endpoints

| Endpoint | Method | File Path | Auth / Security | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/lead` | `POST` | [`app/api/lead/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/lead/route.ts) | Honeypot check + Zod validation + 32KB payload limit | Validates inbound lead submissions from forms and delivers them to `LEAD_WEBHOOK_URL` (Zapier, Make, n8n) with timeouts and error shielding. |
| `/api/newsletter/subscribe` | `POST` | [`app/api/newsletter/subscribe/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/newsletter/subscribe/route.ts) | Honeypot drop + Zod validation + 32KB payload limit | Registers newsletter subscriptions, validates publication slugs, logs masked PII audit events, forwards to CRM webhook when set, and returns early-subscriber waitlist status. |
| `/api/inbound` | `POST` | [`app/api/inbound/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/inbound/route.ts) | Twilio signature (`x-twilio-signature`) + Fail-closed in prod | Inbound Twilio webhook for SMS replies. Fails closed in production if token is absent, parses customer intent, handles opt-outs ("STOP"), triggers AI draft generation, and replies with empty TwiML. |
| `/api/cron` | `GET` | [`app/api/cron/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/cron/route.ts) | Bearer Secret (`CRON_SECRET`) | Scheduled runner tick pinged by Vercel Cron. Executes scheduled automation cycles across all active clients. |
| `/api/v1/relay` | `POST` | [`app/api/v1/relay/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/v1/relay/route.ts) | HMAC-SHA256 signature + nonce | Stateless SMS relay gateway for Android SMS capture devices. Validates hardware cryptographic signatures and forwards to delivery adapters with zero persistence. |

---

## 3. Internal Agent IAM & Automation OS APIs (`/api/internal/v1/...`)

All internal endpoints require authentication via Bearer token (`Authorization: Bearer <key_id>.<secret>`) or `x-api-key`, enforced by the Second Brain database-native IAM system ([`authenticateAgent`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/second-brain/auth/authenticate.ts) and [`authorize`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/lib/second-brain/auth/authorize.ts)).

| Endpoint | Method | File Path | Required Action | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/internal/v1/endpoints` | `GET` | [`app/api/internal/v1/endpoints/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/endpoints/route.ts) | `meta.endpoints.read` | Self-documenting introspection catalog and dynamic OpenAPI 3.0 export. Returns only the endpoints the caller is authorized to execute. |
| `/api/internal/v1/context/search` | `POST` | [`app/api/internal/v1/context/search/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/context/search/route.ts) | `context.read` | Canonical context & RAG engine. Resolves high-level domains and keywords to authoritative Notion/Drive documents, playbooks, and guidelines. |
| `/api/internal/v1/automations/status` | `GET` | [`app/api/internal/v1/automations/status/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/status/route.ts) | `automation.status.read` | Real-time health check returning active claim count, queue backlog, and cycle states. |
| `/api/internal/v1/automations/due-jobs` | `GET` | [`app/api/internal/v1/automations/due-jobs/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/due-jobs/route.ts) | `automation.evaluate` | Evaluates all scheduled jobs and returns due jobs ordered by priority and execution policy. |
| `/api/internal/v1/automations/jobs/[key]` | `GET` | [`app/api/internal/v1/automations/jobs/[key]/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/jobs/[key]/route.ts) | `automation.read` | Loads job configuration, execution budget limits, prompts, and declared targets for a given automation key. |
| `/api/internal/v1/automations/occurrences/ensure` | `POST` | [`app/api/internal/v1/automations/occurrences/ensure/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/occurrences/ensure/route.ts) | `automation.occurrence.write` | Idempotently creates or returns an occurrence slot record for a scheduled job run. |
| `/api/internal/v1/automations/claims/acquire` | `POST` | [`app/api/internal/v1/automations/claims/acquire/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/claims/acquire/route.ts) | `automation.claim.acquire` | Atomically acquires a timed lease claim on an occurrence to prevent duplicate concurrent runs. |
| `/api/internal/v1/automations/claims/release` | `POST` | [`app/api/internal/v1/automations/claims/release/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/claims/release/route.ts) | `automation.claim.release` | Releases an active execution lease claim when execution finishes or aborts. |
| `/api/internal/v1/automations/attempts/start` | `POST` | [`app/api/internal/v1/automations/attempts/start/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/attempts/start/route.ts) | `automation.attempt.write` | Logs the start timestamp and sequence number of a job execution attempt. |
| `/api/internal/v1/automations/attempts/finish` | `POST` | [`app/api/internal/v1/automations/attempts/finish/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/attempts/finish/route.ts) | `automation.attempt.write` | Records completion status (`succeeded`, `failed`, `deferred`), scheduler disposition, and execution duration. |
| `/api/internal/v1/automations/cycles/upsert` | `POST` | [`app/api/internal/v1/automations/cycles/upsert/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/api/internal/v1/automations/cycles/upsert/route.ts) | `automation.cycle.write` | Upserts runner batch cycle summaries, jobs evaluated, and batch metrics. |

---

## 4. Machine-Readable & Document Route Handlers

| Route | File Path | Format | Purpose |
| :--- | :--- | :--- | :--- |
| `/llms.txt` | [`app/llms.txt/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/llms.txt/route.ts) | `text/plain` | Conforms to `llmstxt.org` specification. Compact summary of services, pricing anchors, and canonical URLs for LLMs (Perplexity, ChatGPT, Claude). |
| `/llms-full.txt` | [`app/llms-full.txt/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/llms-full.txt/route.ts) | `text/plain` | Full-depth textual catalog export of all services, delivery frameworks, and SOPs for LLM retrieval and ingestion. |
| `/pricing.md` | [`app/pricing.md/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/pricing.md/route.ts) | `text/plain` | Dynamic markdown pricing sheet for autonomous AI buying agents. |
| `/contact.vcf` | [`app/contact.vcf/route.ts`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/contact.vcf/route.ts) | `text/vcard` | Downloadable organization vCard 3.0 (`X-ABShowAs:COMPANY`) linked from `/social` for saving the company contact to phones. |

---

## 5. URL Redirects ([`next.config.mjs`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/next.config.mjs))

Maintained for URL stability and legacy link preservation (permanent redirects, HTTP 308):
* `/services` $\rightarrow$ `/what-we-automate`
* `/services/:slug` $\rightarrow$ `/what-we-automate/:slug`
* `/for` $\rightarrow$ `/industries`
* `/for/:slug` $\rightarrow$ `/industries/:slug`
* `/privacy` $\rightarrow$ `/legal/privacy`
* `/terms` $\rightarrow$ `/legal/terms`
* `/what-we-automate/feedback-and-reviews` $\rightarrow$ `/what-we-automate/reviews-and-reputation`
