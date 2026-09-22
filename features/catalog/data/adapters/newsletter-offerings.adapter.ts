import { CANONICAL_NEWSLETTERS } from "@/features/newsletters/data/newsletters";
import type { Newsletter } from "@/features/newsletters/domain/types";
import type { NewsletterOffering, ServiceCadence } from "../../domain/types";

function mapCadence(cadence: Newsletter["cadence"]): ServiceCadence {
  switch (cadence) {
    case "daily":
      return "daily";
    case "weekly":
      return "weekly";
    case "monthly":
      return "monthly";
    default:
      return "weekly";
  }
}

export function adaptNewsletter(newsletter: Newsletter): NewsletterOffering {
  const latestIssue = newsletter.issues[newsletter.issues.length - 1];

  return {
    id: `newsletter:${newsletter.slug}`,
    slug: newsletter.slug,
    kind: "newsletter",
    title: newsletter.name,
    tagline: newsletter.tagline,
    shortDescription: newsletter.description,
    longDescription: newsletter.description,
    icon: "file-text",
    accent: "blue",

    status: newsletter.status,
    visibility: newsletter.visibility,
    commerceStatus: newsletter.subscriptionModel === "free" ? "free" : "purchasable",
    fulfillmentReadiness: "operational",
    featured: true,
    priority: 20,

    categories: ["newsletters", ...newsletter.categories],
    tags: newsletter.tags,
    goals: ["stay-informed", "market-intelligence"],
    problemsSolved: [newsletter.description],
    industries: ["all"],
    audiences: [newsletter.audience],

    deliveryModel:
      newsletter.generationMode === "ai"
        ? "ai"
        : newsletter.generationMode === "manual"
          ? "human"
          : "hybrid",
    automationLevel: newsletter.generationMode === "ai" ? "mostly_automated" : "assisted",
    setupEffort: "none",
    ongoingEffort: "none",
    timeToValue: "instant",

    pricingModel: newsletter.subscriptionModel === "free" ? "free" : "subscription",
    priceDisplay: newsletter.priceDisplay,
    billingCadence: newsletter.cadence === "daily" ? "weekly" : "monthly",

    cta: {
      label: newsletter.ctaText || "Subscribe Free",
      href: `/newsletters/${newsletter.slug}`,
      type: "subscribe",
    },
    canonicalUrl: `/newsletters/${newsletter.slug}`,

    relatedOfferingIds: [],
    source: "newsletter",
    createdAt: newsletter.lastPublishedAt || "2026-09-01T00:00:00Z",
    updatedAt: newsletter.lastPublishedAt || "2026-09-22T00:00:00Z",

    newsletterId: newsletter.id,
    generationMode: newsletter.generationMode,
    cadence: mapCadence(newsletter.cadence),
    subscriberCount: newsletter.subscriberCount,
    latestIssueTitle: latestIssue?.title,
    latestIssueDate: latestIssue?.publishedAt,
  };
}

export function getAllNewsletterOfferings(): NewsletterOffering[] {
  return CANONICAL_NEWSLETTERS.map(adaptNewsletter);
}
