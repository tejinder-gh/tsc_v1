/**
 * Canonical Commercial Offers for The Skill Corner
 *
 * Single Source of Truth for all sellable packages, operating systems,
 * intelligence briefings, and custom engineering tiers.
 *
 * Invariant: Changing an offer's canonical price here propagates to all
 * derived representations (bundles.ts, pricing.md, llms.txt, JSON-LD, and UI).
 */

import {
  CUSTOM_ENGINEERING_ENGAGEMENT_POLICY,
  SUBSCRIPTION_30_DAY_GUARANTEE,
} from "./refund-policy";
import type { CommercialOffer } from "./types";

export const CANONICAL_COMMERCIAL_OFFERS: readonly CommercialOffer[] = [
  // --------------------------------------------------------------------------
  // HEADLINE 01: Deal Hunter Pack
  // --------------------------------------------------------------------------
  {
    sku: "sku_deal_hunter_pack",
    slug: "deal-hunter",
    publicName: "Deal Hunter Pack",
    tagline:
      "Asset Arbitrage & Classifieds Scout: Local mispricing, liquidation, and equipment deals.",
    description:
      "Engineered for opportunistic buyers, asset flippers, and value operators. Scans classifieds, equipment auctions, and distress inventories to detect underpriced items before competitors notice.",
    category: "intelligence",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 14900,
      billingPeriod: "month",
      displayPrice: "CAD $149/month",
    },
    commitment: "Month-to-month, cancel anytime",
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: [
      "Asset Flippers",
      "Inventory Liquidators",
      "Equipment Operators",
      "Value Investors",
    ],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Daily Deal Brief & Real-Time Price Drop Alerts",
      cadence: "Daily at 07:00 AM + Instant Push Alerts",
      format: "Single Prioritized Morning Memo & Telegram/Email Dispatches",
      description:
        "One prioritized morning intelligence memo ranking top mispriced assets with calculated all-in purchase thresholds.",
      sampleSpecimenSnippet:
        "ASSET ALERT [14:22 PM] · 2023 Kubota SVL75-2 Skid Steer · Asking $42,500 (Market comp: $58,000) · 620 Hours · Immediate margin potential: +$11,200.",
    },
    workers: [
      {
        roleTitle: "Classifieds Scout",
        automationName: "Local Deal Radar",
        description:
          "Detects underpriced items on local marketplaces, verifies fair market value, and recommends negotiation ranges.",
        capabilities: [
          "Classified monitoring",
          "Underpriced anomaly detection",
          "Offer range recommendation",
          "Resale margin estimate",
        ],
      },
      {
        roleTitle: "Arbitrage Analyst",
        automationName: "Retail Deals & Flips",
        description:
          "Scans clearance, open-box, and small-lot liquidation inventories, cross-referencing sold eBay and Amazon comps.",
        capabilities: [
          "Clearance & open-box detection",
          "Sold comp verification",
          "Margin threshold gating",
        ],
      },
      {
        roleTitle: "Property & Asset Scout",
        automationName: "Vehicle & Property Scout",
        description:
          "Monitors commercial vehicles, machinery, and distress property listings, evaluating occupancy and ownership economics.",
        capabilities: [
          "Commercial vehicle registry tracking",
          "Distress property scanning",
          "Occupancy economic modeling",
        ],
      },
    ],
    serviceIds: ["local-deal-radar", "retail-deals-flips", "vehicle-property-scout"],
    bestPairedWith: {
      pairWith: "Capital Allocator",
      pairWithSlug: "capital-allocator",
      rationale:
        "Finding ten deals is not useful if the buyer cannot determine: Which one deserves my capital today?",
    },
    upsellPro: {
      name: "Deal Hunter Pro",
      priceDisplay: "CAD $249/mo",
      recurringAmountCents: 24900,
      summary:
        "Adds multi-asset portfolio prioritization, opportunity synthesis, and recurring subscription cost auditing.",
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 02: Business Buyer OS
  // --------------------------------------------------------------------------
  {
    sku: "sku_business_buyer_os",
    slug: "business-buyer-os",
    publicName: "Business Buyer OS",
    tagline:
      "The Personal Search Fund OS: Deal sourcing, normalized diligence, and negotiation leverage.",
    description:
      "Purpose-built for acquisition entrepreneurs, search funds, and independent sponsors. Surfaces off-market and listed businesses, analyzes franchise economics, cross-examines SDE multiples, and coordinates offer prep in one unified workspace.",
    category: "automation-system",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 24900,
      billingPeriod: "month",
      displayPrice: "CAD $249/month",
    },
    commitment: "Month-to-month, cancel anytime",
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: [
      "Acquisition Entrepreneurs",
      "Independent Sponsors",
      "Search Funds",
      "Family Offices",
    ],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Consolidated Daily Search Memo & Deal Scorecards",
      cadence: "Daily at 07:00 AM",
      format: "Single Unified Executive Memo & Telegram Real-time Pings",
      description:
        "Every morning, receive a synthesized memo ranking newly discovered business listings by normalized SDE multiple, owner-dependency risk, and verified add-back adjustments.",
      sampleSpecimenSnippet:
        "ACQUISITION MEMO [07:00 AM] · 3 Off-Market Targets Ingested · Target #1: HVAC Mechanical Services (GTA) · Asking $1.4M · Normalized SDE $480k (2.9x) · Low Owner Key-Person Risk.",
    },
    workers: [
      {
        roleTitle: "Acquisition Scout",
        automationName: "Business Acquisition Scout",
        description:
          "Monitors business sale listings across brokers, extracting asking price, revenue, SDE, EBITDA multiples, normalized earnings, and owner dependency.",
        capabilities: [
          "Listing ingestion across 8 brokers",
          "Multiple normalization",
          "Owner-operator risk scoring",
          "Direct seller tracking",
        ],
      },
      {
        roleTitle: "Franchise Analyst",
        automationName: "Franchise Intelligence",
        description:
          "Ingests Franchise Disclosure Documents (FDDs), Item 19 financial performance representations, royalty schedules, and resale availability.",
        capabilities: [
          "Item 19 financial benchmark parser",
          "Territory availability checking",
          "Royalty & ad-fund drag calculation",
        ],
      },
      {
        roleTitle: "Diligence Copilot",
        automationName: "Deal Execution Copilot",
        description:
          "Audits seller teasers and CIMs against bank lending benchmarks, highlights working capital requirements, and drafts customized LOI terms.",
        capabilities: [
          "CIM add-back cross-examination",
          "SBA/BDC loan debt-service coverage check",
          "Custom LOI term generator",
        ],
      },
      {
        roleTitle: "Capital Allocator",
        automationName: "Capital Allocation Agent",
        description:
          "Maintains unified return-on-equity models across current opportunities, flagging where additional debt or seller equity changes cash yield.",
        capabilities: [
          "Cash-on-cash yield scoring",
          "Downside debt stress-testing",
          "Cap table simulation",
        ],
      },
      {
        roleTitle: "Opportunity Synthesizer",
        automationName: "Executive Intelligence Radar",
        description:
          "Consolidates raw data from all upstream scouts into a single 3-minute executive brief delivered every morning before markets open.",
        capabilities: [
          "Single morning memo compilation",
          "Priority ranking by thesis fit",
          "Immediate alert triggers for <3x multiples",
        ],
      },
    ],
    serviceIds: [
      "business-acquisition-scout",
      "franchise-intelligence",
      "deal-execution-copilot",
      "capital-allocator",
      "opportunity-synthesis",
    ],
    bestPairedWith: {
      pairWith: "Deal Hunter Pack",
      pairWithSlug: "deal-hunter",
      rationale:
        "Broadens deal flow by cross-referencing asset liquidation auctions with enterprise acquisitions.",
    },
    upsellPro: {
      name: "Business Buyer Pro",
      priceDisplay: "CAD $399/mo",
      recurringAmountCents: 39900,
      summary:
        "Adds private outreach automation, direct off-market seller skip-tracing, and custom CIM financial model teardowns.",
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 03: E-Commerce Launch & Scale Pack
  // --------------------------------------------------------------------------
  {
    sku: "sku_ecommerce_launch",
    slug: "ecommerce-intelligence",
    publicName: "E-Commerce Launch Pack",
    tagline:
      "Product Sourcing & Margin Guard: Price tracking, supplier monitor, and inventory sync.",
    description:
      "A complete commercial intelligence stack for physical products: dropshipping product discovery, wholesale/OEM supplier verification, competitor pricing watches, and viral creative hook detection.",
    category: "intelligence",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 19900,
      billingPeriod: "month",
      displayPrice: "CAD $199/month",
    },
    commitment: "Month-to-month, cancel anytime",
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: [
      "E-commerce brand founders and Amazon FBA operators",
      "Wholesale distributors and importers",
      "Direct-to-consumer brand managers",
    ],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Daily Product Scout & Supplier Price Radar",
      cadence: "Daily 06:00 AM",
      format: "Unified Product Radar & CSV Supplier Sync",
      description:
        "A single morning intelligence report ranking high-margin product opportunities with verified supplier landed costs, competitor pricing moves, and validated creative ad hooks.",
    },
    workers: [
      {
        roleTitle: "Product Discovery Scout",
        automationName: "Dropshipping & Product Intelligence",
        description:
          "Monitors social virality signals, marketplace sales velocity, and ad library spend to detect emerging product demand before market saturation.",
        capabilities: [
          "TikTok and Meta ad library saturation tracking",
          "Amazon/Shopify BSR velocity calculation",
          "Trend breakout scoring",
        ],
      },
      {
        roleTitle: "Supplier & Factory Auditor",
        automationName: "Supplier & Trade Scout",
        description:
          "Cross-references products with verified Alibaba, 1688, and North American domestic manufacturers, extracting real MOQ and landed duty costs.",
        capabilities: [
          "Factory verification and trade history inspection",
          "True landed cost calculation",
          "Sample ordering and communication workflow",
        ],
      },
    ],
    serviceIds: [
      "dropshipping-product-intelligence",
      "supplier-trade-scout",
      "competitor-watch",
      "social-content-intelligence",
      "venture-experiments",
    ],
    bestPairedWith: {
      pairWith: "Founder Growth OS",
      pairWithSlug: "founder-growth-os",
      rationale:
        "Pair product discovery with outbound founder marketing to secure initial wholesale B2B distribution and creator affiliates simultaneously.",
    },
    upsellPro: {
      name: "E-Commerce Scale Pro",
      priceDisplay: "CAD $399/mo",
      recurringAmountCents: 39900,
      summary:
        "Adds automated inventory replenishment alerts, multi-warehouse sync, and international freight container tracker.",
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 04: Founder Growth OS
  // --------------------------------------------------------------------------
  {
    sku: "sku_founder_growth_os",
    slug: "founder-growth-os",
    publicName: "Founder Growth OS",
    tagline:
      "Autonomous B2B Pipeline: Lead intelligence, competitive pulse, and high-conversion outbound triggers.",
    description:
      "A complete B2B acquisition engine for agency and software founders. Detects high-intent buying signals, monitors key accounts, manages follow-ups, and prioritizes highest-leverage outreach.",
    category: "automation-system",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 29900,
      billingPeriod: "month",
      displayPrice: "CAD $299/month",
    },
    commitment: "Month-to-month, cancel anytime",
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["Founders", "Agency Owners", "Consultancies", "B2B Operators"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Weekly Lead Dossier & Outbound Trigger Feed",
      cadence: "Weekly Monday at 08:00 AM",
      format: "Curated Prospect Roster & Enriched CRM-Ready File",
      description:
        "A weekly batch of 25–50 verified prospects with verified pain points, current tech stack, and drafted conversation openers.",
    },
    workers: [
      {
        roleTitle: "Lead Intelligence Scout",
        automationName: "B2B Lead Finder",
        description:
          "Surfaces verified business prospects matching ideal customer criteria with verified contact endpoints.",
        capabilities: ["ICP matching", "Contact validation", "Technographic profiling"],
      },
      {
        roleTitle: "Market Watch Analyst",
        automationName: "Competitor Intelligence Pulse",
        description:
          "Monitors competitor pricing updates, product changes, executive hires, and public messaging.",
        capabilities: ["Pricing crawl", "Changelog detection", "Review sentiment monitoring"],
      },
    ],
    serviceIds: [
      "customer-acquisition-radar",
      "strategic-account-watch",
      "relationship-crm",
      "inbox-calendar-triage",
      "opportunity-synthesis",
    ],
    bestPairedWith: {
      pairWith: "Small Business COO",
      pairWithSlug: "small-business-coo",
      rationale:
        "Converts inbound pipeline directly into scheduled operational workflows and automated customer intake.",
    },
    upsellPro: {
      name: "Founder Scale Pro",
      priceDisplay: "CAD $499/mo",
      recurringAmountCents: 49900,
      summary:
        "Adds dedicated SDR sequence copy generation, intent data scraping, and CRM bi-directional sync.",
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 05: Competitive Intelligence Suite
  // --------------------------------------------------------------------------
  {
    sku: "sku_competitive_intelligence",
    slug: "competitive-intelligence",
    publicName: "Competitive Intelligence Suite",
    tagline:
      "Track competitor movements, pricing changes, and market shifts before they impact you.",
    description:
      "A radar system for market operators: monitors competitor websites, pricing pages, social accounts, hiring moves, and product changes with weekly executive summaries.",
    category: "intelligence",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 14900,
      billingPeriod: "month",
      displayPrice: "CAD $149/mo",
    },
    commitment: "Month-to-month, cancel anytime",
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["Market Operators", "Growth Leads", "Founders"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Weekly Competitor Pulse Memo",
      cadence: "Weekly Monday 07:00 AM",
      format: "Executive Summary & Diff Log",
      description:
        "Concise brief detailing exact pricing and offering movements across your designated peer set.",
    },
    workers: [
      {
        roleTitle: "Website & Pricing Sentinel",
        automationName: "Competitor Watch",
        description:
          "Scans designated competitor websites for copy changes, new feature releases, and pricing updates.",
        capabilities: [
          "DOM visual diffing",
          "Pricing table extraction",
          "Feature release detection",
        ],
      },
    ],
    serviceIds: [
      "competitor-watch",
      "strategic-account-watch",
      "reputation-watch",
      "opportunity-synthesis",
    ],
    bestPairedWith: {
      pairWith: "Founder Growth OS",
      pairWithSlug: "founder-growth-os",
      rationale: "Feed competitor shifts directly into outbound positioning.",
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 06: Creator Intelligence Pack
  // --------------------------------------------------------------------------
  {
    sku: "sku_creator_intelligence",
    slug: "creator-intelligence",
    publicName: "Creator Intelligence Pack",
    tagline:
      "Content intelligence, audience pulse, and monetization opportunity monitoring for creators.",
    description:
      "For independent creators and media operators: tracks audience engagement, monitors sponsorship opportunities, surfaces high-performing content angles, and coordinates newsletter research.",
    category: "intelligence",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 9900,
      billingPeriod: "month",
      displayPrice: "CAD $99/mo",
    },
    commitment: "Month-to-month, cancel anytime",
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["Creators", "Media Operators", "Newsletter Writers"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Weekly Creator Briefing",
      cadence: "Weekly Tuesday 08:00 AM",
      format: "Curated Angle Memo",
      description: "Top viral hooks, brand sponsorship leads, and emerging niche keywords.",
    },
    workers: [
      {
        roleTitle: "Trend Scout",
        automationName: "Social Content Intelligence",
        description: "Monitors platform trends and surfaces viral outlier formats.",
        capabilities: ["Outlier detection", "Hook transcription", "Audience sentiment scan"],
      },
    ],
    serviceIds: [
      "social-content-intelligence",
      "audience-engagement-radar",
      "creator-monetization-scout",
      "opportunity-synthesis",
    ],
    bestPairedWith: {
      pairWith: "Founder Growth OS",
      pairWithSlug: "founder-growth-os",
      rationale: "Leverage media attention directly into high-ticket enterprise client leads.",
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 07: Personal Executive OS
  // --------------------------------------------------------------------------
  {
    sku: "sku_personal_executive",
    slug: "personal-executive-os",
    publicName: "Personal Executive OS",
    tagline:
      "The AI Chief of Staff for high-output operators: calendar defense, inbox triage, and briefing synthesis.",
    description:
      "An executive operational layer that protects your time: daily morning briefings, intelligent inbox triage, calendar buffer defense, relationship reminder triggers, and weekly commitment tracking.",
    category: "automation-system",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 49900,
      billingPeriod: "month",
      displayPrice: "CAD $499/mo",
    },
    commitment: "Month-to-month, cancel anytime",
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["CEOs", "Managing Partners", "Fund Leads"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Executive Daily Morning Memo",
      cadence: "Daily 06:45 AM",
      format: "Prioritized Action Memo & Calendar Schedule",
      description: "Single 2-minute memo outlining only items requiring executive decisions today.",
    },
    workers: [
      {
        roleTitle: "Executive Chief of Staff",
        automationName: "Inbox & Calendar Triage",
        description:
          "Categorizes inbound communications, prioritizes urgent threads, and enforces schedule boundaries.",
        capabilities: [
          "Zero-inbox categorization",
          "Calendar conflict defense",
          "VIP escalation filter",
        ],
      },
    ],
    serviceIds: [
      "inbox-calendar-triage",
      "relationship-crm",
      "opportunity-synthesis",
      "strategic-account-watch",
      "reputation-watch",
    ],
    bestPairedWith: {
      pairWith: "Business Buyer OS",
      pairWithSlug: "business-buyer-os",
      rationale: "Defend executive time while evaluating acquisition opportunities simultaneously.",
    },
    upsellPro: {
      name: "Chief of Staff Suite",
      priceDisplay: "CAD $899/mo",
      recurringAmountCents: 89900,
      summary:
        "Adds multi-calendar coordination, board pack compilation, and personal financial digest.",
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 08: Small Business COO
  // --------------------------------------------------------------------------
  {
    sku: "sku_small_business_coo",
    slug: "small-business-coo",
    publicName: "Small Business COO",
    tagline:
      "Autonomous Operations: 24/7 client intake, calendar control, invoice chase, and task routing.",
    description:
      "The complete operating engine for professional offices, clinics, and service firms. Takes over telephone reception, appointment confirmations, paperwork collection, and invoice follow-ups.",
    category: "automation-system",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 49900,
      billingPeriod: "month",
      displayPrice: "CAD $499/month",
    },
    commitment: "Month-to-month, cancel anytime",
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: [
      "Medical & Dental Practices",
      "Law Firms",
      "Accounting Practices",
      "Contractors",
    ],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Daily Operational Summary & Live Exception Log",
      cadence: "Daily at 17:30 PM",
      format: "Operational Digest & Real-time SMS Escalations",
      description:
        "Every evening, receive a complete reconciliation of calls handled, appointments scheduled, and invoices resolved.",
    },
    workers: [
      {
        roleTitle: "Autonomous Receptionist",
        automationName: "24/7 AI Voice & Web Reception",
        description:
          "Answers phone calls on ring one, qualifies inquiries, schedules appointments, and handles common FAQs.",
        capabilities: [
          "First-ring call answering",
          "Appointment calendar hold",
          "Urgent caller escalation",
        ],
      },
    ],
    serviceIds: ["ai-receptionist", "booking-and-reminders", "intake-and-documents"],
    bestPairedWith: {
      pairWith: "Founder Growth OS",
      pairWithSlug: "founder-growth-os",
      rationale:
        "Fills the calendar with qualified new clients while the COO handles all downstream operational execution.",
    },
    upsellPro: {
      name: "Operations Director Pro",
      priceDisplay: "CAD $549/mo",
      recurringAmountCents: 54900,
      summary: "Adds automated staff shift coverage and multi-provider reconciliation.",
    },
  },

  // --------------------------------------------------------------------------
  // ADDITIONAL COMMERCIAL BUNDLES (derived into bundles.ts)
  // --------------------------------------------------------------------------
  {
    sku: "sku_reseller_os",
    slug: "reseller-os",
    publicName: "Reseller & Arbitrage OS",
    tagline: "End-to-end arbitrage pipeline from source scanning to cross-listing and pricing.",
    description:
      "Multi-marketplace arbitrage automation: scans local classifieds, checks comps, monitors clearance, and coordinates inventory.",
    category: "automation-system",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 29900,
      billingPeriod: "month",
      displayPrice: "CAD $299/mo",
    },
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["Professional Resellers", "Liquidators"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Daily Arbitrage Scorecard",
      cadence: "Daily 07:00 AM",
      format: "Arbitrage Feed",
      description: "Ranked list of flip opportunities with net margin calculations.",
    },
    workers: [],
    serviceIds: ["local-deal-radar", "retail-deals-flips", "vehicle-property-scout"],
  },
  {
    sku: "sku_revenue_os",
    slug: "revenue-os",
    publicName: "Revenue Engine OS",
    tagline: "Complete revenue operations: acquisition, conversion, retention, and re-engagement.",
    description: "Revenue operations automation for high-ticket service businesses.",
    category: "automation-system",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 49900,
      billingPeriod: "month",
      displayPrice: "CAD $499/mo",
    },
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["Agencies", "Professional Service Firms"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Weekly Revenue Dashboard",
      cadence: "Weekly Monday",
      format: "Executive Memo",
      description: "Full pipeline velocity report.",
    },
    workers: [],
    serviceIds: ["customer-acquisition-radar", "strategic-account-watch", "relationship-crm"],
  },
  {
    sku: "sku_developer_intelligence",
    slug: "developer-intelligence",
    publicName: "Developer Intelligence Pack",
    tagline: "Track technology shifts, open source opportunities, and API changes.",
    description: "Intelligence briefing for engineering leads and technical founders.",
    category: "intelligence",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 9900,
      billingPeriod: "month",
      displayPrice: "CAD $99/mo",
    },
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["Tech Leads", "Founders"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Weekly Tech Architecture Memo",
      cadence: "Weekly",
      format: "Memo",
      description: "API and OSS changes.",
    },
    workers: [],
    serviceIds: ["competitor-watch", "opportunity-synthesis"],
  },
  {
    sku: "sku_career_accelerator",
    slug: "career-accelerator",
    publicName: "Career Opportunity Monitor",
    tagline: "Executive role intelligence and confidential recruiter movements.",
    description: "Curated executive opportunity alerts and hiring signals.",
    category: "intelligence",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 9900,
      billingPeriod: "month",
      displayPrice: "CAD $99/mo",
    },
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["Executives", "Senior Operators"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Executive Opportunity Brief",
      cadence: "Weekly",
      format: "Confidential Memo",
      description: "Direct recruiter leads.",
    },
    workers: [],
    serviceIds: ["lead-finder", "opportunity-synthesis"],
  },
  {
    sku: "sku_business_launch_os",
    slug: "business-launch-os",
    publicName: "Business Launch OS",
    tagline: "Turn an idea into an operating business with automated market validation.",
    description: "Turnkey validation and launch operating system for new commercial ventures.",
    category: "automation-system",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 29900,
      billingPeriod: "month",
      displayPrice: "CAD $299/mo",
    },
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["First-time Founders", "Corporate Spinouts"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Launch Milestones Memo",
      cadence: "Weekly",
      format: "Execution Tracker",
      description: "Validation milestones.",
    },
    workers: [],
    serviceIds: ["venture-experiments", "lead-finder", "competitor-watch"],
  },
  {
    sku: "sku_local_business_intelligence",
    slug: "local-business-intelligence",
    publicName: "Local Business Intelligence",
    tagline: "Hyperlocal market intelligence for retail, restaurant, and clinic owners.",
    description: "Local competitor pricing, foot traffic signals, and neighborhood demand trends.",
    category: "intelligence",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 14900,
      billingPeriod: "month",
      displayPrice: "CAD $149/mo",
    },
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["Retailers", "Clinic Owners", "Restaurateurs"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Local Market Memo",
      cadence: "Weekly",
      format: "Neighborhood Pulse",
      description: "Competitor reviews and promotions.",
    },
    workers: [],
    serviceIds: ["local-deal-radar", "competitor-watch"],
  },
  {
    sku: "sku_franchise_buyer_os",
    slug: "franchise-buyer-os",
    publicName: "Franchise Buyer OS",
    tagline: "Item 19 financial breakdown, territory analysis, and royalty modeling.",
    description: "Specialized intelligence suite for prospective franchise operators.",
    category: "automation-system",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 29900,
      billingPeriod: "month",
      displayPrice: "CAD $299/mo",
    },
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["Franchisees", "Multi-unit Operators"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "FDD Financial Evaluation Memo",
      cadence: "Weekly",
      format: "Item 19 Model",
      description: "Unit economics teardown.",
    },
    workers: [],
    serviceIds: ["franchise-intelligence", "capital-allocator"],
  },
  {
    sku: "sku_ai_opportunity_pack",
    slug: "ai-opportunity-pack",
    publicName: "AI Opportunity Engine",
    tagline: "Curated AI commercial use cases, prompt blueprints, and implementation specs.",
    description: "Weekly intelligence digest of verified profitable AI deployments.",
    category: "intelligence",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 14900,
      billingPeriod: "month",
      displayPrice: "CAD $149/mo",
    },
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["Agency Leads", "Consultants"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "AI Deployment Dossier",
      cadence: "Weekly",
      format: "Technical Blueprint",
      description: "Architecture and prompts.",
    },
    workers: [],
    serviceIds: ["opportunity-synthesis", "competitor-watch"],
  },
  {
    sku: "sku_entrepreneur_os",
    slug: "entrepreneur-os",
    publicName: "Entrepreneur OS",
    tagline:
      "Full-lifecycle enterprise stack: deal discovery, venture ops, and portfolio management.",
    description:
      "All-in-one automation stack for multi-company entrepreneurs and portfolio builders.",
    category: "automation-system",
    tier: "business_os",
    tierLabel: "Business OS & Growth Stack",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 99900,
      billingPeriod: "month",
      displayPrice: "CAD $999/month",
    },
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["Portfolio Entrepreneurs", "Serial Founders"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Portfolio Executive Brief",
      cadence: "Daily 07:00 AM",
      format: "Consolidated Master Memo",
      description: "Cross-venture metrics and alerts.",
    },
    workers: [],
    serviceIds: [
      "business-acquisition-scout",
      "customer-acquisition-radar",
      "inbox-calendar-triage",
    ],
  },
  {
    sku: "sku_executive_os",
    slug: "executive-os",
    publicName: "Executive Operating System",
    tagline: "Autonomous enterprise executive layer: multi-company coordination and intelligence.",
    description: "Enterprise operating layer for multi-entity CEOs and holding company partners.",
    category: "automation-system",
    tier: "complete_stack",
    tierLabel: "Complete Automation Stack",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 149900,
      billingPeriod: "month",
      displayPrice: "CAD $1,499/month",
    },
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["Holding Company Partners", "Group CEOs"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Group Executive Brief",
      cadence: "Daily",
      format: "Holding Co Memo",
      description: "Multi-entity operational feed.",
    },
    workers: [],
    serviceIds: ["inbox-calendar-triage", "relationship-crm", "opportunity-synthesis"],
  },
  {
    sku: "sku_automation_office",
    slug: "automation-office",
    publicName: "Autonomous Office Suite",
    tagline: "Zero-touch back-office automation: voice, documents, scheduling, and billing.",
    description: "Replaces manual administrative tasks across professional clinics and offices.",
    category: "automation-system",
    tier: "complete_stack",
    tierLabel: "Complete Automation Stack",
    pricing: {
      currency: "CAD",
      recurringAmountCents: 199900,
      billingPeriod: "month",
      displayPrice: "CAD $1,999/mo",
    },
    refundPolicyId: SUBSCRIPTION_30_DAY_GUARANTEE.id,
    targetSegments: ["Multi-location Practices", "Regional Clinics"],
    availability: "public",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Autonomous Office Digest",
      cadence: "Daily 18:00",
      format: "Clinic Ledger Reconciliation",
      description: "Zero-missed-call confirmation.",
    },
    workers: [],
    serviceIds: ["ai-receptionist", "booking-and-reminders", "intake-and-documents"],
  },
  {
    sku: "sku_custom_managed",
    slug: "custom-managed",
    publicName: "Custom Managed Automation",
    tagline: "Dedicated engineering, custom integration, and continuous workflow tuning.",
    description: "Dedicated engineer-led deployment and monthly SLA maintenance.",
    category: "custom-engineering",
    tier: "custom",
    tierLabel: "Custom Engineering",
    pricing: {
      currency: "CAD",
      setupAmountCents: 250000,
      recurringAmountCents: 250000,
      billingPeriod: "month",
      displayPrice: "From CAD $2,500/mo",
    },
    refundPolicyId: CUSTOM_ENGINEERING_ENGAGEMENT_POLICY.id,
    targetSegments: ["Enterprises", "Custom Workflows"],
    availability: "custom",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Custom Engineering SOW",
      cadence: "Milestone-based",
      format: "Deployed Codebase",
      description: "Dedicated production infrastructure.",
    },
    workers: [],
    serviceIds: ["ai-agent-development", "website-development"],
  },

  // --------------------------------------------------------------------------
  // BESPOKE / CUSTOM ENGINEERING ENGAGEMENTS
  // --------------------------------------------------------------------------
  {
    sku: "sku_core_system_deployment",
    slug: "custom-automation-deployment",
    publicName: "Core System Deployment",
    tagline:
      "Turnkey Operational Automation: Scoped, integrated, and wired directly into your existing tools.",
    description:
      "Full turnkey operational deployment addressing a high-impact bottleneck (e.g. 24/7 AI Receptionist, multi-channel appointment recall, automated intake routing). Scoped after discovery call.",
    category: "custom-engineering",
    tier: "custom",
    tierLabel: "Custom Engineering Deployment",
    pricing: {
      currency: "CAD",
      setupAmountCents: 450000,
      recurringAmountCents: 75000,
      billingPeriod: "month",
      startingAt: true,
      displayPrice: "From $4,500 setup · $750/mo managed",
      setupDisplay: "From $4,500 setup",
    },
    commitment: "Fixed-scope milestone SOW, monthly managed support cancelable anytime",
    refundPolicyId: CUSTOM_ENGINEERING_ENGAGEMENT_POLICY.id,
    targetSegments: ["Growing Local Businesses", "Established Practices", "Multi-Location Clinics"],
    availability: "custom",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Production Turnkey System Architecture",
      cadence: "10–14 Business Days to Production",
      format: "Production Software, API Webhooks, and Operator Dashboard",
      description:
        "Complete deployed system integrated into your existing phone numbers, calendar, EMR/CRM, and accounting ledgers.",
    },
    workers: [],
    serviceIds: [
      "ai-receptionist",
      "booking-and-reminders",
      "intake-and-documents",
      "reviews-and-reputation",
    ],
  },
  {
    sku: "sku_bespoke_practice_infrastructure",
    slug: "bespoke-practice-infrastructure",
    publicName: "Bespoke Practice Infrastructure",
    tagline:
      "Enterprise Workflow Architecture: Multi-agent systems, sovereign RAG, and private integrations.",
    description:
      "Enterprise workflow architecture scoped after discovery audit. Continuous monitoring, model fine-tuning, and dedicated engineering support. Full PIPEDA/PHIPA compliance.",
    category: "custom-engineering",
    tier: "custom",
    tierLabel: "Bespoke Practice Infrastructure",
    pricing: {
      currency: "CAD",
      setupAmountCents: 1500000,
      recurringAmountCents: 250000,
      billingPeriod: "month",
      startingAt: true,
      displayPrice: "Typical builds $15,000–$75,000 · $2,500/mo managed",
      setupDisplay: "$15,000 to $75,000",
    },
    commitment: "Fixed milestone SOW with explicit phase sign-offs",
    refundPolicyId: CUSTOM_ENGINEERING_ENGAGEMENT_POLICY.id,
    targetSegments: ["Medical Groups", "Regional Law Practices", "Financial Advisory Firms"],
    availability: "custom",
    effectiveFrom: "2026-06-01",
    deliverable: {
      title: "Enterprise Multi-Agent Operational Layer",
      cadence: "4–8 Weeks to Production Deployment",
      format: "Sovereign Cloud Deployment & Dedicated Operator Portal",
      description:
        "Custom multi-agent workflows with zero customer PII persistence, dedicated model routing, and immutable audit logs.",
    },
    workers: [],
    serviceIds: ["ai-agent-development", "website-development", "application-development"],
  },
];

