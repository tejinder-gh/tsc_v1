import type { Newsletter } from "../domain/types";

export const CANONICAL_NEWSLETTERS: readonly Newsletter[] = [
  {
    id: "tech-founder-briefing",
    slug: "tech-founder-briefing",
    name: "Tech Founder Briefing",
    tagline: "Actionable AI & engineering shifts, distilled weekly.",
    description:
      "A curated weekly briefing highlighting practical agent architectures, model breakthroughs, and production engineering playbooks. Delivered every Monday morning.",
    topic: "Applied AI, Agent Architectures & Technical Entrepreneurship",
    audience: "Technical founders, CTOs, engineering leads, and software operators",
    categories: ["ai", "engineering", "startups"],
    tags: ["agents", "llm-ops", "architecture", "playbooks"],
    generationMode: "ai",
    cadence: "weekly",
    deliveryChannel: "all",
    subscriptionModel: "free",
    priceDisplay: "Free",
    editorialOwner: "The Skill Corner Engineering",
    sourceInputs: [
      "ArXiv applied AI papers",
      "Model release documentation",
      "Production post-mortems",
      "GitHub trending autonomous systems",
    ],
    status: "active",
    visibility: "public",
    subscriberCount: 142,
    lastPublishedAt: "2026-09-15T12:00:00Z",
    nextScheduledAt: "2026-09-29T11:00:00Z",
    sampleIssueSnippet:
      "How to design deterministic agent harness layers that prevent hallucination in production workflows without sacrificing speed.",
    issues: [
      {
        id: "tfb-001",
        newsletterSlug: "tech-founder-briefing",
        issueNumber: 1,
        title: "Production Agent Harnesses & In-Memory RAG: What Changed in Q3",
        slug: "production-agent-harnesses-q3",
        summary:
          "Why top engineering teams are ditching fragile multi-agent frameworks in favor of constrained state machines, deterministic ranking, and strict token-budget limits.",
        keyTakeaways: [
          "State machines outperform free-form loop orchestrators in predictability by 40%",
          "In-memory deterministic ranking beats external vector search for small-to-medium enterprise catalogs",
          "Hard input allowlisting remains the #1 defense against prompt injection in tool-calling agents",
        ],
        contentMarkdown: `## The Shift Toward Constrained Determinism

Over the past quarter, the consensus among engineers shipping autonomous systems to commercial clients has fundamentally shifted. Early enthusiasm for general-purpose autonomous agent frameworks has been tempered by the reality of non-deterministic failure modes in production.

### 1. State Machines over Open-Ended Autonomy
Rather than permitting agents to execute unrestricted tool selection loops, robust architectures enforce finite-state transitions. Each phase (Ingest -> Validate -> Plan -> Execute -> Audit) must satisfy explicit invariants before state mutations occur.

### 2. In-Memory Catalog Ranking
For datasets under 50,000 items, external vector databases add network latency, operational overhead, and index synchronization bugs. In-memory deterministic scoring—evaluating exact intent matches, category hierarchies, and hard constraints—delivers sub-millisecond query latency with zero external failure points.

### 3. Verification Gates as First-Class Citizens
Every LLM generation step should be guarded by a strict schema validator. If an output fails schema validation, the system drops to a deterministic fallback rather than retrying blindly.`,
        generatedBy: "ai",
        status: "published",
        publishedAt: "2026-09-15T12:00:00Z",
        deliveredAt: "2026-09-15T12:05:00Z",
        sourceItemCount: 18,
        curatorNotes: "Approved by lead architect after technical validation.",
        isSample: true,
      },
      {
        id: "tfb-002",
        newsletterSlug: "tech-founder-briefing",
        issueNumber: 2,
        title: "Database-Native IAM for Background Agents",
        slug: "database-native-iam-agents",
        summary:
          "Implementing fine-grained Postgres row-level security and service-role principal separation for headless background workers.",
        keyTakeaways: [
          "Separate web frontend credentials from automation engine credentials",
          "Use Security Definer functions with immutable search paths",
          "Log caller principals on all internal audit tables",
        ],
        contentMarkdown: `## Securing Autonomous Background Execution

When background workers and relay services interact with core databases, traditional shared application connection pools present a severe privilege escalation risk.

### Principle of Least Privilege for Agents
Headless agents should never hold broad table permissions. By defining dedicated Postgres roles with scoped execution grants on security-definer procedures, the database engine itself enforces the security boundary regardless of LLM output.`,
        generatedBy: "ai",
        status: "published",
        publishedAt: "2026-09-22T12:00:00Z",
        deliveredAt: "2026-09-22T12:04:00Z",
        sourceItemCount: 12,
        curatorNotes: "Editorial review complete.",
        isSample: true,
      },
    ],
  },
  {
    id: "ontario-opportunity-monitor",
    slug: "ontario-opportunity-monitor",
    name: "Ontario Opportunity Monitor",
    tagline: "Daily deal radar for Ontario businesses, distressed assets, and auctions.",
    description:
      "Monitors fragmented Ontario deal registries, commercial property auctions, and bankruptcy trustees every morning at 7:00 AM, publishing a ranked daily shortlist based on acquisition parameters.",
    topic: "Business Acquisitions, Commercial Assets & Ontario Dealflow",
    audience: "Business buyers, acquisition entrepreneurs, search funds, and local investors",
    categories: ["acquisitions", "investing", "business"],
    tags: ["dealflow", "ontario", "mergers", "auctions"],
    generationMode: "hybrid",
    cadence: "daily",
    deliveryChannel: "all",
    subscriptionModel: "freemium",
    priceDisplay: "Free tier / C$49 mo for pro",
    editorialOwner: "The Skill Corner Market Intelligence",
    sourceInputs: [
      "Ontario Business Registry filings",
      "Trustee bankruptcy notices",
      "Municipal surplus auctions",
      "Commercial real estate listings",
    ],
    status: "active",
    visibility: "public",
    subscriberCount: 89,
    lastPublishedAt: "2026-09-22T11:00:00Z",
    nextScheduledAt: "2026-09-23T11:00:00Z",
    sampleIssueSnippet:
      "Today's radar: A 28-year established HVAC contractor in London, ON looking for ownership transition, plus 3 municipal equipment auctions.",
    issues: [
      {
        id: "oom-001",
        newsletterSlug: "ontario-opportunity-monitor",
        issueNumber: 1,
        title: "Daily Radar: 3 Operating Businesses in Southwestern Ontario",
        slug: "daily-radar-southwestern-ontario",
        summary:
          "Key highlights: Established plumbing contractor in Kitchener-Waterloo, specialty bakery in Guelph, and municipal equipment auction in Hamilton.",
        keyTakeaways: [
          "Plumbing contractor: C$1.2M revenue, owner retiring, clean book of commercial service contracts",
          "Specialty bakery: Turnkey location with equipment included, lease transferable",
          "Hamilton municipal auction: 14 light commercial service vehicles listed with reserve prices",
        ],
        contentMarkdown: `## Daily Deal Digest — Ontario Region

Our automated ingestion engine scanned 14 registries this morning at 07:00 ET. Here are today's verified opportunities:

### 1. Established Commercial Plumbing Contractor (Kitchener-Waterloo)
- **Status**: Owner retirement transition
- **Revenue**: ~C$1.2M ARR (80% recurring maintenance contracts with property managers)
- **Staff**: 4 licensed journeymen, 2 apprentices
- **Source**: Industry broker filing (verified)

### 2. Commercial Fleet Surplus (City of Hamilton)
- **Items**: 14 Ford Transit 250 service vans (2020-2023)
- **Auction Date**: Thursday, October 1, 2026
- **Terms**: Verified clear title, public inspection open Wednesday`,
        generatedBy: "hybrid",
        status: "published",
        publishedAt: "2026-09-22T11:00:00Z",
        deliveredAt: "2026-09-22T11:05:00Z",
        sourceItemCount: 24,
        curatorNotes: "Verified broker filings manually before distribution.",
        isSample: true,
      },
    ],
  },
  {
    id: "tender-brief",
    slug: "tender-brief",
    name: "Tender Brief: Ontario Municipal RFPs",
    tagline: "Curated municipal & provincial procurement opportunities for SMBs.",
    description:
      "A weekly digest matching open government tenders and public sector RFPs to independent businesses, contractors, and technology service providers across Ontario.",
    topic: "Government Procurement & Public Tenders",
    audience: "Contractors, digital agencies, IT consultancies, and facilities operators",
    categories: ["procurement", "contracts", "government"],
    tags: ["rfp", "tenders", "municipal", "contracts"],
    generationMode: "hybrid",
    cadence: "weekly",
    deliveryChannel: "email",
    subscriptionModel: "free",
    priceDisplay: "Free",
    editorialOwner: "The Skill Corner Market Intelligence",
    sourceInputs: [
      "MERX Ontario tenders",
      "Biddingo public notices",
      "City of Toronto procurement bulletin",
      "Metrolinx vendor notices",
    ],
    status: "active",
    visibility: "public",
    subscriberCount: 64,
    lastPublishedAt: "2026-09-20T14:00:00Z",
    nextScheduledAt: "2026-09-27T14:00:00Z",
    sampleIssueSnippet:
      "This week: 4 small-business friendly digital transformation contracts under C$100k requiring local presence in GTA.",
    issues: [
      {
        id: "tb-001",
        newsletterSlug: "tender-brief",
        issueNumber: 1,
        title: "Weekly Brief: Digital Transformation & Web Accessibility RFPs",
        slug: "digital-transformation-rfps",
        summary:
          "Four low-barrier municipal tenders for web redesign, accessibility compliance (AODA), and CRM integration in the Greater Toronto Area.",
        keyTakeaways: [
          "Town of Halton Hills: AODA compliance audit for municipal web portal (Deadline: Oct 12)",
          "City of Markham: Cloud VoIP migration and interactive voice response configuration",
          "Durham Region: Automated intake form workflows for community housing program",
        ],
        contentMarkdown: `## Ontario Public Sector RFP Shortlist

We filtered 132 raw notices down to 4 high-relevance bids suitable for independent technology firms and consultancies:

### 1. Town of Halton Hills — AODA Compliance Audit
- **Scope**: WCAG 2.1 AA audit of external web properties and staff training
- **Submission Deadline**: October 12, 2026 at 2:00 PM EST
- **Format**: Electronic bid submission

### 2. City of Markham — Interactive Reception & Intake Voice Automation
- **Scope**: Configuration of cloud-based telephony and intake scheduling
- **Submission Deadline**: October 18, 2026`,
        generatedBy: "hybrid",
        status: "published",
        publishedAt: "2026-09-20T14:00:00Z",
        deliveredAt: "2026-09-20T14:04:00Z",
        sourceItemCount: 14,
        curatorNotes: "Filtered for sub-$150k contracts with no prior tier-1 vendor lock-in.",
        isSample: true,
      },
    ],
  },
];

export function getAllNewsletters(): readonly Newsletter[] {
  return CANONICAL_NEWSLETTERS;
}

export function getNewsletterBySlug(slug: string): Newsletter | undefined {
  return CANONICAL_NEWSLETTERS.find((n) => n.slug === slug || n.id === slug);
}

export function getIssueBySlug(
  newsletterSlug: string,
  issueSlug: string,
): { newsletter: Newsletter; issue: Newsletter["issues"][number] } | undefined {
  const newsletter = getNewsletterBySlug(newsletterSlug);
  if (!newsletter) return undefined;
  const issue = newsletter.issues.find((i) => i.slug === issueSlug);
  if (!issue) return undefined;
  return { newsletter, issue };
}
