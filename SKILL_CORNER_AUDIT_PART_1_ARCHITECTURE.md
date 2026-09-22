# TheSkillCorner Codebase Forensic Audit
## Part 1: Repository Identity, Statistics, Architecture Diagram & Repository Map

> **Audit Type**: Read-Only Forensic Architecture Audit  
> **Auditor**: Principal Software Architect  
> **Date**: September 2026  
> **Repository**: `TheSkillCorner` (`/Users/tejindersingh/dev/projects/TheSkillCorner`)  
> **Scope**: Entire Repository (Marketing Site, Automations Engine, Hardware SMS Relay, Agent IAM & Automation OS)  
> **Standard**: Ground-truth code tracing, zero speculation, evidence-backed confidence ratings  

---

## 1. Executive Snapshot

**TheSkillCorner** is ostensibly marketed as a lead-generation and conversion website for an AI automation agency based in Toronto, Ontario (serving local retail/hospitality and professional healthcare/legal practices). Underneath that public marketing exterior, however, forensic inspection reveals that **the repository actually contains four distinct, loosely coupled, and partially competing software applications housed within a single Next.js project:**

```
                                  THESKILLCORNER REPOSITORY
                                              │
         ┌───────────────────┬────────────────┴──────────────────┬───────────────────┐
         ▼                   ▼                                   ▼                   ▼
    Subsystem 1         Subsystem 2                         Subsystem 3         Subsystem 4
  Marketing Funnel    Client Automation Engine           Android SMS Relay   Agent IAM & Automation OS
  & Lead Capture     & Operator Dashboard              Hardware Gateway    ("Second Brain")
  ─────────────────  ─────────────────────────         ─────────────────   ─────────────────────────
  • Public Routes    • Inbound/Outbound Engine         • /api/v1/relay     • /api/internal/v1/*
  • Typed Content    • 2 Hardcoded Demo Clients        • HMAC-SHA256 Auth  • Neon PostgreSQL DB
  • Zapier Webhook   • Local JSON File Persistence     • Zero Persistence  • PL/pgSQL Sec-Definers
  • Cal.com Embed    • Clerk-Protected /dashboard      • Webhook/SendGrid  • Context RAG Engine
  • Segment Context  • Twilio & SendGrid Channels      • Hardware Ingest   • Due-Job State Machine
```

### The Four Disconnected Subsystems

1. **The Public Marketing & Conversion Site**:
   - **Framework**: Next.js 16.1.0 App Router, React 19.2.0, TypeScript 5.7, Tailwind CSS v4 (`@theme` tokens in `app/globals.css`).
   - **Function**: Conversion-ladder marketing site featuring 63 public URLs (13 static pages, 24 industry vertical funnels, 19 automation service detail pages, and 7 digital agency service pillars).
   - **Data Layer**: Zero database. 100% typed static TypeScript constants located in `content/*.ts`.
   - **Lead Capture**: Form submissions validate via Zod and POST directly to an external webhook URL (`LEAD_WEBHOOK_URL` -> Zapier / Make / n8n). No lead data is stored in the application.

2. **The In-Memory / File-Backed Client Automation Engine & Operator Dashboard**:
   - **Location**: `automations/` (~35 files) and `app/dashboard/` (Clerk-gated operator portal).
   - **Function**: A multi-channel SMS/email communication engine designed to execute automated recipes (booking reminders, invoice dunning, review booster, win-back campaigns, inbound lead response).
   - **Data Layer**: Strictly in-memory mock datasets (`brightSmileDentalData`, `radianceSalonData`) and local filesystem JSON files stored in `.automations/` (`drafts/`, `idempotency/`, `overrides/`, `suppression.json`, `conversation.json`, `contacts.json`).
   - **Execution Model**: Polled via `/api/cron` (pings `runTick()`) and event-driven via `/api/inbound` (Twilio webhook receiver with Claude LLM intent classification).

3. **The Stateless Android Hardware SMS Relay Subsystem**:
   - **Location**: `relay/` (~12 files) and `app/api/v1/relay/route.ts`.
   - **Function**: A hardened, stateless API gateway built to receive raw SMS messages forwarded by a physical Android phone running SMS capture hardware in India (`SMS_RELAY_ID=india-sms`).
   - **Security**: Cryptographic verification over raw body bytes using HMAC-SHA256, request canonicalization, timing-safe equality, nonce tracking, and a ±300-second freshness window.
   - **Persistence**: Strictly zero persistence. Forwarded immediately to delivery adapters (SendGrid/Resend email or outbound webhook).
   - **Coupling**: 100% isolated. Has zero imports from or exports to `automations/`, `content/`, `components/`, or `lib/second-brain/`.

