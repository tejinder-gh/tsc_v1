import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { getAllNewsletters, getNewsletterBySlug } from "@/features/newsletters/data/newsletters";
import {
  generateUnsubscribeToken,
  isDeliveryEligible,
  verifyUnsubscribeToken,
} from "@/features/newsletters/domain/consent";
import {
  filterOfferings,
  getAllOfferings,
  getOfferingBySlug,
  getOfferingsByKind,
  getRecommendedOfferings,
} from "../data/registry";
import { CANONICAL_SERVICES } from "../data/source-services";
import { scoreService } from "../domain/scoring";
import { calculateSearchRank, parseNaturalLanguageQuery } from "../domain/search";

describe("Catalog Registry & Offering Integrity", () => {
  const allOfferings = getAllOfferings();

  it("registers exact offering counts by kind: 18 automations, 13 services, 3 newsletters = 34 total", () => {
    expect(allOfferings.length).toBe(34);

    const automations = getOfferingsByKind("automation");
    const services = getOfferingsByKind("service");
    const newsletters = getOfferingsByKind("newsletter");
    const resources = getOfferingsByKind("resource");
    const tools = getOfferingsByKind("tool");

    expect(automations.length).toBe(18);
    expect(services.length).toBe(13);
    expect(newsletters.length).toBe(3);
    expect(resources.length).toBe(0);
    expect(tools.length).toBe(0);
  });

  it("ensures all offering IDs are strictly unique", () => {
    const idSet = new Set<string>();
    for (const offering of allOfferings) {
      expect(idSet.has(offering.id)).toBe(false);
      idSet.add(offering.id);
    }
  });

  it("ensures canonical URLs are non-empty and strictly unique across all offerings", () => {
    const urlSet = new Set<string>();
    for (const offering of allOfferings) {
      expect(offering.canonicalUrl).toBeTruthy();
      expect(urlSet.has(offering.canonicalUrl)).toBe(false);
      urlSet.add(offering.canonicalUrl);
    }
  });

  it("preserves global identity invariants for cross-kind same-slug entities (tender-brief)", () => {
    // Newsletter: Tender Brief
    const tenderNewsletter = getOfferingBySlug("tender-brief");
    expect(tenderNewsletter).toBeDefined();
    expect(tenderNewsletter?.id).toBe("newsletter:tender-brief");
    expect(tenderNewsletter?.kind).toBe("newsletter");
    expect(tenderNewsletter?.canonicalUrl).toBe("/newsletters/tender-brief");

    // Service: Tender Document Analysis (on-demand RFP document synthesis)
    const tenderService = getOfferingBySlug("tender-document-analysis");
    expect(tenderService).toBeDefined();
    expect(tenderService?.id).toBe("service:tender-document-analysis");
    expect(tenderService?.kind).toBe("service");
    expect(tenderService?.canonicalUrl).toBe("/library?service=tender-document-analysis");

    // Both coexist with distinct IDs, distinct slugs, and distinct canonical URLs
    expect(tenderNewsletter?.id).not.toBe(tenderService?.id);
    expect(tenderNewsletter?.slug).not.toBe(tenderService?.slug);
    expect(tenderNewsletter?.canonicalUrl).not.toBe(tenderService?.canonicalUrl);
  });

  it("ensures all offering slugs are non-empty and unique", () => {
    const slugSet = new Set<string>();
    for (const offering of allOfferings) {
      expect(offering.slug).toBeTruthy();
      expect(slugSet.has(offering.slug)).toBe(false);
      slugSet.add(offering.slug);
    }
  });

  it("validates that all offerings adhere to allowed OfferingKinds", () => {
    const validKinds = new Set(["service", "automation", "newsletter", "resource", "tool"]);
    for (const offering of allOfferings) {
      expect(validKinds.has(offering.kind)).toBe(true);
      expect(offering.canonicalUrl).toMatch(
        /^\/(what-we-automate|digital-services|newsletters|library)/,
      );
    }
  });

  it("faithfully adapts all 18 existing automation services without modifying existing canonical URLs", () => {
    const automations = getOfferingsByKind("automation");
    expect(automations.length).toBe(18);

    const receptionist = getOfferingBySlug("ai-receptionist");
    expect(receptionist).toBeDefined();
    expect(receptionist?.kind).toBe("automation");
    expect(receptionist?.canonicalUrl).toBe("/what-we-automate/ai-receptionist");
    expect(receptionist?.deliveryModel).toBe("automation");
  });

  it("faithfully adapts all 7 existing digital services without modifying existing canonical URLs", () => {
    const digitalServices = getOfferingsByKind("service").filter(
      (s) => s.source === "skill-corner-digital",
    );
    expect(digitalServices.length).toBe(7);

    const aiAgentDev = getOfferingBySlug("ai-agent-development");
    expect(aiAgentDev).toBeDefined();
    expect(aiAgentDev?.kind).toBe("service");
    expect(aiAgentDev?.canonicalUrl).toBe("/digital-services/ai-agent-development");
  });

  it("imports and adapts source intelligence services and newsletters", () => {
    const leadFinder = getOfferingBySlug("lead-finder");
    expect(leadFinder).toBeDefined();
    expect(leadFinder?.title).toBe("Lead Finder");
    expect(leadFinder?.deliveryModel).toBe("hybrid");

    const founderBriefing = getOfferingBySlug("tech-founder-briefing");
    expect(founderBriefing).toBeDefined();
    expect(founderBriefing?.kind).toBe("newsletter");
    expect(founderBriefing?.canonicalUrl).toBe("/newsletters/tech-founder-briefing");
  });
});

