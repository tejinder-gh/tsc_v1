# Skill Corner Codebase Forensic Audit — Complete Architectural Report

> **Document Type**: Comprehensive Read-Only Forensic Architecture Audit  
> **Repository Target**: `/Users/tejindersingh/dev/projects/TheSkillCorner`  
> **Auditor Role**: Principal Software Architect  
> **Date**: September 2026  
> **Target Audience**: Senior Technical Architects, C-Suite Review Boards, and External AI Analysis Engines  
> **Verification Status**: 100% Read-Only. Grounded strictly in static code analysis, reference tracing, AST queries, and runtime build verification. Zero speculative claims.

---

## Table of Contents
1. [Executive Snapshot](#1-executive-snapshot)
2. [Repository Statistics](#2-repository-statistics)
3. [Architecture Diagram](#3-architecture-diagram)
4. [Repository Map](#4-repository-map)
5. [Feature / Module Inventory](#5-feature--module-inventory)
6. [Route Inventory](#6-route-inventory)
7. [API Inventory](#7-api-inventory)
8. [Data Model](#8-data-model)
9. [Integrations](#9-integrations)
10. [AI Systems](#10-ai-systems)
11. [Automation Systems](#11-automation-systems)
12. [UI / Component Architecture](#12-ui--component-architecture)
13. [State & Data Flow](#13-state--data-flow)
14. [Authentication & Authorization](#14-authentication--authorization)
15. [Dependency Analysis](#15-dependency-analysis)
16. [Dead / Orphaned / Legacy Candidates](#16-dead--orphaned--legacy-candidates)
17. [Duplicate / Competing Implementations](#17-duplicate--competing-implementations)
18. [Incomplete / Experimental Features](#18-incomplete--experimental-features)
19. [Overengineering / Unnecessary Abstraction Candidates](#19-overengineering--unnecessary-abstraction-candidates)
20. [Code Quality Hotspots](#20-code-quality-hotspots)
21. [Security Observations](#21-security-observations)
22. [Performance Observations](#22-performance-observations)
23. [Build / Deployment Architecture](#23-build--deployment-architecture)
24. [Architectural History / Migration Residue](#24-architectural-history--migration-residue)
25. Complexity Map
26. Top 20 Complexity Contributors
27. Potential Cleanup Candidates
28. Important Unknowns
29. Questions for the Owner
30. Architecture Reconstruction Summary

---

## 1. Executive Snapshot

Skill Corner (`the-skill-corner`, v0.1.0) is a hybrid Next.js 16 (App Router / Turbopack) application deployed primarily to Vercel and backed by a remote Neon PostgreSQL cluster. Rather than being a unified single application, the codebase is a container for **four distinct, semi-autonomous subsystems** that share a common repository and runtime:

1. **Production Marketing & Lead Generation Engine (High Commercial Value, Healthy)**:
   - High-performance, statically generated marketing website serving 73 prerendered pages.
   - Covers 7 digital service pillars, 24 industry verticals, 18 automation solutions, an interactive ROI calculator, and an automation opportunities checklist lead magnet.
   - Completely database-free at runtime for public visitors; all content is stored as typed static TypeScript constants (`content/*.ts`).
   - Lead capture POSTs to an external webhook (Zapier/Make/n8n) via an 8s-timeout proxy with client/server Zod validation and honeypot spam protection.
   - Sophisticated SEO and Generative Engine Optimization (GEO) with JSON-LD structured schemas, `llms.txt`, and `llms-full.txt`.

2. **Automations Recipe Engine & Operator Review Dashboard (Fragmented / Prototype Stage)**:
   - A multi-channel outbound/inbound communication engine in `automations/` (~45 files) supporting 7 recipe types (appointment reminders, review boosters, invoice dunning, lead auto-responders, etc.).
   - Includes an inbound SMS webhook receiver (`/api/inbound`) that classifies incoming customer replies via heuristic rules or an Anthropic Claude (Opus 4.8) LLM interpreter.
   - Built around 2 demo clients (`radiance-salon`, `brightsmile-dental`) with hardcoded mock datasets (`MemoryDataset`).
   - **Severe architectural impedance**: State persistence is backed entirely by synchronous local JSON files (`.automations/**/*.json`), which fails across serverless cloud environments (Vercel Lambdas).
   - Paired with an operator portal at `/dashboard` protected by Clerk authentication, featuring a Human-in-the-Loop review queue for AI-generated drafts.

3. **Stateless SMS Relay Gateway Subsystem (Self-Contained, Production-Grade)**:
   - Located in `relay/` (19 files) and exposed via `POST /api/v1/relay`.
   - Designed to ingest SMS messages forwarded by physical Android hardware devices in international locales (e.g. India office).
   - Authenticated via strict HMAC-SHA256 signatures over canonical request envelopes with 300s timestamp freshness windows and an in-memory replay cache.
   - 100% stateless with zero persistence; dispatches directly to pluggable delivery adapters (SendGrid/Resend email or outbound webhooks).

4. **Second Brain Agent IAM & Automation OS (Sophisticated Database Layer / Incomplete Integration)**:
   - Located in `lib/second-brain/` (15 files) with 4 SQL migrations in `db/migrations/` and 11 private REST endpoints under `/api/internal/v1/`.
   - Implements a database-native Machine IAM system on Neon PostgreSQL with custom `<keyId>.<secret>` Bearer tokens, SHA-256 hash storage, PL/pgSQL Security Definer procedures, and granular scope-based authorization.
   - Exposes dynamic OpenAPI 3.0 endpoint introspection, hybrid Context RAG search, and distributed job leasing/claim management.
   - **Critical finding**: The public schema tables referenced by this subsystem (`resource_context_index`, `jobs_automation`, `occurrences_automation`, etc.) have **no DDL migration files in this repository**, existing only as grants and TypeScript repository queries against an external schema.

---

## 2. Repository Statistics

Accurate statistics generated via direct repository AST traversal and static analysis (excluding `node_modules` and hidden directories):

| Metric | Measured Value | Notes / Context |
| :--- | :--- | :--- |
| **Total Tracked Project Files** | **290** | Non-hidden, non-`node_modules` |
| **Total Lines of Code & Docs** | **38,228** | Total physical lines across all tracked files |
| **TypeScript Files (`.ts`)** | **158** | Libs, automations, relay, Second Brain, content |
| **React Component Files (`.tsx`)** | **55** | Marketing pages, dashboard pages, UI primitives |
| **JavaScript Modules (`.mjs`)** | **2** | `next.config.mjs`, `postcss.config.mjs` |
| **JSON Configuration & Data (`.json`)** | **16** | Package configs, ticket records, Biome config |
| **Markdown Documentation (`.md`)** | **40** | Architecture docs, ADRs, tickets, specs |
| **CSS Stylesheets (`.css`)** | **1** | `app/globals.css` (276 lines, Tailwind v4 `@theme`) |
| **SQL Migration Scripts (`.sql`)** | **4** | `db/migrations/001_...` through `004_...` (~800 lines) |
| **Static Assets (public images/fonts)** | **14** | 4 self-hosted `.woff2` font files, SVGs, PNGs |
| **Frontend UI Routes** | **76** | 73 prerendered SSG/static + 3 dynamic dashboard pages |
| **Backend API Route Handlers** | **15** | 4 public/cron/relay routes + 11 internal Second Brain routes |
| **Prerendered Output Endpoints** | **84** | Full Next.js Turbopack build artifact count |
| **Production Dependencies** | **13** | `@clerk/nextjs`, `@anthropic-ai/sdk`, `pg`, `zod`, etc. |
| **Dev Dependencies** | **8** | `@biomejs/biome`, `tailwindcss`, `vitest`, `tsx`, etc. |
| **Automated Test Files** | **31** | Vitest v3.2.6 test suites |
| **Total Automated Unit Tests** | **214** | **100% passing (214/214 in ~600ms)** |
| **TypeScript Compilation Status** | **0 Errors** | `tsc --noEmit` exits with code 0 |
| **Biome Linter Status** | **0 Errors** | 53 harmless warnings (`noExplicitAny` in test mocks) |

---

## 3. Architecture Diagram

```text
                                  ┌─────────────────────────────┐
                                  │      Public Internet /      │
                                  │   Search Engines / Users    │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ NEXT.JS 16 APPLICATION RUNTIME (App Router / Turbopack / Vercel Edge & Node)                   │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│  [ SUBSYSTEM 1: MARKETING & CONVERSION ] (Static / Zero DB)                                     │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 73 Prerendered Static HTML Routes (7 Digital Services, 24 Industries, 18 Automations)     │  │
│  │ Content Layer: content/*.ts (site, services, industries, digital-services, proof, faq)     │  │
│  │ UI Primitives: components/* (Header, Footer, ServicesGrid, RoiCalculator, ExitIntentModal)│  │
│  │ Conversion: POST /api/lead ──(8s timeout)──▶ Zapier / Make / n8n Webhook                 │  │
│  │ Cal.com Embed: /book ──(Client Iframe)──▶ cal.com/theskillcorner                          │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                 │
│  [ SUBSYSTEM 2: OPERATOR PORTAL & AUTOMATIONS ENGINE ]                                          │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Operator Auth: Clerk Middleware (/dashboard/*) ──▶ app/dashboard/ (flows, drafts)        │  │
│  │ Human-in-the-Loop Server Actions: approve / reject / edit AI drafts                        │  │
│  │ Scheduler Trigger: GET /api/cron ──(Bearer CRON_SECRET)──▶ automations/server/run-tick.ts │  │
│  │ Inbound SMS Webhook: POST /api/inbound ──(Twilio Sig)──▶ automations/inbound/handle.ts     │  │
│  │ LLM Intent Interpreter: Claude Opus 4.8 (@anthropic-ai/sdk) / Ollama / OpenAI             │  │
│  │ ⚠ Impedance Warning: State is persisted to Local JSON (.automations/**/*.json)            │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                 │
│  [ SUBSYSTEM 3: STATELESS SMS RELAY GATEWAY ]                                                   │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Hardware Ingestion: POST /api/v1/relay (Android Forwarder App)                            │  │
│  │ Cryptographic Layer: HMAC-SHA256 Canonical Request Verification + Nonce/Replay Cache      │  │
│  │ Processing: 100% Stateless Stream (Zero Persistence)                                      │  │
│  │ Delivery Adapters: EmailDeliveryAdapter (SendGrid/Resend) or WebhookDeliveryAdapter        │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                 │
│  [ SUBSYSTEM 4: SECOND BRAIN AGENT IAM & AUTOMATION OS ]                                        │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Authentication: Bearer <keyId>.<secret> / x-api-key ──▶ PL/pgSQL authenticate_agent()    │  │
│  │ Scope Authorization: Fine-grained Action / ResourceType / Effect evaluation Engine        │  │
│  │ 11 Private REST APIs: /api/internal/v1/context/search, /endpoints, /automations/*         │  │
│  │ Introspection: Dynamic OpenAPI 3.0 export filtered by caller privileges                   │  │
│  └─────────────────────────────────────────────┬─────────────────────────────────────────────┘  │
└────────────────────────────────────────────────┼────────────────────────────────────────────────┘
                                                 │
                                                 ▼ (pg connection pool)
                               ┌───────────────────────────────────┐
                               │   NEON MANAGED POSTGRESQL (AWS)   │
                               ├───────────────────────────────────┤
                               │ Schema: second_brain_security     │
                               │ - agent_principals                │
                               │ - agent_credentials (SHA-256)     │
                               │ - agent_credential_scopes         │
                               │ - agent_audit_log                 │
                               │                                   │
                               │ Schema: public (External)         │
                               │ - resource_context_index (RAG)    │
                               │ - jobs_automation / schedules     │
                               │ - occurrences / execution_claims  │
                               └───────────────────────────────────┘
```

---

## 4. Repository Map

| Directory / File | Architectural Role | Key Contents | Runtime Execution Relevance | Notes & Observations |
| :--- | :--- | :--- | :--- | :--- |
| `app/(marketing)/` | Public Web Presentation | 18 page routes, `layout.tsx` | Next.js SSG / Server Components | Encapsulates Header/Footer, isolates marketing visitors from Clerk JS. |
| `app/dashboard/` | Operator Control Portal | `flows/`, `drafts/`, `page.tsx` | Next.js Server Components & Actions | Protected by Clerk middleware. Uses `auth-guard.ts` for path safety. |
| `app/api/` | Edge & Server Route Handlers | `lead/`, `inbound/`, `cron/`, `relay/` | Node.js dynamic serverless routes | Ingestion endpoints with bounded 32KB body readers and rate limits. |
| `app/api/internal/v1/` | Second Brain Private APIs | 11 endpoint route handlers | Node.js dynamic serverless routes | Authenticated via database-native IAM Bearer tokens. |
| `automations/` | Multi-Client Automation Engine | 45 files (`recipes/`, `inbound/`, `core/`) | In-memory & file-backed engine | Dispatches SMS/email and handles replies; tied to 2 demo clients. |
| `.automations/` | File-Backed Engine Storage | `brightsmile-dental/`, `drafts/`, `overrides/` | Local JSON files | **Runtime hazard**: Incompatible with ephemeral serverless filesystems. |
| `relay/` | Stateless SMS Gateway | 19 files (`auth/`, `adapters/`, `validation/`) | Pure stateless TypeScript library | HMAC-SHA256 signature verification and pluggable delivery adapters. |
| `lib/second-brain/` | Private Agent IAM & Automation OS | 15 files (`auth/`, `repositories/`, `admin/`) | Postgres `pg.Pool` client layer | Interacts with Neon DB via PL/pgSQL security definer procedures. |
| `lib/` | Shared Utilities & Hooks | `analytics.ts`, `schemas.ts`, `roi.ts`, `leads.ts` | Shared client/server utilities | Zod validation schemas, ROI calculation models, analytics tracking. |
| `components/` | Shared UI Component Library | 26 components (`home/`, `forms/`, `capture/`) | React Server & Client Components | Built with Tailwind v4 tokens; contains 3 duplicate form implementations. |
| `content/` | Static Content Store (Zero DB) | 9 TypeScript content files | Static compilation inputs | Single source of truth for site copy, navigation, services, industries. |
| `db/migrations/` | Database DDL & Seed Scripts | 4 SQL migration files | PostgreSQL schema deployment | Deploys `second_brain_security` schema. Missing DDL for `public` tables. |
| `db/policies/` | Declarative Security Policies | 5 JSON policy files | Administrative reference | Declarative least-privilege policies for Claude, ChatGPT, Muse, etc. |
| `docs/` | Architectural Specs & Research | 16 Markdown / text documents | Offline developer reference | Contains relay API specs, market research, SEO checklists, outreach docs. |
| `tickets/` | Auto-Fix Execution Records | 7 ticket `.md` and `.json` reports | Static project history | C-suite audit implementation tickets T-001 through T-007 (Aug 2026). |
| `public/` | Public Static Assets | Fonts, icons, brand PNGs/SVGs | Next.js static asset serving | Contains 4 self-hosted `.woff2` font files for Poppins and DM Sans. |

---

## 5. Feature / Module Inventory

| Module Name | Principal Paths | Purpose | User-Facing? | Entry Points | Data Store | External Integrations | Current Status | Duplication / Issues | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Marketing Storefront** | `app/(marketing)/*`, `content/*` | Inform visitors, drive conversion ladder | Yes (Public) | `/`, `/about`, `/how-it-works`, `/results` | None (Static TS) | Google Analytics, Plausible | **Active / Production** | High health; fast static compilation. | HIGH |
| **Automation Catalog** | `app/(marketing)/what-we-automate/*` | Showcase 18 automation services | Yes (Public) | `/what-we-automate`, `/[slug]` | `content/services.ts` | None | **Active / Production** | Fully static; clean JSON-LD metadata. | HIGH |
| **Industry Hub** | `app/(marketing)/industries/*` | Showcase 24 vertical solutions | Yes (Public) | `/industries`, `/[slug]` | `content/industries.ts` | None | **Active / Production** | Scaled across 24 verticals with breadcrumbs. | HIGH |
| **Digital Services Hub** | `app/(marketing)/digital-services/*` | Showcase 7 core service pillars | Yes (Public) | `/digital-services`, `/[slug]` | `content/digital-services.ts` | None | **Active / Production** | Broadens agency positioning beyond automations. | HIGH |
| **Lead Capture Engine** | `app/api/lead/route.ts`, `lib/leads.ts` | Validate and forward inbound leads | Yes (Public) | `POST /api/lead` | External CRM | Zapier / Make / n8n | **Active / Production** | Server Zod parsing + honeypot + 8s timeout. | HIGH |
| **Audit Booking** | `app/(marketing)/book/page.tsx` | Embed free 30-min audit calendar | Yes (Public) | `/book` | Cal.com | Cal.com Embed React | **Active / Production** | Clean client-side iframe embed. | HIGH |
| **Interactive ROI Tool** | `components/home/RoiCalculator.tsx` | Calculate business hours & $ saved | Yes (Public) | Embedded on `/` | Client Memory | Analytics tracking | **Active / Production** | Segment-aware slider calculation. | HIGH |
| **Checklist Magnet** | `app/(marketing)/checklist/page.tsx` | 25-task automation audit list | Yes (Public) | `/checklist` | `content/checklist.ts` | Lead Webhook | **Active / Production** | Duplicate email form inside interactive list. | HIGH |
| **Physical Card Landing** | `app/(marketing)/social/page.tsx` | Landing for NFC cards & QR codes | Yes (Public) | `/social`, `/contact.vcf` | None | Mobile vCard | **Active / Production** | Mobile-first; quick query form + vCard download. | HIGH |
| **Operator Dashboard** | `app/dashboard/*` | Client automation flow toggles | Internal | `/dashboard`, `/flows`, `/drafts` | `.automations/overrides` | Clerk Authentication | **Partial / Prototype** | Clerk gated; writes to local disk files. | HIGH |
| **Human-in-the-Loop Queue** | `app/dashboard/drafts/*` | Approve/edit/reject AI replies | Internal | `/dashboard/drafts` | `.automations/drafts` | None | **Partial / Prototype** | Functional UI, but writes to local JSON files. | HIGH |
| **Automations Recipe Engine** | `automations/recipes/*`, `core/*` | Run 7 communication workflows | Background | `runTick()`, CLI, scheduler | `.automations/**/*.json` | SendGrid, Twilio | **Experimental / Partial** | Hardcoded to 2 demo clients; local file I/O. | HIGH |
| **Inbound SMS Processor** | `app/api/inbound/route.ts`, `automations/inbound/*` | Ingest replies, parse intent | Internal/Partner | `POST /api/inbound` | `.automations/` | Twilio, Anthropic Claude | **Active / Prototype** | Twilio sig verified; calls Claude Opus 4.8. | HIGH |
| **Stateless SMS Relay** | `app/api/v1/relay/route.ts`, `relay/*` | Hardware SMS forwarder gateway | Partner / Device | `POST /api/v1/relay` | Stateless | SendGrid, Resend | **Active / Production** | HMAC-SHA256 signed; zero persistence. | HIGH |
| **Second Brain Agent IAM** | `lib/second-brain/auth/*`, `db/migrations/*` | Database-native agent identity | Internal Agents | `/api/internal/v1/*` | Neon PostgreSQL | Neon DB | **Active / Hardened** | Security Definer PL/pgSQL procedures. | HIGH |
| **Canonical Context RAG** | `app/api/internal/v1/context/search/*` | Domain/keyword RAG resolution | Internal Agents | `POST .../context/search` | Neon PostgreSQL | Neon DB | **Active / Untested DB** | Queries `public.resource_context_index`. | MEDIUM |
| **Automation OS Scheduler** | `app/api/internal/v1/automations/*` | Distributed job scheduling & claims | Internal Agents | 9 `/api/internal/v1/*` endpoints | Neon PostgreSQL | Neon DB | **Incomplete / Schema Missing** | 0 DDL migrations in repository for public tables. | HIGH |

---

## 6. Route Inventory

Complete inventory of all 76 frontend routes across the application:

### 6.1 Marketing & Presentation Pages (70 Static / SSG Routes)
All wrapped by [`app/(marketing)/layout.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/(marketing)/layout.tsx) with Header, Footer, and conversion modals.

| Route | File Path | Type | Auth | Purpose | Navigation Links | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `app/(marketing)/page.tsx` | Static (○) | Public | Main Conversion Homepage | Logo, Header, Footer | Active |
| `/about` | `app/(marketing)/about/page.tsx` | Static (○) | Public | Founder Credentials & Mission | Header, Footer | Active |
| `/how-it-works` | `app/(marketing)/how-it-works/page.tsx` | Static (○) | Public | 3-Stage Delivery Process | Footer, Home CTA | Active |
| `/results` | `app/(marketing)/results/page.tsx` | Static (○) | Public | Case Studies & Scenarios | Footer | Active |
| `/book` | `app/(marketing)/book/page.tsx` | Static (○) | Public | Free 30-Min Audit (Cal.com) | Header CTA, Mobile Bar | Active |
| `/contact` | `app/(marketing)/contact/page.tsx` | Static (○) | Public | General Inquiries Contact Form | Footer, Mobile Nav | Active |
| `/checklist` | `app/(marketing)/checklist/page.tsx` | Static (○) | Public | 25-Task Lead Magnet | Header Nav, Exit Modal | Active |
| `/social` | `app/(marketing)/social/page.tsx` | Static (○) | Public | NFC / QR Physical Card Landing | External QR / NFC | Active |
| `/digital-services` | `app/(marketing)/digital-services/page.tsx` | Static (○) | Public | Digital Services 7-Pillar Hub | Header Nav, Footer | Active |
| `/digital-services/[slug]` | `app/(marketing)/digital-services/[slug]/page.tsx` | SSG (●) | Public | 7 Individual Pillar Pages | Digital Services Hub | Active |
| `/industries` | `app/(marketing)/industries/page.tsx` | Static (○) | Public | 24-Industry Vertical Directory | Header Nav, Footer | Active |
| `/industries/[slug]` | `app/(marketing)/industries/[slug]/page.tsx` | SSG (●) | Public | 24 Individual Vertical Pages | Industries Directory, Footer | Active |
| `/what-we-automate` | `app/(marketing)/what-we-automate/page.tsx` | Static (○) | Public | 18 Automation Solutions Hub | Header Nav, Footer | Active |
| `/what-we-automate/[slug]`| `app/(marketing)/what-we-automate/[slug]/page.tsx` | SSG (●) | Public | 18 Individual Solution Pages | Automation Hub, Footer | Active |
| `/legal/privacy` | `app/(marketing)/legal/privacy/page.tsx` | Static (○) | Public | PIPEDA/PHIPA Privacy Policy | Footer Sub-bar | Active |
| `/legal/terms` | `app/(marketing)/legal/terms/page.tsx` | Static (○) | Public | Client Engagement Terms | Footer Sub-bar | Active |
| `/dev/components` | `app/(marketing)/dev/components/page.tsx` | Static (○) | Dev (`noindex`)| Visual Design Token Gallery | Unlinked (Direct URL) | Dev Only |

*Active dynamic slug list:*
- **Digital Services (7)**: `ai-agent-development`, `application-development`, `digital-marketing`, `documentation`, `rebranding`, `staffing`, `website-development`.
- **Industries (24)**: `accounting-firms`, `auto-repair`, `boutique-retail`, `catering-services`, `construction-trades`, `dental-offices`, `gyms-fitness`, `insurance-agencies`, `landscaping-gardening`, `law-firms`, `medical-clinics`, `mental-health-practices`, `mortgage-brokerages`, `optometry-clinics`, `pet-grooming-boarding`, `photography-studios`, `physiotherapy-clinics`, `real-estate`, `residential-cleaning`, `restaurants`, `retail-stores`, `salons-spas`, `tutoring-centers`, `veterinary-clinics`.
- **Automations (18)**: `ai-receptionist`, `booking-and-reminders`, `client-notifications`, `client-onboarding-portals`, `contract-automation`, `customer-win-back`, `dispatch-and-routing`, `expense-matching`, `follow-up-automation`, `intake-and-documents`, `inventory-and-supplier-ordering`, `invoice-and-payments`, `lead-qualification`, `newsletter-compiler`, `reporting-dashboards`, `reviews-and-reputation`, `social-media-automation`, `staff-scheduling`.

### 6.2 Operator Dashboard Pages (3 Dynamic Routes)
Wrapped by [`app/dashboard/layout.tsx`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/dashboard/layout.tsx) with Clerk authentication.

| Route | File Path | Type | Auth Requirement | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `/dashboard` | `app/dashboard/page.tsx` | Dynamic (ƒ) | Clerk Session | Dashboard entry; redirects immediately to `/dashboard/flows`. |
| `/dashboard/flows` | `app/dashboard/flows/page.tsx` | Dynamic (ƒ) | Clerk Session | Operator portal to toggle automation flows per demo client. |
| `/dashboard/drafts` | `app/dashboard/drafts/page.tsx` | Dynamic (ƒ) | Clerk Session | Human-in-the-loop review queue for AI-generated outbound SMS. |

### 6.3 Document & Metadata Route Handlers (8 Static Routes)

| Route | File Path | Content Type | Purpose |
| :--- | :--- | :--- | :--- |
| `/contact.vcf` | `app/contact.vcf/route.ts` | `text/vcard` | Downloadable digital business card for mobile contacts. |
| `/llms.txt` | `app/llms.txt/route.ts` | `text/plain` | High-level summary of capabilities for AI web agents. |
| `/llms-full.txt` | `app/llms-full.txt/route.ts` | `text/plain` | Comprehensive text export of all 49 service & industry offerings. |
| `/pricing.md` | `app/pricing.md/route.ts` | `text/markdown` | Machine-readable pricing anchors and engagement models. |
| `/robots.txt` | `app/robots.ts` | `text/plain` | Crawler directives explicitly permitting AI retrieval engines. |
| `/sitemap.xml` | `app/sitemap.ts` | `application/xml`| XML sitemap indexing all 73 canonical static URLs. |
| `/opengraph-image` | `app/opengraph-image.tsx` | `image/png` | Dynamic OpenGraph preview card generated at build time. |
| `/icon.svg` | `app/icon.svg` | `image/svg+xml` | Scalable vector favicon. |

---

## 7. API Inventory

Complete inventory of all 15 backend API route handlers:

| Method | Endpoint | Source File | Authentication | Responsibility | Target System / Store | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/lead` | `app/api/lead/route.ts` | Honeypot + Zod | Validates and forwards lead form submissions | Zapier / Make / n8n Webhook | Active / Production |
| `POST` | `/api/inbound` | `app/api/inbound/route.ts` | Twilio HMAC (`x-twilio-signature`) | Ingests customer SMS replies; parses intent | Anthropic Claude Opus 4.8 / Local JSON | Active / Hardened |
| `GET` | `/api/cron` | `app/api/cron/route.ts` | Bearer `CRON_SECRET` | Scheduled automation execution tick | Memory Demo Clients / `.automations/` | Active / Serverless |
| `POST` | `/api/v1/relay` | `app/api/v1/relay/route.ts` | HMAC-SHA256 Canonical Req | Stateless SMS forwarder gateway | SendGrid / Resend / Webhook Adapter | Active / Production |
| `GET` | `/api/internal/v1/endpoints` | `app/api/internal/v1/endpoints/route.ts` | Bearer Agent IAM (`meta.endpoints.read`) | OpenAPI 3.0 & JSON endpoint introspection | In-memory routes registry | Active / Internal |
| `POST` | `/api/internal/v1/context/search`| `app/api/internal/v1/context/search/route.ts`| Bearer Agent IAM (`context.read`) | Hybrid Vector/BM25 Context RAG search | Neon DB (`resource_context_index`) | Active / Schema External |
| `GET` | `/api/internal/v1/automations/status` | `.../automations/status/route.ts` | Bearer Agent IAM (`automation.status.read`) | Real-time queue and cycle health check | Neon DB (`occurrences_automation`) | Active / Schema External |
| `GET` | `/api/internal/v1/automations/due-jobs` | `.../automations/due-jobs/route.ts` | Bearer Agent IAM (`automation.evaluate`) | Evaluates and returns pending due jobs | Neon DB (`jobs_automation`, schedules) | Active / Schema External |
| `GET` | `/api/internal/v1/automations/jobs/[key]` | `.../automations/jobs/[key]/route.ts` | Bearer Agent IAM (`automation.read`) | Fetches configuration for a single job key | Neon DB (`jobs_automation`) | Active / Schema External |
| `POST` | `/api/internal/v1/automations/occurrences/ensure`| `.../occurrences/ensure/route.ts` | Bearer Agent IAM (`automation.occurrence.write`) | Idempotently creates a scheduled run slot | Neon DB (`occurrences_automation`) | Active / Schema External |
| `POST` | `/api/internal/v1/automations/claims/acquire` | `.../claims/acquire/route.ts` | Bearer Agent IAM (`automation.claim.acquire`) | Acquires timed distributed lease claim | Neon DB (`execution_claims_automation`)| Active / Schema External |
| `POST` | `/api/internal/v1/automations/claims/release` | `.../claims/release/route.ts` | Bearer Agent IAM (`automation.claim.release`) | Releases active distributed lease claim | Neon DB (`execution_claims_automation`)| Active / Schema External |
| `POST` | `/api/internal/v1/automations/attempts/start` | `.../attempts/start/route.ts` | Bearer Agent IAM (`automation.attempt.write`) | Logs start timestamp of execution attempt | Neon DB (`occurrence_attempts_automation`) | Active / Schema External |
| `POST` | `/api/internal/v1/automations/attempts/finish`| `.../attempts/finish/route.ts` | Bearer Agent IAM (`automation.attempt.write`) | Records final execution attempt outcome | Neon DB (`occurrence_attempts_automation`) | Active / Schema External |
| `POST` | `/api/internal/v1/automations/cycles/upsert` | `.../cycles/upsert/route.ts` | Bearer Agent IAM (`automation.cycle.write`) | Upserts runner batch cycle metrics | Neon DB (`runner_cycles_automation`) | Active / Schema External |

---

## 8. Data Model

The application utilizes two distinct storage paradigms: local filesystem JSON stores and a managed PostgreSQL relational database.

### 8.1 Filesystem JSON Stores (`.automations/`)
Used exclusively by Subsystem 2 (Automations Engine and Operator Dashboard):

| Path / File Pattern | Structure | Responsibility | Active? | Architectural Concerns |
| :--- | :--- | :--- | :--- | :--- |
| `.automations/{client}/contacts.json` | `Map<phone, ContactRecord>` | Maps phone numbers to client contacts | Yes | Synchronous file I/O blocks event loop; lost on serverless deploy. |
| `.automations/{client}/conversation.json` | `Record<contactId, Message[]>` | Message conversation history | Yes | Unbounded file growth over time; no indexing or query capabilities. |
| `.automations/{client}/idempotency.json` | `string[]` (message IDs) | 30-day message deduplication ring | Yes | Rewritten in full on every message; race conditions under concurrency. |
| `.automations/{client}/suppression.json` | `Set<contactId | phone>` | Tracks opt-outs ("STOP", "CANCEL") | Yes | Critical compliance data stored in ephemeral files; risk of TCPA violation. |
| `.automations/overrides/{client}.json` | `Record<recipeId, boolean>` | Operator flow enable/disable toggles | Yes | Modified by Dashboard Server Actions; lost on next Vercel build. |
| `.automations/drafts/{client}.json` | `ReviewDraft[]` | AI-generated outbound message drafts | Yes | Modified by Dashboard Server Actions; ephemeral. |

### 8.2 Relational Database Layer (Neon PostgreSQL)

#### Managed Schema: `second_brain_security` (Defined in `db/migrations/001..004.sql`)

| Table Name | Responsibility | Primary Key | Key Relationships | Active? |
| :--- | :--- | :--- | :--- | :--- |
| `agent_principals` | Declares machine identities (`chatgpt`, `claude`, `muse`, etc.) | `principal_id` (UUID) | 1:M with `agent_credentials` | Active |
| `agent_credentials` | Stores SHA-256 hashed secret tokens and key IDs | `credential_id` (UUID) | FK to `agent_principals` | Active |
| `agent_credential_scopes` | Granular permission grants (action, resourceType, effect) | `scope_id` (UUID) | FK to `agent_credentials` | Active |
| `agent_audit_log` | Immutable append-only audit trail of authenticated requests | `audit_id` (UUID) | FK to `agent_principals`, `agent_credentials` | Active |

#### External Public Schema Tables (Referenced in Code, Missing In-Repo Migrations)
Queried by `AutomationRepository.ts` and `ContextRepository.ts` via role `skill_corner_runtime`:
- **Context RAG**: `public.resource_context_index`, `public.resource_registry`, `public.resource_locations`, `public.resource_aliases`.
- **Automation OS**: `public.jobs_automation`, `public.schedules_automation`, `public.job_execution_policy_automation`, `public.job_dependencies_automation`, `public.job_targets_automation`, `public.job_prompt_refs_automation`, `public.job_report_delivery_automation`, `public.occurrences_automation`, `public.execution_claims_automation`, `public.occurrence_attempts_automation`, `public.runner_cycles_automation`, `public.runner_cycle_jobs_automation`.

---

## 9. Integrations

| Provider | Purpose | Code Paths | Environment Variables | Active? | Observed Concerns |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Zapier / Make / n8n** | Lead delivery webhook | `app/api/lead/route.ts` | `LEAD_WEBHOOK_URL` | Active | Webhook must be manually provisioned; fails closed in prod if unset. |
| **Cal.com** | Free audit appointment scheduling | `app/(marketing)/book/page.tsx` | `NEXT_PUBLIC_CAL_LINK` | Active | Client-side iframe; graceful fallback text if link is omitted. |
| **Clerk** | Operator portal authentication | `middleware.ts`, `app/dashboard/*` | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Active | Fails closed on `/dashboard(.*)`. Marketing site completely decoupled. |
| **Twilio** | Outbound SMS & Inbound Webhooks | `app/api/inbound/*`, `automations/channels/sms-twilio.ts` | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | Active | Inbound webhook verifies `x-twilio-signature`; rejects if token unset in prod. |
| **Anthropic (Claude)** | Natural language intent classification | `automations/inbound/models/anthropic.ts`, `automations/inbound/llm-interpreter.ts` | `ANTHROPIC_API_KEY`, `INTERPRETER_MODEL` | Active | Uses official `@anthropic-ai/sdk` with model `claude-opus-4-8`. |
| **Ollama / OpenAI** | Dev/local alternative LLM providers | `automations/inbound/models/ollama.ts`, `openai-compatible.ts` | `INTERPRETER_PROVIDER`, `OLLAMA_HOST`, `OPENAI_BASE_URL`, `OPENAI_API_KEY` | Supported | Fallback implementations using standard `fetch()`. |
| **SendGrid** | Outbound transactional email | `relay/adapters/EmailDeliveryAdapter.ts`, `automations/channels/email-sendgrid.ts` | `SMS_RELAY_SENDGRID_API_KEY`, `SENDGRID_API_KEY` | Active | Relay adapter uses raw HTTP fetch; automations channel has mock fallbacks. |
| **Resend** | Outbound transactional email alternative | `relay/adapters/EmailDeliveryAdapter.ts` | `SMS_RELAY_RESEND_API_KEY` | Active | Alternative delivery provider for stateless SMS relay. |
| **Neon PostgreSQL** | Second Brain IAM and Automation OS | `lib/second-brain/db/client.ts` | `SECOND_BRAIN_DATABASE_URL`, `SECOND_BRAIN_ADMIN_DATABASE_URL` | Active | Uses connection pool with SSL requirement; credentials stored securely. |
| **Plausible Analytics**| Privacy-first web analytics | `app/layout.tsx`, `lib/analytics.ts` | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | Zero cookies, lightweight script; toggled via env. |
| **Google Analytics 4** | Web traffic measurement | `app/layout.tsx`, `lib/analytics.ts` | `NEXT_PUBLIC_GA_ID` | Optional | Mutually exclusive with Plausible (Plausible takes precedence). |

---

## 10. AI Systems

Skill Corner contains two distinct AI implementations:

### 10.1 Inbound SMS Intent Classifier & Auto-Responder
* **Pipeline Trace**:
  ```text
  Customer SMS
      ↓
  Twilio Inbound Webhook (POST /api/inbound)
      ↓
  Heuristic Rules Classifier (automations/inbound/rules-interpreter.ts)
      ├─ Match: Opt-out ("STOP") ──▶ Add to suppression list (no LLM call)
      ├─ Match: Exact Confirmation ("YES") ──▶ Mark confirmed (no LLM call)
      └─ No Match: Natural Language Reply
             ↓
  LLM Interpreter (automations/inbound/llm-interpreter.ts)
      ├─ Prompt: System instructions with business context & tone
      ├─ Provider: Anthropic (@anthropic-ai/sdk) / Ollama / OpenAI
      ├─ Model: claude-opus-4-8 (default)
      ├─ Structured Output: JSON schema enforcing { intent, confidence, replyText, humanHandoff }
             ↓
  Review or Dispatch
      ├─ Low Confidence / Handoff ──▶ Write to .automations/drafts/ (Human Review)
      └─ High Confidence Auto-Reply ──▶ Dispatch via Twilio SMS
  ```
* **Architectural Observation**: Structured outputs prevent hallucinated function calls, and high-risk keywords (emergency, cancellations) trigger automatic human handoffs. However, the system relies on local file storage for draft persistence.

### 10.2 Second Brain Context RAG Search
* **Pipeline Trace**:
  ```text
  External Agent Query (POST /api/internal/v1/context/search)
      ↓
  Bearer Token IAM Authentication & Authorization (context.read)
      ↓
  Context Repository (lib/second-brain/repositories/ContextRepository.ts)
      ↓
  SQL Query against public.resource_context_index
      ├─ Match: Exact route match on domain + subdomain
      ├─ Filter: Routing keywords intersection
      ├─ Sort: is_primary DESC, priority DESC
      └─ Join: public.resource_registry & public.resource_locations
             ↓
  JSON Response: Canonical Playbooks, SOPs, Notion/Drive URLs
  ```

---

## 11. Automation Systems

1. **Vercel Cron Trigger (`GET /api/cron`)**:
   - Pings `app/api/cron/route.ts` every 5 minutes (configured in `vercel.json`).
   - Requires `Authorization: Bearer <CRON_SECRET>`.
   - Calls `runTick()`, executing pending recipes across all registered clients.
   - Evaluates quiet hours (`20:00` to `08:00` local client time) to prevent late-night messaging.

2. **Standalone Daemon Scheduler (`automations/runtime/scheduler.ts`)**:
   - Long-lived Node.js process running a `setInterval` loop (default 60,000ms).
   - Designed for traditional VPS/container deployments; unusable on Vercel serverless.

3. **CLI Demo Runner (`automations/runtime/cli.ts`)**:
   - Executable via `npm run automations:demo`.
   - Runs a full dry-run simulation of `radiance-salon` and `brightsmile-dental` using a pinned deterministic mock clock (`DEMO_NOW`).

4. **Second Brain Distributed Job Leases (`lib/second-brain/repositories/AutomationRepository.ts`)**:
   - Implements distributed occurrence slots, 15-minute execution leases (`execution_claims_automation`), and retry tracking (`occurrence_attempts_automation`) to prevent duplicate execution across distributed agent runners.

---

## 12. UI / Component Architecture

The UI is built with React 19 and styled using Tailwind CSS v4 with bespoke design tokens defined under `@theme` in [`app/globals.css`](file:///Users/tejindersingh/dev/projects/TheSkillCorner/app/globals.css).

### Component Audit Table

| Component | File Path | Consumed By | Responsibility | Observations & Duplications |
| :--- | :--- | :--- | :--- | :--- |
| `Header` | `components/Header.tsx` | `MarketingLayout` | Responsive navigation with mobile portal overlay | High polish; accessible focus trap (`use-focus-trap.ts`). |
| `Footer` | `components/Footer.tsx` | `MarketingLayout` | Full directory link columns & office locality rail | Server component; dynamically derives links from content files. |
| `CtaLink` | `components/CtaLink.tsx` | Site-wide | Primary button & conversion link primitive | Standardized button styling; handles analytics event tagging. |
| `ServicesGrid` | `components/ServicesGrid.tsx` | `/`, `/what-we-automate` | Displays 18 automation solution cards | Clean grid layout; deep links to dynamic service pages. |
| `RoiCalculator` | `components/home/RoiCalculator.tsx` | Homepage (`/`) | Interactive slider estimating ROI and payback | Highly engaging; segment-aware (local vs practice). |
| `ExitIntentModal` | `components/capture/ExitIntentModal.tsx` | `MarketingLayout` | Desktop mouse-leave & 45s timer modal | Embeds `ChecklistForm`; uses focus trap and local storage flag. |
| `MobileStickyBar` | `components/capture/MobileStickyBar.tsx` | `MarketingLayout` | Fixed bottom bar on mobile screens | Provides instant tap-to-call and tap-to-book CTAs. |
| `QuickActions` | `components/capture/QuickActions.tsx` | `MarketingLayout` | Desktop floating speed-dial button | Floating quick access to booking, checklist, and phone call. |
| `Faq` | `components/Faq.tsx` | `/`, Service pages | FAQ accordion list | Zero JS! Built entirely with native `<details>` and `<summary>`. |
| `ContactForm` | `components/forms/ContactForm.tsx` | `/contact` | Full contact query form | React Hook Form + Zod; honeypot spam protection. |
| `ChecklistForm` | `components/forms/ChecklistForm.tsx` | `ExitIntentModal`, `/checklist` | Email lead capture form | Duplicate validation and submission logic with `ContactForm`. |
| `QuickMessageForm`| `components/forms/QuickMessageForm.tsx`| `/social` | Simplified single-field message form | Tailored for mobile card visitors; submits to `/api/lead`. |
| `InteractiveChecklist`| `components/checklist/InteractiveChecklist.tsx`| `/checklist` | 25-task interactive checklist | Contains a **3rd duplicate email submission form** inline. |
| `SegmentRouter` | `components/home/SegmentRouter.tsx` | **0 CALLERS (Orphaned)** | Tabbed audience navigation switcher | **Dead code**. Deleted in staging; was superseded by redesign. |

---

## 13. State & Data Flow

```text
1. Marketing Visitor Flow:
   Browser ──▶ Static Edge HTML (Vercel CDN)
               ├─ Static Content: content/*.ts (zero runtime DB)
               ├─ Client State: SegmentContext ("all" | "local" | "practice")
               └─ Form Submit: React Hook Form ──▶ POST /api/lead ──▶ Zapier Webhook

2. Operator Dashboard Flow:
   Browser ──▶ Clerk Auth Session Check (middleware.ts)
               └─ Dashboard Pages (/dashboard/flows, /dashboard/drafts)
                    └─ Next.js Server Actions ──▶ Synchronous fs I/O (.automations/**/*.json)

3. Hardware SMS Relay Flow:
   Android App ──▶ POST /api/v1/relay (HMAC-SHA256 signature in headers)
                   └─ Verify timestamp & nonce ──▶ Parse payload ──▶ Stateless Delivery Adapter (SendGrid/Resend)

4. Agent Machine Flow:
   AI Agent ──▶ POST /api/internal/v1/* (Bearer <keyId>.<secret>)
                └─ authenticateAgent() ──▶ authorize() ──▶ Neon Postgres Pool ──▶ JSON Result
```

---

## 14. Authentication & Authorization

| Domain | Auth Mechanism | Enforcement File | Roles / Identities | Behavior on Failure |
| :--- | :--- | :--- | :--- | :--- |
| **Marketing Pages** | None (Public) | None | Public anonymous visitors | N/A |
| **Operator Dashboard** | Clerk Session Cookies | `middleware.ts`, `app/dashboard/auth-guard.ts` | Authenticated Clerk Users | Redirects to Clerk hosted sign-in page. |
| **Inbound SMS Webhook** | Twilio Signature (`x-twilio-signature`) | `app/api/inbound/route.ts` | Twilio Webhook Dispatcher | 403 Forbidden (Fails closed in prod if token unset). |
| **Vercel Cron Trigger** | Bearer Secret Header | `app/api/cron/route.ts` | Vercel Cron Runner (`CRON_SECRET`) | 401 Unauthorized. |
| **Hardware SMS Relay** | HMAC-SHA256 Canonical Req Signature | `relay/auth/verifyRelayRequest.ts` | Provisioned Android Devices (`SMS_RELAY_DEVICE_ID`) | 401 Unauthorized (Constant-time comparison). |
| **Second Brain APIs** | Database-Native Bearer Token (`<keyId>.<secret>`) | `lib/second-brain/auth/authenticate.ts` | Principals: `chatgpt`, `claude`, `muse`, `automation-os`, `skill-corner-internal` | 401 AuthenticationError / 403 AuthorizationError |

---

## 15. Dependency Analysis

### Production Dependencies (`dependencies` in `package.json`)
1. `next` (`^16.1.0`, installed `16.3.0`): Core React framework (App Router / Turbopack).
2. `react` & `react-dom` (`^19.2.0`): Core UI runtime.
3. `@clerk/nextjs` (`^6.0.0`): Operator authentication. Isolated strictly to `/dashboard`.
4. `@anthropic-ai/sdk` (`^0.104.2`): Claude Opus 4.8 client for SMS intent classification.
5. `zod` (`^3.25.0`): Validation schemas for lead forms, relay payloads, and API requests.
6. `react-hook-form` (`^7.54.2`) & `@hookform/resolvers` (`^5.2.0`): Client-side form state management.
7. `pg` (`^8.23.0`): PostgreSQL client for Second Brain Neon database connection pool.
8. `framer-motion` (`^12.40.0`): Micro-animations, scroll cascades, and mobile modal transitions.
9. `lucide-react` (`^1.17.0`): Standard icon set.
10. `@calcom/embed-react` (`^1.5.3`): Embed component for booking calendar.
11. `tsx` (`^4.22.4`): TypeScript execution runtime for CLI commands and ticks.

### Dev Dependencies (`devDependencies`)
- `@biomejs/biome` (`^2.1.0`): High-speed linter and formatter.
- `tailwindcss` (`^4.1.0`) & `@tailwindcss/postcss` (`^4.1.0`): Modern CSS engine.
- `vitest` (`^3.2.0`): Fast unit and integration test runner (214 tests pass in <600ms).
- `typescript` (`^5.7.0`): Static type checking (`tsc --noEmit` passes with 0 errors).

### Redundant / Suspicious Dependency Patterns
- **SDK Inconsistency**: While Anthropic uses the official `@anthropic-ai/sdk`, OpenAI and Ollama model adapters use raw `fetch()` calls.
- **Email Delivery Duplication**: `relay/adapters/EmailDeliveryAdapter.ts` uses raw `fetch()` to call SendGrid and Resend APIs, while `automations/channels/email-sendgrid.ts` uses nodemailer/mock abstractions.

---

## 16. Dead / Orphaned / Legacy Candidates

Using the required A–F classification taxonomy:

| ID | Class | Path | Description | Evidence | Recommended Action | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **D-01** | **A** | `components/home/SegmentRouter.tsx` | Tabbed audience navigation switcher | **0 imports across repository**. Leftover from Era 1. Staged for deletion. | Delete file. | HIGH |
| **D-02** | **A** | `lib/use-animated-number.ts` | Number ticker hook | **0 imports across repository**. Replaced by static stat rendering. Staged for deletion. | Delete file. | HIGH |
| **D-03** | **A** | `content/home.ts` (`segmentCards` array) | Audience cards with obsolete hash anchors (`/for#local-businesses`) | **0 imports outside dead SegmentRouter**. Active homepage uses `audienceProfiles`. | Remove array from `content/home.ts`. | HIGH |
| **D-04** | **A** | `lib/second-brain/auth/audit.ts` (`recordAgentAudit`) | Agent audit logging function | **0 callers across entire codebase**. Audit procedure exists in SQL but is never invoked. | Wire into internal API handlers or delete. | HIGH |
| **D-05** | **A** | `.env.example` (`NEXT_PUBLIC_CHECKLIST_PDF_URL`) | Config pointer to downloadable checklist PDF | Variable documented in `.env.example` but **file does not exist in `public/`**. | Remove env reference or provide PDF. | HIGH |
| **D-06** | **B** | `automations/runtime/scheduler.ts` | Long-lived daemon polling loop | Unused in Vercel serverless production. Superseded by `app/api/cron`. | Retain only for standalone worker environments. | HIGH |
| **D-07** | **B** | `automations/runtime/cli.ts` | CLI simulation runner | Referenced only in `package.json` demo script (`npm run automations:demo`). | Keep as developer tool or move to `scripts/`. | HIGH |
| **D-08** | **C** | `automations/clients/brightsmile-dental.ts` & `radiance-salon.ts` | Hardcoded demo client datasets | Referenced directly in `knownClients` and `demoClients`; run by production cron. | Migrate to database or decouple from cron. | HIGH |
| **D-09** | **D** | Second Brain Public Tables (`jobs_automation`, etc.) | Automation OS distributed scheduling schema | 10+ tables queried in `AutomationRepository.ts`, but **0 DDL migrations exist in repo**. | Provide migration DDL or document external DB. | HIGH |
| **D-10** | **E** | `automations/channels/sms-twilio.ts` vs `relay/` | Two parallel SMS delivery mechanisms | Subsystem 2 uses Twilio SDK; Subsystem 3 uses custom HMAC Android relay. | Clarify business boundary between systems. | MEDIUM |
| **D-11** | **F** | `app/contact.vcf/route.ts` | vCard endpoint | Linked only from `/social`; real-world QR usage unknown. | Retain; zero maintenance overhead. | LOW |

---

## 17. Duplicate / Competing Implementations

1. **Lead & Contact Capture Form Systems (3 Competing Implementations)**:
   - `components/forms/ContactForm.tsx`: Full contact form on `/contact`.
   - `components/forms/ChecklistForm.tsx`: Modal email capture form on `/checklist` and `ExitIntentModal`.
   - `components/checklist/InteractiveChecklist.tsx`: Contains an inline email submission form directly embedded inside the checklist.
   - *Observation*: All three forms duplicate Zod validation error handling and submit to the same endpoint (`/api/lead`).

2. **Dual SMS Messaging Stacks**:
   - `automations/channels/sms-twilio.ts`: Twilio-based outbound SMS dispatcher for client appointment reminders.
   - `relay/`: Custom HMAC-SHA256 stateless SMS relay designed to receive SMS forwarded from Android hardware devices in international offices.
   - *Observation*: Two completely independent SMS architectures that share zero types, configuration, or utilities.

3. **Dual Automation Engines**:
   - `automations/` (Recipe Engine): In-memory recipes evaluated on ticks, persisted to local `.automations/` JSON files.
   - `lib/second-brain/repositories/AutomationRepository.ts`: Database-backed distributed Automation OS with occurrence claims and execution leases on Neon PostgreSQL.
   - *Observation*: Two entirely disconnected automation scheduling systems living in the same project.

---

## 18. Incomplete / Experimental Features

1. **Missing Schema Migrations for Automation OS**:
   - `lib/second-brain/repositories/AutomationRepository.ts` and `ContextRepository.ts` issue queries against 15 tables in the `public` schema (`jobs_automation`, `schedules_automation`, `resource_context_index`, etc.).
   - Migrations `001` through `004` only create the `second_brain_security` schema.
   - There are **no DDL migration files** in the repository to create the public tables. Running this against a fresh database will crash immediately.

2. **File-Backed Persistence in Serverless Environment**:
   - The automations engine and operator dashboard rely on `.automations/**/*.json` for storing idempotency, drafts, conversation logs, and flow overrides.
   - On Vercel, serverless lambdas run in ephemeral read-only filesystems. State saved to `.automations/` is wiped on every lambda cold start.

3. **Hardcoded Demo Clients in Production Cron**:
   - `app/api/cron/route.ts` triggers `runTick()`, which iterates over `demoClients` (`radiance-salon` and `brightsmile-dental`).
   - The cron runs ticks for fake demo companies using in-memory appointments and mock reviews.

---

## 19. Overengineering / Unnecessary Abstraction Candidates

1. **7-Layer Communication Dispatcher in `automations/`**:
   - Trace: `runTick` → `runClient` → `planClient` → `buildPlan` → `dispatchPlan` → `dispatchAction` → `channel.send`
   - For an engine that currently only runs two demo clients with mock in-memory data, this 7-layer abstraction chain introduces high cognitive load without active multi-tenant production traffic.

2. **Enterprise Agent IAM for Internal Utility Scripts**:
   - The `second_brain_security` schema implements PL/pgSQL Security Definer procedures, credential hashing, rotation grace periods, and hierarchical scope trees for only 5 machine agents (`chatgpt`, `claude`, `muse`, `automation-os`, `skill-corner-internal`).
   - While architecturally impressive, it adds substantial database maintenance overhead compared to standard environment secret tokens.

---

## 20. Code Quality Hotspots

1. **`automations/runtime/run.ts`**:
   - Orchestrates multi-client execution plans, channel dispatching, quiet hours, and idempotency checks. Long functions with dense nested promises.

2. **`lib/second-brain/repositories/AutomationRepository.ts`**:
   - 280+ lines of raw SQL string concatenation. Contains `any` casts on database result sets.

3. **`components/home/RoiCalculator.tsx`**:
   - 240+ lines of complex interactive slider math, dual-segment branch logic (local vs practice), payback period projections, and animated values.

4. **`automations/inbound/llm-interpreter.ts`**:
   - Complex prompt construction with manual JSON escaping and schema verification.

---

## 21. Security Observations

1. **Hardened Inbound Twilio Webhook (Recently Patched)**:
   - `app/api/inbound/route.ts` verifies `x-twilio-signature`. In production (`NODE_ENV === "production"`), it fails closed with HTTP 500 if `TWILIO_AUTH_TOKEN` is missing, preventing unauthenticated webhook injection.

2. **Bounded Request Body Limits**:
   - Both `/api/lead` and `/api/inbound` employ `readBoundedBody()` with a strict 32KB payload limit, defending against body-overflow Denial of Service attacks.

3. **Constant-Time Cryptographic Verification**:
   - `relay/auth/safeEqualHex.ts` uses `crypto.timingSafeEqual` to compare HMAC digests, eliminating timing-attack side-channel vulnerabilities.

4. **Path Traversal Protection in Dashboard**:
   - `app/dashboard/auth-guard.ts` validates `clientId` format, rejecting any strings containing `/`, `\`, or `..`.

5. **Security Finding: Database Cluster Hostname in `.env.example`**:
   - Line 62 of `.env.example` contains the actual AWS Neon cluster hostname:
     `postgresql://skill_corner_runtime:password@ep-shiny-bar-b5dmxal3.c-7.us-east-2.aws.neon.tech/neondb`
   - While `:password` is a placeholder, exposing the exact cluster endpoint aids malicious reconnaissance.

---

## 22. Performance Observations

1. **High-Speed Static Delivery**:
   - 73 of 76 frontend routes are fully prerendered static HTML (`○` or `●`). All 84 build outputs compile in 245ms via Turbopack.

2. **Zero Client-Side JavaScript Overhead for Marketing**:
   - Marketing pages use standard Server Components. The only client components are interactive conversion elements (`Header`, `RoiCalculator`, modals, and forms).
   - Scoped `ClerkProvider` ensures zero Clerk JavaScript is loaded by public marketing visitors.

3. **Blocking Synchronous Filesystem I/O**:
   - `automations/core/idempotency.ts` and `overrides.ts` use `readFileSync` and `writeFileSync`, which block the single-threaded Node.js event loop during webhook and cron processing.

---

## 23. Build / Deployment Architecture

- **Bundler**: Next.js 16.3.0 with Turbopack (`next build`).
- **Target Platform**: Vercel Serverless & Edge.
- **Node.js Runtime**: Node.js v24.18.0 (pnpm v11.16.0 / npm v11.16.0).
- **Scheduled Tasks**: Configured via Vercel Cron pinging `GET /api/cron` every 5 minutes.
- **Database**: External serverless PostgreSQL on Neon (AWS `us-east-2`).

---

## 24. Architectural History / Migration Residue

The repository contains clear evidence of four distinct architectural eras:

1. **Era 1: Single-Page Segmented Marketing Site (Mid 2026)**:
   - Used `/for` and `/for#local-businesses` audience tabs.
   - *Residue*: `SegmentRouter.tsx` (staged for deletion) and `segmentCards` array in `content/home.ts`.

2. **Era 2: Autonomous Local Business Recipe Engine (Summer 2026)**:
   - Built the multi-channel communication engine in `automations/` for salon and dental demo clients with local JSON persistence.
   - *Residue*: Hardcoded demo clients running inside the production cron tick.

3. **Era 3: International Business Card & SMS Relay Expansion (Late Summer 2026)**:
   - Added `/social` NFC card landing page, `/contact.vcf`, and the stateless HMAC SMS relay in `relay/`.

4. **Era 4: Second Brain Machine IAM & Enterprise Automation OS (September 2026)**:
   - Added Neon PostgreSQL migrations, database-native agent authentication, OpenAPI introspection, and distributed job leasing under `lib/second-brain/`.

5. **Era 4.5: Controlled Route Isolation & Security Hardening (Current HEAD)**:
   - Isolated marketing routes into `app/(marketing)/` layout group to prevent layout leaks into `/dashboard`.
   - Hardened `/api/inbound` and `/api/lead` with bounded body limits and fail-closed checks.

---

## 25. Complexity Map

| Subsystem | Architectural Complexity | Operational Risk | Maintenance Burden | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Marketing Storefront** | **LOW** | **LOW** | **LOW** | Clean, fast, static, typed content files. |
| **Lead Ingestion (`/api/lead`)**| **LOW** | **LOW** | **LOW** | Lightweight, robust proxy to Zapier with honeypot. |
| **Stateless SMS Relay (`relay/`)**| **MEDIUM** | **LOW** | **LOW** | Thoroughly tested (100% pass), completely stateless. |
| **Operator Dashboard (`/dashboard`)**| **MEDIUM** | **HIGH** | **HIGH** | Clerk auth is sound, but local JSON state causes serverless failure. |
| **Automations Engine (`automations/`)**| **HIGH** | **HIGH** | **HIGH** | 7-layer abstraction chain; synchronous JSON file I/O; demo clients. |
| **Second Brain Agent IAM** | **HIGH** | **MEDIUM** | **MEDIUM** | Advanced PL/pgSQL security; requires managed PostgreSQL instance. |
| **Second Brain Automation OS** | **VERY HIGH** | **VERY HIGH** | **VERY HIGH** | 10+ public tables queried with **0 DDL migrations in repository**. |

---

## 26. Top 20 Complexity Contributors

Ranked by overall architectural impact:

1. **Missing DDL Migrations for Automation OS (`lib/second-brain/repositories/AutomationRepository.ts`)**: Queries 10+ unmigrated public tables.
2. **Synchronous File-Backed Storage in Serverless (`.automations/**/*.json`)**: Incompatible with Vercel lambdas; blocks event loop.
3. **Hardcoded Demo Clients in Production Cron (`app/api/cron/route.ts`)**: Cron tick executes dummy client data on every interval.
4. **Dual Disconnected Automation Engines (`automations/` vs `AutomationRepository.ts`)**: Two separate job runners in one repo.
5. **Dual Independent SMS Stacks (`automations/channels/sms-twilio.ts` vs `relay/`)**: Redundant SMS architectures.
6. **7-Layer Communication Dispatcher (`automations/runtime/run.ts`)**: Deep indirection for only 2 demo clients.
7. **Triplicate Lead Form Implementations (`ContactForm`, `ChecklistForm`, `InteractiveChecklist`)**: 3 copies of form validation logic.
8. **Heavy Enterprise Agent IAM for 5 Machine Identities (`db/migrations/001..004.sql`)**: High database complexity.
9. **In-Memory Replay Cache in Serverless Relay (`relay/auth/verifyRelayRequest.ts`)**: In-memory cache resets on cold starts.
10. **Unbounded Conversation History Files (`automations/inbound/conversation.ts`)**: JSON files grow infinitely.
11. **Client ID Route Guard Bypass Risk (`app/dashboard/auth-guard.ts`)**: Relies on application-level regex for path traversal safety.
12. **Raw SQL Query Strings in Repositories (`AutomationRepository.ts`)**: Lack of type-safe query builder or ORM.
13. **Anthropic Claude Dependency for Webhook Ingestion (`automations/inbound/llm-interpreter.ts`)**: Inbound replies depend on external LLM availability.
14. **Database Endpoint Disclosure (`.env.example`)**: Exposes live Neon cluster endpoint in example file.
15. **Unmigrated / Unused Audit Procedure (`lib/second-brain/auth/audit.ts`)**: Declared function has 0 callers in code.
16. **Orphaned Component Residue (`components/home/SegmentRouter.tsx`)**: Leftover from Era 1.
17. **Orphaned Segment Cards Array (`content/home.ts`)**: Leftover data structure.
18. **Missing Checklist PDF Asset (`.env.example`)**: References non-existent static download.
19. **Dual Analytics Systems (`app/layout.tsx`)**: Coexisting Plausible and Google Analytics configurations.
20. **Standalone Scheduler Daemon (`automations/runtime/scheduler.ts`)**: Long-running script that cannot execute on serverless host.

---

## 27. Potential Cleanup Candidates

### Very Likely Removable (Zero Risk)
- `components/home/SegmentRouter.tsx` (0 imports across repository; staged for deletion).
- `lib/use-animated-number.ts` (0 imports across repository; staged for deletion).
- `segmentCards` array in `content/home.ts` (0 imports outside dead `SegmentRouter`).
- `NEXT_PUBLIC_CHECKLIST_PDF_URL` reference in `.env.example` (points to non-existent file).

### Probably Removable (Low Risk, Pending Confirmation)
- `automations/runtime/scheduler.ts` (standalone daemon unused on serverless Vercel).
- `automations/channels/console.ts` (dev fallback unused in production).
- Triplicate inline form in `components/checklist/InteractiveChecklist.tsx` (consolidate into `ChecklistForm.tsx`).

### Requires Investigation (Strategic Decision Required)
- Dual SMS Systems: Reconcile Twilio outbound dispatcher with `relay/` stateless gateway.
- Dual Automation Engines: Choose between lightweight file/webhook engine and database-backed Automation OS.
- Missing Automation OS Migrations: Determine whether public schema migrations exist in an external repository or need to be authored.
- Demo Clients (`radiance-salon`, `brightsmile-dental`): Replace with real database entities or disable production cron tick until onboarded.

### Should Definitely Remain (Core Business Value)
- All marketing pages and content files (`app/(marketing)/*`, `content/*`).
- Lead capture API (`app/api/lead/route.ts`).
- Audit booking integration (`/book`, Cal.com embed).
- Stateless SMS Relay Subsystem (`relay/`, `app/api/v1/relay/route.ts`).
- Second Brain Agent IAM security schema (`db/migrations/001..004.sql`, `lib/second-brain/auth/*`).

---

## 28. Important Unknowns

The following operational characteristics cannot be determined solely via static code analysis:

1. **Production Neon Database Schema State**: Are the `public.jobs_automation` and `public.resource_context_index` tables already created and populated on the live Neon database?
2. **Real-World Lead Webhook Destination**: Is `LEAD_WEBHOOK_URL` active in production, and does the receiving Zapier scenario execute reliably?
3. **Live Hardware Forwarding Traffic**: Is an actual Android device actively POSTing to `POST /api/v1/relay` in production, and which delivery adapter is active?
4. **Twilio Production Phone Number**: Is a live Twilio webhook configured to ping `POST /api/inbound`?
5. **Clerk User Base**: How many human operators currently have authorized accounts in the Clerk dashboard?
6. **Vercel Cron Deployment Status**: Is `vercel.json` deployed and executing `GET /api/cron` on live servers?

---

## 29. Questions for the Owner

1. **Automation OS Schema**: Where is the canonical DDL definition for `public.jobs_automation` and `public.resource_context_index` maintained? Are these tables already created in Neon?
2. **Automations Engine Future**: Is the `automations/` engine intended to be rewritten to use PostgreSQL instead of `.automations/**/*.json`, or is it being superseded by the Second Brain Automation OS?
3. **Demo Clients in Production**: Should the production cron endpoint (`GET /api/cron`) continue running ticks for the two demo clients (`radiance-salon` and `brightsmile-dental`)?
4. **SMS Architecture Convergence**: What is the long-term relationship between Twilio SMS in `automations/` and the Android hardware SMS gateway in `relay/`?
5. **Checklist Lead Magnet Asset**: Does an actual PDF file exist for the Automation Opportunities Checklist, or should the lead magnet remain purely interactive on the web?
6. **Insight Commercial Storefront Integration**: The adjacent `insight` repository contains Stripe Checkout and customer onboarding. When will this be integrated into TheSkillCorner?
7. **Operator Dashboard Scope**: Are real clients expected to log into `/dashboard`, or will this strictly remain an internal agency tool?
8. **Relay Replay Cache**: Should the in-memory relay replay cache be migrated to Redis/Upstash for multi-instance serverless replay protection?
9. **Audit Logging Activation**: Should `record_agent_audit` be wired into every `/api/internal/v1/*` endpoint to fulfill the audit requirements in Migration 001?
10. **Ollama / OpenAI Fallbacks**: Are the local Ollama and OpenAI LLM adapters in `automations/inbound/models/` still needed, or is Anthropic Claude the permanent provider?
11. **Form Consolidation**: Can we consolidate the three separate lead form components into a single reusable form primitive?
12. **Analytics Preference**: Is Plausible or Google Analytics 4 the preferred long-term analytics provider?
13. **Database Credentials in Env Example**: Can we redact the Neon cluster hostname from `.env.example` to follow standard security hygiene?
14. **Dead Code Clearance**: Can we formally commit the staged deletions of `SegmentRouter.tsx` and `use-animated-number.ts`?
15. **Deployment Target**: Is Vercel the permanent hosting environment, or is there an intention to move backend workers to a dedicated VPS/container platform?

---

## 30. Architecture Reconstruction Summary

If a senior architect who has never seen Skill Corner asks what this repository is, here is the accurate mental model:

> **The Skill Corner is a dual-purpose Next.js 16 application housing a rock-solid, production-ready static marketing and lead-generation engine alongside three partially integrated backend subsystems from different stages of the company's evolution.**

### What Is Central & Healthy:
The core commercial engine is the marketing site (`app/(marketing)/`). It is extremely well built: 73 statically generated pages, zero database dependencies, typed TypeScript content files, high-speed Turbopack compilation, accessible WCAG-compliant design tokens, world-class SEO/GEO indexing (`llms.txt`, JSON-LD), and a clean, validated lead capture pipeline feeding Zapier. This subsystem can ship and scale immediately with zero architectural changes.

### What Is Peripheral & Experimental:
The `automations/` directory contains an ambitious multi-step communication engine and inbound SMS classifier. While the business logic and unit tests are rigorous (214 tests passing), the architecture relies on local `.automations/**/*.json` file storage and hardcoded demo client datasets. On serverless Vercel, this persistence model will fail.

### What Is Specialized & Production-Grade:
The `relay/` subsystem is an isolated, highly disciplined, stateless SMS gateway. It uses cryptographic HMAC-SHA256 signatures to ingest SMS messages from Android hardware in international offices and forward them to email or webhooks with zero data persistence.

### What Is Emerging & Fragmented:
The `lib/second-brain/` subsystem is an enterprise-grade database-native Agent IAM and Automation OS built on Neon PostgreSQL. It features PL/pgSQL security definer functions, token hashing, and dynamic OpenAPI introspection. However, the public database tables it depends on (`jobs_automation`, `resource_context_index`) have no migration scripts in this repository, creating a major schema gap.

**In summary**: Skill Corner does not suffer from code quality degradation (the code is well-written, strictly typed, and 100% tested); it suffers from **architectural multi-tenancy**—four separate architectures from four different product iterations cohabiting in a single Next.js project.
