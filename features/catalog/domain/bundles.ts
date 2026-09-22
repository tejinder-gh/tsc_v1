import type { CommerceStatus } from "./types";

export type ServiceBundle = {
  id: string; // Stable bundle ID
  slug: string; // URL slug
  version: string;
  name: string;
  tagline: string;
  description: string;
  serviceIds: string[]; // Included service IDs
  planIds: string[]; // Specific plan IDs included
  priceAmountCents: number; // Bundle price in cents
  originalPriceAmountCents: number; // Cumulative standalone price in cents
  savingsPercentage: number;
  currency: string;
  billingInterval: "month" | "year" | "one_time";
  stripePriceEnvKey?: string;
  commerceStatus: CommerceStatus;
  isFixture: boolean;
  outcomes: string[];
  targetAudience: string[];
  featured?: boolean;
};

export const BUNDLES: readonly ServiceBundle[] = [
  {
    id: "business-buyer-toolkit",
    slug: "business-buyer-toolkit",
    version: "1.0.0",
    name: "Business Buyer Intelligence Toolkit",
    tagline: "End-to-end deal sourcing and opportunity intelligence for active acquirers.",
    description:
      "Combine daily Ontario opportunity tracking, franchise resale signals, and capability-matched opportunity scouting in one coordinated bundle.",
    serviceIds: ["opportunity-scout", "ontario-opportunity-monitor", "franchise-resale-radar"],
    planIds: [
      "plan_opportunity_scout_monthly",
      "plan_ontario_opportunity_monthly",
      "plan_franchise_resale_monthly",
    ],
    priceAmountCents: 14900,
    originalPriceAmountCents: 17700,
    savingsPercentage: 16,
    currency: "CAD",
    billingInterval: "month",
    stripePriceEnvKey: "STRIPE_PRICE_BUSINESS_BUYER_TOOLKIT",
    commerceStatus: "waitlist", // Only activatable when bundle Stripe Price and fulfilment are verified
    isFixture: true,
    outcomes: [
      "Access all three opportunity discovery streams in one place",
      "Prioritize acquisitions matching specific criteria",
      "Bundle pricing savings of over 15%",
    ],
    targetAudience: [
      "Search funds and acquisition entrepreneurs",
      "Independent business buyers",
      "Private investors seeking Ontario assets",
    ],
    featured: true,
  },
] as const;

export function getBundleBySlug(slug: string): ServiceBundle | undefined {
  return BUNDLES.find((b) => b.slug === slug);
}

export function getBundleById(id: string): ServiceBundle | undefined {
  return BUNDLES.find((b) => b.id === id);
}