describe("Deterministic Filtering & Query Engine", () => {
  it("filters offerings accurately by kind", () => {
    const automations = filterOfferings({ kind: "automation" });
    expect(automations.every((o) => o.kind === "automation")).toBe(true);

    const newsletters = filterOfferings({ kind: "newsletter" });
    expect(newsletters.every((o) => o.kind === "newsletter")).toBe(true);
    expect(newsletters.length).toBeGreaterThanOrEqual(3);
  });

  it("filters offerings accurately by delivery model", () => {
    const fullyAutomated = filterOfferings({ deliveryModel: "automation" });
    expect(fullyAutomated.every((o) => o.deliveryModel === "automation")).toBe(true);

    const hybrid = filterOfferings({ deliveryModel: "hybrid" });
    expect(hybrid.every((o) => o.deliveryModel === "hybrid")).toBe(true);
  });

  it("supports combined multi-dimensional filtering", () => {
    const filtered = filterOfferings({
      kind: "automation",
      deliveryModel: "automation",
    });
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((o) => o.kind === "automation" && o.deliveryModel === "automation")).toBe(
      true,
    );
  });
});

describe("Deterministic Scoring & Recommendation Ranking", () => {
  it("produces explainable recommendation scores and reasons", () => {
    const recommendations = getRecommendedOfferings({
      goalId: "grow-revenue",
      limit: 5,
    });

    expect(recommendations.length).toBe(5);
    // Scores must be sorted descending
    for (let i = 0; i < recommendations.length - 1; i++) {
      expect(recommendations[i].score).toBeGreaterThanOrEqual(recommendations[i + 1].score);
    }

    // Top results should have recommendation reasons
    expect(recommendations[0].reasonText).toBeTruthy();
  });

  it("scores exact intent matches at highest priority", () => {
    const leadFinder = CANONICAL_SERVICES.find((s) => s.id === "lead-finder");
    expect(leadFinder).toBeDefined();
    if (!leadFinder) return;

    const result = scoreService(leadFinder, {
      intentId: "find customers",
      goalId: "grow-revenue",
    });

    expect(result.score).toBeGreaterThan(0.6);
    const intentReason = result.reasonCodes.find((r) => r.dimension === "intent");
    expect(intentReason?.code).toBe("INTENT_EXACT");
  });
});

describe("Natural Language Query & Search Ranking", () => {
  it("parses conversational user queries into structured discovery parameters", () => {
    const parsed = parseNaturalLanguageQuery(
      "I need an automation in Ontario for deals and acquisitions",
    );
    expect(parsed.goalId).toBe("find-opportunities");
    expect(parsed.hardLocation).toBe("Ontario");
    expect(parsed.preferredDeliveryType).toBe("automation");
  });

  it("prioritizes exact intent over broad keyword matching in search ranking", () => {
    const leadFinder = CANONICAL_SERVICES.find((s) => s.id === "lead-finder");
    const competitorWatch = CANONICAL_SERVICES.find((s) => s.id === "competitor-watch");
    expect(leadFinder).toBeDefined();
    expect(competitorWatch).toBeDefined();
    if (!leadFinder || !competitorWatch) return;

    // Exact intent
    const rankIntent = calculateSearchRank(leadFinder, "find customers");
    expect(rankIntent).toBe(100);

    // Name match
    const rankName = calculateSearchRank(competitorWatch, "competitor");
    expect(rankName).toBe(80);

    // Keyword match
    const rankKeyword = calculateSearchRank(leadFinder, "growth");
    expect(rankKeyword).toBe(20);
  });
});

