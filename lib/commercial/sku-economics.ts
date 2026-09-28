/**
 * SKU Economics Calculation & Instrumentation Contract for The Skill Corner
 *
 * Status: DOMAIN / CALCULATION MODEL (NOT live ingested financial data).
 *
 * Terminology Rule:
 * This is an instrumentation contract and unit-economics calculation engine.
 * It is NOT live runtime financial tracking.
 *
 * Missing Source Integrations Required for Live Tracking:
 * 1. Stripe Invoicing & Charge Webhooks (real-time gross revenue, processing fees, and chargebacks)
 * 2. OpenAI / Anthropic Commercial API Cost Metering (actual token consumption per tenant/worker)
 * 3. Twilio Usage Records API (carrier SMS transit charges, SIP trunk fees, and 10DLC registration)
 * 4. Cloud Infrastructure Billing APIs (Vercel serverless compute, Neon Postgres storage/CPU hours)
 * 5. Operator Time-Tracking Ledger (actual human review and custom onboarding minutes logged)
 */

import { getCommercialOfferBySku } from "./offers";

export interface SkuCostBreakdown {
  /** Model inference / token API expenses per account-month in cents */
  modelApiCogsCents: number;
  /** Browser automation, headless Chromium, proxy / scraping COGS in cents */
  scrapingProxyCogsCents: number;
  /** Third-party vendor APIs (e.g. Twilio transit, verification, enrichment) in cents */
  vendorApiCogsCents: number;
  /** Database, serverless compute, and storage infrastructure cost in cents */
  infrastructureCogsCents: number;
  /** Direct human onboarding labor in minutes */
  onboardingLaborMinutes: number;
  /** Recurring human review / quality assurance minutes per month */
  humanReviewMinutesPerMonth: number;
  /** Customer support minutes per month */
  supportMinutesPerMonth: number;
  /** Estimated hourly cost of technical labor in cents (for margin modeling) */
  laborCostPerHourCents?: number;
}

/**
 * SKU Economics Calculation / Instrumentation Contract.
 * Declares the schema and mathematical relationship between pricing, COGS, CAC, and LTV.
 */
export interface SkuEconomicsRecord {
  sku: string;
  publicName: string;
  tier: string;
  currency: "CAD" | "USD";
  setupPriceCents: number;
  recurringPriceCents: number;
  billingPeriod: "month" | "year" | "one-time";
  costs: SkuCostBreakdown;
  acquisition: {
    blendedCacCents?: number;
    channelCacCents?: Record<string, number>;
    targetPaybackMonths?: number;
  };
  retention: {
    projectedMonthlyChurnRate?: number;
    averageLifespanMonths?: number;
  };
}

export interface SkuMarginAnalysis {
  sku: string;
  monthlyRevenueCents: number;
  directCogsCents: number;
  laborCostCents: number;
  totalDirectCostCents: number;
  grossContributionCents: number;
  grossMarginPercent: number;
  paybackMonths?: number;
  projectedLtvCents?: number;
  ltvToCacRatio?: number;
}

export function calculateSkuMarginAnalysis(
  record: SkuEconomicsRecord,
  laborRatePerHourCents = 6000, // $60/hr default technical baseline
): SkuMarginAnalysis {
  const { recurringPriceCents, costs, acquisition, retention } = record;

  const directCogsCents =
    costs.modelApiCogsCents +
    costs.scrapingProxyCogsCents +
    costs.vendorApiCogsCents +
    costs.infrastructureCogsCents;

  const monthlyMinutes = costs.humanReviewMinutesPerMonth + costs.supportMinutesPerMonth;
  const laborCostCents = Math.round(
    (monthlyMinutes / 60) * (costs.laborCostPerHourCents || laborRatePerHourCents),
  );

  const totalDirectCostCents = directCogsCents + laborCostCents;
  const grossContributionCents = recurringPriceCents - totalDirectCostCents;
  const grossMarginPercent =
    recurringPriceCents > 0
      ? Math.round((grossContributionCents / recurringPriceCents) * 1000) / 10
      : 0;

  let paybackMonths: number | undefined;
  if (acquisition.blendedCacCents && grossContributionCents > 0) {
    paybackMonths = Math.round((acquisition.blendedCacCents / grossContributionCents) * 10) / 10;
  }

  let projectedLtvCents: number | undefined;
  let ltvToCacRatio: number | undefined;
  if (retention.averageLifespanMonths && grossContributionCents > 0) {
    projectedLtvCents = Math.round(grossContributionCents * retention.averageLifespanMonths);
    if (acquisition.blendedCacCents && acquisition.blendedCacCents > 0) {
      ltvToCacRatio = Math.round((projectedLtvCents / acquisition.blendedCacCents) * 10) / 10;
    }
  }

  return {
    sku: record.sku,
    monthlyRevenueCents: recurringPriceCents,
    directCogsCents,
    laborCostCents,
    totalDirectCostCents,
    grossContributionCents,
    grossMarginPercent,
    paybackMonths,
    projectedLtvCents,
    ltvToCacRatio,
  };
}