export function getCommercialOfferBySku(sku: string): CommercialOffer | undefined {
  return CANONICAL_COMMERCIAL_OFFERS.find((offer) => offer.sku === sku);
}

export function getCommercialOfferBySlug(slug: string): CommercialOffer | undefined {
  return CANONICAL_COMMERCIAL_OFFERS.find((offer) => offer.slug === slug);
}

export function getCommercialOffersByCategory(
  category: CommercialOffer["category"],
): CommercialOffer[] {
  return CANONICAL_COMMERCIAL_OFFERS.filter((offer) => offer.category === category);
}

export function getCommercialOffersByTier(tier: CommercialOffer["tier"]): CommercialOffer[] {
  return CANONICAL_COMMERCIAL_OFFERS.filter((offer) => offer.tier === tier);
}

/**
 * Returns canonical price parameters for any package slug.
 * Adapts between CommercialOffer model and legacy/derived representations.
 */
export function getCanonicalOfferPricing(slug: string):
  | {
      priceAmountCents: number;
      currency: string;
      displayPrice: string;
      cadMonthlyNumber: number;
      billingInterval: "month" | "year" | "one_time";
    }
  | undefined {
  const offer = getCommercialOfferBySlug(slug);
  if (!offer) return undefined;
  const priceAmountCents =
    offer.pricing.recurringAmountCents ?? offer.pricing.setupAmountCents ?? 0;
  return {
    priceAmountCents,
    currency: offer.pricing.currency,
    displayPrice: offer.pricing.displayPrice,
    cadMonthlyNumber: Math.round(priceAmountCents / 100),
    billingInterval: offer.pricing.billingPeriod === "one-time" ? "one_time" : "month",
  };
}