4. **The Database-Native Agent IAM & Automation OS Subsystem ("Second Brain")**:
   - **Location**: `db/` (PostgreSQL migrations & JSON policies), `lib/second-brain/` (auth, repositories, routes registry), and `app/api/internal/v1/*` (11 private endpoints).
   - **Function**: An autonomous AI agent identity and access management system with a Retrieval-Augmented Generation (RAG) context router and a distributed job execution state machine.
   - **Database**: External Neon serverless PostgreSQL (`SECOND_BRAIN_DATABASE_URL`). Features a private security schema (`second_brain_security`) with PL/pgSQL `SECURITY DEFINER` functions implementing least-privilege capability intersections (`Principal Grants ∩ Credential Scopes = Effective Access`).
   - **Coupling**: Completely segregated from Subsystems 1, 2, and 3. Its automation job tables (`jobs_automation`, `schedules_automation`, `occurrences_automation`) are completely disconnected from the `automations/` directory's recipe engine.

---

## 2. Repository Statistics

Quantitative inventory obtained via automated static analysis and test runner verification:

| Metric | Measured Value | Notes & Evidence |
| :--- | :--- | :--- |
| **Total Non-Hidden Files** | **280** | Excluding `.git/`, `.next/`, `node_modules/`, `.automations/` |
| **Total Source Lines of Code** | **35,185** | Measured across all text/source files |
| **TypeScript Files (`.ts`)** | **155** | Core logic, automations, second-brain, content, relay |
| **TypeScript React Files (`.tsx`)** | **53** | Pages, layouts, UI components, dashboard widgets |
| **Markdown Documentation Files (`.md`)** | **35** | Specs, ADRs, tickets, marketing articles, audit logs |
| **JSON Configuration & Data Files** | **16** | Policies, configs, tickets, biome configuration |
| **PostgreSQL Migration Files (`.sql`)** | **4** | Located in `db/migrations/` (totaling 929 lines of SQL) |
| **JavaScript / MJS Files (`.mjs`)** | **2** | `next.config.mjs`, `postcss.config.mjs` |
| **Stylesheet Files (`.css`)** | **1** | `app/globals.css` (Tailwind v4 theme tokens & font rules) |
| **Static Binary Assets** | **12** | 6 PNGs, 4 WOFF2 fonts, 2 SVGs |
| **Frontend Route Pages (`page.tsx`)** | **19** | Dynamic catch-alls expand to **63 unique public URLs** |
| **API & Document Route Handlers (`route.ts`)** | **19** | 4 edge/public, 4 document generators, 11 internal APIs |
| **Layout Components (`layout.tsx`)** | **2** | Root `app/layout.tsx` and operator `app/dashboard/layout.tsx` |
| **React UI Components** | **29** | 27 in `components/`, 2 in `app/dashboard/` |
| **Automated Test Files** | **28** | Vitest test suites (`*.test.ts`) across lib, automations, relay, api |
| **Automated Test Cases** | **195** | **195/195 passing** (Runtime: 546ms) |
| **Database Tables Referenced** | **21** | 5 in `second_brain_security` schema, 16 in `public` schema |
| **Production Dependencies** | **13** | `@clerk/nextjs`, `@anthropic-ai/sdk`, `pg`, `zod`, etc. |
| **Development Dependencies** | **9** | `@biomejs/biome`, `tailwindcss`, `vitest`, `typescript`, etc. |
| **Git Commits to Date** | **82** | Earliest: June 2026; Latest: September 2026 |

---

## 3. Architecture Diagram

The diagram below reflects the actual runtime architecture, entry points, boundaries, and data stores discovered during the forensic audit:

