import { type DigitalService, digitalServices } from "@/content/digital-services";
import type { ServiceOffering } from "../../domain/types";

export function adaptDigitalService(service: DigitalService): ServiceOffering {
  const isHighPriority = [
    "ai-agent-development",
    "website-development",
    "digital-marketing",
  ].includes(service.slug);

  return {
    id: `service:${service.slug}`,
    slug: service.slug,
    kind: "service",
    title: service.name,
    tagline: service.tagline,
    shortDescription: service.metaDescription,
    longDescription: service.description,
    icon: "code",
    accent: "navy",

    status: "active",
    visibility: "public",
    commerceStatus: "request_only",
    fulfillmentReadiness: "operational",
    featured: isHighPriority,
    priority: isHighPriority ? 15 : 0,

    categories: ["digital-services", "engineering", "consulting"],
    tags: [...service.bullets.slice(0, 5), "software", "development", "enterprise"],
    goals: ["grow-revenue", "automate-operations", "elevate-brand"],
    problemsSolved: [service.description],
    industries: ["all"],
    audiences: service.whoItIsFor,

    deliveryModel: "hybrid",
    automationLevel: "assisted",
    setupEffort: "medium",
    ongoingEffort: "low",
    timeToValue: "2 to 4 weeks",

    pricingModel: "custom",
    priceDisplay: "Scoped Engagement",
    billingCadence: "one_time",

    cta: {
      label: "Explore Digital Service",
      href: `/digital-services/${service.slug}`,
      type: "primary",
    },
    canonicalUrl: `/digital-services/${service.slug}`,

    relatedOfferingIds: [],
    source: "skill-corner-digital",
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-09-22T00:00:00Z",

    deliverables: service.deliverables,
    features: service.features,
    process: service.process,
    requiredInputs: ["Project Brief", "Current Architecture Overview", "Target Metrics"],
  };
}

export function getAllDigitalServiceOfferings(): ServiceOffering[] {
  return digitalServices.map(adaptDigitalService);
}
