# Service Application Migration Manifest

## Executive Summary
This document serves as the canonical audit trail and provenance manifest for the migration of the standalone service application (`/Users/tejindersingh/dev/AI/service/`) into **TheSkillCorner** (`/Users/tejindersingh/dev/projects/TheSkillCorner/`).

The standalone application has ceased to be treated as a separate product. Its valuable domain models, scoring engines, natural language search algorithms, canonical offerings, newsletters, and operator workflows have been integrated as a first-class **Catalog & Newsletter Bounded Context** within Skill Corner.

---

## Source & Target Canonical Coordinates

* **Source Repository (READ-ONLY)**: `/Users/tejindersingh/dev/AI/service/`
* **Target Repository (CANONICAL RUNTIME)**: `/Users/tejindersingh/dev/projects/TheSkillCorner/`

---

## Migration Classification Matrix

| Source Path | Classification | Target Path | Changes & Adaptations |
| :--- | :--- | :--- | :--- |
| `src/domain/services/service.types.ts` | **COPIED + ADAPTED** | `features/catalog/domain/types.ts` | Unified into canonical `Offering` discriminated union (`AutomationOffering`, `ServiceOffering`, `NewsletterOffering`, `ResourceOffering`, `ToolOffering`) while maintaining backward-compatible `CanonicalService` contracts. |
| `src/domain/services/service.taxonomy.ts` | **COPIED + ADAPTED** | `features/catalog/domain/taxonomy.ts` | Preserved complete taxonomy hierarchies (goals, problems, outcomes, use cases, audiences, industries, intent aliases). |
| `src/domain/services/service.scoring.ts` | **COPIED + ADAPTED** | `features/catalog/domain/scoring.ts` | Adapted imports to modular feature paths; added strict TypeScript typing for callback parameters; preserved multi-factor weighted scoring and structured reason code generation. |
| `src/domain/services/service.search.ts` | **COPIED + ADAPTED** | `features/catalog/domain/search.ts` | Preserved natural language query mapper (`parseNaturalLanguageQuery`) and multi-tier priority search ranker (`calculateSearchRank`). |
| `src/domain/services/service.recommendations.ts` | **COPIED + ADAPTED** | `features/catalog/domain/recommendations.ts` | Preserved human-readable recommendation copy formatting (`formatRecommendationReason`). |
| `src/domain/services/service.eligibility.ts` | **COPIED + ADAPTED** | `features/catalog/domain/eligibility.ts` | Preserved geographic scope, budget ceiling, and fixture isolation logic. |
| `src/domain/services/service.bundles.ts` | **COPIED + ADAPTED** | `features/catalog/domain/bundles.ts` | Preserved curated service bundles, plan linkage, and discount calculations. |
| `src/domain/services/service.plans.ts` | **COPIED + ADAPTED** | `features/catalog/domain/plans.ts` | Preserved service pricing plans and feature limits. |
| `src/domain/services/canonical.catalog.ts` | **COPIED + ADAPTED** | `features/catalog/data/source-services.ts` | Preserved 8 source production and beta services (`lead-finder`, `competitor-watch`, `opportunity-scout`, `tender-brief`, `ontario-opportunity-monitor`, `franchise-resale-radar`, `ai-workflow-audit`, `tech-founder-briefing`). |
| `src/domain/services/service.repository.ts` | **COPIED + ADAPTED** | `features/catalog/domain/repository.ts` | Preserved in-memory query and repository methods. |
| `src/domain/services/discovery.test.mjs` | **COPIED + ADAPTED** | `features/catalog/__tests__/catalog-integrity.test.ts` | Re-implemented into the target's Vitest runner with expanded tests for catalog integrity, unique slugs, adapter fidelity, and route resolution. |
| `src/components/discovery/*` | **ADAPTED** | `features/catalog/components/*` | Replaced legacy CSS classes with Skill Corner Tailwind v4 tokens (`navy`, `blue`, `blue-tint`, `rounded-xl`). Added `DiscoveryWizard.tsx`, `FilterBar.tsx`, `SearchBar.tsx`, `ZeroResultsState.tsx`. |
| `src/components/services/ServiceCard.tsx` | **ADAPTED** | `features/catalog/components/OfferingCard.tsx` | Redesigned using Skill Corner's design system: 2px `border-navy/10 hover:border-blue`, Poppins display headers, DM Sans body text, and Lucide line icons. |
| `src/app/discover/page.tsx` | **REWRITTEN** | `app/(marketing)/library/page.tsx` | Native Next.js 16 App Router marketing page with structured data JSON-LD, breadcrumbs, and progressive disclosure library client. |
| `src/app/newsletters/*` | **REWRITTEN** | `app/(marketing)/newsletters/*` & `[slug]` | Transformed into first-class public publication hub and issue reader. |
| `src/app/internal/*` | **REWRITTEN** | `app/dashboard/catalog/` & `app/dashboard/newsletters/` | Replaced standalone HTML/Basic auth views with Clerk-authenticated Dashboard management pages inside the operator portal. |
| `db/migrations/001_initial.sql` - `003_canonical_services...` | **ADAPTED** | `db/migrations/005_catalog_and_newsletters.sql` | Extracted into isolated `catalog.*` and `newsletters.*` Postgres DDL, strictly quarantined from `second_brain_security` and Automation OS tables. |
| `src/app/globals.css` | **DROPPED** | None | Old serif / cream stylesheet discarded; target `app/globals.css` and `DESIGN.md` govern all styling. |
| `src/app/layout.tsx` | **DROPPED** | None | Source application shell discarded; target `app/(marketing)/layout.tsx` and `app/dashboard/layout.tsx` govern presentation. |
| `src/lib/internal-auth/` | **DROPPED** | None | HTTP Basic Auth discarded; target Clerk authentication and server-side route guarding govern operator access. |
| `src/components/navigation/*` | **DROPPED** | None | Source header and footer discarded; target SiteHeader and SiteFooter govern global navigation. |
| Stripe Checkout & Customer Portal | **DEFERRED** | Staged in adapters | Direct Stripe Checkout execution deferred until production Stripe keys for Skill Corner are configured. Offerings expose standard lead/booking CTAs. |

