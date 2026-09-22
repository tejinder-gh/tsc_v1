export type TaxonomyItem = {
  id: string;
  label: string;
  description?: string;
  aliases: string[];
  parentId?: string;
  icon?: string;
};

export const GOAL_TAXONOMY: readonly TaxonomyItem[] = [
  {
    id: "find-opportunities",
    label: "Find Opportunities",
    description:
      "Discover off-market acquisitions, distressed assets, auctions, and growth possibilities.",
    aliases: [
      "discover deals",
      "find deals",
      "acquisitions",
      "buying a business",
      "commercial opportunities",
    ],
    icon: "compass",
  },
  {
    id: "monitor-competitors",
    label: "Monitor Markets & Competitors",
    description:
      "Track competitor pricing, strategic messaging, shifts, and emerging industry signals.",
    aliases: [
      "track competitors",
      "market intelligence",
      "price monitoring",
      "competitive intelligence",
    ],
    icon: "radar",
  },
  {
    id: "automate-work",
    label: "Automate Repetitive Work",
    description:
      "Streamline repetitive research, data extraction, and monitoring through turnkey automations.",
    aliases: ["automation", "save time", "automate research", "workflow automation"],
    icon: "bolt",
  },
  {
    id: "grow-revenue",
    label: "Grow Revenue & Find Customers",
    description:
      "Discover ideal business customers and opportunities with contextual intelligence.",
    aliases: ["find leads", "lead generation", "sales pipeline", "customer acquisition"],
    icon: "trending-up",
  },
  {
    id: "make-decisions",
    label: "Make Clearer Decisions",
    description: "Turn complex, fragmented public data and documents into actionable briefings.",
    aliases: ["due diligence", "decision support", "tender analysis", "document review"],
    icon: "file-text",
  },
  {
    id: "stay-informed",
    label: "Stay Informed",
    description: "Receive curated intelligence, executive digests, and regulatory monitors.",
    aliases: ["newsletters", "industry updates", "daily briefing", "weekly brief"],
    icon: "newspaper",
  },
] as const;

export const CATEGORY_TAXONOMY: readonly TaxonomyItem[] = [
  {
    id: "business-opportunities",
    label: "Business & Opportunity Intelligence",
    description:
      "Acquisition opportunities, auctions, franchises, distressed businesses, and tenders.",
    aliases: ["acquisitions", "distressed business", "franchises", "tenders", "deals"],
  },
  {
    id: "ai-automation",
    label: "AI & Automation",
    description: "Turnkey AI workers, workflow automations, and operational monitoring.",
    aliases: ["ai tools", "workflows", "agents", "automation"],
  },
  {
    id: "research-monitoring",
    label: "Research & Market Monitoring",
    description: "Competitor tracking, pricing intelligence, regulatory pulse, and market shifts.",
    aliases: ["competitors", "market tracking", "pricing", "intelligence"],
  },
  {
    id: "marketing-growth",
    label: "Marketing & Lead Growth",
    description: "Prospect intelligence, lead discovery, and customer insights.",
    aliases: ["sales", "leads", "growth", "marketing"],
  },
  {
    id: "custom-services",
    label: "Custom & Advisory Services",
    description: "Human-in-the-loop audits, custom research briefs, and specialized evaluations.",
    aliases: ["consulting", "bespoke", "human review", "advisory"],
  },
] as const;

export const AUDIENCE_TAXONOMY: readonly TaxonomyItem[] = [
  {
    id: "business-buyer",
    label: "Business Buyers & Acquirers",
    aliases: ["investor", "search fund", "buyer"],
  },
  {
    id: "founder-operator",
    label: "Founders & Operators",
    aliases: ["business owner", "founder", "executive"],
  },
  {
    id: "sales-marketing",
    label: "Sales & Marketing Teams",
    aliases: ["growth lead", "sales rep", "agency"],
  },
  {
    id: "procurement-bidders",
    label: "Bidders & Contractors",
    aliases: ["rfp response", "tender applicant"],
  },
  {
    id: "individual-consultant",
    label: "Independent Consultants",
    aliases: ["freelancer", "advisor"],
  },
] as const;

export const DELIVERY_TAXONOMY: readonly TaxonomyItem[] = [
  {
    id: "automation",
    label: "Turnkey Automation",
    description: "Runs continuously or on schedule without human intervention",
    aliases: ["automated", "bot", "script"],
  },
  {
    id: "hybrid",
    label: "AI + Human Reviewed",
    description: "AI intelligence synthesized with expert verification",
    aliases: ["reviewed", "supervised", "verified"],
  },
  {
    id: "ai",
    label: "AI Generated",
    description: "Pure AI synthesis delivered instantly or on schedule",
    aliases: ["ai only", "instant"],
  },
  {
    id: "human",
    label: "Human / Done-For-You",
    description: "Delivered by specialist consultants and researchers",
    aliases: ["manual", "consulting", "expert"],
  },
] as const;

export const CADENCE_TAXONOMY: readonly TaxonomyItem[] = [
  { id: "daily", label: "Daily", aliases: ["every day", "morning brief"] },
  { id: "weekly", label: "Weekly", aliases: ["once a week", "weekly brief"] },
  { id: "monthly", label: "Monthly", aliases: ["once a month"] },
  { id: "on_demand", label: "On Demand", aliases: ["as needed", "whenever requested"] },
  { id: "continuous", label: "Real-time / Event-driven", aliases: ["instant alert", "live"] },
  { id: "instant", label: "Instant", aliases: ["immediate"] },
] as const;

export function getGoalById(id: string): TaxonomyItem | undefined {
  return GOAL_TAXONOMY.find((item) => item.id === id);
}

export function getCategoryById(id: string): TaxonomyItem | undefined {
  return CATEGORY_TAXONOMY.find((item) => item.id === id);
}

export function getDeliveryById(id: string): TaxonomyItem | undefined {
  return DELIVERY_TAXONOMY.find((item) => item.id === id);
}

export function getCadenceById(id: string): TaxonomyItem | undefined {
  return CADENCE_TAXONOMY.find((item) => item.id === id);
}