```text
====================================================================================================
                                      EXTERNAL CLIENTS & CONSUMERS
====================================================================================================
        │                                  │                     │                       │
        │ [Browser / Public Traffic]       │ [Android Phone]     │ [Twilio Webhook]      │ [AI Agents]
        │                                  │                     │                       │
        ▼                                  ▼                     ▼                       ▼
┌──────────────────────────────┐ ┌───────────────────┐ ┌───────────────────┐ ┌─────────────────────┐
│ Next.js App Router (Public)  │ │ Hardware Gateway  │ │ Inbound Webhook   │ │ Internal Agent IAM  │
│ - Homepage (/)               │ │ POST              │ │ POST              │ │ GET/POST            │
│ - 24 Industry Funnels (/for) │ │ /api/v1/relay     │ │ /api/inbound      │ │ /api/internal/v1/*  │
│ - 19 Automation Pages        │ └─────────┬─────────┘ └─────────┬─────────┘ └──────────┬──────────┘
│ - 7 Digital Service Pages    │           │                     │                      │
│ - Lead Capture Forms         │           │                     │                      │
└──────────────┬───────────────┘           │                     │                      │
               │                           │                     │                      │
               ▼                           │                     │                      │
┌──────────────────────────────┐           │                     │                      │
│ Form Submissions (REST)      │           │                     │                      │
│ POST /api/lead               │           │                     │                      │
│ - Honeypot Validation        │           │                     │                      │
│ - Zod Server Validation      │           │                     │                      │
└──────────────┬───────────────┘           │                     │                      │
               │                           │                     │                      │
               ▼                           ▼                     ▼                      ▼
┌──────────────────────────────┐ ┌───────────────────┐ ┌───────────────────┐ ┌─────────────────────┐
│ External Webhook Delivery    │ │ Cryptographic     │ │ Twilio Signature  │ │ Database-Side IAM   │
│ (Zapier / Make / n8n)        │ │ Verification      │ │ Verification      │ │ & Authorization     │
│ - Passes JSON Payload        │ │ - Canonical Req   │ │ - Validate Token  │ │ - Parse Key.Secret  │
│ - 8-second Timeout Shield    │ │ - HMAC-SHA256     │ │ - Extract Form    │ │ - Sec-Definer Auth  │
│ - Zero Local Storage         │ │ - Freshness ±300s │ │ - Find Client No. │ │ - Grants ∩ Scopes   │
└──────────────────────────────┘ └─────────┬─────────┘ └─────────┬─────────┘ └──────────┬──────────┘
                                           │                     │                      │
                                           ▼                     ▼                      │
                                 ┌───────────────────┐ ┌───────────────────┐            │
                                 │ Delivery Adapters │ │ Inbound Pipeline  │            │
                                 │ - SendGrid Email  │ │ - Carrier Rules   │            │
                                 │ - Resend Email    │ │ - Claude LLM      │            │
                                 │ - Webhook Relay   │ │ - Intent Router   │            │
                                 └───────────────────┘ └─────────┬─────────┘            │
                                                                 │                      │
               ┌─────────────────────────────────────────────────┴──┐                   │
               │                                                    │                   │
               ▼                                                    ▼                   │
┌──────────────────────────────┐                          ┌───────────────────┐         │
│ Local File Stores (.automations)                        │ Channels Dispatch │         │
│ - drafts/[client].json       │                          │ - Twilio SMS      │         │
│ - idempotency/[client].json  │                          │ - SendGrid Email  │         │
│ - suppression.json           │                          │ - Console (DryRun)│         │
│ - conversation.json          │                          └───────────────────┘         │
└──────────────▲───────────────┘                                                        │
               │                                                                        │
               │ (Mutates / Reads)                                                      │
               │                                                                        │
┌──────────────┴───────────────┐                                                        │
│ Operator Dashboard           │                                                        │
│ - Clerk Middleware Gate      │                                                        │
│ - /dashboard/flows (Actions) │                                                        │
│ - /dashboard/drafts (Actions)│                                                        │
└──────────────────────────────┘                                                        │
                                                                                        │
               ┌────────────────────────────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Neon Serverless PostgreSQL Database (`SECOND_BRAIN_DATABASE_URL`)                                 │
├─────────────────────────────────────────────────┬────────────────────────────────────────────────┤
│ Security Schema (`second_brain_security`)        │ Canonical Public Schema (`public`)             │
│ - `agent_principals`                            │ - `resource_context_index` (RAG Knowledge)     │
│ - `agent_credentials` (Digests only)            │ - `resource_registry` & `resource_locations`   │
│ - `agent_principal_grants` (Ceilings)           │ - `jobs_automation` & `schedules_automation`   │
│ - `agent_credential_scopes` (Restrictions)     │ - `occurrences_automation` & `execution_claims`│
│ - `agent_audit` (Tamper-evident log)            │ - `runner_cycles_automation` (Batch Metrics)   │
└─────────────────────────────────────────────────┴────────────────────────────────────────────────┘
```

---

## 4. Full Repository Map

Meaningful directory breakdown explaining architectural purpose, contents, runtime relevance, and forensic observations:

