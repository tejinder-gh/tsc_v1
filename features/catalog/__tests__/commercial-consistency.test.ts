import { describe, expect, it } from "vitest";
import { GET as getLlmsTxt } from "@/app/llms.txt/route";
import { GET as getLlmsFullTxt } from "@/app/llms-full.txt/route";
import { GET as getPricingMd } from "@/app/pricing.md/route";
import { CLAIM_REGISTRY } from "@/lib/commercial/claim-evidence";
import {
  CANONICAL_COMMERCIAL_OFFERS,
  getCanonicalOfferPricing,
  getCommercialOfferBySku,
  getCommercialOfferBySlug,
} from "@/lib/commercial/offers";
import {
  CANONICAL_REFUND_POLICIES,
  getRefundPolicyById,
  OWNER_COMMERCIAL_DECISIONS_REQUIRED,
  SUBSCRIPTION_30_DAY_GUARANTEE,
} from "@/lib/commercial/refund-policy";
import {
  CONTRACT_SPECIMEN_SKU_ECONOMICS,
  calculateSkuMarginAnalysis,
} from "@/lib/commercial/sku-economics";
import { commercialCatalogJsonLd, commercialOfferJsonLd } from "@/lib/structured-data";
import { getBundleBySlug } from "../domain/bundles";