---

## Domain Architecture: Canonical `Offering` Model

The canonical `Offering` model represents all products and capabilities in TheSkillCorner via a discriminated union:

```text
                                Offering (Discriminated Union)
                                              │
    ┌─────────────────┬───────────────────────┼───────────────────────┬────────────────┐
    ▼                 ▼                       ▼                       ▼                ▼
AutomationOffering  ServiceOffering    NewsletterOffering      ResourceOffering    ToolOffering
(18 Services)       (7 Digital +       (3 Canonical            (Checklist,         (ROI Calculator,
                    Research)           Publications)           SOP Templates)      VCF Card)
```

### Offering Registry Aggregation

The `features/catalog/data/registry.ts` engine coordinates:
1. `content/services.ts` (18 automation offerings) via `automation-services.adapter.ts`
2. `content/digital-services.ts` (7 digital service pillars) via `digital-services.adapter.ts`
3. `features/catalog/data/source-services.ts` (market intelligence & research) via `source-services.adapter.ts`
4. `features/newsletters/data/newsletters.ts` (publications) via `newsletter-offerings.adapter.ts`

---

## Preserved Public Route Inventory

Zero pre-existing public URLs were altered, renamed, or collapsed. All 18 automation services and 7 digital services remain directly accessible at their canonical SEO routes:
* `/what-we-automate/*` (18 URLs)
* `/digital-services/*` (7 URLs)
* `/industries/*` (24 URLs)
* `/book`, `/contact`, `/checklist`, `/social`, `/about`, `/results`

New Public Offerings:
* `/library` — Unified catalog discovery experience
* `/newsletters` — Curated publication hub
* `/newsletters/[slug]` — Issue reader & sample archive

New Operator Dashboard Surfaces:
* `/dashboard/catalog` — Operator catalog management and audit plane
* `/dashboard/newsletters` — Newsletter publication and subscriber operations
* `/dashboard/newsletters/[slug]` — AI issue compilation and approval control plane

New Public API Endpoint:
* `POST /api/newsletter/subscribe` — Zero-spam newsletter subscription handler