| Directory Path | Architectural Purpose | Significant Files & Contents | Runtime Relevance | Forensic Observations & Risks |
| :--- | :--- | :--- | :--- | :--- |
| `app/` | Next.js 16 App Router routing tree | 19 `page.tsx`, 19 `route.ts`, 2 `layout.tsx`, `robots.ts`, `sitemap.ts` | **Critical** (All incoming HTTP routes) | Root `app/layout.tsx` wraps all routes (including `/dashboard/*`), causing marketing UI elements to bleed into the operator portal. Missing `app/dashboard/page.tsx`. |
| `app/api/` | Edge & Serverless Route Handlers | `lead/route.ts`, `inbound/route.ts`, `cron/route.ts`, `v1/relay/route.ts`, `internal/v1/*` | **Critical** (Backend APIs) | `/api/inbound` fails open if `TWILIO_AUTH_TOKEN` is unset. `/api/cron` requires `CRON_SECRET`. |
| `app/dashboard/` | Clerk-gated Operator Portal | `layout.tsx`, `flows/`, `drafts/`, Server Actions | **High** (Operator UI) | Relies on Server Actions reading/writing local JSON files in `.automations/`. In a serverless environment (Vercel), local disk writes are ephemeral. |
| `app/digital-services/` | Digital Agency Service Line Hub | `page.tsx`, `[slug]/page.tsx` | **High** (Public SEO) | 7 digital agency pillars added in Aug 2026. Structurally separate from automation services. |
| `app/what-we-automate/` | Automation Catalog Hub | `page.tsx`, `[slug]/page.tsx` | **High** (Public SEO) | 19 automation solutions. Contains conceptual duplication with `digital-services` and duplicate services internally. |
| `app/industries/` | Vertical Funnel Landing Pages | `page.tsx`, `[slug]/page.tsx` | **High** (Public SEO / Ads) | 24 industry verticals. Dynamic pages generate full SEO funnels from `content/industries.ts`. |
| `automations/` | Client Automation & Communication Engine | `channels/`, `clients/`, `core/`, `inbound/`, `recipes/`, `runtime/`, `server/` | **Medium** (Called via cron/inbound) | Contains 7 recipes and 2 hardcoded demo clients. All external tool integrations are mocked in-memory. Zero connection to `lib/second-brain/`. |
| `components/` | Shared React UI Component Library | 27 component files (`home/`, `forms/`, `capture/`, `checklist/`, `CtaLink.tsx`, etc.) | **High** (Client & Server Rendering) | Contains completely orphaned `SegmentRouter.tsx`. Duplicate form logic between `ChecklistForm.tsx` and `InteractiveChecklist.tsx`. |
| `content/` | Typed Static Content Store (Headless CMS alternative) | `site.ts`, `home.ts`, `services.ts`, `digital-services.ts`, `industries.ts`, `proof.ts`, `faq.ts`, `about.ts`, `checklist.ts` | **Critical** (Content Source of Truth) | Massive data files (`industries.ts` is 1,694 lines). Broken slug reference: `"convenience-stores"` exists in 11 services but is missing from industries. |
| `db/` | Database Schemas & IAM Policies | `migrations/001-004.sql`, `policies/*.policy.json` | **High** (Database Setup) | Defines `second_brain_security` schema and PL/pgSQL functions. Crucially: contains **zero DDL migrations for the 16 `public.*` automation tables** it references. |
| `docs/` | Architectural Guides & Strategy Documentation | `relay-api-contract.md`, `community/`, `marketing/`, `outreach/` | **Low** (Build-time reference only) | Contains unpublished blog articles and Circle community strategy documents that have no corresponding code implementation. |
| `lib/` | Shared Utilities, Schemas & Domain Libraries | `analytics.ts`, `leads.ts`, `roi.ts`, `schemas.ts`, `segment-context.tsx`, `use-animated-number.ts` | **Critical** (Cross-cutting logic) | `use-animated-number.ts` has zero imports across the repository (orphaned). |
| `lib/second-brain/` | Agent IAM & RAG Repository Subsystem | `auth/`, `admin/`, `db/`, `repositories/`, `routes-registry.ts`, `types/` | **High** (Private Agent APIs) | Connects to Neon PostgreSQL. `recordAgentAudit` is dead code (never called). `admin/lifecycle.ts` has no caller outside its unit tests. |
| `public/` | Public Static Assets | Fonts (Poppins, DM Sans WOFF2), PNG logos, SVG icons | **Medium** (Static Delivery) | Missing `automation-opportunities-checklist.pdf` referenced in `.env.example`. |
| `relay/` | Stateless SMS Hardware Gateway | `adapters/`, `auth/`, `config/`, `errors/`, `handler.ts`, `types/`, `validation/` | **High** (Hardware Ingestion) | Clean, robust, isolated subsystem. 100% test coverage. Completely unintegrated with the rest of the application. |
| `tickets/` | Auto-Fix Review Pipeline Audit Ledgers | `T-001.md` through `T-007.md`, `*-report.json` | **None** (Historical Audit Artifacts) | Documents auto-fix ticket implementations (T-001 Clerk, T-002 Robots, T-004 Cron, T-007 Contrast). |
| `.automations/` | Local JSON Storage Directory | Gitignored runtime state files | **High** in dev / **Fatal** in serverless | File-backed state stores for demo clients. Incompatible with stateless serverless deployment. |
