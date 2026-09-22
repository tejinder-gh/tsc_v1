export type BillingModel = "free" | "one_time" | "subscription" | "usage_based" | "custom";

export type ServicePlan = {
  id: string; // e.g. "plan_lead_finder_monthly"
  serviceId: string; // Linked canonical service ID
  version: string; // e.g. "1.0.0"
  name: string; // Plan name, e.g. "Standard Monthly"
  description?: string;
  billingModel: BillingModel;
  priceAmountCents: number; // Price in minor currency units (cents)
  currency: string; // ISO 4217, e.g. "CAD"
  billingInterval?: "week" | "month" | "year" | "one_time";
  stripePriceEnvKey?: string; // Environment key resolving Stripe Price ID
  limits?: Record<string, number>;
  features: string[];
  recommended?: boolean;
  active: boolean;
};

export const PLANS: readonly ServicePlan[] = [
  {
    id: "plan_lead_finder_monthly",
    serviceId: "lead-finder",
    version: "1.0.0",
    name: "Monthly Subscription",
    description: "Weekly shortlist of businesses matching your ideal customer profile.",
    billingModel: "subscription",
    priceAmountCents: 9900,
    currency: "CAD",
    billingInterval: "month",
    stripePriceEnvKey: "STRIPE_PRICE_LEAD_FINDER",
    features: [
      "Weekly shortlist of relevant businesses",
      "Source links and verified fit rationale",
      "Public business contact details",
      "Human-reviewed before inbox delivery",
    ],
    recommended: true,
    active: true,
  },
  {
    id: "plan_competitor_watch_monthly",
    serviceId: "competitor-watch",
    version: "1.0.0",
    name: "Monthly Subscription",
    description: "Concise brief of competitor pricing, offer, and messaging changes.",
    billingModel: "subscription",
    priceAmountCents: 4900,
    currency: "CAD",
    billingInterval: "month",
    stripePriceEnvKey: "STRIPE_PRICE_COMPETITOR_WATCH",
    features: [
      "Weekly competitor pulse brief",
      "Public pricing and messaging changes",
      "Dated source links and context",
      "Clear no-change updates when quiet",
    ],
    recommended: true,
    active: true,
  },
  {
    id: "plan_opportunity_scout_monthly",
    serviceId: "opportunity-scout",
    version: "1.0.0",
    name: "Monthly Subscription",
    description: "Curated brief of public business opportunities matched to your capabilities.",
    billingModel: "subscription",
    priceAmountCents: 9900,
    currency: "CAD",
    billingInterval: "month",
    stripePriceEnvKey: "STRIPE_PRICE_OPPORTUNITY_SCOUT",
    features: [
      "Weekly shortlist matched to your brief",
      "Original source links and deadlines",
      "Fit notes, eligibility and known gaps",
      "Actionable next-step assessment",
    ],
    recommended: true,
    active: true,
  },
  {
    id: "plan_tender_brief_lab",
    serviceId: "tender-brief",
    version: "1.0.0",
    name: "Experimental Research Access",
    description: "In-lab exploration for turning tender documents into concise requirement briefs.",
    billingModel: "free",
    priceAmountCents: 0,
    currency: "CAD",
    billingInterval: "month",
    features: [
      "Proposed requirements and deadline summary",
      "Proposed eligibility and document checklist",
      "Direct link back to original tender",
    ],
    recommended: false,
    active: true,
  },
  // Plans for fixtures/demo offerings
  {
    id: "plan_ontario_opportunity_monthly",
    serviceId: "ontario-opportunity-monitor",
    version: "1.0.0",
    name: "Daily Opportunity Feed",
    description: "Daily automated brief of Ontario business & distressed opportunities.",
    billingModel: "subscription",
    priceAmountCents: 2900,
    currency: "CAD",
    billingInterval: "month",
    features: [
      "Daily opportunity radar",
      "Cross-source auction & liquidation tracking",
      "Estimated acquisition multiples",
      "Ontario-wide coverage",
    ],
    recommended: true,
    active: true,
  },
  {
    id: "plan_franchise_resale_monthly",
    serviceId: "franchise-resale-radar",
    version: "1.0.0",
    name: "Weekly Resale Digest",
    description: "Track franchise resales and territory availability.",
    billingModel: "subscription",
    priceAmountCents: 4900,
    currency: "CAD",
    billingInterval: "month",
    features: [
      "Weekly territory release updates",
      "Historical unit cash-flow indicators",
      "Franchisor requirement summaries",
    ],
    recommended: true,
    active: true,
  },
  {
    id: "plan_ai_workflow_audit_fixed",
    serviceId: "ai-workflow-audit",
    version: "1.0.0",
    name: "One-Time Architecture Review",
    description: "Expert human audit of your recurring business processes for AI automation.",
    billingModel: "one_time",
    priceAmountCents: 49900,
    currency: "CAD",
    billingInterval: "one_time",
    features: [
      "Comprehensive process evaluation",
      "AI feasibility scorecard",
      "Architecture diagram & tool recommendations",
      "60-minute executive walk-through",
    ],
    recommended: true,
    active: true,
  },
  {
    id: "plan_tech_founder_briefing_free",
    serviceId: "tech-founder-briefing",
    version: "1.0.0",
    name: "Free Weekly Issue",
    description: "Weekly AI intelligence digest for technical founders and operators.",
    billingModel: "free",
    priceAmountCents: 0,
    currency: "CAD",
    billingInterval: "week",
    features: [
      "Curated model releases and benchmarks",
      "Commercial agent use cases",
      "Zero promotional spam",
    ],
    recommended: true,
    active: true,
  },
] as const;

export function getPlansByService(serviceId: string): ServicePlan[] {
  return PLANS.filter((plan) => plan.serviceId === serviceId && plan.active);
}

export function getDefaultPlan(serviceId: string): ServicePlan | undefined {
  const plans = getPlansByService(serviceId);
  return plans.find((p) => p.recommended) || plans[0];
}

export function getPlanById(id: string): ServicePlan | undefined {
  return PLANS.find((plan) => plan.id === id);
}
