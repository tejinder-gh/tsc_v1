import type { CanonicalService } from "../domain/types";

export const CANONICAL_SERVICES: readonly CanonicalService[] = [
  // ==========================================
  // PRODUCTION SERVICES (isFixture: false)
  // ==========================================
  {
    id: "lead-finder",
    slug: "lead-finder",
    version: "1.0.0",
    name: "Lead Finder",
    tagline: "Meet your next customer.",
    shortDescription:
      "A focused shortlist of businesses that fit your ideal customer, with the context you need to start a useful conversation.",
    longDescription:
      "Lead Finder researches public business directories, registry filings, local chambers, and corporate websites to build a weekly, human-verified shortlist of high-fit prospects for your specific offer.",
    icon: "search",
    accent: "blue",

    visibility: "public",
    commerceStatus: "purchasable",
    fulfillmentReadiness: "operational",
    fulfillmentSpecVersion: "1.0.0",
    isFixture: false,

    categoryId: "marketing-growth",
    subcategoryId: "lead-intelligence",
    goalIds: ["grow-revenue"],
    problemIds: ["finding-customers", "time-consuming-prospecting", "stale-lead-lists"],
    outcomeIds: ["qualified-sales-leads", "save-research-time", "verified-contact-context"],
    useCaseIds: ["b2b-outreach", "territory-expansion", "founder-led-sales"],
    audienceIds: ["sales-marketing", "founder-operator"],
    industryIds: ["all"],
    intentIds: [
      "find customers",
      "grow my business",
      "generate leads",
      "find leads",
      "b2b prospects",
    ],

    productType: "research",
    deliveryType: "hybrid",
    cadence: "weekly",
    automationLevel: "assisted",
    humanReviewAvailable: true,
    humanReviewRequired: true,

    geographicScope: "country",
    supportedLocations: ["Canada", "Ontario"],

    userEffortLevel: "low",
    setupEffort: "low",
    requiredInputs: ["Your business offer", "Ideal customer profile", "Target geography"],
    optionalInputs: ["Target company size", "Exclusion lists"],
    requiredIntegrations: [],
    optionalIntegrations: [],
    requiredPermissions: [],

    planIds: ["plan_lead_finder_monthly"],
    defaultPlanId: "plan_lead_finder_monthly",

    valueProposition:
      "Instead of wasting hours scouring fragmented databases, receive an inbox-ready brief of researched businesses with source links and clear match reasons.",
    deliverableSummaries: [
      "A weekly shortlist of relevant businesses",
      "Source links and a clear reason each lead fits",
      "Public business contact details where available",
      "Human-reviewed brief delivered directly to your inbox",
    ],
    exampleOutputs: [
      "An independent Ontario commercial facility manager matching your square-footage criteria, with website, public LinkedIn profile, and a concise summary of why their expansion matches your service.",
    ],
    maturity: "proven",
    dataFreshness: "Weekly public scan",
    methodologySummary:
      "Multi-source web crawl supplemented by human verification to prevent hallucinated leads.",

    keywords: ["leads", "b2b", "prospects", "sales", "outreach", "customers", "growth"],
    searchAliases: ["find leads", "customer finder", "sales prospects", "lead gen"],
    featured: true,
    priority: 10,

    relatedServiceIds: ["competitor-watch", "opportunity-scout"],
    prerequisiteServiceIds: [],
    complementaryServiceIds: ["competitor-watch"],
    alternativeServiceIds: [],
    bundleIds: [],

    primaryCTA: "subscribe",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-09-22T00:00:00Z",
  },
  {
    id: "competitor-watch",
    slug: "competitor-watch",
    version: "1.0.0",
    name: "Competitor Watch",
    tagline: "Know what changed. Know why it matters.",
    shortDescription:
      "Keep up with competitor pricing, offers, and messaging through a concise brief of meaningful public changes.",
    longDescription:
      "Competitor Watch monitors competitor websites, pricing tables, public announcements, and messaging shifts, distilling noise into a high-signal weekly briefing.",
    icon: "radar",
    accent: "violet",

    visibility: "public",
    commerceStatus: "purchasable",
    fulfillmentReadiness: "operational",
    fulfillmentSpecVersion: "1.0.0",
    isFixture: false,

    categoryId: "research-monitoring",
    subcategoryId: "competitor-monitoring",
    goalIds: ["monitor-competitors"],
    problemIds: ["competitor-blindspots", "unnoticed-pricing-shifts", "slow-market-reaction"],
    outcomeIds: ["competitive-advantage", "pricing-awareness", "messaging-pulse"],
    useCaseIds: ["market-positioning", "pricing-strategy", "product-planning"],
    audienceIds: ["founder-operator", "sales-marketing"],
    industryIds: ["all"],
    intentIds: [
      "monitor competitors",
      "track market pricing",
      "stay informed",
      "competitive intelligence",
    ],

    productType: "monitoring",
    deliveryType: "hybrid",
    cadence: "weekly",
    automationLevel: "assisted",
    humanReviewAvailable: true,
    humanReviewRequired: true,

    geographicScope: "global",
    supportedLocations: ["Canada", "United States", "Global"],

    userEffortLevel: "none",
    setupEffort: "low",
    requiredInputs: ["Competitor names and public URLs", "Key priorities to watch"],
    optionalInputs: ["Target geography", "Specific products to monitor"],
    requiredIntegrations: [],
    optionalIntegrations: [],
    requiredPermissions: [],

    planIds: ["plan_competitor_watch_monthly"],
    defaultPlanId: "plan_competitor_watch_monthly",

    valueProposition:
      "Never get caught off guard by a competitor's stealth pricing revision or new product tier.",
    deliverableSummaries: [
      "A concise weekly competitor update",
      "Public pricing, tier, and positioning changes",
      "Dated source links and concise analyst notes",
      "Explicit 'no change' status when quiet",
    ],
    exampleOutputs: [
      "A regional competitor's pricing page introduced an entry-level tier. Your brief includes screenshots, previous vs new pricing, and strategic implications.",
    ],
    maturity: "proven",
    dataFreshness: "Weekly delta analysis",
    methodologySummary:
      "Automated DOM difference detection with human curation to filter out trivial markup updates.",

    keywords: ["competitors", "pricing", "monitoring", "market intelligence", "radar"],
    searchAliases: ["competitor tracking", "market monitor", "pricing watch"],
    featured: false,
    priority: 20,

    relatedServiceIds: ["lead-finder"],
    prerequisiteServiceIds: [],
    complementaryServiceIds: ["lead-finder"],
    alternativeServiceIds: [],
    bundleIds: [],

    primaryCTA: "subscribe",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-09-22T00:00:00Z",
  },
  {
    id: "opportunity-scout",
    slug: "opportunity-scout",
    version: "1.0.0",
    name: "Opportunity Scout",
    tagline: "Find the opportunities worth your time.",
    shortDescription:
      "A curated brief of public business opportunities matched to your capabilities, interests, and location.",
    longDescription:
      "Opportunity Scout scours public tender notices, grant programs, and partnership announcements to surface contracts and possibilities matched to your business profile.",
    icon: "compass",
    accent: "green",

    visibility: "public",
    commerceStatus: "purchasable",
    fulfillmentReadiness: "operational",
    fulfillmentSpecVersion: "1.0.0",
    isFixture: false,

    categoryId: "business-opportunities",
    subcategoryId: "opportunity-intelligence",
    goalIds: ["find-opportunities", "grow-revenue"],
    problemIds: ["missed-procurement-deadlines", "fragmented-portals", "discovering-grants"],
    outcomeIds: ["discover-contracts-early", "expand-pipeline", "targeted-rfps"],
    useCaseIds: ["public-sector-bidding", "partnership-exploration", "grant-seeking"],
    audienceIds: ["procurement-bidders", "founder-operator", "individual-consultant"],
    industryIds: ["all"],
    intentIds: ["find opportunities", "grow revenue", "discover tenders", "contracts", "rfps"],

    productType: "monitoring",
    deliveryType: "hybrid",
    cadence: "weekly",
    automationLevel: "assisted",
    humanReviewAvailable: true,
    humanReviewRequired: true,

    geographicScope: "country",
    supportedLocations: ["Canada", "Ontario"],

    userEffortLevel: "low",
    setupEffort: "low",
    requiredInputs: ["Your capabilities", "Opportunity types of interest", "Target geography"],
    optionalInputs: ["Exclusions and constraints"],
    requiredIntegrations: [],
    optionalIntegrations: [],
    requiredPermissions: [],

    planIds: ["plan_opportunity_scout_monthly"],
    defaultPlanId: "plan_opportunity_scout_monthly",

    valueProposition:
      "Stop navigating dozens of municipality portals. Get a single curated weekly briefing with clear eligibility notes.",
    deliverableSummaries: [
      "A weekly shortlist matched to your capabilities",
      "Original source links and application deadlines",
      "Fit notes, eligibility details, and known gaps",
      "Inbox summary with recommended next actions",
    ],
    exampleOutputs: [
      "A provincial grant opening for sustainable facilities matched to your clean-tech capability, detailing deadline, budget pool, and link to documentation.",
    ],
    maturity: "proven",
    dataFreshness: "Weekly procurement aggregation",
    methodologySummary:
      "Government and municipal open-data ingestion reviewed by procurement analysts.",

    keywords: ["tenders", "rfp", "grants", "procurement", "contracts", "opportunities"],
    searchAliases: ["find tenders", "rfp scout", "contract alerts", "government grants"],
    featured: false,
    priority: 30,

    relatedServiceIds: ["tender-brief", "lead-finder"],
    prerequisiteServiceIds: [],
    complementaryServiceIds: ["tender-brief"],
    alternativeServiceIds: [],
    bundleIds: ["business-buyer-toolkit"],

    primaryCTA: "subscribe",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-09-22T00:00:00Z",
  },
  {
    id: "tender-brief",
    slug: "tender-brief",
    version: "1.0.0",
    name: "Tender Brief",
    tagline: "A clearer first read on your next tender.",
    shortDescription:
      "An experimental service for turning lengthy public tender documents into a concise requirements and deadline brief.",
    longDescription:
      "Tender Brief uses AI document synthesis to extract mandatory requirements, scoring rubrics, submission deadlines, and eligibility gates from multi-hundred-page RFPs.",
    icon: "file",
    accent: "amber",

    visibility: "public",
    commerceStatus: "request_only",
    fulfillmentReadiness: "beta",
    fulfillmentSpecVersion: "0.9.0",
    isFixture: false,

    categoryId: "business-opportunities",
    subcategoryId: "procurement-intelligence",
    goalIds: ["make-decisions", "automate-work"],
    problemIds: ["dense-rfp-documents", "missed-mandatory-clauses", "slow-bid-go-no-go"],
    outcomeIds: ["faster-bid-decisions", "clear-compliance-checklist", "time-savings"],
    useCaseIds: ["bid-qualification", "procurement-review"],
    audienceIds: ["procurement-bidders"],
    industryIds: ["all"],
    intentIds: ["analyze tender", "summarize rfp", "bid review", "procurement help"],

    productType: "analysis",
    deliveryType: "ai",
    cadence: "on_demand",
    automationLevel: "mostly_automated",
    humanReviewAvailable: false,
    humanReviewRequired: false,

    geographicScope: "global",
    supportedLocations: ["Canada", "Global"],

    userEffortLevel: "low",
    setupEffort: "none",
    requiredInputs: ["Tender documentation URL or file"],
    optionalInputs: ["Specific focus areas"],
    requiredIntegrations: [],
    optionalIntegrations: [],
    requiredPermissions: [],

    planIds: ["plan_tender_brief_lab"],
    defaultPlanId: "plan_tender_brief_lab",

    valueProposition:
      "Transform a 200-page government tender into a 2-page executive compliance checklist in minutes.",
    deliverableSummaries: [
      "Requirements and deadline summary",
      "Mandatory eligibility checklist",
      "Direct cross-references to original tender sections",
    ],
    exampleOutputs: [
      "A structured matrix highlighting submission deadline, bond requirements, ISO certifications required, and disqualification criteria.",
    ],
    maturity: "beta",
    dataFreshness: "On-demand execution",
    methodologySummary: "LLM extraction constrained by structural schemas and cited line numbers.",

    keywords: ["tender", "rfp summary", "compliance", "bid analysis", "ai worker"],
    searchAliases: ["rfp reader", "tender analyzer", "bid summary"],
    featured: false,
    priority: 40,

    relatedServiceIds: ["opportunity-scout"],
    prerequisiteServiceIds: [],
    complementaryServiceIds: ["opportunity-scout"],
    alternativeServiceIds: [],
    bundleIds: [],

    primaryCTA: "request",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-09-22T00:00:00Z",
  },

  // ==========================================
  // DEMONSTRATION / FIXTURE OFFERINGS (isFixture: true)
  // Non-production prototypes demonstrating future catalogue capability
  // ==========================================
  {
    id: "ontario-opportunity-monitor",
    slug: "ontario-opportunity-monitor",
    version: "1.0.0",
    name: "Ontario Opportunity Monitor",
    tagline: "Daily deal radar for Ontario businesses and assets.",
    shortDescription:
      "Discover potentially attractive businesses, properties, auctions and distressed opportunities across Ontario.",
    longDescription:
      "Monitors 14 fragmented Ontario deal registries, commercial property auctions, and bankruptcy trustees every morning at 7:00 AM, publishing a ranked daily shortlist based on acquisition parameters.",
    icon: "compass",
    accent: "green",

    visibility: "public",
    commerceStatus: "waitlist",
    fulfillmentReadiness: "planned",
    isFixture: true,

    categoryId: "business-opportunities",
    subcategoryId: "business-acquisition",
    goalIds: ["find-opportunities"],
    problemIds: [
      "fragmented-deal-sources",
      "opportunities-vanish-quickly",
      "manual-search-fatigue",
    ],
    outcomeIds: ["discover-deals-early", "acquire-profitable-businesses", "automate-deal-flow"],
    useCaseIds: ["business-acquisition", "distressed-investing", "commercial-real-estate"],
    audienceIds: ["business-buyer", "founder-operator"],
    industryIds: ["all"],
    intentIds: [
      "find opportunities",
      "monitor opportunities",
      "buy a business",
      "business acquisition",
      "ontario deals",
    ],

    productType: "monitoring",
    deliveryType: "automation",
    cadence: "daily",
    automationLevel: "fully_automated",
    humanReviewAvailable: false,
    humanReviewRequired: false,

    geographicScope: "province_state",
    supportedLocations: ["Ontario", "CA-ON"],

    userEffortLevel: "low",
    setupEffort: "low",
    requiredInputs: ["Target deal size and industry preference"],
    optionalInputs: ["Specific Ontario municipalities"],
    requiredIntegrations: [],
    optionalIntegrations: [],
    requiredPermissions: [],

    planIds: ["plan_ontario_opportunity_monthly"],
    defaultPlanId: "plan_ontario_opportunity_monthly",

    valueProposition:
      "Instead of manually checking fragmented opportunity sources, receive a daily prioritized shortlist based on your acquisition criteria.",
    deliverableSummaries: [
      "Daily 7:00 AM Ontario opportunity radar",
      "Estimated valuation metrics and multiple benchmarks",
      "Direct link to liquidation, auction or broker source",
    ],
    exampleOutputs: [
      "A turnkey light manufacturing business in Kitchener-Waterloo listed for liquidation, including verified revenue range and broker contact link.",
    ],
    maturity: "beta",
    dataFreshness: "Daily 7:00 AM refresh",
    methodologySummary:
      "Automated web crawlers scraping court records, broker networks, and municipal auctions.",

    keywords: [
      "business acquisition",
      "ontario",
      "distressed business",
      "auction",
      "commercial property",
    ],
    searchAliases: ["ontario deals", "buy business ontario", "liquidation radar"],
    featured: true,
    priority: 15,

    relatedServiceIds: ["franchise-resale-radar", "opportunity-scout"],
    prerequisiteServiceIds: [],
    complementaryServiceIds: ["franchise-resale-radar"],
    alternativeServiceIds: ["opportunity-scout"],
    bundleIds: ["business-buyer-toolkit"],

    primaryCTA: "join_waitlist",
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-09-22T00:00:00Z",
  },
  {
    id: "franchise-resale-radar",
    slug: "franchise-resale-radar",
    version: "1.0.0",
    name: "Franchise Resale Radar",
    tagline: "Track profitable franchise resales before they hit open portals.",
    shortDescription:
      "Real-time alerts and weekly intelligence on existing franchise units available for transfer or acquisition.",
    longDescription:
      "Aggregates franchisor disclosures and broker resales across Canada to highlight cash-flowing franchise opportunities with proven unit economics.",
    icon: "radar",
    accent: "blue",

    visibility: "public",
    commerceStatus: "waitlist",
    fulfillmentReadiness: "planned",
    isFixture: true,

    categoryId: "business-opportunities",
    subcategoryId: "business-acquisition",
    goalIds: ["find-opportunities"],
    problemIds: ["hidden-franchise-resales", "unverified-franchisor-claims"],
    outcomeIds: ["acquire-cash-flow-franchise", "skip-startup-phase"],
    useCaseIds: ["franchise-investing", "portfolio-expansion"],
    audienceIds: ["business-buyer", "founder-operator"],
    industryIds: ["retail", "services"],
    intentIds: ["franchise", "buy franchise", "resale radar", "franchise opportunities"],

    productType: "monitoring",
    deliveryType: "automation",
    cadence: "weekly",
    automationLevel: "mostly_automated",
    humanReviewAvailable: false,
    humanReviewRequired: false,

    geographicScope: "country",
    supportedLocations: ["Canada"],

    userEffortLevel: "none",
    setupEffort: "low",
    requiredInputs: ["Capital range", "Target franchise sectors"],
    optionalInputs: ["Geographic radius"],
    requiredIntegrations: [],
    optionalIntegrations: [],
    requiredPermissions: [],

    planIds: ["plan_franchise_resale_monthly"],
    defaultPlanId: "plan_franchise_resale_monthly",

    valueProposition:
      "Avoid the high failure rate of startup franchises by acquiring operational units with established cash flow.",
    deliverableSummaries: [
      "Weekly franchise resale dispatch",
      "Historical unit cash-flow indicators",
      "Franchisor approval prerequisites summary",
    ],
    exampleOutputs: [
      "An established quick-service restaurant unit in Oakville with 4 years remaining on lease, showing audited historical EBITDA.",
    ],
    maturity: "beta",
    dataFreshness: "Weekly intelligence sweep",
    methodologySummary:
      "Franchise disclosure registry monitoring combined with commercial broker feeds.",

    keywords: ["franchise", "resale", "cash flow", "acquisitions", "investor"],
    searchAliases: ["buy a franchise", "franchise for sale", "qsr resale"],
    featured: false,
    priority: 18,

    relatedServiceIds: ["ontario-opportunity-monitor"],
    prerequisiteServiceIds: [],
    complementaryServiceIds: ["ontario-opportunity-monitor"],
    alternativeServiceIds: [],
    bundleIds: ["business-buyer-toolkit"],

    primaryCTA: "join_waitlist",
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-09-22T00:00:00Z",
  },
  {
    id: "ai-workflow-audit",
    slug: "ai-workflow-audit",
    version: "1.0.0",
    name: "AI Workflow & Automation Audit",
    tagline: "Identify high-ROI operational processes to automate.",
    shortDescription:
      "A hands-on, human-delivered audit of your recurring business processes to pinpoint exact AI and automation gains.",
    longDescription:
      "Our senior automation architects analyze your daily workflows, team bottlenecks, and tool stacks to deliver an actionable automation roadmap with projected ROI.",
    icon: "bolt",
    accent: "violet",

    visibility: "public",
    commerceStatus: "request_only",
    fulfillmentReadiness: "manual",
    isFixture: true,

    categoryId: "custom-services",
    subcategoryId: "consulting-advisory",
    goalIds: ["automate-work", "make-decisions"],
    problemIds: ["confusing-ai-hype", "repetitive-admin-overhead", "unknown-automation-roi"],
    outcomeIds: ["custom-automation-roadmap", "hours-saved", "tooling-consolidation"],
    useCaseIds: ["operational-overhaul", "scaling-without-headcount"],
    audienceIds: ["founder-operator", "sales-marketing"],
    industryIds: ["all"],
    intentIds: ["ai consulting", "automate business", "workflow audit", "ai roadmap"],

    productType: "consulting",
    deliveryType: "human",
    cadence: "on_demand",
    automationLevel: "manual",
    humanReviewAvailable: true,
    humanReviewRequired: true,

    geographicScope: "global",
    supportedLocations: ["Canada", "United States", "Global"],

    userEffortLevel: "medium",
    setupEffort: "medium",
    requiredInputs: ["Current software stack list", "3 most time-consuming workflows"],
    optionalInputs: ["Team structure overview"],
    requiredIntegrations: [],
    optionalIntegrations: [],
    requiredPermissions: [],

    planIds: ["plan_ai_workflow_audit_fixed"],
    defaultPlanId: "plan_ai_workflow_audit_fixed",

    valueProposition:
      "Stop guessing which AI tools to buy. Get an engineering-backed implementation blueprint customized to your exact team.",
    deliverableSummaries: [
      "Custom 15-page automation architecture roadmap",
      "Tool evaluation scorecard & cost comparison",
      "60-minute executive walk-through and Q&A",
    ],
    exampleOutputs: [
      "A complete blueprint showing how to replace 12 hours of weekly customer quote drafting with an automated webhook pipeline.",
    ],
    maturity: "proven",
    dataFreshness: "Custom engagement",
    methodologySummary:
      "Comprehensive stakeholder interviews and operational process mapping by senior engineers.",

    keywords: ["consulting", "workflow", "audit", "automation", "expert"],
    searchAliases: ["ai consultant", "automate my business", "workflow review"],
    featured: true,
    priority: 25,

    relatedServiceIds: ["lead-finder"],
    prerequisiteServiceIds: [],
    complementaryServiceIds: [],
    alternativeServiceIds: [],
    bundleIds: [],

    primaryCTA: "request",
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-09-22T00:00:00Z",
  },
  {
    id: "tech-founder-briefing",
    slug: "tech-founder-briefing",
    version: "1.0.0",
    name: "Tech Founder Briefing",
    tagline: "Actionable AI & engineering shifts, distilled weekly.",
    shortDescription:
      "A curated weekly newsletter highlighting commercial agent use cases, model breakthroughs, and engineering playbooks.",
    longDescription:
      "Written for technical founders, operators, and engineering leads who need signal without sensationalism. Delivers concise architectural breakdowns every Monday morning.",
    icon: "file-text",
    accent: "blue",

    visibility: "public",
    commerceStatus: "free",
    fulfillmentReadiness: "beta",
    isFixture: true,

    categoryId: "research-monitoring",
    subcategoryId: "newsletter",
    goalIds: ["stay-informed"],
    problemIds: ["information-overload", "shallow-ai-newsletters"],
    outcomeIds: ["stay-ahead-of-ai-curve", "implementable-code-patterns"],
    useCaseIds: ["executive-briefing", "technology-scanning"],
    audienceIds: ["founder-operator", "individual-consultant"],
    industryIds: ["software", "ai"],
    intentIds: ["newsletter", "stay informed", "ai digest", "tech news"],

    productType: "newsletter",
    deliveryType: "ai",
    cadence: "weekly",
    automationLevel: "mostly_automated",
    humanReviewAvailable: true,
    humanReviewRequired: false,

    geographicScope: "global",
    supportedLocations: ["Global"],

    userEffortLevel: "none",
    setupEffort: "none",
    requiredInputs: ["Email address"],
    optionalInputs: [],
    requiredIntegrations: [],
    optionalIntegrations: [],
    requiredPermissions: [],

    planIds: ["plan_tech_founder_briefing_free"],
    defaultPlanId: "plan_tech_founder_briefing_free",

    valueProposition:
      "Get straight to the engineering substance behind modern AI tools in 5 minutes every Monday.",
    deliverableSummaries: [
      "Weekly Monday 8:00 AM email brief",
      "Benchmark comparisons & architectural teardowns",
      "Full web archive access",
    ],
    exampleOutputs: [
      "Issue #42: Analyzing stateful memory patterns in multi-agent orchestration systems with code snippets.",
    ],
    maturity: "proven",
    dataFreshness: "Weekly Monday dispatch",
    methodologySummary:
      "Continuous arXiv and GitHub trending monitoring curated by technical staff.",

    keywords: ["newsletter", "briefing", "ai", "engineering", "tech"],
    searchAliases: ["ai newsletter", "founder brief", "tech digest"],
    featured: false,
    priority: 35,

    relatedServiceIds: [],
    prerequisiteServiceIds: [],
    complementaryServiceIds: [],
    alternativeServiceIds: [],
    bundleIds: [],

    primaryCTA: "subscribe",
    createdAt: "2026-03-01T00:00:00Z",
    updatedAt: "2026-09-22T00:00:00Z",
  },
] as const;

export function getCanonicalServiceById(id: string): CanonicalService | undefined {
  return CANONICAL_SERVICES.find((s) => s.id === id);
}

export function getCanonicalServiceBySlug(slug: string): CanonicalService | undefined {
  return CANONICAL_SERVICES.find((s) => s.slug === slug);
}
