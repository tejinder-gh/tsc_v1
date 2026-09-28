/**
 * Canonical Commercial Domain Types for The Skill Corner
 *
 * Implements the unified commercial model across public offerings, machine-readable
 * surfaces, AI crawlers, contracts, and telemetry.
 *
 * Invariant: One commercial fact has one canonical source.
 */

export type OfferCategory = "automation-system" | "intelligence" | "custom-engineering";

export type CommercialTierLevel =
  | "single"
  | "bundle"
  | "vertical_os"
  | "business_os"
  | "complete_stack"
  | "custom";

export type OfferAvailability = "public" | "private" | "waitlist" | "custom";

export type BillingPeriod = "month" | "year" | "one-time";

export interface CommercialPricing {
  currency: "CAD" | "USD";
  setupAmountCents?: number;
  recurringAmountCents?: number;
  billingPeriod?: BillingPeriod;
  startingAt?: boolean;
  displayPrice: string;
  setupDisplay?: string;
  includedUsage?: string[];
  overages?: string[];
}

export interface CommercialDeliverable {
  title: string;
  cadence: string;
  format: string;
  description: string;
  sampleSpecimenSnippet?: string;
}

export interface CommercialRoleWorker {
  roleTitle: string;
  automationName: string;
  description: string;
  capabilities: readonly string[];
}

export interface CommercialOffer {
  sku: string;
  slug: string;
  publicName: string;
  tagline: string;
  description: string;
  category: OfferCategory;
  tier: CommercialTierLevel;
  tierLabel: string;
  pricing: CommercialPricing;
  commitment?: string;
  refundPolicyId: string;
  targetSegments: string[];
  availability: OfferAvailability;
  effectiveFrom: string;
  deliverable: CommercialDeliverable;
  workers: readonly CommercialRoleWorker[];
  serviceIds: readonly string[];
  claimEvidenceIds?: readonly string[];
  bestPairedWith?: {
    pairWith: string;
    pairWithSlug?: string;
    rationale: string;
  };
  upsellPro?: {
    name: string;
    priceDisplay: string;
    recurringAmountCents: number;
    summary: string;
  };
}

export type ClaimEvidenceType =
  | "verified-production"
  | "verified-implementation"
  | "customer-result"
  | "internal-benchmark"
  | "illustrative"
  | "target"
  | "third-party-source";

export interface ClaimEvidence {
  id: string;
  claim: string;
  evidenceType: ClaimEvidenceType;
  qualificationText: string;
  measuredAt?: string;
  sampleSize?: number;
  source?: string;
  limitations?: string;
  expiresAt?: string;
}

export type PolicyStatus = "verified_existing" | "owner_approved" | "owner_decision_required";

export interface RefundPolicy {
  id: string;
  name: string;
  policyStatus: PolicyStatus;
  guaranteePeriodDays: number;
  refundPercentage: number;
  setupFeeRefundable: boolean;
  recurringFeeRefundable: boolean;
  claimMethod: string;
  businessInitiationTimeline: string;
  externalSettlementNote: string;
  applicableSkus: readonly string[];
  summary: string;
  fullTermsSectionRef: string;
  passThroughExpensesPolicy?: string;
  cancellationPolicy?: string;
  defectRemediationPeriod?: string;
  openCommercialDecisions?: readonly string[];
}