describe("Newsletter Domain Integrity", () => {
  const newsletters = getAllNewsletters();

  it("contains valid canonical newsletter definitions", () => {
    expect(newsletters.length).toBeGreaterThanOrEqual(3);

    for (const n of newsletters) {
      expect(n.id).toBeTruthy();
      expect(n.slug).toBeTruthy();
      expect(n.name).toBeTruthy();
      expect(["ai", "manual", "hybrid"]).toContain(n.generationMode);
      expect(["daily", "weekly", "biweekly", "monthly", "on_demand"]).toContain(n.cadence);
      expect(n.issues.length).toBeGreaterThanOrEqual(1);

      // Verify each issue
      for (const issue of n.issues) {
        expect(issue.newsletterSlug).toBe(n.slug);
        expect(issue.title).toBeTruthy();
        expect(issue.keyTakeaways.length).toBeGreaterThanOrEqual(1);
        expect(issue.contentMarkdown.length).toBeGreaterThan(50);
      }
    }
  });

  it("resolves newsletters and issues by slug", () => {
    const tfb = getNewsletterBySlug("tech-founder-briefing");
    expect(tfb).toBeDefined();
    expect(tfb?.name).toBe("Tech Founder Briefing");
    expect(tfb?.issues.length).toBeGreaterThanOrEqual(2);
  });

  it("generates and verifies opaque HMAC-SHA256 signed unsubscribe tokens", () => {
    const secret = "test-secret-key-32-chars-minimum-!";
    const email = "user@example.com";
    const slug = "tech-founder-briefing";

    const token = generateUnsubscribeToken(email, slug, secret);
    expect(token).toContain(".");

    // Valid verification
    const verified = verifyUnsubscribeToken(token, secret);
    expect(verified.valid).toBe(true);
    if (verified.valid) {
      expect(verified.payload.email).toBe(email);
      expect(verified.payload.newsletterSlug).toBe(slug);
    }

    // Tampered token rejection
    const tamperedToken = `${token.slice(0, -4)}abcd`;
    const tamperedResult = verifyUnsubscribeToken(tamperedToken, secret);
    expect(tamperedResult.valid).toBe(false);

    // Wrong secret rejection
    const wrongSecretResult = verifyUnsubscribeToken(token, "different-secret-key");
    expect(wrongSecretResult.valid).toBe(false);
  });

  it("enforces delivery eligibility rules", () => {
    expect(
      isDeliveryEligible({
        id: "sub-1",
        email: "active@example.com",
        newsletterSlug: "tech-founder-briefing",
        status: "active",
        subscribedAt: new Date().toISOString(),
        source: "web",
        consentVersion: "1.0",
        consentContext: "form",
      }),
    ).toBe(true);

    expect(
      isDeliveryEligible({
        id: "sub-2",
        email: "unsub@example.com",
        newsletterSlug: "tech-founder-briefing",
        status: "unsubscribed",
        subscribedAt: new Date().toISOString(),
        unsubscribedAt: new Date().toISOString(),
        source: "web",
        consentVersion: "1.0",
        consentContext: "form",
      }),
    ).toBe(false);

    expect(
      isDeliveryEligible({
        id: "sub-3",
        email: "suppressed@example.com",
        newsletterSlug: "tech-founder-briefing",
        status: "suppressed",
        subscribedAt: new Date().toISOString(),
        source: "web",
        consentVersion: "1.0",
        consentContext: "form",
        suppressedReason: "spam_complaint",
      }),
    ).toBe(false);
  });

  it("excludes draft and sample issues from sitemap indexation", () => {
    const sitemapEntries = sitemap();
    const urls = sitemapEntries.map((e) => e.url);

    // Must include the 3 publication landing pages
    expect(urls).toContain("https://www.theskillcorner.com/newsletters/tech-founder-briefing");
    expect(urls).toContain(
      "https://www.theskillcorner.com/newsletters/ontario-opportunity-monitor",
    );
    expect(urls).toContain("https://www.theskillcorner.com/newsletters/tender-brief");

    // Must NOT index individual issue slugs in the main sitemap
    for (const url of urls) {
      expect(url).not.toMatch(/\/newsletters\/.*\/.*\//);
      expect(url).not.toContain("production-agent-harnesses-q3");
      expect(url).not.toContain("database-native-iam-agents");
    }
  });

  it("assigns valid lastModified timestamps to all sitemap entries", () => {
    const sitemapEntries = sitemap();
    expect(sitemapEntries.length).toBeGreaterThan(0);
    for (const entry of sitemapEntries) {
      expect(entry.lastModified).toBeDefined();
      expect(entry.lastModified instanceof Date || typeof entry.lastModified === "string").toBe(
        true,
      );
    }
  });
});
