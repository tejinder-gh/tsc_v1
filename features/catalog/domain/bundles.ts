/**
 * Canonical Commercial Bundles, Operating Systems & Packaging Architecture
 *
 * Implements the TheSkillCorner commercial hierarchy:
 * Single Automation ($29–149/mo) -> Purpose-Built Bundle ($99–299/mo) ->
 * Vertical OS ($299–749/mo) -> Business OS & Complete Stack ($749–2,999/mo) ->
 * Custom / Managed Infrastructure ($2,500–10,000+ setup + monthly).
 *
 * Every package explicitly declares:
 * 1. "Includes" with AI workers framed as human roles (Scout, Analyst, Diligence Agent, CRM, etc.)
 * 2. Unified customer deliverable (e.g. Daily Deal Brief, Owner Brief)
 * 3. "Best paired with" rationale to drive natural expansion revenue
 * 4. Optional Upsell Pro tier
 */

import type { CommerceStatus } from "./types";

export type CommercialTier =
  | "single"
  | "bundle"
  | "vertical_os"
  | "business_os"
  | "complete_stack"
  | "custom";

export interface BundleRoleItem {
  readonly roleTitle: string; // e.g. "Acquisition Scout", "Diligence Copilot", "Capital Controller"
  readonly automationName: string; // e.g. "Business Acquisition Scout"
  readonly description: string;
  readonly capabilities: readonly string[];
}

export interface BundlePairing {
  readonly pairWith: string; // Product / bundle name to pair with
  readonly pairWithSlug?: string;
  readonly rationale: string; // Explicit expansion thesis
  readonly expansionVector?: string; // e.g. "Discovery -> Diligence"
}

export interface BundleUpsellPro {
  readonly name: string; // e.g. "Deal Hunter Pro", "Business Buyer Pro"
  readonly priceCadMonthly: number;
  readonly priceCadDisplay: string;
  readonly summary: string;
  readonly addedModules: readonly string[];
}

export interface BundleDeliverable {
  readonly title: string; // e.g. "Daily Deal Brief", "Weekly Owner Brief"
  readonly cadence: string; // e.g. "Daily 07:00 AM", "Weekly Monday 09:00"
  readonly format: string; // e.g. "Unified Executive Memo & Real-Time Dispatches"
  readonly description: string;
}

export interface ServiceBundle {
  readonly id: string; // Stable bundle ID
  readonly slug: string; // URL slug
  readonly version: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly tier: CommercialTier;
  readonly tierLabel: string;
  readonly headlineLaunch: boolean; // Flag for the 8 launch packages
  readonly serviceIds: readonly string[];
  readonly planIds: readonly string[];
  readonly priceAmountCents: number; // CAD price in cents (monthly recurring or base)
  readonly originalPriceAmountCents: number; // Standalone cumulative value in cents
  readonly savingsPercentage: number;
  readonly currency: string;
  readonly billingInterval: "month" | "year" | "one_time";
  readonly priceDisplay: string; // Formatted price (e.g. "CAD $149/mo")
  readonly cadMonthlyNumber: number; // Integer for sorting / filtering
  readonly stripePriceEnvKey?: string;
  readonly commerceStatus: CommerceStatus;
  readonly isFixture: boolean;
  readonly outcomes: readonly string[];
  readonly targetAudience: readonly string[];
  readonly featured?: boolean;
  readonly roles: readonly BundleRoleItem[];
  readonly deliverable: BundleDeliverable;
  readonly bestPairedWith: BundlePairing;
  readonly upsellPro?: BundleUpsellPro;
  readonly pipeline?: string;
  readonly answeringQuestion?: string;
}

export interface PairingRule {
  readonly id: string;
  readonly ifBuying: string;
  readonly pairWith: string;
  readonly because: string;
  readonly strategicValue: string;
  readonly category: "deals" | "commerce" | "growth" | "operations" | "engineering" | "executive";
}

export interface CommercialTierSpec {
  readonly tier: CommercialTier;
  readonly name: string;
  readonly indicativeCadRange: string;
  readonly description: string;
  readonly scopeSummary: string;
}

export interface SingleBriefingItem {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly roleTitle: string;
  readonly priceCadMonthly: number;
  readonly priceDisplay: string;
  readonly cadence: string;
  readonly summary: string;
  readonly deliverable: string;
  readonly bestPairedWith: string;
  readonly targetAudience: string;
}

// ============================================================================
// 1. CORE PRICING ARCHITECTURE TIERS
// ============================================================================

export const COMMERCIAL_TIERS: readonly CommercialTierSpec[] = [
  {
    tier: "single",
    name: "Single Automation / Briefing",
    indicativeCadRange: "CAD $29–149/mo",
    description: "One autonomous worker or intelligence radar solving a single focused bottleneck.",
    scopeSummary: "Single data pipeline, automated ingestion, and daily/weekly dispatch.",
  },
  {
    tier: "bundle",
    name: "Purpose-Built Bundle",
    indicativeCadRange: "CAD $99–299/mo",
    description: "3–5 tightly related automations that feed into a single unified executive brief.",
    scopeSummary: "Unified workflow, collaborative agents, cross-source synthesis.",
  },
  {
    tier: "vertical_os",
    name: "Vertical Operating System",
    indicativeCadRange: "CAD $299–749/mo",
    description: "6–10 coordinated automations orchestrating a complete functional vertical.",
    scopeSummary: "End-to-end industry operating layer (Search Fund, Reseller, Small Business COO).",
  },
  {
    tier: "business_os",
    name: "Business OS & Growth Stack",
    indicativeCadRange: "CAD $749–1,499/mo",
    description: "Broader commercial stack spanning deal sourcing, validation, revenue generation, and triage.",
    scopeSummary: "Cross-department automation, CRM sync, continuous opportunity engine.",
  },
  {
    tier: "complete_stack",
    name: "Complete Automation Stack",
    indicativeCadRange: "CAD $1,499–2,999/mo",
    description: "Almost everything applicable across business operations, intelligence radars, and personal productivity.",
    scopeSummary: "All-in-one AI operating layer with unified executive briefs and custom alerts.",
  },
  {
    tier: "custom",
    name: "Custom / Managed Infrastructure",
    indicativeCadRange: "CAD $2,500–10,000+ setup + monthly",
    description: "Implementation, bespoke autonomous workflows, dedicated SLA monitoring, and private scrapers.",
    scopeSummary: "Full engineering audit, custom worker authoring, private hosting, and continuous tuning.",
  },
] as const;

// ============================================================================
// 2. THE CANONICAL COMMERCIAL PACKAGES (20 HEADLINE & SPECIALIZED STACKS)
// ============================================================================

