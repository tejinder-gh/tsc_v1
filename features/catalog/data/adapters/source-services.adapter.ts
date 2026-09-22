import type {
  CanonicalService,
  NewsletterOffering,
  Offering,
  ServiceOffering,
} from "../../domain/types";
import { CANONICAL_SERVICES } from "../source-services";

export function adaptSourceService(service: CanonicalService): Offering {
  // If the service is tender-brief, namespace its slug and title to prevent
  // collision with the Tender Brief weekly newsletter publication.
  const isTenderSynthesisService = service.id === "tender-brief";
  const resolvedSlug = isTenderSynthesisService ? "tender-document-analysis" : service.slug;
  const resolvedTitle = isTenderSynthesisService
    ? "Tender Brief: RFP Document Synthesis"
    : service.name;

  const base = {
    id: `service:${resolvedSlug}`,
    slug: resolvedSlug,
    title: resolvedTitle,
    tagline: service.tagline,
    shortDescription: service.shortDescription,
    longDescription: service.longDescription || service.shortDescription,
    icon: service.icon,
    accent: service.accent ?? "blue",

    status: (service.commerceStatus === "unavailable"
      ? "paused"
      : service.fulfillmentReadiness === "beta"
        ? "beta"
        : "active") as "active" | "experimental" | "beta" | "paused",
    visibility: service.visibility,
    commerceStatus: service.commerceStatus,
    fulfillmentReadiness: service.fulfillmentReadiness,
    featured: service.featured,
    priority: service.priority,

    categories: [service.categoryId, service.subcategoryId].filter(Boolean) as string[],
    tags: [...service.keywords, ...service.searchAliases],
    goals: service.goalIds,
    problemsSolved: service.problemIds,
    industries: service.industryIds ?? ["all"],
    audiences: service.audienceIds,

    deliveryModel: service.deliveryType,
    automationLevel: service.automationLevel,
    setupEffort: service.setupEffort,
    ongoingEffort: service.userEffortLevel,
    timeToValue: service.cadence.replace("_", " "),

    pricingModel: (service.commerceStatus === "free"
      ? "free"
      : service.commerceStatus === "waitlist" || service.commerceStatus === "request_only"
        ? "custom"
        : "subscription") as "free" | "one_time" | "subscription" | "custom" | "included",
    priceDisplay:
      service.commerceStatus === "free"
        ? "Free"
        : service.commerceStatus === "request_only"
          ? "In the Lab"
          : service.commerceStatus === "waitlist"
            ? "Waitlist Open"
            : service.defaultPlanId
              ? "From C$49/mo"
              : "Subscription",
    billingCadence: "monthly" as const,

    relatedOfferingIds: service.relatedServiceIds.map((id) => `service:${id}`),
    source: "imported-service" as const,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };

  if (service.productType === "newsletter") {
    const newsletterOffering: NewsletterOffering = {
      ...base,
      id: `newsletter:${service.slug}`,
      kind: "newsletter",
      newsletterId: service.id,
      generationMode:
        service.deliveryType === "ai"
          ? "ai"
          : service.deliveryType === "human"
            ? "manual"
            : "hybrid",
      cadence: service.cadence,
      cta: {
        label: "Subscribe to Newsletter",
        href: `/newsletters/${service.slug}`,
        type: "subscribe",
      },
      canonicalUrl: `/newsletters/${service.slug}`,
    };
    return newsletterOffering;
  }

  const serviceOffering: ServiceOffering = {
    ...base,
    kind: "service",
    deliverables: service.deliverableSummaries,
    requiredInputs: service.requiredInputs,
    cta: {
      label:
        service.commerceStatus === "purchasable"
          ? "View Service"
          : service.commerceStatus === "waitlist"
            ? "Join Waitlist"
            : "Learn More",
      href: `/library?service=${resolvedSlug}`,
      type: "primary",
    },
    canonicalUrl: `/library?service=${resolvedSlug}`,
  };

  return serviceOffering;
}

export function getAllSourceServiceOfferings(): Offering[] {
  return CANONICAL_SERVICES.map(adaptSourceService);
}