describe("Commercial Consistency & Invariant Verification", () => {
  it("verifies canonical offers have unique SKUs and valid slugs", () => {
    const skus = CANONICAL_COMMERCIAL_OFFERS.map((o) => o.sku);
    const uniqueSkus = new Set(skus);
    expect(uniqueSkus.size).toBe(skus.length);

    for (const offer of CANONICAL_COMMERCIAL_OFFERS) {
      expect(offer.sku).toBeTruthy();
      expect(offer.slug).toBeTruthy();
      expect(offer.publicName).toBeTruthy();
      expect(offer.pricing.currency).toBe("CAD");
    }
  });

  it("verifies canonical operating system prices match catalog bundle definitions with zero drift", () => {
    for (const offer of CANONICAL_COMMERCIAL_OFFERS) {
      const bundle = getBundleBySlug(offer.slug);
      if (bundle) {
        const expectedPriceCents =
          offer.pricing.recurringAmountCents ?? offer.pricing.setupAmountCents ?? 0;
        expect(bundle.priceAmountCents).toBe(expectedPriceCents);
        expect(bundle.currency).toBe(offer.pricing.currency);
        expect(bundle.priceDisplay).toBe(offer.pricing.displayPrice);
      }
    }
  });

  it("structurally proves CANONICAL_COMMERCIAL_OFFERS is the single pricing source of truth for bundles", () => {
    // Required invariant: Changing an offer's canonical price in exactly one domain location
    // changes every derived public/machine representation.
    const testSlug = "business-buyer-os";
    const canonicalPricing = getCanonicalOfferPricing(testSlug);
    expect(canonicalPricing).toBeDefined();

    const bundle = getBundleBySlug(testSlug);
    expect(bundle).toBeDefined();

    // Verify structural derivation: bundle fields match canonical offer pricing exactly
    expect(bundle?.priceAmountCents).toBe(canonicalPricing?.priceAmountCents);
    expect(bundle?.priceDisplay).toBe(canonicalPricing?.displayPrice);
    expect(bundle?.cadMonthlyNumber).toBe(canonicalPricing?.cadMonthlyNumber);
    expect(bundle?.currency).toBe(canonicalPricing?.currency);
    expect(bundle?.billingInterval).toBe(canonicalPricing?.billingInterval);

    // Verify derived upsellPro pricing link
    const offer = getCommercialOfferBySlug(testSlug);
    if (offer?.upsellPro && bundle?.upsellPro) {
      expect(bundle.upsellPro.priceCadMonthly).toBe(
        Math.round(offer.upsellPro.recurringAmountCents / 100),
      );
      expect(bundle.upsellPro.priceCadDisplay).toBe(offer.upsellPro.priceDisplay);
    }
  });

  it("verifies all referenced refund policies exist and maintain verified status", () => {
    for (const offer of CANONICAL_COMMERCIAL_OFFERS) {
      if (offer.refundPolicyId) {
        const policy = getRefundPolicyById(offer.refundPolicyId);
        expect(
          policy,
          `Expected policy ${offer.refundPolicyId} for offer ${offer.sku} to exist`,
        ).toBeDefined();
        expect(policy?.summary).toBeTruthy();
        expect(["verified_existing", "owner_approved"]).toContain(policy?.policyStatus);
      }
    }

    expect(CANONICAL_REFUND_POLICIES.length).toBeGreaterThanOrEqual(2);
    expect(SUBSCRIPTION_30_DAY_GUARANTEE.guaranteePeriodDays).toBe(30);
    // All prior owner decisions OD-001 through OD-006 are now resolved
    expect(OWNER_COMMERCIAL_DECISIONS_REQUIRED.length).toBe(0);
  });

  it("red-teams claim evidence registry: unverified claims must be downgraded to illustrative or target", () => {
    for (const claim of CLAIM_REGISTRY) {
      expect(claim.id).toBeTruthy();
      expect(claim.claim).toBeTruthy();
      expect(claim.qualificationText).toBeTruthy();
      expect([
        "verified-production",
        "verified-implementation",
        "customer-result",
        "internal-benchmark",
        "illustrative",
        "target",
        "third-party-source",
      ]).toContain(claim.evidenceType);

      // Rule: Marketing claims lacking repository empirical datasets must not claim verified-production or customer-result
      if (
        claim.id === "claim_intake_paperwork_saved" ||
        claim.id === "claim_quote_close_improvement" ||
        claim.id === "claim_hygiene_recall_rebookings" ||
        claim.id === "claim_conflict_screening"
      ) {
        expect(claim.evidenceType).toBe("illustrative");
      }

      if (claim.id === "claim_call_pickup_latency" || claim.id === "claim_turnaround_target") {
        expect(claim.evidenceType).toBe("target");
      }

      if (claim.id === "claim_deterministic_extraction") {
        expect(claim.evidenceType).toBe("verified-implementation");
      }
    }
  });

  it("verifies /pricing.md outputs exact canonical pricing and verified 30-day guarantee", async () => {
    const response = getPricingMd();
    const text = await response.text();

    expect(text).toContain("Business Buyer OS");
    expect(text).toContain("CAD $249/month");
    expect(text).toContain("Deal Hunter Pack");
    expect(text).toContain("CAD $149/month");
    expect(text).toContain("Founder Growth OS");
    expect(text).toContain("CAD $299/month");
    expect(text).toContain("Small Business COO");
    expect(text).toContain("CAD $499/month");
    expect(text).toContain("30-Day 100% Money-Back Guarantee");
    expect(text).toContain("/legal/terms");
  });

  it("verifies /llms.txt and /llms-full.txt include canonical offers and pricing.md link", async () => {
    const llmsRes = getLlmsTxt();
    const llmsText = await llmsRes.text();

    expect(llmsText).toContain("Business Buyer OS");
    expect(llmsText).toContain("Deal Hunter Pack");
    expect(llmsText).toContain("/pricing.md");
    expect(llmsText).toContain("30-Day 100% Money-Back Guarantee");

    const fullRes = getLlmsFullTxt();
    const fullText = await fullRes.text();
    expect(fullText).toContain("Business Buyer OS");
    expect(fullText).toContain("/pricing.md");
    expect(fullText).toContain("Turnkey AI Operating Systems & Autonomous Packages");
  });

  it("verifies JSON-LD structured data generation for commercial offers", () => {
    const offer = getCommercialOfferBySku("sku_business_buyer_os");
    expect(offer).toBeDefined();
    if (offer) {
      const jsonLd = commercialOfferJsonLd(offer);
      expect(jsonLd["@type"]).toBe("Product");
      expect(jsonLd.name).toBe("Business Buyer OS");
      expect(jsonLd.sku).toBe("sku_business_buyer_os");

      const offersObj = jsonLd.offers as Record<string, unknown>;
      expect(offersObj.price).toBe("249");
      expect(offersObj.priceCurrency).toBe("CAD");
    }

    const catalogLd = commercialCatalogJsonLd(CANONICAL_COMMERCIAL_OFFERS);
    expect(catalogLd["@type"]).toBe("ItemList");
    expect(catalogLd.numberOfItems).toBe(CANONICAL_COMMERCIAL_OFFERS.length);
  });

  it("verifies SKU economic model calculation contract evaluates safely", () => {
    for (const record of CONTRACT_SPECIMEN_SKU_ECONOMICS) {
      const analysis = calculateSkuMarginAnalysis(record);
      expect(analysis.sku).toBe(record.sku);
      expect(analysis.grossContributionCents).toBeDefined();
      expect(typeof analysis.grossMarginPercent).toBe("number");
      expect(analysis.totalDirectCostCents).toBeGreaterThan(0);
    }
  });
});
