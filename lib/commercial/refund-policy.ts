/**
 * Canonical Refund & Guarantee Policies for The Skill Corner
 *
 * Invariant: Marketing promises and contractual terms must reflect identical commercial truth.
 *
 * Strictly separates:
 * 1. VERIFIED EXISTING POLICY: Established by active site copy and business state.
 * 2. OWNER DECISION REQUIRED: Commercial decisions requiring Tejinder's explicit authorization.
 */

import type { RefundPolicy } from "./types";

/**
 * Owner-Approved Commercial Policy Determinations (Decided 2026-09-28):
 * - OD-001 (Inquiry Response): No contractual SLA. Operational target: normally respond within one business day.
 * - OD-002 (Refund Initiation): Internal operational target: initiate approved refunds within 2 business days.
 * - OD-003 (Pass-Through Usage): Normal API/telecom usage during trial is absorbed as operating/CAC cost.
 * - OD-004 (Architecture Diagnostic Credit): Global policy non-operative now; unlaunched concepts remain inactive.
 * - OD-005 (Cancellation): Monthly subscriptions cancel anytime before next renewal (no notice). Managed SOWs governed by MSA/SOW.
 * - OD-006 (Post-Deployment): 30-day defect remediation period against agreed acceptance criteria (no new scope).
 */
export const APPROVED_COMMERCIAL_POLICIES = {
  inquiryResponseTarget:
    "We normally respond within one business day (operational target, no contractual SLA).",
  refundInitiationTarget:
    "Internal operational target: initiated within 2 business days; external settlement depends on payment provider/bank.",
  passThroughTrialUsage:
    "Normal API and telephony usage incurred during trial period is absorbed by The Skill Corner.",
  subscriptionCancellation:
    "Cancel any time before the next monthly renewal date; no advance notice period.",
  bespokeRemediationPeriod:
    "30-day defect remediation period covering defects against agreed acceptance criteria.",
} as const;

/**
 * Empty array: All prior open commercial decisions (OD-001 through OD-006) have been resolved.
 */
export const OWNER_COMMERCIAL_DECISIONS_REQUIRED: readonly {
  decisionKey: string;
  topic: string;
  currentStatus: string;
  notes: string;
}[] = [];

export const SUBSCRIPTION_30_DAY_GUARANTEE: RefundPolicy = {
  id: "policy_subscription_30d_full",
  name: "30-Day 100% Money-Back Guarantee (Software Subscriptions & Operating Systems)",
  policyStatus: "owner_approved",
  guaranteePeriodDays: 30,
  refundPercentage: 100,
  setupFeeRefundable: false,
  recurringFeeRefundable: true,
  claimMethod: "Email notification to info@theskillcorner.com",
  businessInitiationTimeline:
    "Internal operational target: initiated within 2 business days of request verification",
  externalSettlementNote:
    "Actual financial settlement and posting times to your original payment method depend on your card issuer, payment provider, and bank networks.",
  applicableSkus: [
    "sku_business_buyer_os",
    "sku_deal_hunter_pack",
    "sku_founder_growth_os",
    "sku_small_business_coo",
    "sku_ecommerce_launch",
    "sku_creator_intelligence",
    "sku_competitive_intelligence",
    "sku_personal_executive",
    "sku_lead_finder_monthly",
    "sku_competitor_watch_monthly",
    "sku_opportunity_scout_monthly",
    "sku_ontario_opportunity_monthly",
    "sku_franchise_resale_monthly",
  ],
  passThroughExpensesPolicy:
    "Normal API and telephony usage incurred during the 30-day trial period is absorbed as operating cost by The Skill Corner. Only exceptional, separately customer-authorized metered expenditures disclosed prior to expenditure may be excluded from refunds.",
  cancellationPolicy:
    "Cancel any time before the next monthly renewal date with no advance notice period.",
  summary:
    "All recurring software subscription packages, purpose-built bundles, vertical operating systems, and single intelligence briefings are backed by an unconditional 30-day money-back guarantee. If you are not satisfied within 30 days of your initial subscription start date, contact info@theskillcorner.com for a 100% refund of recurring subscription fees. Normal telephony and API trial usage is absorbed by The Skill Corner. Approved refunds are initiated internally within 2 business days; external settlement timing depends on your bank or payment provider. Subscriptions may be cancelled any time before the next billing cycle.",
  fullTermsSectionRef: "Section 07 (Money-Back Guarantee & Refund Policy)",
};

export const CUSTOM_ENGINEERING_ENGAGEMENT_POLICY: RefundPolicy = {
  id: "policy_custom_engineering_milestones",
  name: "Bespoke Engineering & Custom Systems Engagement Terms",
  policyStatus: "owner_approved",
  guaranteePeriodDays: 0,
  refundPercentage: 0,
  setupFeeRefundable: false, // Milestone-gated according to SOW
  recurringFeeRefundable: true,
  claimMethod: "Written notice pursuant to Statement of Work terms prior to milestone sign-off",
  businessInitiationTimeline: "Governed by written Statement of Work milestone acceptance gates",
  externalSettlementNote:
    "Bank wire or invoice settlement timelines vary by financial institution and agreed payment terms.",
  applicableSkus: [
    "sku_core_system_deployment",
    "sku_bespoke_practice_infrastructure",
    "sku_enterprise_transformation",
  ],
  defectRemediationPeriod:
    "Includes a 30-day defect remediation period following milestone deployment, covering defects against agreed acceptance criteria. New requirements, enhancements, or scope changes are not covered under defect remediation and require separate scoping.",
  cancellationPolicy:
    "Bespoke managed-operation contracts are governed by their individual Statement of Work (SOW) or Master Services Agreement (MSA).",
  summary:
    "Custom engineering deployments proceed under fixed-price Statements of Work with explicit milestone deliverables and acceptance sign-offs. Milestone payments compensate dedicated engineering hours and become non-refundable once deliverables are inspected and accepted in writing according to the SOW. Deployed milestones include a 30-day defect remediation period covering defects against agreed acceptance criteria (excluding new features or scope expansions). Ongoing managed-operation contracts are governed by their individual SOW/MSA.",
  fullTermsSectionRef: "Section 07 (Money-Back Guarantee & Refund Policy)",
};

export const CANONICAL_REFUND_POLICIES: readonly RefundPolicy[] = [
  SUBSCRIPTION_30_DAY_GUARANTEE,
  CUSTOM_ENGINEERING_ENGAGEMENT_POLICY,
];

export function getRefundPolicyById(id: string): RefundPolicy {
  const match = CANONICAL_REFUND_POLICIES.find((p) => p.id === id);
  if (!match) {
    return SUBSCRIPTION_30_DAY_GUARANTEE;
  }
  return match;
}