export const BUNDLES: readonly ServiceBundle[] = [
  // --------------------------------------------------------------------------
  // HEADLINE 01: Deal Hunter Pack
  // --------------------------------------------------------------------------
  {
    id: "deal-hunter-pack",
    slug: "deal-hunter",
    version: "2.0.0",
    name: "Deal Hunter Pack",
    tagline: "Find mispriced physical assets, court auctions, and liquidation opportunities.",
    description:
      "A coordinated 4-agent radar scanning Ontario auctions, local marketplace listings, open-box retail lots, and commercial property notices. Compiles all-in acquisition costs and resale margins into one unified daily memo.",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    headlineLaunch: true,
    serviceIds: ["auction-deal-hunter", "marketplace-deal-hunter", "retail-deals-flips", "vehicle-property-scout"],
    planIds: ["plan_deal_hunter_monthly"],
    priceAmountCents: 14900,
    originalPriceAmountCents: 27600,
    savingsPercentage: 46,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $149/month",
    cadMonthlyNumber: 149,
    stripePriceEnvKey: "STRIPE_PRICE_DEAL_HUNTER",
    commerceStatus: "purchasable",
    isFixture: false,
    featured: true,
    outcomes: [
      "Daily unified Deal Brief replaces checking 12 auction and classified portals",
      "Calculates buyer premium, HST, and freight before submitting bids",
      "Estimates conservative resale margin based on verified historical comps",
    ],
    targetAudience: [
      "Asset flippers and arbitrageurs",
      "Equipment buyers and liquidation specialists",
      "Private collectors seeking mispriced opportunities",
    ],
    roles: [
      {
        roleTitle: "Auction Scout",
        automationName: "Auction Deal Hunter",
        description: "Scans public & court auction portals, calculates buyer premium, sales tax, shipping, and computes target and hard-maximum bids.",
        capabilities: ["Auction platform scraping", "All-in cost modeling", "Target bid calculation", "Hard-max guardrails"],
      },
      {
        roleTitle: "Marketplace Scout",
        automationName: "Marketplace Deal Hunter",
        description: "Detects underpriced items on local marketplaces, verifies fair market value, and recommends negotiation ranges.",
        capabilities: ["Classified monitoring", "Underpriced anomaly detection", "Offer range recommendation", "Resale margin estimate"],
      },
      {
        roleTitle: "Arbitrage Analyst",
        automationName: "Retail Deals & Flips",
        description: "Scans clearance, open-box, and small-lot liquidation inventories, cross-referencing sold eBay and Amazon comps.",
        capabilities: ["Clearance & open-box detection", "Sold comp verification", "Margin threshold gating"],
      },
      {
        roleTitle: "Property & Asset Scout",
        automationName: "Vehicle & Property Scout",
        description: "Monitors commercial vehicles, machinery, and distress property listings, evaluating occupancy and ownership economics.",
        capabilities: ["Commercial vehicle registry tracking", "Distress property scanning", "Occupancy economic modeling"],
      },
    ],
    deliverable: {
      title: "Daily Deal Brief",
      cadence: "Daily at 07:00 AM",
      format: "Single Unified Executive Memo",
      description: "One prioritized morning intelligence memo ranking top mispriced assets with calculated all-in purchase thresholds.",
    },
    bestPairedWith: {
      pairWith: "Capital Allocator",
      pairWithSlug: "capital-allocator",
      rationale: "Finding ten deals is not useful if the buyer cannot determine: Which one deserves my $20,000?",
      expansionVector: "Deal Sourcing -> Capital Allocation",
    },
    upsellPro: {
      name: "Deal Hunter Pro",
      priceCadMonthly: 249,
      priceCadDisplay: "CAD $249/mo",
      summary: "Adds multi-asset portfolio prioritization, opportunity synthesis, and recurring subscription cost auditing.",
      addedModules: ["Capital Allocator", "Opportunity Synthesis", "Asset Optimizer"],
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 02: Business Buyer OS (Flagship)
  // --------------------------------------------------------------------------
  {
    id: "business-buyer-os",
    slug: "business-buyer-os",
    version: "2.0.0",
    name: "Business Buyer OS",
    tagline: "The Personal Search Fund OS: Deal sourcing, normalized diligence, and negotiation leverage.",
    description:
      "Purpose-built for acquisition entrepreneurs and independent sponsors. Surfaces off-market and listed businesses, analyzes franchise economics, cross-examines SDE multiples, and coordinates offer prep in one unified workspace.",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    headlineLaunch: true,
    serviceIds: ["business-acquisition-scout", "franchise-intelligence", "deal-execution-copilot", "capital-allocator", "opportunity-synthesis"],
    planIds: ["plan_business_buyer_monthly"],
    priceAmountCents: 24900,
    originalPriceAmountCents: 45000,
    savingsPercentage: 45,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $249/month",
    cadMonthlyNumber: 249,
    stripePriceEnvKey: "STRIPE_PRICE_BUSINESS_BUYER_OS",
    commerceStatus: "purchasable",
    isFixture: false,
    featured: true,
    outcomes: [
      "Operate like a funded search fund without a $100k analyst team",
      "Instant SDE & EBITDA normalization with owner-dependency risk checks",
      "Defensible walk-away prices and negotiation terms generated in minutes",
    ],
    targetAudience: [
      "Self-funded searchers and acquisition entrepreneurs",
      "Corporate executives buying their first cash-flowing business",
      "Family offices acquiring Ontario and Canadian SMBs",
    ],
    roles: [
      {
        roleTitle: "Acquisition Scout",
        automationName: "Business Acquisition Scout",
        description: "Monitors business sale listings, extracting asking price, revenue, SDE, EBITDA multiples, normalized earnings, and owner dependency.",
        capabilities: ["Listing ingestion across 8 brokers", "Multiple normalization", "Owner-operator risk scoring", "Direct seller tracking"],
      },
      {
        roleTitle: "Franchise Analyst",
        automationName: "Franchise Intelligence",
        description: "Evaluates franchise disclosure documents (FDDs), royalties, marketing fund fees, remodel schedules, and transfer costs.",
        capabilities: ["FDD analysis", "Fee schedule breakdown", "Territory covenants", "Unit-level economics"],
      },
      {
        roleTitle: "Diligence Copilot",
        automationName: "Deal Execution Copilot",
        description: "Audits shortlisted targets: spots missing documents, diligence gaps, normalized owner benefit add-backs, and formulates walk-away prices.",
        capabilities: ["Red-flag detection", "Add-back verification", "Walk-away price setting", "LOI term sheet drafting"],
      },
      {
        roleTitle: "Capital Controller",
        automationName: "Capital Allocator",
        description: "Compares competing acquisition opportunities against your equity checks and debt underwriting criteria.",
        capabilities: ["Capital allocation ranking", "DSCR modeling", "Downside cushion testing"],
      },
      {
        roleTitle: "Strategic Synthesizer",
        automationName: "Opportunity Synthesis",
        description: "Renders clear Pursue, Investigate, Wait, or Reject classifications for every live deal in pipeline.",
        capabilities: ["Deterministic 4-state scoring", "Weekly priority briefing", "Portfolio pipeline review"],
      },
    ],
    deliverable: {
      title: "Search Fund Command Center & Weekly Deal Memo",
      cadence: "Real-Time Alerts + Friday 16:00 Dossier",
      format: "Unified Acquisition Pipeline Dashboard & Executive Memo",
      description: "Live pipeline ranking every active business for sale with diligence checklists and normalized valuation multiples.",
    },
    bestPairedWith: {
      pairWith: "Relationship CRM & Inbox Triage",
      pairWithSlug: "relationship-crm",
      rationale: "Tracks broker, seller, franchisor, lender, lawyer, and accountant follow-up dates while catching inbound documents automatically.",
      expansionVector: "Sourcing -> Deal CRM",
    },
    upsellPro: {
      name: "Business Buyer Pro",
      priceCadMonthly: 399,
      priceCadDisplay: "CAD $399/mo",
      summary: "Turns the package into a complete Search Fund OS: Adds Relationship CRM, Inbox/Calendar Triage, Compliance Watch, and Ontario Distress & Tax Sales.",
      addedModules: ["Relationship CRM", "Inbox & Calendar Triage", "Compliance Watch", "Ontario Distress & Tax Sales"],
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 03: E-Commerce Intelligence Pack
  // --------------------------------------------------------------------------
  {
    id: "ecommerce-intelligence-pack",
    slug: "ecommerce-intelligence",
    version: "2.0.0",
    name: "E-Commerce Launch Pack",
    tagline: "Find viable products, source direct from manufacturers, and track competitors.",
    description:
      "A complete commercial intelligence stack for physical products: dropshipping product discovery, wholesale/OEM supplier verification, competitor pricing watches, and viral creative hook detection.",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    headlineLaunch: true,
    serviceIds: ["dropshipping-product-intelligence", "supplier-trade-scout", "competitor-watch", "social-content-intelligence", "venture-experiments"],
    planIds: ["plan_ecommerce_pack_monthly"],
    priceAmountCents: 19900,
    originalPriceAmountCents: 38000,
    savingsPercentage: 48,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $199/month",
    cadMonthlyNumber: 199,
    stripePriceEnvKey: "STRIPE_PRICE_ECOMMERCE_PACK",
    commerceStatus: "purchasable",
    isFixture: false,
    featured: true,
    outcomes: [
      "Discover high-margin products before competitor saturation",
      "Calculate true landed cost including customs, shipping, and factory MOQ",
      "Validate product viability with structured budget/kill experiment protocols",
    ],
    targetAudience: [
      "E-commerce brand founders and Amazon FBA operators",
      "Shopify store builders looking for repeatable sourcing",
      "Direct-to-consumer product innovators",
    ],
    roles: [
      {
        roleTitle: "Product Scout",
        automationName: "Dropshipping Product Intelligence",
        description: "Monitors trending TikTok shop data, ad libraries, and supplier order velocity to identify breakout consumer demand.",
        capabilities: ["Order velocity tracking", "Margin estimate calculation", "Saturation index"],
      },
      {
        roleTitle: "Sourcing Agent",
        automationName: "Supplier & Trade Scout",
        description: "Identifies direct factories, evaluates MOQ, landed freight costs, and validates OEM private label requirements.",
        capabilities: ["Manufacturer verification", "Landed cost breakdown", "MOQ analysis", "OEM capability check"],
      },
      {
        roleTitle: "Market Watch",
        automationName: "Strategic Competitor Watch",
        description: "Tracks competitor catalogue updates, discounts, price changes, promotional bundles, and messaging angles.",
        capabilities: ["Competitor catalog monitoring", "Price elasticity tracking", "Discount event alerts"],
      },
      {
        roleTitle: "Creative Analyst",
        automationName: "Social Content Intelligence",
        description: "Surfaces top-performing ad hooks, viral customer UGC themes, and competitor creative angles across short-form video.",
        capabilities: ["Ad hook taxonomy", "UGC trend clustering", "Comment sentiment mining"],
      },
      {
        roleTitle: "Experiment Tracker",
        automationName: "Venture Experiments",
        description: "Enforces disciplined testing budgets: tracks spend, click-through thresholds, customer acquisition costs, and hard kill rules.",
        capabilities: ["Experiment ledger", "Spend cap enforcement", "Kill-criteria tracking"],
      },
    ],
    deliverable: {
      title: "Weekly Product & Sourcing Dossier",
      cadence: "Weekly Tuesday 08:00 AM",
      format: "Actionable Sourcing Spec & Trend Matrix",
      description: "A curated weekly catalogue of 5 validated products with factory contacts, landed margin models, and competitor ad hooks.",
    },
    bestPairedWith: {
      pairWith: "Community Opportunity Radar",
      pairWithSlug: "community-opportunity-radar",
      rationale: "Gives direct insight into what consumers are actively complaining about or requesting across Reddit and community forums.",
      expansionVector: "Product Sourcing -> Unmet Consumer Demand",
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 04: Founder Growth Pack
  // --------------------------------------------------------------------------
  {
    id: "founder-growth-pack",
    slug: "founder-growth-os",
    version: "2.0.0",
    name: "Founder Growth OS",
    tagline: "Turn market buying signals into qualified prospect conversations and booked pipeline.",
    description:
      "A complete B2B acquisition engine for agency and software founders. Detects high-intent buying signals, monitors key accounts, manages follow-ups, and prioritizes highest-leverage outreach.",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    headlineLaunch: true,
    serviceIds: ["customer-acquisition-radar", "strategic-account-watch", "relationship-crm", "inbox-calendar-triage", "opportunity-synthesis"],
    planIds: ["plan_founder_growth_monthly"],
    priceAmountCents: 29900,
    originalPriceAmountCents: 52000,
    savingsPercentage: 43,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $299/month",
    cadMonthlyNumber: 299,
    stripePriceEnvKey: "STRIPE_PRICE_FOUNDER_GROWTH",
    commerceStatus: "purchasable",
    isFixture: false,
    featured: true,
    pipeline: "SIGNAL → PROSPECT → CONVERSATION → FOLLOW-UP → OPPORTUNITY",
    outcomes: [
      "Never miss a warm prospect trigger or follow-up deadline",
      "Transform cold outreach into context-rich conversations",
      "Focus exclusively on high-conviction pipeline opportunities",
    ],
    targetAudience: [
      "B2B software founders and boutique agency owners",
      "Technical consultancies scaling client acquisition",
      "Professional service partners building recurring pipeline",
    ],
    roles: [
      {
        roleTitle: "Demand Scout",
        automationName: "Customer Acquisition Radar",
        description: "Scans corporate hiring notices, software migrations, and regulatory filings for urgent commercial buying triggers.",
        capabilities: ["Buying trigger extraction", "Decision-maker discovery", "Pain-point matching", "Value hypothesis drafting"],
      },
      {
        roleTitle: "Account Monitor",
        automationName: "Strategic Account Watch",
        description: "Tracks key prospects, existing high-value customers, and strategic partner movements in real time.",
        capabilities: ["Executive movements", "Press & funding announcements", "Product expansion alerts"],
      },
      {
        roleTitle: "Relationship Manager",
        automationName: "Relationship CRM",
        description: "Maintains full conversational context, tracks last touchpoints, and enforces strict follow-up cadences without data entry.",
        capabilities: ["Contact lifecycle tracking", "Follow-up schedule automation", "Contextual note generation"],
      },
      {
        roleTitle: "Executive Triage",
        automationName: "Inbox & Calendar Triage",
        description: "Surfaces high-urgency replies, document arrivals, and meeting prep notes while filtering out operational noise.",
        capabilities: ["Reply intent detection", "Commitment extraction", "Meeting brief generation"],
      },
      {
        roleTitle: "Strategic Synthesizer",
        automationName: "Opportunity Synthesis",
        description: "Synthesizes weekly pipeline into an unambiguous Action vs Drop list so the founder knows where to apply effort.",
        capabilities: ["Opportunity ranking", "Disqualification rules", "Next-step recommendations"],
      },
    ],
    deliverable: {
      title: "Founder Pipeline Brief & Morning Action Sheet",
      cadence: "Daily 08:30 AM + Weekly Monday Strategy Memo",
      format: "Morning Priority Card & CRM Activity Feed",
      description: "A distilled daily briefing with exactly who needs a reply, who just demonstrated buying intent, and today's top 3 follow-ups.",
    },
    bestPairedWith: {
      pairWith: "Build & Sell / Venture Experiments",
      pairWithSlug: "revenue-os",
      rationale: "Customer Acquisition finds the buyers; Build & Sell creates and tests the exact offers they are willing to purchase.",
      expansionVector: "Lead Generation -> Offer Architecture",
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 05: Competitive Intelligence Pack
  // --------------------------------------------------------------------------
  {
    id: "competitive-intelligence-pack",
    slug: "competitive-intelligence",
    version: "2.0.0",
    name: "Competitive Intelligence Pack",
    tagline: "Track competitor movements, pricing changes, and customer complaints without vanity noise.",
    description:
      "A radar tuned specifically to competitor pricing changes, product rollouts, customer friction in forums, and macro industry shifts. Delivers only the material delta.",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    headlineLaunch: true,
    serviceIds: ["strategic-account-watch", "competitor-monitor", "community-opportunity-radar", "social-content-intelligence", "data-ai-radar"],
    planIds: ["plan_comp_intel_monthly"],
    priceAmountCents: 14900,
    originalPriceAmountCents: 29000,
    savingsPercentage: 49,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $149/month",
    cadMonthlyNumber: 149,
    stripePriceEnvKey: "STRIPE_PRICE_COMP_INTEL",
    commerceStatus: "purchasable",
    isFixture: false,
    featured: true,
    outcomes: [
      "Eliminate weekly hours spent manually scouring competitor websites",
      "Immediate alert when a competitor changes pricing or drops a feature",
      "Turn competitor customer complaints into your product roadmap advantages",
    ],
    targetAudience: [
      "Product leaders and enterprise marketing heads",
      "Founders competing in crowded SaaS or agency markets",
      "Investors monitoring portfolio competitive landscapes",
    ],
    roles: [
      {
        roleTitle: "Account Monitor",
        automationName: "Strategic Account Watch",
        description: "Monitors named competitor websites, leadership changes, job postings, and quarterly strategic shifts.",
        capabilities: ["Website diff tracking", "Hiring priority detection", "Strategic announcement monitoring"],
      },
      {
        roleTitle: "Competitor Watch",
        automationName: "Competitor Monitor",
        description: "Detects pricing table adjustments, plan restructuring, feature deprecation, and promotional discount campaigns.",
        capabilities: ["Pricing matrix change detection", "Feature delta logging", "Discount campaign tracking"],
      },
      {
        roleTitle: "Community Radar",
        automationName: "Community Opportunity Radar",
        description: "Listens into community forums, Subreddits, and Discord groups to flag customer grievances with rival solutions.",
        capabilities: ["Sentiment drift tracking", "Unmet feature requests", "Dissatisfied user signal detection"],
      },
      {
        roleTitle: "Trend Synthesizer",
        automationName: "Social Content Intelligence",
        description: "Tracks competitor positioning narratives, paid ad volume, and content themes gaining market engagement.",
        capabilities: ["Narrative clustering", "Ad creative volume tracking", "Engagement velocity analysis"],
      },
      {
        roleTitle: "Macro Analyst",
        automationName: "Data / AI / Industry Radar",
        description: "Monitors relevant technical, infrastructural, and regulatory shifts impacting industry margins.",
        capabilities: ["Technology adoption shifts", "API updates", "Regulatory radar"],
      },
    ],
    deliverable: {
      title: "Daily Delta & Weekly Intelligence Brief",
      cadence: "Daily Instant Triggers + Thursday 15:00 Brief",
      format: "Material Change Alert + Strategic Implication Memo",
      description: "Delivers zero-fluff delta alerts when material competitor shifts occur, accompanied by a weekly strategic synthesis.",
    },
    bestPairedWith: {
      pairWith: "Customer Acquisition Radar",
      pairWithSlug: "customer-acquisition-radar",
      rationale: "Competitor intelligence tells you what is happening. Customer Acquisition tells you: Where can we make money from it?",
      expansionVector: "Market Monitoring -> Pipeline Capture",
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 06: Creator Intelligence Pack
  // --------------------------------------------------------------------------
  {
    id: "creator-intelligence-pack",
    slug: "creator-intelligence",
    version: "2.0.0",
    name: "Creator Intelligence Pack",
    tagline: "Turn audience questions and saved research into high-conviction content and revenue.",
    description:
      "A complete production loop for high-output creators: discovers viral themes, mines audience questions, converts bookmarked research into structured outlines, and monitors monetization paths.",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    headlineLaunch: true,
    serviceIds: ["social-content-intelligence", "community-opportunity-radar", "saved-content-action-engine", "creator-revenue-radar", "strategic-account-watch"],
    planIds: ["plan_creator_pack_monthly"],
    priceAmountCents: 9900,
    originalPriceAmountCents: 21000,
    savingsPercentage: 53,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $99/month",
    cadMonthlyNumber: 99,
    stripePriceEnvKey: "STRIPE_PRICE_CREATOR_INTEL",
    commerceStatus: "purchasable",
    isFixture: false,
    featured: true,
    pipeline: "DISCOVER → UNDERSTAND → CREATE → MONETIZE",
    outcomes: [
      "Never sit in front of a blank screen wondering what to write or record",
      "Transform saved browser bookmarks into actionable video and essay scripts",
      "Identify high-paying brand sponsorship and digital product opportunities",
    ],
    targetAudience: [
      "Independent creators, newsletter authors, and podcasters",
      "Technical founders building personal brands on LinkedIn and X",
      "Media operators and educational course creators",
    ],
    roles: [
      {
        roleTitle: "Trend Scout",
        automationName: "Social Content Intelligence",
        description: "Clusters high-performing content hooks, storytelling frameworks, and trending topics across your niche.",
        capabilities: ["Hook extraction", "Format performance benchmarking", "Viral angle discovery"],
      },
      {
        roleTitle: "Community Listener",
        automationName: "Community Opportunity Radar",
        description: "Monitors target audience forums to surface recurring frustrations, frequently asked questions, and terminology.",
        capabilities: ["Audience question harvesting", "Problem definition clustering", "Language mining"],
      },
      {
        roleTitle: "Production Engine",
        automationName: "Saved Content Action Engine",
        description: "Synthesizes saved articles, bookmarks, and papers into production-ready outlines with key citations and angles.",
        capabilities: ["Bookmark synthesis", "Citation cross-referencing", "Outline drafting"],
      },
      {
        roleTitle: "Monetization Scout",
        automationName: "Creator Revenue Radar",
        description: "Scans active brand campaigns, sponsorship budgets, digital product pricing, and creator monetization mechanics.",
        capabilities: ["Sponsor budget tracking", "Digital product comp analysis", "Affiliate opportunity scanning"],
      },
      {
        roleTitle: "Benchmark Tracker",
        automationName: "Strategic Account Watch",
        description: "Tracks top-tier benchmark creators in your niche to identify format innovations and cadence changes.",
        capabilities: ["Cadence analysis", "New channel expansion alerts", "Sponsorship disclosures"],
      },
    ],
    deliverable: {
      title: "Weekly Creator Strategy Brief",
      cadence: "Weekly Sunday 18:00",
      format: "Production Plan & Monetization Playbook",
      description: "A weekly production roadmap with 5 verified topic concepts, source citations, audience hooks, and active sponsor leads.",
    },
    bestPairedWith: {
      pairWith: "Community Opportunity Radar & Saved Content Engine",
      pairWithSlug: "community-opportunity-radar",
      rationale: "Connects content discovery directly with audience demand, closing the gap between research and finished creative output.",
      expansionVector: "Research -> Production",
    },
    upsellPro: {
      name: "Creator Pro",
      priceCadMonthly: 199,
      priceCadDisplay: "CAD $199/mo",
      summary: "Adds AI Tool Radar, GitHub Scout for technical builders, Opportunity Synthesis, and a weekly creator strategy brief.",
      addedModules: ["AI Tool Radar", "GitHub Scout", "Opportunity Synthesis", "Creator Strategy Brief"],
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 07: Personal Executive Pack
  // --------------------------------------------------------------------------
  {
    id: "personal-executive-pack",
    slug: "personal-executive-os",
    version: "2.0.0",
    name: "Personal Executive Pack",
    tagline: "An AI Chief of Staff handling operational noise, communications, and daily priorities.",
    description:
      "A personal operating system for high-output leaders. Orchestrates daily commitments, reviews inbox and calendar obligations, safeguards compliance deadlines, and eliminates recurring subscription waste.",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    headlineLaunch: true,
    serviceIds: ["personal-ai-coo", "inbox-calendar-triage", "relationship-crm", "compliance-watch", "asset-optimizer"],
    planIds: ["plan_personal_exec_monthly"],
    priceAmountCents: 14900,
    originalPriceAmountCents: 31000,
    savingsPercentage: 52,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $149/month",
    cadMonthlyNumber: 149,
    stripePriceEnvKey: "STRIPE_PRICE_PERSONAL_EXEC",
    commerceStatus: "purchasable",
    isFixture: false,
    featured: true,
    outcomes: [
      "End every day with zero lingering commitments or forgotten promises",
      "Immediate clarity on tomorrow's 3 non-negotiable priorities",
      "Save thousands in forgotten SaaS subscriptions and missed compliance filings",
    ],
    targetAudience: [
      "CEOs, solo operators, and senior executives",
      "Multi-venture founders managing split cognitive load",
      "High-performing knowledge workers and consultants",
    ],
    roles: [
      {
        roleTitle: "Chief Operating Officer",
        automationName: "Personal AI COO",
        description: "Acts as your daily operating system: synthesizes open loops, coordinates daily agendas, and enforces evening debriefs.",
        capabilities: ["Daily operating system orchestration", "Open loop synthesis", "Nightly review protocol"],
      },
      {
        roleTitle: "Triage Officer",
        automationName: "Inbox & Calendar Triage",
        description: "Scans emails, calendar invites, and threads to surface unreplied high-priority contacts and upcoming prep requirements.",
        capabilities: ["Urgent commitment extraction", "Meeting prep dossier", "Unanswered communication tracking"],
      },
      {
        roleTitle: "Relationship Lead",
        automationName: "Relationship CRM",
        description: "Maintains records of key professional contacts, logging context, last discussion topics, and automated touchpoint alerts.",
        capabilities: ["Key contact health tracking", "Contextual note retrieval", "Cadence alerts"],
      },
      {
        roleTitle: "Compliance Sentinel",
        automationName: "Compliance Watch",
        description: "Tracks corporate tax filings, license renewals, insurance policy dates, and statutory requirements.",
        capabilities: ["Filing deadline countdown", "License renewal tracking", "Statutory notice alerting"],
      },
      {
        roleTitle: "Asset Optimizer",
        automationName: "Asset Optimizer",
        description: "Monitors personal and business software subscriptions, flags recurring cost creep, and highlights underutilized services.",
        capabilities: ["Subscription creep audit", "Cost-to-value scoring", "Cancellation recommendation"],
      },
    ],
    deliverable: {
      title: "Evening Executive Debrief",
      cadence: "Nightly at 21:00",
      format: "Unified Evening Standup Memo",
      description: "Answers 7 essential operational questions every night: What happened? What remains open? What matters tomorrow? Who needs a response? What deadline is approaching? What should be scheduled? What should be dropped?",
    },
    bestPairedWith: {
      pairWith: "Decision Review",
      pairWithSlug: "decision-review",
      rationale: "Pairs daily operational execution with structured decision retrospective to create: execution + continuous learning.",
      expansionVector: "Execution -> Learning",
    },
    upsellPro: {
      name: "Personal COO Pro",
      priceCadMonthly: 299,
      priceCadDisplay: "CAD $299/mo",
      summary: "Full AI Chief of Staff: Adds Opportunity Synthesis, Capital Allocator, Decision Review, Learning ROI, and Life Ops Watch.",
      addedModules: ["Opportunity Synthesis", "Capital Allocator", "Decision Review", "Learning ROI", "Life Ops Watch"],
    },
  },

  // --------------------------------------------------------------------------
  // HEADLINE 08: Small Business COO Pack
  // --------------------------------------------------------------------------
  {
    id: "small-business-coo-pack",
    slug: "small-business-coo",
    version: "2.0.0",
    name: "Small Business COO Pack",
    tagline: "The complete operational command center for owners of local and trade businesses.",
    description:
      "Engineered specifically for business owners who spend too much time firefighting administrative chaos. Coordinates customer relationships, compliance dates, public procurement RFPs, local market changes, and daily priorities.",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    headlineLaunch: true,
    serviceIds: ["inbox-calendar-triage", "relationship-crm", "compliance-watch", "customer-acquisition-radar", "strategic-account-watch", "public-rfp-radar", "local-intelligence", "business-coo"],
    planIds: ["plan_smb_coo_monthly"],
    priceAmountCents: 49900,
    originalPriceAmountCents: 85000,
    savingsPercentage: 41,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $499/month",
    cadMonthlyNumber: 499,
    stripePriceEnvKey: "STRIPE_PRICE_SMB_COO",
    commerceStatus: "purchasable",
    isFixture: false,
    featured: true,
    outcomes: [
      "Free the owner from 15+ hours of weekly administrative and inbox grind",
      "Win municipal and institutional contracts through automated sub-$100k RFP alerts",
      "Prevent catastrophic regulatory fines, missed permit dates, and lost customer relationships",
    ],
    targetAudience: [
      "Trade contractors, renovation firms, and commercial maintenance companies",
      "Multi-chair clinics, medical practices, and professional service owners",
      "Local hospitality, manufacturing, and logistics operators",
    ],
    roles: [
      {
        roleTitle: "Operations Triage",
        automationName: "Inbox & Calendar Triage",
        description: "Separates real customer requests and job emergencies from vendor spam and operational noise.",
        capabilities: ["Inquiry categorization", "Emergency dispatch", "Calendar conflict prevention"],
      },
      {
        roleTitle: "Customer Hub",
        automationName: "Relationship CRM",
        description: "Tracks active customer projects, vendor pricing arrangements, sub-trade reliability, and follow-ups.",
        capabilities: ["Client and vendor records", "Subcontractor tracking", "Automated review requests"],
      },
      {
        roleTitle: "Compliance Sentinel",
        automationName: "Compliance Watch",
        description: "Guards WSIB, municipal permits, safety certifications, and insurance policy expiration dates.",
        capabilities: ["WSIB/safety tracking", "Permit deadline monitoring", "Corporate return alerts"],
      },
      {
        roleTitle: "Revenue Scout",
        automationName: "Customer Acquisition Radar",
        description: "Finds commercial properties and local businesses with urgent operational repair or expansion needs.",
        capabilities: ["Commercial permit mining", "Property owner identification", "Local trigger tracking"],
      },
      {
        roleTitle: "Account Watch",
        automationName: "Strategic Account Watch",
        description: "Keeps tabs on key local accounts, prime general contractors, and nearby competitor pricing changes.",
        capabilities: ["GC project announcements", "Competitor hiring watch", "Key account tracking"],
      },
      {
        roleTitle: "Procurement Scout",
        automationName: "Public RFP Radar",
        description: "Scans municipal, school board, and hospital procurement portals for sub-$100k opportunities matching trade capabilities.",
        capabilities: ["Municipal tender scraping", "Sub-$100k filtering", "Requirement compliance pre-check"],
      },
      {
        roleTitle: "Territory Analyst",
        automationName: "Local Intelligence",
        description: "Monitors local zoning adjustments, commercial building sales, developments, and competitor closures.",
        capabilities: ["Committee of Adjustment filings", "Commercial vacancy tracking", "New development notices"],
      },
      {
        roleTitle: "Business COO",
        automationName: "Personal/Business COO",
        description: "Aggregates inputs across the 7 specialists to synthesize the weekly top 3 business actions.",
        capabilities: ["Weekly owner priorities", "Bottleneck diagnosis", "Cross-department briefing"],
      },
    ],
    deliverable: {
      title: "Weekly Owner Brief",
      cadence: "Weekly Monday 06:30 AM",
      format: "6-Pillar Operational Intelligence Dashboard",
      description: "Answers 6 critical questions every week: Revenue (where to make money), Customers (who needs action), Operations (what is blocked), Compliance (what deadlines loom), Competition (what changed), and Priorities (top 3 actions).",
    },
    bestPairedWith: {
      pairWith: "Business Launch OS",
      pairWithSlug: "business-launch-os",
      rationale: "Provides the complete operating system after entity launch to scale operations without expanding administrative headcount.",
      expansionVector: "Formation -> Operational Scale",
    },
  },

  // --------------------------------------------------------------------------
  // BUNDLE 09: Reseller OS
  // --------------------------------------------------------------------------
  {
    id: "reseller-os",
    slug: "reseller-os",
    version: "2.0.0",
    name: "Reseller OS",
    tagline: "The complete pipeline for professional flippers and arbitrageurs.",
    description:
      "Coordinates wholesale acquisition, local arbitrage, clearance inventory, and supplier supply. Calculates buy ranges, resale margins, and optimal inventory capital allocation.",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    headlineLaunch: false,
    serviceIds: ["auction-deal-hunter", "marketplace-deal-hunter", "retail-deals-flips", "supplier-trade-scout", "asset-inventory-intelligence", "capital-allocator"],
    planIds: ["plan_reseller_os_monthly"],
    priceAmountCents: 29900,
    originalPriceAmountCents: 48000,
    savingsPercentage: 38,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $299/month",
    cadMonthlyNumber: 299,
    stripePriceEnvKey: "STRIPE_PRICE_RESELLER_OS",
    commerceStatus: "purchasable",
    isFixture: false,
    pipeline: "FIND → VALUE → BUY RANGE → SOURCE → RESALE → REPEAT",
    outcomes: [
      "Operate a full multi-channel resale business with algorithmic discipline",
      "Avoid tying up cash in slow-moving inventory with strict capital gating",
      "Scale from opportunistic flips to predictable wholesale distribution",
    ],
    targetAudience: [
      "Full-time resale and arbitrage operators",
      "Liquidation specialists and inventory liquidators",
      "Refurbished electronics and machinery dealers",
    ],
    roles: [
      {
        roleTitle: "Wholesale Scout",
        automationName: "Auction Deal Hunter",
        description: "Identifies bulk lots and surplus machinery across government and private liquidation auctions.",
        capabilities: ["Pallet & lot evaluation", "Auction fee calculation", "Max-bid limits"],
      },
      {
        roleTitle: "Arbitrage Scout",
        automationName: "Marketplace Deal Hunter",
        description: "Scans classifieds and peer-to-peer marketplaces for local mispriced inventory ready for immediate flip.",
        capabilities: ["Local radius search", "Immediate resale margin", "Offer formulation"],
      },
      {
        roleTitle: "Retail Hunter",
        automationName: "Retail Deals & Flips",
        description: "Monitors big-box clearance, salvage, and customer return inventory feeds.",
        capabilities: ["Barcode lookup", "Sold comp historical analysis", "BSR rating check"],
      },
      {
        roleTitle: "Supply Scout",
        automationName: "Supplier & Trade Scout",
        description: "Identifies repeatable manufacturer supply channels for high-margin repeat SKUs.",
        capabilities: ["Direct factory sourcing", "Terms negotiation guidance", "Volume tier checks"],
      },
      {
        roleTitle: "Inventory Analyst",
        automationName: "Asset / Inventory Intelligence",
        description: "Analyzes velocity, turn rates, carrying costs, and depreciation risk for all catalog items.",
        capabilities: ["Inventory velocity scoring", "Days-in-inventory tracking", "Markdown recommendations"],
      },
      {
        roleTitle: "Capital Controller",
        automationName: "Capital Allocator",
        description: "Determines exactly how much inventory capital should go into quick turns versus high-margin long holds.",
        capabilities: ["Portfolio capital limits", "Cash flow rotation planning", "Risk cap management"],
      },
    ],
    deliverable: {
      title: "Reseller Arbitrage Radar & Capital Allocation Memo",
      cadence: "Daily 07:30 AM",
      format: "Inventory Acquisition Sheet & Capital Allocation Matrix",
      description: "Daily ranking of verified acquisition opportunities with clear buy ranges and estimated resale proceeds.",
    },
    bestPairedWith: {
      pairWith: "Dropshipping Product Intelligence",
      pairWithSlug: "ecommerce-intelligence",
      rationale: "If an item repeatedly demonstrates high demand, the reseller can graduate: opportunistic flipping -> repeat sourcing -> dropshipping -> wholesale -> private label.",
      expansionVector: "Opportunistic Arbitrage -> Branded Supply",
    },
  },

  // --------------------------------------------------------------------------
  // BUNDLE 10: Revenue OS
  // --------------------------------------------------------------------------
  {
    id: "revenue-os",
    slug: "revenue-os",
    version: "2.0.0",
    name: "Revenue OS",
    tagline: "Where can this business realistically generate additional revenue this week?",
    description:
      "Expands the Founder Growth Pack into an expansive revenue generation machine: validates new product ideas, tests venture hypotheses, captures government RFP opportunities, and discovers local market expansions.",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    headlineLaunch: false,
    serviceIds: ["founder-growth-pack", "build-and-sell", "venture-experiments", "creator-knowledge-revenue", "public-rfp-radar", "local-intelligence", "local-ventures"],
    planIds: ["plan_revenue_os_monthly"],
    priceAmountCents: 49900,
    originalPriceAmountCents: 89000,
    savingsPercentage: 44,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $499/month",
    cadMonthlyNumber: 499,
    stripePriceEnvKey: "STRIPE_PRICE_REVENUE_OS",
    commerceStatus: "purchasable",
    isFixture: false,
    answeringQuestion: "Where can this business realistically generate additional revenue?",
    outcomes: [
      "Diversify beyond a single volatile client or service offering",
      "Systematically test and validate new cash-flow products with zero wasted engineering",
      "Capture municipal grant and procurement revenue that competitors ignore",
    ],
    targetAudience: [
      "Established service businesses wanting productized recurring revenue",
      "Growth-stage companies seeking adjacent revenue streams",
      "Holding company operators and serial builders",
    ],
    roles: [
      {
        roleTitle: "Product Architect",
        automationName: "Build & Sell",
        description: "Identifies digital and productized service opportunities based on demonstrated enterprise demand.",
        capabilities: ["Productization roadmaps", "Pricing architecture", "Go-to-market packages"],
      },
      {
        roleTitle: "Validation Scientist",
        automationName: "Venture Experiments",
        description: "Creates lean validation tests to prove willingness to pay before writing production code.",
        capabilities: ["Smoke test protocols", "CAC-to-LTV testing", "Kill rule enforcement"],
      },
      {
        roleTitle: "Knowledge Monetizer",
        automationName: "Creator & Knowledge Revenue",
        description: "Finds monetizable expertise, proprietary data products, and technical workshop opportunities.",
        capabilities: ["Knowledge audit", "Course & advisory pricing", "High-ticket packaging"],
      },
      {
        roleTitle: "Procurement Officer",
        automationName: "Public RFP & Government Support",
        description: "Surfaces non-dilutive government grants, procurement tenders, and innovation subsidies.",
        capabilities: ["Grant eligibility checks", "RFP matching", "Proposal framework generation"],
      },
      {
        roleTitle: "Territory Scout",
        automationName: "Local Intelligence & Local Ventures",
        description: "Detects regional market gaps, competitor vacancies, and offline venture opportunities.",
        capabilities: ["Zoning filings", "Commercial vacancies", "Local venture ranking"],
      },
    ],
    deliverable: {
      title: "Weekly Corporate Revenue Expansion Dossier",
      cadence: "Weekly Wednesday 09:00 AM",
      format: "Revenue Expansion Pipeline & Experiment Scorecard",
      description: "A comprehensive weekly briefing identifying 3 actionable revenue opportunities with proof of market demand and unit economics.",
    },
    bestPairedWith: {
      pairWith: "Capital Allocator",
      pairWithSlug: "capital-allocator",
      rationale: "Aligns validated revenue opportunities with disciplined capital budget constraints so cash is deployed where return is highest.",
      expansionVector: "Opportunity Discovery -> Capital Deployment",
    },
  },

  // --------------------------------------------------------------------------
  // BUNDLE 11: Developer Intelligence Pack
  // --------------------------------------------------------------------------
  {
    id: "developer-intelligence-pack",
    slug: "developer-intelligence",
    version: "2.0.0",
    name: "Developer Intelligence Pack",
    tagline: "What deserves your attention as a software engineer or technical builder this week?",
    description:
      "Filters out Twitter hype to deliver high-signal developer intelligence: breakout open-source repositories, agent architecture shifts, compute/GPU cost arbitrage, and production engineering post-mortems.",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    headlineLaunch: false,
    serviceIds: ["ai-agent-developer-radar", "github-scout", "data-ai-developer-radar", "compute-ai-deal-scout"],
    planIds: ["plan_dev_intel_monthly"],
    priceAmountCents: 9900,
    originalPriceAmountCents: 18000,
    savingsPercentage: 45,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $99/month",
    cadMonthlyNumber: 99,
    stripePriceEnvKey: "STRIPE_PRICE_DEV_INTEL",
    commerceStatus: "purchasable",
    isFixture: false,
    outcomes: [
      "Zero time wasted reading marketing AI press releases",
      "Discover battle-tested open-source libraries before they trend",
      "Save hundreds per month on cloud GPU, model API, and workstation costs",
    ],
    targetAudience: [
      "Staff engineers, CTOs, and technical founders",
      "Full-stack and AI software developers",
      "MLOps and infrastructure engineers",
    ],
    roles: [
      {
        roleTitle: "Tool Radar",
        automationName: "AI Agent & Developer Tool Radar",
        description: "Monitors new development frameworks, testing harnesses, and developer CLI utilities.",
        capabilities: ["Framework benchmarking", "Breaking change alerts", "Tool utility ranking"],
      },
      {
        roleTitle: "Repo Scout",
        automationName: "GitHub Repository Scout",
        description: "Tracks trending repos filtered for production stars, active commit velocity, and pragmatic engineering.",
        capabilities: ["Velocity metrics", "Dependency health", "Licensing verification"],
      },
      {
        roleTitle: "Infrastructure Analyst",
        automationName: "Data / AI / Developer Radar",
        description: "Monitors model API price cuts, latency improvements, context length benchmarks, and dataset drops.",
        capabilities: ["Model latency benchmarks", "Context token pricing", "API breaking changes"],
      },
      {
        roleTitle: "Compute Scout",
        automationName: "Compute & AI Deal Scout",
        description: "Scans cloud GPU spot pricing, server clearances, dedicated hardware auctions, and API credit programs.",
        capabilities: ["GPU spot arbitrage", "Hardware liquidation tracking", "Credit grant alerts"],
      },
    ],
    deliverable: {
      title: "Weekly Developer Signal Brief",
      cadence: "Weekly Monday 09:00 AM",
      format: "Markdown Terminal-Optimized Briefing",
      description: "A terse, high-density weekly markdown briefing answering: What deserves my attention as a developer this week?",
    },
    bestPairedWith: {
      pairWith: "AI/ML Systems Instructor",
      pairWithSlug: "aiml-instructor",
      rationale: "Discovery answers: What is changing in tech? The Systems Instructor answers: What should I actually learn to build with it?",
      expansionVector: "Radar -> Technical Curriculum",
    },
  },

  // --------------------------------------------------------------------------
  // BUNDLE 12: Career Accelerator Pack
  // --------------------------------------------------------------------------
  {
    id: "career-accelerator-pack",
    slug: "career-accelerator",
    version: "2.0.0",
    name: "Career Accelerator Pack",
    tagline: "Turn job market signal into prioritized high-ROI skill acquisition and interviews.",
    description:
      "A systematic career operating system for tech professionals: identifies high-compensation roles matching your capabilities, tracks recruiter relationships, schedules interview prep, and calculates the monetary ROI of learning specific skills.",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    headlineLaunch: false,
    serviceIds: ["career-agent", "relationship-crm", "inbox-triage", "calendar-prep", "learning-roi"],
    planIds: ["plan_career_pack_monthly"],
    priceAmountCents: 9900,
    originalPriceAmountCents: 19500,
    savingsPercentage: 49,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $99/month",
    cadMonthlyNumber: 99,
    stripePriceEnvKey: "STRIPE_PRICE_CAREER_ACCEL",
    commerceStatus: "purchasable",
    isFixture: false,
    pipeline: "JOB MARKET → SKILL GAP → LEARNING → APPLICATION → INTERVIEW",
    outcomes: [
      "Stop blindly submitting generic resumes to job board black holes",
      "Learn only the skills that unlock a direct $20k–$50k salary differential",
      "Maintain flawless follow-up discipline with hiring managers and executive recruiters",
    ],
    targetAudience: [
      "Senior software engineers targeting staff/principal roles",
      "Engineering managers and tech leaders in career transition",
      "Specialists positioning for high-rate advisory contracts",
    ],
    roles: [
      {
        roleTitle: "Opportunity Scout",
        automationName: "Career Agent",
        description: "Monitors direct hiring announcements, team expansions, and specialized roles matching your profile.",
        capabilities: ["Direct hiring signal detection", "Compensation range verification", "Fit-score calculation"],
      },
      {
        roleTitle: "Recruiter CRM",
        automationName: "Relationship CRM",
        description: "Tracks hiring managers, headhunters, past colleagues, and referral contacts with automated check-in triggers.",
        capabilities: ["Contact relationship tracking", "Check-in cadence enforcement", "Contextual note storage"],
      },
      {
        roleTitle: "Communication Triage",
        automationName: "Inbox & Calendar Preparation",
        description: "Surfaces interview invitations and recruiter responses while blocking preparation and debrief slots on your calendar.",
        capabilities: ["Interview invite prioritization", "Calendar study blocks", "Prep notes generation"],
      },
      {
        roleTitle: "Skill ROI Analyst",
        automationName: "Learning ROI",
        description: "Analyzes hundreds of active postings to determine which specific skill gap has the highest salary leverage.",
        capabilities: ["Salary delta analysis", "Skill premium ranking", "Learning curve feasibility"],
      },
    ],
    deliverable: {
      title: "Weekly Career Signal & Interview Dossier",
      cadence: "Weekly Sunday 20:00",
      format: "Career Strategy Sheet & Interview Action Plan",
      description: "A weekly dossier identifying matching opportunities, high-value skill targets, and upcoming recruiter follow-ups.",
    },
    bestPairedWith: {
      pairWith: "AI/ML Systems Instructor",
      pairWithSlug: "aiml-instructor",
      rationale: "Creates a complete closed loop: Job Market -> Skill Gap -> Structured Learning -> Application -> Interview.",
      expansionVector: "Career Strategy -> Technical Mastery",
    },
  },

  // --------------------------------------------------------------------------
  // BUNDLE 13: Business Launch OS
  // --------------------------------------------------------------------------
  {
    id: "business-launch-os",
    slug: "business-launch-os",
    version: "2.0.0",
    name: "Business Launch OS",
    tagline: "Turnkey entity formation, operational infrastructure, and go-to-market execution.",
    description:
      "Everything needed to stand up a legally compliant, operationally sound company in Ontario: regulatory checklists, corporate registry filing guidance, insurance, payments, SOPs, supplier verification, and 30/60/90 day execution milestones.",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    headlineLaunch: false,
    serviceIds: ["business-launch-automation", "compliance-watch", "supplier-scout", "local-intelligence", "customer-acquisition", "venture-experiments"],
    planIds: ["plan_biz_launch_hybrid"],
    priceAmountCents: 29900,
    originalPriceAmountCents: 65000,
    savingsPercentage: 54,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $299 one-time + $149/mo",
    cadMonthlyNumber: 149,
    stripePriceEnvKey: "STRIPE_PRICE_BIZ_LAUNCH",
    commerceStatus: "purchasable",
    isFixture: false,
    pipeline: "VALIDATE → LAUNCH → ACQUIRE CUSTOMERS → OPERATE → SCALE",
    outcomes: [
      "Eliminate legal and compliance guesswork when launching in Ontario",
      "Complete entity setup, banking, bookkeeping, and insurance in days instead of months",
      "Launch directly with customer acquisition pipelines running on day one",
    ],
    targetAudience: [
      "First-time entrepreneurs incorporating in Canada",
      "Corporate professionals launching consulting or agency firms",
      "Trades and service specialists establishing an independent company",
    ],
    roles: [
      {
        roleTitle: "Launch Coordinator",
        automationName: "Business Launch Automation",
        description: "Enforces a comprehensive launch protocol: licenses, banking, payments, bookkeeping, SOPs, and hiring frameworks.",
        capabilities: ["Entity setup checklist", "Payments & invoicing setup", "SOP document generation", "30/60/90 roadmap"],
      },
      {
        roleTitle: "Compliance Sentinel",
        automationName: "Compliance Watch",
        description: "Monitors initial registration requirements, municipal bylaws, WSIB compliance, and tax deadlines.",
        capabilities: ["OBR filing tracking", "Statutory deadline alerts", "Municipal licensing watch"],
      },
      {
        roleTitle: "Supply Scout",
        automationName: "Supplier Scout",
        description: "Identifies essential local and international vendors, tooling, and infrastructure suppliers.",
        capabilities: ["Vendor diligence", "Payment terms guidance", "Operational tool selection"],
      },
      {
        roleTitle: "Market Analyst",
        automationName: "Local Intelligence",
        description: "Analyzes neighborhood competitors, local zoning variances, and demand patterns in your target area.",
        capabilities: ["Local competitor map", "Zoning check", "Demographic snapshot"],
      },
      {
        roleTitle: "Go-To-Market Scout",
        automationName: "Customer Acquisition Radar",
        description: "Initializes your first outreach lists and prospect radar so you generate pipeline as soon as incorporation is active.",
        capabilities: ["Day-one lead generation", "Outreach trigger setup", "Initial customer list"],
      },
    ],
    deliverable: {
      title: "Turnkey Launch Command Center & 90-Day Roadmap",
      cadence: "Instant Setup + Weekly Launch Standup Memo",
      format: "Interactive Formation Workspace & Launch Schedule",
      description: "A complete step-by-step launch control plane tracking all legal, financial, and operational checkboxes to full operational status.",
    },
    bestPairedWith: {
      pairWith: "Founder Growth Pack",
      pairWithSlug: "founder-growth-os",
      rationale: "Once formation is finalized, seamless graduation to the Founder Growth Pack scales active customer acquisition and relationship management.",
      expansionVector: "Formation -> Customer Acquisition",
    },
  },

  // --------------------------------------------------------------------------
  // BUNDLE 14: Local Business Intelligence Pack
  // --------------------------------------------------------------------------
  {
    id: "local-business-intelligence-pack",
    slug: "local-business-intelligence",
    version: "2.0.0",
    name: "Local Business Intelligence Pack",
    tagline: "Track commercial property shifts, municipal permits, closures, and local tenders.",
    description:
      "A localized radar for Ontario entrepreneurs and landlords: monitors municipal building permits, Committee of Adjustment zoning hearings, competitor closures, commercial vacancies, and public municipal tenders.",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    headlineLaunch: false,
    serviceIds: ["local-intelligence", "local-ventures", "strategic-account-watch", "public-rfp-radar", "community-opportunity-radar"],
    planIds: ["plan_local_intel_monthly"],
    priceAmountCents: 14900,
    originalPriceAmountCents: 28000,
    savingsPercentage: 47,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $149/month",
    cadMonthlyNumber: 149,
    stripePriceEnvKey: "STRIPE_PRICE_LOCAL_INTEL",
    commerceStatus: "purchasable",
    isFixture: false,
    outcomes: [
      "Know about nearby commercial developments and rezoning before public notice boards go up",
      "Identify closing competitors and acquire their customer base or equipment",
      "Win municipal sub-$100k local vendor contracts without complex bid committees",
    ],
    targetAudience: [
      "Franchisees, restaurant owners, and retail managers",
      "General contractors and commercial trades",
      "Commercial real estate brokers, landlords, and regional investors",
    ],
    roles: [
      {
        roleTitle: "Municipal Monitor",
        automationName: "Local Intelligence",
        description: "Monitors city building permits, zoning variances within 500m of client assets, closures, and developments.",
        capabilities: ["Permit application alerts", "Zoning committee notices", "Commercial vacancy alerts"],
      },
      {
        roleTitle: "Opportunity Synthesizer",
        automationName: "Local Ventures",
        description: "Translates raw local signals (vacancies, population growth, closures) into actionable venture opportunities.",
        capabilities: ["Signal-to-idea conversion", "Territory gap analysis", "Commercial feasibility check"],
      },
      {
        roleTitle: "Competitor Watch",
        automationName: "Strategic Account Watch",
        description: "Tracks regional competitors, local pricing announcements, and key hiring changes in your target city.",
        capabilities: ["Local competitor tracking", "Promotion monitoring", "Store opening/closure alerts"],
      },
      {
        roleTitle: "Tender Scout",
        automationName: "Public RFP Radar",
        description: "Scans city, town, and regional school board bid portals for sub-$100k RFPs suited for local firms.",
        capabilities: ["Municipal tender scraping", "Trade match scoring", "Notice deadline alerts"],
      },
    ],
    deliverable: {
      title: "Weekly Municipal & Commercial Real Estate Intelligence Dispatch",
      cadence: "Weekly Wednesday 07:00 AM",
      format: "Territory Map & Commercial Event Memo",
      description: "A comprehensive weekly breakdown of permits, municipal hearings, commercial sales, and public RFPs across your target municipality.",
    },
    bestPairedWith: {
      pairWith: "Public RFP Radar & Compliance Watch",
      pairWithSlug: "small-business-coo",
      rationale: "Translates local physical intelligence directly into qualified public contract bids and protected regulatory standing.",
      expansionVector: "Local Intelligence -> Public Contract Revenue",
    },
  },

  // --------------------------------------------------------------------------
  // BUNDLE 15: Franchise Buyer OS
  // --------------------------------------------------------------------------
  {
    id: "franchise-buyer-os",
    slug: "franchise-buyer-os",
    version: "2.0.0",
    name: "Franchise Buyer OS",
    tagline: "The acquisition command center for prospective franchise owners and multi-unit operators.",
    description:
      "A vertical operating system designed specifically for evaluating franchise resales and new territory offerings: analyzes FDD disclosures, royalty math, mandatory supplier costs, territory exclusivity, and broker negotiations.",
    tier: "vertical_os",
    tierLabel: "Vertical Operating System",
    headlineLaunch: false,
    serviceIds: ["business-acquisition-scout", "franchise-intelligence", "deal-execution", "relationship-crm", "follow-up-automation", "local-intelligence", "capital-allocator"],
    planIds: ["plan_franchise_buyer_monthly"],
    priceAmountCents: 29900,
    originalPriceAmountCents: 52000,
    savingsPercentage: 42,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $299/month",
    cadMonthlyNumber: 299,
    stripePriceEnvKey: "STRIPE_PRICE_FRANCHISE_OS",
    commerceStatus: "purchasable",
    isFixture: false,
    outcomes: [
      "Audit franchise disclosure documents without paying $1,000s in upfront legal review",
      "Model true unit economics after mandatory marketing fees, supplier markups, and royalties",
      "Score competing franchise brands on actual franchisee satisfaction and unit closure rates",
    ],
    targetAudience: [
      "Prospective QSR, fitness, and service franchise purchasers",
      "Multi-unit operators acquiring existing territory resales",
      "Corporate professionals purchasing their first franchise business",
    ],
    roles: [
      {
        roleTitle: "Resale Scout",
        automationName: "Business Acquisition Scout",
        description: "Finds existing franchise resale listings, evaluating asking prices, current revenue, and historical cash flow.",
        capabilities: ["Resale portal scraping", "Multiple calculation", "Seller add-back verification"],
      },
      {
        roleTitle: "Franchise Analyst",
        automationName: "Franchise Intelligence",
        description: "Extracts mandatory supplier fee structures, royalty percentages, advertising fund rules, and transfer penalties.",
        capabilities: ["FDD parsing", "Mandatory fee modeling", "Franchisor litigation history check"],
      },
      {
        roleTitle: "Diligence Copilot",
        automationName: "Deal Execution",
        description: "Assists with LOI drafting, diligence gap checklists, franchise agreement red lines, and negotiation levers.",
        capabilities: ["Diligence checklist", "LOI term drafting", "Remodel requirement audits"],
      },
      {
        roleTitle: "Territory Analyst",
        automationName: "Local Intelligence",
        description: "Evaluates protected territory radius, local foot traffic indicators, and nearby competitive saturation.",
        capabilities: ["Territory mapping", "Competitor density", "Demographic purchasing power"],
      },
      {
        roleTitle: "Capital Controller",
        automationName: "Capital Allocator",
        description: "Compares competing franchise options on return on invested capital, break-even timelines, and DSCR covenants.",
        capabilities: ["ROIC comparison", "DSCR debt coverage", "Downside cushion modeling"],
      },
    ],
    deliverable: {
      title: "Franchise Acquisition Command Center",
      cadence: "Real-Time Alerts + Weekly Acquisition Memo",
      format: "Unified Franchise Pipeline & Diligence Workspace",
      description: "A centralized dashboard ranking every target franchise opportunity with normalized economics and territory evaluations.",
    },
    bestPairedWith: {
      pairWith: "Capital Allocator",
      pairWithSlug: "capital-allocator",
      rationale: "Ensures the buyer allocates limited liquidity to the franchise brand with the highest risk-adjusted cash flow.",
      expansionVector: "Franchise Evaluation -> Capital Allocation",
    },
  },

  // --------------------------------------------------------------------------
  // BUNDLE 16: AI Opportunity Pack
  // --------------------------------------------------------------------------
  {
    id: "ai-opportunity-pack",
    slug: "ai-opportunity-pack",
    version: "2.0.0",
    name: "AI Opportunity Pack",
    tagline: "Discover, validate, and monetize applied AI applications and workflow solutions.",
    description:
      "Built around our live AI Money Opportunity Engine. Scans global markets for high-value workflow inefficiencies, designs automated software solutions, runs lightweight smoke tests, and discovers paying customers.",
    tier: "bundle",
    tierLabel: "Purpose-Built Bundle",
    headlineLaunch: false,
    serviceIds: ["ai-money-opportunity-engine", "build-and-sell", "venture-experiments", "customer-acquisition", "opportunity-synthesis"],
    planIds: ["plan_ai_opp_monthly"],
    priceAmountCents: 14900,
    originalPriceAmountCents: 28000,
    savingsPercentage: 47,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $149/month",
    cadMonthlyNumber: 149,
    stripePriceEnvKey: "STRIPE_PRICE_AI_OPP",
    commerceStatus: "purchasable",
    isFixture: false,
    outcomes: [
      "Identify high-conviction micro-SaaS and AI workflow products with proven buyer intent",
      "Avoid building solutions nobody wants through structured smoke tests",
      "Find enterprise buyers ready to pay for automated agent solutions",
    ],
    targetAudience: [
      "Technical founders building micro-SaaS and autonomous agent tools",
      "Indie hackers seeking cash-flowing software ideas",
      "Software consultants creating recurring productized revenue",
    ],
    roles: [
      {
        roleTitle: "Opportunity Engine",
        automationName: "AI Money Opportunity Engine",
        description: "Monitors operational bottlenecks across 24 industries where applied AI delivers high commercial ROI.",
        capabilities: ["Bottleneck ranking", "ROI formula generation", "Buyer willingness scoring"],
      },
      {
        roleTitle: "Product Designer",
        automationName: "Build & Sell",
        description: "Drafts architecture specifications, tech stack recommendations, and feature scopes for minimum viable solutions.",
        capabilities: ["MVP architecture blueprint", "Pricing tier recommendations", "Tech stack selection"],
      },
      {
        roleTitle: "Experimenter",
        automationName: "Venture Experiments",
        description: "Runs structured customer validation tests with strict budgets and objective kill criteria.",
        capabilities: ["Smoke test landing specs", "Budget cap guardrails", "Validation gatekeeping"],
      },
      {
        roleTitle: "Buyer Scout",
        automationName: "Customer Acquisition",
        description: "Identifies early prospective enterprise buyers for the validated AI tool.",
        capabilities: ["Prospect identification", "Outreach angle formulation", "Pilot customer discovery"],
      },
    ],
    deliverable: {
      title: "Weekly AI Monetization & Venture Ranking Brief",
      cadence: "Weekly Thursday 10:00 AM",
      format: "Opportunity Ranking Matrix & Architecture Dossier",
      description: "A weekly ranking of the top 3 high-ROI AI software opportunities with ready-to-test product specs and target buyer lists.",
    },
    bestPairedWith: {
      pairWith: "Developer Intelligence Pack",
      pairWithSlug: "developer-intelligence",
      rationale: "Pairs commercial monetization opportunities with the technical tooling, repos, and compute arbitrage required to build them rapidly.",
      expansionVector: "Commercial Opportunity -> Engineering Execution",
    },
  },

  // --------------------------------------------------------------------------
  // TOP-TIER STACK 17: Complete Entrepreneur OS
  // --------------------------------------------------------------------------
  {
    id: "entrepreneur-os",
    slug: "entrepreneur-os",
    version: "2.0.0",
    name: "Entrepreneur OS",
    tagline: "The complete commercial stack: Sourcing, validation, revenue generation, execution, and capital allocation.",
    description:
      "Combines virtually every monetizable business automation into a single coordinated enterprise stack. Includes 8 opportunity discovery scouts, 4 validation engines, 4 revenue generators, 4 execution copilots, and strategic portfolio synthesis.",
    tier: "business_os",
    tierLabel: "Complete Business Operating Stack",
    headlineLaunch: false,
    serviceIds: [
      "ai-money-opportunity-engine", "business-acquisition-scout", "auction-deal-hunter", "marketplace-deal-hunter",
      "local-intelligence", "local-ventures", "public-rfp-radar", "side-income-radar",
      "build-and-sell", "venture-experiments", "supplier-scout", "franchise-intelligence",
      "customer-acquisition-radar", "strategic-account-watch", "community-opportunity-radar", "creator-revenue-intelligence",
      "deal-execution-copilot", "relationship-crm", "inbox-calendar-triage", "business-launch-os",
      "capital-allocator", "opportunity-synthesis", "decision-review", "learning-roi"
    ],
    planIds: ["plan_entrepreneur_os_monthly"],
    priceAmountCents: 99900,
    originalPriceAmountCents: 245000,
    savingsPercentage: 59,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $999/month",
    cadMonthlyNumber: 999,
    stripePriceEnvKey: "STRIPE_PRICE_ENTREPRENEUR_OS",
    commerceStatus: "purchasable",
    isFixture: false,
    featured: true,
    outcomes: [
      "Operate a full multi-venture enterprise with the intelligence capacity of a 10-person analyst team",
      "Coordinate deal scouting, customer pipeline, diligence, and capital limits in one unified plane",
      "Single consolidated executive briefing replacing dozens of fragmented software tools and alerts",
    ],
    targetAudience: [
      "Serial entrepreneurs and multi-venture holding company founders",
      "Private equity investors and family office directors",
      "High-output business owners scaling across multiple entities",
    ],
    roles: [
      {
        roleTitle: "Discovery Cluster (8 Scouts)",
        automationName: "Unified Deal & Opportunity Sourcing",
        description: "Scans business acquisitions, public auctions, local permits, commercial vacancies, and government RFPs.",
        capabilities: ["M&A listings", "Auctions & liquidations", "Municipal tenders", "Classified arbitrage"],
      },
      {
        roleTitle: "Validation Cluster (4 Engines)",
        automationName: "Disciplined Opportunity Validation",
        description: "Vets unit economics, supplier viability, franchise disclosures, and customer willingness to pay.",
        capabilities: ["FDD analysis", "Supply chain verification", "Smoke-testing protocols", "Margin verification"],
      },
      {
        roleTitle: "Revenue Cluster (4 Generators)",
        automationName: "B2B Acquisition & Market Watch",
        description: "Surfaces high-intent corporate buying triggers, monitors competitor positioning, and mines community demand.",
        capabilities: ["Demand trigger alerts", "Strategic account watch", "Community mining", "Sponsorship radars"],
      },
      {
        roleTitle: "Execution Cluster (4 Copilots)",
        automationName: "Deal Execution & Operations Hub",
        description: "Orchestrates LOI diligence, manages relationship CRM, triages incoming communications, and oversees business launch.",
        capabilities: ["LOI drafting", "CRM follow-ups", "Inbox/calendar triage", "Formation oversight"],
      },
      {
        roleTitle: "Capital & Synthesis Cluster",
        automationName: "Capital Allocation & Retrospective",
        description: "Enforces cash budget limits, prioritizes opportunities, and conducts structured decision retrospectives.",
        capabilities: ["Capital allocation ranking", "Opportunity state machine", "Decision audit logs"],
      },
    ],
    deliverable: {
      title: "Consolidated Entrepreneur Intelligence & Strategy Memo",
      cadence: "Daily 07:00 AM + Friday Executive Portfolio Review",
      format: "Executive Command Center & High-Density Weekly Review",
      description: "One unified daily briefing and weekly strategic review orchestrating all active sourcing, revenue, and capital allocation streams.",
    },
    bestPairedWith: {
      pairWith: "Executive OS Upgrade",
      pairWithSlug: "executive-os",
      rationale: "Adds the complete personal operating layer (Personal COO, Life Ops, Tech Intelligence, Career Agent) to run work and life seamlessly.",
      expansionVector: "Business Operations -> Complete Executive Layer",
    },
  },

  // --------------------------------------------------------------------------
  // TOP-TIER STACK 18: Complete Executive OS
  // --------------------------------------------------------------------------
  {
    id: "executive-os",
    slug: "executive-os",
    version: "2.0.0",
    name: "Executive OS",
    tagline: "An AI operating layer for your work, money, intelligence, and opportunities.",
    description:
      "The definitive operating stack: Everything in Entrepreneur OS plus Personal Operations (Personal COO, nightly planning, compliance, asset optimizer), Tech Intelligence (AI Tool Radar, GitHub Scout, Compute Deals), Career, and Creator engines. Delivers unified executive briefings instead of dozens of disparate emails.",
    tier: "complete_stack",
    tierLabel: "Complete Automation Stack",
    headlineLaunch: false,
    serviceIds: ["entrepreneur-os", "personal-ai-coo", "life-ops-watch", "compliance-watch", "asset-optimizer", "ai-agent-developer-radar", "github-scout", "career-agent", "social-content-intelligence"],
    planIds: ["plan_executive_os_monthly"],
    priceAmountCents: 149900,
    originalPriceAmountCents: 380000,
    savingsPercentage: 61,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $1,499/month",
    cadMonthlyNumber: 1499,
    stripePriceEnvKey: "STRIPE_PRICE_EXECUTIVE_OS",
    commerceStatus: "purchasable",
    isFixture: false,
    featured: true,
    outcomes: [
      "We no longer sell automations — this is an autonomous AI operating layer for your work, wealth, and time",
      "Replaces dozens of scattered newsletters and portals with 4 unified executive documents",
      "Unsurpassed operational peace of mind and strategic clarity",
    ],
    targetAudience: [
      "Venture founders, high-net-worth operators, and family office principals",
      "Chief executives managing complex multi-business and investment holdings",
      "Elite solo operators seeking maximum operational leverage",
    ],
    roles: [
      {
        roleTitle: "Complete Commercial Stack",
        automationName: "Entrepreneur OS Core",
        description: "All 24 business modules for sourcing deals, validating ventures, generating revenue, and managing capital.",
        capabilities: ["Deal sourcing", "Pipeline CRM", "Due diligence", "Capital controller"],
      },
      {
        roleTitle: "Personal Chief of Staff",
        automationName: "Personal COO & Life Ops",
        description: "Orchestrates personal schedule, handles communications triage, tracks recurring commitments, and optimizes software costs.",
        capabilities: ["Nightly standups", "Inbox/calendar triage", "Asset optimization", "Life ops monitoring"],
      },
      {
        roleTitle: "Tech Intelligence Director",
        automationName: "Developer & AI Intelligence",
        description: "Tracks groundbreaking tools, repository shifts, compute deals, and applied research.",
        capabilities: ["Model benchmarking", "Repo tracking", "Hardware cost arbitrage", "API shifts"],
      },
      {
        roleTitle: "Strategic Synthesis Officer",
        automationName: "Executive Opportunity Synthesizer",
        description: "Ranks opportunities and presents unified strategic recommendations to the principal.",
        capabilities: ["Portfolio review", "Cross-domain synthesis", "Urgent alert escalation"],
      },
    ],
    deliverable: {
      title: "4-Part Unified Executive Suite",
      cadence: "Morning 07:00 + Nightly 21:00 + Weekly Review + Monthly Portfolio",
      format: "Morning Executive Brief · Urgent Real-Time Alerts · Weekly Strategic Review · Monthly Portfolio Review",
      description: "A synchronized suite of 4 core executive documents ensuring zero informational blind spots across business, wealth, and operations.",
    },
    bestPairedWith: {
      pairWith: "Automation Office (Team Expansion)",
      pairWithSlug: "automation-office",
      rationale: "Deploys custom shared workflows, team access controls, and collaborative watchlists across your entire executive office staff.",
      expansionVector: "Personal Leverage -> Team Infrastructure",
    },
  },

  // --------------------------------------------------------------------------
  // TOP-TIER STACK 19: Automation Office (Agency & Enterprise Multi-User)
  // --------------------------------------------------------------------------
  {
    id: "automation-office",
    slug: "automation-office",
    version: "2.0.0",
    name: "Automation Office",
    tagline: "The multi-seat intelligence command center for teams, agencies, and operating businesses.",
    description:
      "Enterprise deployment for companies with multiple users. Includes custom watchlists, lead intelligence, competitor tracking, compliance alerts, and custom scheduled workflows, plus 3 bespoke automation workflows built and maintained by our engineering team.",
    tier: "complete_stack",
    tierLabel: "Complete Enterprise Stack",
    headlineLaunch: false,
    serviceIds: ["executive-os", "team-watchlists", "custom-workflows", "shared-crm", "white-glove-onboarding"],
    planIds: ["plan_automation_office_monthly"],
    priceAmountCents: 199900,
    originalPriceAmountCents: 450000,
    savingsPercentage: 56,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $1,999–2,999+/month",
    cadMonthlyNumber: 1999,
    stripePriceEnvKey: "STRIPE_PRICE_AUTOMATION_OFFICE",
    commerceStatus: "request_only",
    isFixture: false,
    outcomes: [
      "Deploy custom company-wide intelligence infrastructure with zero engineering overhead",
      "Includes 3 bespoke custom automation workflows created to match your unique data sources",
      "Full hands-on onboarding, API integrations, and ongoing engineer-led monitoring",
    ],
    targetAudience: [
      "Commercial agencies, brokerage firms, and law partnerships",
      "Multi-location medical, dental, and professional clinics",
      "Mid-market enterprises automating core repetitive intelligence work",
    ],
    roles: [
      {
        roleTitle: "Team Intelligence Hub",
        automationName: "Multi-Seat Radar Console",
        description: "Shared watchlists for competitors, strategic accounts, and lead triggers with role-based team access.",
        capabilities: ["Multi-user seats", "Role-based permissions", "Team activity logs"],
      },
      {
        roleTitle: "Custom Workflow Engine",
        automationName: "Bespoke Automation Credits",
        description: "Includes 3 custom-authored data ingestion and processing workflows built specifically for your business.",
        capabilities: ["Custom portal scraping", "Internal database sync", "Proprietary model extraction"],
      },
      {
        roleTitle: "Dedicated Engineering Lead",
        automationName: "White-Glove Managed Operations",
        description: "Continuous uptime monitoring, prompt maintenance, API key rotation, and dedicated technical support.",
        capabilities: ["Uptime SLAs", "Schema migration support", "Direct Slack/call escalation"],
      },
    ],
    deliverable: {
      title: "Enterprise Command Center & Custom Alert Dispatches",
      cadence: "Continuous Real-Time Webhooks + Weekly Executive Sync",
      format: "Team Dashboard · Direct Slack Dispatches · Bi-Weekly Optimization Call",
      description: "Real-time team webhooks, shared Slack alert feeds, and bi-weekly engineering optimization calls.",
    },
    bestPairedWith: {
      pairWith: "Custom Workflow Add-On Credits",
      rationale: "Add additional bespoke automation pipelines as new operational bottlenecks are identified across your team.",
      expansionVector: "Team Intelligence -> Workflow Automation Expansion",
    },
  },

  // --------------------------------------------------------------------------
  // TIER 20: Custom / Managed Infrastructure
  // --------------------------------------------------------------------------
  {
    id: "custom-managed-infrastructure",
    slug: "custom-managed",
    version: "2.0.0",
    name: "Custom / Managed Infrastructure",
    tagline: "Dedicated engineering, bespoke autonomous agents, and sovereign operational pipelines.",
    description:
      "When off-the-shelf software is insufficient. Complete operational audit, bespoke custom worker development, private infrastructure deployment, and engineer-led uptime SLAs.",
    tier: "custom",
    tierLabel: "Custom / Managed Infrastructure",
    headlineLaunch: false,
    serviceIds: ["custom-engineering", "sovereign-data-pipeline", "bespoke-agent-harness"],
    planIds: ["plan_custom_managed"],
    priceAmountCents: 250000,
    originalPriceAmountCents: 250000,
    savingsPercentage: 0,
    currency: "CAD",
    billingInterval: "month",
    priceDisplay: "CAD $2,500–10,000+ setup + monthly",
    cadMonthlyNumber: 2500,
    stripePriceEnvKey: "STRIPE_PRICE_CUSTOM_MANAGED",
    commerceStatus: "request_only",
    isFixture: false,
    outcomes: [
      "Custom scrapers bypassing anti-bot shields on opaque commercial portals",
      "Sovereign data hosting adhering to PIPEDA and PHIPA Canadian compliance",
      "Guaranteed SLAs with zero non-deterministic hallucinations in production",
    ],
    targetAudience: [
      "Enterprise healthcare and legal practices requiring strict data isolation",
      "Regional logistics and commercial distributors with legacy ERP systems",
      "Financial institutions and high-volume acquisition funds",
    ],
    roles: [
      {
        roleTitle: "Lead Systems Architect",
        automationName: "Custom Architecture & Scoping",
        description: "Conducts deep constraint audits, authors strict schema gates, and designs deterministic state machines.",
        capabilities: ["Diagnostic audit", "Schema gate authoring", "Architecture diagrams"],
      },
      {
        roleTitle: "Staff Automation Engineer",
        automationName: "Bespoke Worker Development",
        description: "Authors resilient Playwright workers, PDF extraction pipelines, and database replication harnesses.",
        capabilities: ["Headless browser workers", "OCR extraction", "Database-native IAM"],
      },
      {
        roleTitle: "Production Operations Lead",
        automationName: "Continuous SLA & Model Tuning",
        description: "Oversees worker health, handles schema drift on target websites, and enforces prompt security.",
        capabilities: ["24/7 error monitoring", "Anti-drift scraper updates", "Zero data leak guarantee"],
      },
    ],
    deliverable: {
      title: "Sovereign Intelligence Engine & Custom API Handshake",
      cadence: "Continuous Execution + Monthly Engineering Review",
      format: "Private Database Replication · Webhook Gateways · Dedicated Audit Portal",
      description: "Dedicated production infrastructure streaming clean, verified JSON directly into your proprietary database or enterprise CRM.",
    },
    bestPairedWith: {
      pairWith: "Executive Diagnostic & Architecture Blueprint",
      rationale: "Credited 100% toward subsequent system deployment; establishes deterministic technical specifications before build.",
      expansionVector: "Audit -> Production Build",
    },
  },
] as const;

// ============================================================================
// 3. THE AUTHORITATIVE "BETTER PAIRED WITH" EXPANSION MATRIX
// ============================================================================

export const PAIRING_MATRIX: readonly PairingRule[] = [
  {
    id: "pair-01",
    ifBuying: "Business Acquisition Scout",
    pairWith: "Deal Execution Copilot",
    because: "Discovery → diligence",
    strategicValue: "Finding an interesting business listing is only step one; you immediately need normalized earnings, add-back audits, and a walk-away valuation to avoid catastrophic overpayment.",
    category: "deals",
  },
  {
    id: "pair-02",
    ifBuying: "Business Acquisition Scout",
    pairWith: "Capital Allocator",
    because: "Compare opportunities",
    strategicValue: "When multiple attractive acquisitions emerge simultaneously, capital constraints dictate which single opportunity yields the safest return on invested equity.",
    category: "deals",
  },
  {
    id: "pair-03",
    ifBuying: "Auction Deal Hunter",
    pairWith: "Marketplace Deal Hunter",
    because: "More inventory channels",
    strategicValue: "Combines closed municipal and bankruptcy court auctions with real-time local peer-to-peer listings to double the deal discovery surface.",
    category: "deals",
  },
  {
    id: "pair-04",
    ifBuying: "Auction Deal Hunter",
    pairWith: "Capital Allocator",
    because: "Prevent over-allocation",
    strategicValue: "Finding ten underpriced machinery lots is useless if you tie up 100% of working capital in illiquid inventory without cash reserves for freight and taxes.",
    category: "deals",
  },
  {
    id: "pair-05",
    ifBuying: "Dropshipping Product Intelligence",
    pairWith: "Supplier & Trade Scout",
    because: "Product → reliable sourcing",
    strategicValue: "Detecting viral product demand on social feeds requires immediate factory verification to secure direct OEM pricing and verify minimum order quantities.",
    category: "commerce",
  },
  {
    id: "pair-06",
    ifBuying: "Supplier & Trade Scout",
    pairWith: "Competitor Watch",
    because: "Understand retail economics",
    strategicValue: "Landed factory cost is meaningless without knowing competitor retail prices, discount cadences, and bundle positioning in real time.",
    category: "commerce",
  },
  {
    id: "pair-07",
    ifBuying: "Competitor Watch",
    pairWith: "Customer Acquisition Radar",
    because: "Intelligence → revenue",
    strategicValue: "Competitor intelligence tells you what is happening in the market; Customer Acquisition tells you where you can immediately profit from their service gaps.",
    category: "growth",
  },
  {
    id: "pair-08",
    ifBuying: "Customer Acquisition Radar",
    pairWith: "Relationship CRM",
    because: "Lead → managed relationship",
    strategicValue: "Surfacing high-intent buyer signals is wasted if warm leads fall into a fragmented spreadsheet without automatic follow-up and relationship context.",
    category: "growth",
  },
  {
    id: "pair-09",
    ifBuying: "Relationship CRM",
    pairWith: "Inbox & Calendar Triage",
    because: "Detect replies automatically",
    strategicValue: "A CRM is only as good as its data; automatic inbox parsing detects incoming client responses and document arrivals without manual operator data entry.",
    category: "operations",
  },
  {
    id: "pair-10",
    ifBuying: "Local Intelligence",
    pairWith: "Local Ventures",
    because: "Signal → business idea",
    strategicValue: "Raw municipal signals (building permits, rezoning, commercial vacancies) become valuable only when converted into viable commercial business models.",
    category: "deals",
  },
  {
    id: "pair-11",
    ifBuying: "Public RFP Radar",
    pairWith: "Compliance Watch",
    because: "Opportunity → eligibility",
    strategicValue: "Winning government and municipal contracts requires pristine WSIB standing, valid liability insurance, and active business registrations that pass compliance gates.",
    category: "operations",
  },
  {
    id: "pair-12",
    ifBuying: "Career Agent",
    pairWith: "Learning ROI",
    because: "Opportunity → skill gap",
    strategicValue: "Job discovery identifies open senior roles; Learning ROI pinpoints the exact technical credentials and libraries that unlock an immediate compensation jump.",
    category: "growth",
  },
  {
    id: "pair-13",
    ifBuying: "Learning ROI",
    pairWith: "AI/ML Systems Instructor",
    because: "Gap → curriculum",
    strategicValue: "Once the high-value skill gap is identified, structured technical curriculum and architecture code labs bridge the competence gap rapidly.",
    category: "engineering",
  },
  {
    id: "pair-14",
    ifBuying: "AI Tool Radar",
    pairWith: "GitHub Repository Scout",
    because: "Commercial + OSS intelligence",
    strategicValue: "Combines closed commercial AI model announcements with trending open-source architectures to build defensible, non-fragile technical infrastructure.",
    category: "engineering",
  },
  {
    id: "pair-15",
    ifBuying: "Creator Intelligence",
    pairWith: "Community Opportunity Radar",
    because: "Content → audience demand",
    strategicValue: "Creators frequently burn out creating content nobody asked for; community listening identifies the exact burning questions audience members are already asking.",
    category: "growth",
  },
  {
    id: "pair-16",
    ifBuying: "Creator Intelligence",
    pairWith: "Saved Content Action Engine",
    because: "Research → production",
    strategicValue: "Bridges the chasm between hundreds of saved articles or research papers and structured, publishable video scripts and essays.",
    category: "growth",
  },
  {
    id: "pair-17",
    ifBuying: "Personal AI COO",
    pairWith: "Inbox & Calendar Triage",
    because: "Better source data",
    strategicValue: "Your AI operating system can only coordinate your day effectively if it has real-time visibility into incoming calendar commitments and executive messages.",
    category: "executive",
  },
  {
    id: "pair-18",
    ifBuying: "Personal AI COO",
    pairWith: "Decision Review",
    because: "Action → learning",
    strategicValue: "Daily execution without retrospective reflection leads to repetitive strategic errors; pairing standups with decision reviews compounds executive judgement.",
    category: "executive",
  },
  {
    id: "pair-19",
    ifBuying: "Build & Sell",
    pairWith: "Venture Experiments",
    because: "Idea → evidence",
    strategicValue: "Designing an attractive productized service is useless without cheap smoke tests that prove market willingness to pay before investing engineering time.",
    category: "growth",
  },
  {
    id: "pair-20",
    ifBuying: "Venture Experiments",
    pairWith: "Customer Acquisition Radar",
    because: "Test → buyer conversations",
    strategicValue: "Validation tests produce real prospect engagement; Customer Acquisition turns that initial curiosity into booked customer discovery and pilot contract calls.",
    category: "growth",
  },
] as const;

// ============================================================================
// 4. INDIVIDUAL SUBSCRIBABLE BRIEFINGS ($29–$149/MO)
// ============================================================================

export const SINGLE_BRIEFINGS: readonly SingleBriefingItem[] = [
  {
    id: "briefing-tech-founder",
    slug: "tech-founder-briefing",
    name: "Tech Founder Briefing",
    roleTitle: "AI & Systems Architecture Radar",
    priceCadMonthly: 49,
    priceDisplay: "CAD $49/mo (or Free Edition)",
    cadence: "Weekly · Monday 11:00 AM",
    summary: "Actionable agent architectures, token budget limits, and deterministic production engineering playbooks for CTOs.",
    deliverable: "Weekly Technical Memo & GitHub Architecture Repository Review",
    bestPairedWith: "AI Tool Radar & GitHub Scout",
    targetAudience: "Technical founders, CTOs, and engineering leads",
  },
  {
    id: "briefing-ontario-deal-radar",
    slug: "ontario-opportunity-monitor",
    name: "Ontario Opportunity Monitor",
    roleTitle: "M&A, Distress & Auction Monitor",
    priceCadMonthly: 99,
    priceDisplay: "CAD $99/mo",
    cadence: "Daily · 07:00 AM",
    summary: "Daily tracking of Ontario court receiverships, business registry filings, bankruptcy notices, and equipment auctions.",
    deliverable: "Daily Morning Deal Memo & Distress Filing Radar",
    bestPairedWith: "Business Acquisition Scout & Diligence Copilot",
    targetAudience: "Acquisition entrepreneurs, search funds, and asset buyers",
  },
  {
    id: "briefing-tender-brief",
    slug: "tender-brief",
    name: "Tender Brief: Public Procurement",
    roleTitle: "Sub-$100k Procurement Scout",
    priceCadMonthly: 79,
    priceDisplay: "CAD $79/mo",
    cadence: "Bi-Weekly · Tue & Thu 06:30 AM",
    summary: "Curated municipal, school board, and provincial procurement bids below $100,000 requiring zero complex union RFP processes.",
    deliverable: "Bi-Weekly Municipal Bid Digest with Pre-Checked Eligibility",
    bestPairedWith: "Compliance Watch & Customer Acquisition Radar",
    targetAudience: "Trades, professional clinics, and regional service contractors",
  },
  {
    id: "briefing-auction-hunter",
    slug: "auction-deal-hunter",
    name: "Auction Deal Hunter Dispatch",
    roleTitle: "Surplus & Machinery Bid Scout",
    priceCadMonthly: 79,
    priceDisplay: "CAD $79/mo",
    cadence: "Daily · 06:45 AM",
    summary: "Scans physical asset auctions across Ontario, calculating buyer premiums, sales tax, and conservative sold comps.",
    deliverable: "Daily Auction Sheet with Target & Hard-Max Bids",
    bestPairedWith: "Marketplace Deal Hunter & Capital Allocator",
    targetAudience: "Equipment dealers, arbitrageurs, and liquidators",
  },
  {
    id: "briefing-business-acquisition-scout",
    slug: "business-acquisition-scout",
    name: "Business Acquisition Scout",
    roleTitle: "Direct SMB M&A Sourcing",
    priceCadMonthly: 99,
    priceDisplay: "CAD $99/mo",
    cadence: "Daily · 08:00 AM",
    summary: "Extracts normalized revenue, SDE, EBITDA, and owner dependency across 8 major broker listing platforms.",
    deliverable: "Daily Deal Sheet with Multiple Comparisons & Red Flags",
    bestPairedWith: "Deal Execution Copilot & Relationship CRM",
    targetAudience: "Search funds and corporate buyers",
  },
  {
    id: "briefing-ai-money-opportunity",
    slug: "ai-money-opportunity-engine",
    name: "AI Money Opportunity Radar",
    roleTitle: "Applied AI Monetization Scout",
    priceCadMonthly: 99,
    priceDisplay: "CAD $99/mo",
    cadence: "Weekly · Thursday 10:00 AM",
    summary: "Identifies validated operational friction points across 24 industries ready for high-ROI autonomous AI workflow solutions.",
    deliverable: "Weekly Workflow Opportunity Spec with ROI Calculator",
    bestPairedWith: "Build & Sell / Venture Experiments",
    targetAudience: "SaaS founders and automation agency builders",
  },
] as const;

// ============================================================================
// 5. HELPER ACCESSORS & REPOSITORY FUNCTIONS
// ============================================================================

export function getAllBundles(): readonly ServiceBundle[] {
  return BUNDLES;
}

export function getHeadlineBundles(): readonly ServiceBundle[] {
  return BUNDLES.filter((b) => b.headlineLaunch);
}

export function getTopTierStacks(): readonly ServiceBundle[] {
  return BUNDLES.filter((b) => b.tier === "business_os" || b.tier === "complete_stack" || b.tier === "custom");
}

export function getVerticalOsBundles(): readonly ServiceBundle[] {
  return BUNDLES.filter((b) => b.tier === "vertical_os");
}

export function getBundleBySlug(slug: string): ServiceBundle | undefined {
  return BUNDLES.find((b) => b.slug === slug);
}

export function getBundleById(id: string): ServiceBundle | undefined {
  return BUNDLES.find((b) => b.id === id);
}

export function getPairingRules(): readonly PairingRule[] {
  return PAIRING_MATRIX;
}

export function getPairingsFor(term: string): readonly PairingRule[] {
  const normalized = term.toLowerCase().trim();
  return PAIRING_MATRIX.filter(
    (p) =>
      p.ifBuying.toLowerCase().includes(normalized) ||
      p.pairWith.toLowerCase().includes(normalized) ||
      p.category.toLowerCase().includes(normalized),
  );
}

export function getSingleBriefings(): readonly SingleBriefingItem[] {
  return SINGLE_BRIEFINGS;
}