/**
 * Illustrative contract specimen instances for unit-test validation.
 * Prices derive from CANONICAL_COMMERCIAL_OFFERS to preserve single pricing source of truth.
 */
export const CONTRACT_SPECIMEN_SKU_ECONOMICS: readonly SkuEconomicsRecord[] = [
  {
    sku: "sku_business_buyer_os",
    publicName: "Business Buyer OS",
    tier: "vertical_os",
    currency: "CAD",
    setupPriceCents: 0,
    recurringPriceCents:
      getCommercialOfferBySku("sku_business_buyer_os")?.pricing.recurringAmountCents ?? 24900,
    billingPeriod: "month",
    costs: {
      modelApiCogsCents: 1850,
      scrapingProxyCogsCents: 1200,
      vendorApiCogsCents: 450,
      infrastructureCogsCents: 650,
      onboardingLaborMinutes: 45,
      humanReviewMinutesPerMonth: 20,
      supportMinutesPerMonth: 15,
      laborCostPerHourCents: 6000,
    },
    acquisition: {
      blendedCacCents: 35000,
      targetPaybackMonths: 2.0,
    },
    retention: {
      projectedMonthlyChurnRate: 0.05,
      averageLifespanMonths: 14,
    },
  },
  {
    sku: "sku_deal_hunter_pack",
    publicName: "Deal Hunter Pack",
    tier: "bundle",
    currency: "CAD",
    setupPriceCents: 0,
    recurringPriceCents:
      getCommercialOfferBySku("sku_deal_hunter_pack")?.pricing.recurringAmountCents ?? 14900,
    billingPeriod: "month",
    costs: {
      modelApiCogsCents: 1100,
      scrapingProxyCogsCents: 850,
      vendorApiCogsCents: 300,
      infrastructureCogsCents: 450,
      onboardingLaborMinutes: 30,
      humanReviewMinutesPerMonth: 15,
      supportMinutesPerMonth: 10,
      laborCostPerHourCents: 6000,
    },
    acquisition: {
      blendedCacCents: 22000,
      targetPaybackMonths: 2.1,
    },
    retention: {
      projectedMonthlyChurnRate: 0.06,
      averageLifespanMonths: 12,
    },
  },
  {
    sku: "sku_founder_growth_os",
    publicName: "Founder Growth OS",
    tier: "vertical_os",
    currency: "CAD",
    setupPriceCents: 0,
    recurringPriceCents:
      getCommercialOfferBySku("sku_founder_growth_os")?.pricing.recurringAmountCents ?? 29900,
    billingPeriod: "month",
    costs: {
      modelApiCogsCents: 2400,
      scrapingProxyCogsCents: 1400,
      vendorApiCogsCents: 900,
      infrastructureCogsCents: 800,
      onboardingLaborMinutes: 60,
      humanReviewMinutesPerMonth: 25,
      supportMinutesPerMonth: 20,
      laborCostPerHourCents: 6000,
    },
    acquisition: {
      blendedCacCents: 42000,
      targetPaybackMonths: 1.8,
    },
    retention: {
      projectedMonthlyChurnRate: 0.045,
      averageLifespanMonths: 16,
    },
  },
];
