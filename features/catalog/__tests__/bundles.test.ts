import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import {
  COMMERCIAL_TIERS,
  getAllBundles,
  getBundleById,
  getBundleBySlug,
  getHeadlineBundles,
  getPairingRules,
  getPairingsFor,
  getSingleBriefings,
  getTopTierStacks,
  getVerticalOsBundles,
  PAIRING_MATRIX,
  SINGLE_BRIEFINGS,
} from "../domain/bundles";
import { getPublicEndpointsRegistry } from "@/lib/catalogue/public-routes";

describe("Commercial Hierarchy & Briefings Catalog Domain Integrity", () => {
  const allBundles = getAllBundles();

  it("verifies the 6 commercial architecture tiers exist with valid CAD ranges", () => {
    expect(COMMERCIAL_TIERS.length).toBe(6);
    const tierKeys = COMMERCIAL_TIERS.map((t) => t.tier);
    expect(tierKeys).toEqual([
      "single",
      "bundle",
      "vertical_os",
      "business_os",
      "complete_stack",
      "custom",
    ]);

    for (const tier of COMMERCIAL_TIERS) {
      expect(tier.name).toBeTruthy();
      expect(tier.indicativeCadRange).toContain("CAD");
      expect(tier.description).toBeTruthy();
    }
  });

  it("registers exactly 20 canonical bundles and operating systems", () => {
    expect(allBundles.length).toBe(20);
  });

  it("identifies exactly 8 headline launch packages with valid pricing and roles", () => {
    const headline = getHeadlineBundles();
    expect(headline.length).toBe(8);

    const headlineSlugs = headline.map((b) => b.slug);
    expect(headlineSlugs).toEqual([
      "deal-hunter",
      "business-buyer-os",
      "ecommerce-intelligence",
      "founder-growth-os",
      "competitive-intelligence",
      "creator-intelligence",
      "personal-executive-os",
      "small-business-coo",
    ]);

    // Check pricing anchors for headline packs
    const dealHunter = getBundleBySlug("deal-hunter");
    expect(dealHunter?.cadMonthlyNumber).toBe(149);
    expect(dealHunter?.upsellPro?.priceCadMonthly).toBe(249);

    const bizBuyer = getBundleBySlug("business-buyer-os");
    expect(bizBuyer?.cadMonthlyNumber).toBe(249);
    expect(bizBuyer?.upsellPro?.priceCadMonthly).toBe(399);

    const smbCoo = getBundleBySlug("small-business-coo");
    expect(smbCoo?.cadMonthlyNumber).toBe(499);
  });

  it("ensures all 20 bundles adhere to strict schema invariants", () => {
    const slugSet = new Set<string>();
    const idSet = new Set<string>();

    for (const bundle of allBundles) {
      // Slugs and IDs must be non-empty and globally unique
      expect(bundle.id).toBeTruthy();
      expect(idSet.has(bundle.id)).toBe(false);
      idSet.add(bundle.id);

      expect(bundle.slug).toBeTruthy();
      expect(slugSet.has(bundle.slug)).toBe(false);
      slugSet.add(bundle.slug);

      // Financials
      expect(bundle.priceAmountCents).toBeGreaterThan(0);
      expect(bundle.priceDisplay).toContain("CAD");
      expect(bundle.currency).toBe("CAD");

      // AI Workers framed as human roles
      expect(bundle.roles.length).toBeGreaterThanOrEqual(3);
      for (const role of bundle.roles) {
        expect(role.roleTitle).toBeTruthy();
        expect(role.automationName).toBeTruthy();
        expect(role.description).toBeTruthy();
        expect(role.capabilities.length).toBeGreaterThan(0);
      }

      // Unified customer deliverable
      expect(bundle.deliverable.title).toBeTruthy();
      expect(bundle.deliverable.cadence).toBeTruthy();
      expect(bundle.deliverable.description).toBeTruthy();

      // Expansion pairing declaration
      expect(bundle.bestPairedWith.pairWith).toBeTruthy();
      expect(bundle.bestPairedWith.rationale).toBeTruthy();

      // Audience and outcomes
      expect(bundle.targetAudience.length).toBeGreaterThan(0);
      expect(bundle.outcomes.length).toBeGreaterThan(0);
    }
  });

  it("verifies the top-tier enterprise operating stacks (Entrepreneur, Executive, Automation Office, Custom)", () => {
    const topTier = getTopTierStacks();
    expect(topTier.length).toBe(4);

    const topTierSlugs = topTier.map((t) => t.slug);
    expect(topTierSlugs).toContain("entrepreneur-os");
    expect(topTierSlugs).toContain("executive-os");
    expect(topTierSlugs).toContain("automation-office");
    expect(topTierSlugs).toContain("custom-managed");

    const entrepreneur = getBundleBySlug("entrepreneur-os");
    expect(entrepreneur?.cadMonthlyNumber).toBe(999);

    const executive = getBundleBySlug("executive-os");
    expect(executive?.cadMonthlyNumber).toBe(1499);
  });

  it("verifies the vertical OS tier packages", () => {
    const verticalOs = getVerticalOsBundles();
    expect(verticalOs.length).toBe(7);

    const slugs = verticalOs.map((v) => v.slug);
    expect(slugs).toContain("business-buyer-os");
    expect(slugs).toContain("founder-growth-os");
    expect(slugs).toContain("small-business-coo");
    expect(slugs).toContain("reseller-os");
    expect(slugs).toContain("revenue-os");
    expect(slugs).toContain("business-launch-os");
    expect(slugs).toContain("franchise-buyer-os");
  });

  it("registers exactly 20 canonical 'Better Paired With' rules", () => {
    expect(PAIRING_MATRIX.length).toBe(20);
    expect(getPairingRules().length).toBe(20);

    const validCategories = new Set([
      "deals",
      "commerce",
      "growth",
      "operations",
      "engineering",
      "executive",
    ]);

    for (const rule of PAIRING_MATRIX) {
      expect(rule.id).toBeTruthy();
      expect(rule.ifBuying).toBeTruthy();
      expect(rule.pairWith).toBeTruthy();
      expect(rule.because).toBeTruthy();
      expect(rule.strategicValue).toBeTruthy();
      expect(validCategories.has(rule.category)).toBe(true);
    }
  });

  it("supports contextual search across pairing rules", () => {
    const dealPairs = getPairingsFor("Auction");
    expect(dealPairs.length).toBeGreaterThanOrEqual(2);

    const crmPairs = getPairingsFor("CRM");
    expect(crmPairs.length).toBeGreaterThanOrEqual(2);

    const nonexistent = getPairingsFor("nonexistent_random_token_99");
    expect(nonexistent.length).toBe(0);
  });

  it("registers single subscribable briefings ($29–$149/mo)", () => {
    const single = getSingleBriefings();
    expect(single.length).toBe(6);
    expect(SINGLE_BRIEFINGS.length).toBe(6);

    for (const item of single) {
      expect(item.id).toBeTruthy();
      expect(item.slug).toBeTruthy();
      expect(item.priceCadMonthly).toBeGreaterThan(0);
      expect(item.priceDisplay).toContain("CAD");
      expect(item.deliverable).toBeTruthy();
      expect(item.bestPairedWith).toBeTruthy();
    }
  });

  it("looks up bundles by ID and slug accurately", () => {
    const bySlug = getBundleBySlug("deal-hunter");
    expect(bySlug).toBeDefined();
    expect(bySlug?.id).toBe("deal-hunter-pack");

    const byId = getBundleById("business-buyer-os");
    expect(byId).toBeDefined();
    expect(byId?.slug).toBe("business-buyer-os");

    expect(getBundleBySlug("non-existent-slug")).toBeUndefined();
    expect(getBundleById("non-existent-id")).toBeUndefined();
  });

  it("ensures /briefings is registered in the public route registry and sitemap", () => {
    const publicEndpoints = getPublicEndpointsRegistry();
    const briefingsEndpoint = publicEndpoints.find((ep) => ep.path === "/briefings");
    expect(briefingsEndpoint).toBeDefined();
    expect(briefingsEndpoint?.type).toBe("page");
    expect(briefingsEndpoint?.access).toBe("public");
    expect(briefingsEndpoint?.category).toBe("Executive Briefings Hub");

    const sitemapEntries = sitemap();
    const sitemapUrls = sitemapEntries.map((e) => e.url);
    expect(sitemapUrls).toContain("https://www.theskillcorner.com/briefings");
  });

  it("verifies GET /pricing.md outputs markdown containing the commercial hierarchy and pairings", async () => {
    const { GET } = await import("@/app/pricing.md/route");
    const response = GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/plain");

    const body = await response.text();
    expect(body).toContain("Pricing & Commercial Architecture");
    expect(body).toContain("Commercial Hierarchy: **Single Automation");
    expect(body).toContain("Headline Launch Packages");
    expect(body).toContain("Deal Hunter Pack — CAD $149/month");
    expect(body).toContain("Business Buyer OS — CAD $249/month");
    expect(body).toContain("Small Business COO Pack — CAD $499/month");
    expect(body).toContain("Entrepreneur OS — CAD $999/month");
    expect(body).toContain("Executive OS — CAD $1,499/month");
    expect(body).toContain("Better Paired With");
    expect(body).toContain("Money-Back Guarantee");
  });

  it("verifies Header primary navigation and CommandPalette index include Put AI to Work", async () => {
    const fs = await import("fs");
    const path = await import("path");

    const headerContent = fs.readFileSync(
      path.resolve(process.cwd(), "components/Header.tsx"),
      "utf-8"
    );
    expect(headerContent).toContain('{ label: "Put AI to Work", href: "/#put-ai-to-work" }');
    expect(headerContent).toContain("handleNavClick");
    expect(headerContent).toContain("handleMobileNavClick");

    const commandContent = fs.readFileSync(
      path.resolve(process.cwd(), "components/command/CommandPalette.tsx"),
      "utf-8"
    );
    expect(commandContent).toContain('"act-put-ai-to-work"');
    expect(commandContent).toContain('"pub-briefings-catalog"');
  });
});


