import { type Service, services } from "@/content/services";
import type { AutomationOffering } from "../../domain/types";

export function adaptAutomationService(service: Service): AutomationOffering {
  const isHighPriority = [
    "ai-receptionist",
    "booking-and-reminders",
    "intake-and-documents",
    "lead-qualification",
  ].includes(service.slug);

  return {
    id: `automation:${service.slug}`,
    slug: service.slug,
    kind: "automation",
    title: service.name,
    tagline: service.title,
    shortDescription: service.excerpt,
    longDescription: service.problem,
    icon: "bolt",
    accent: "green",

    status: "active",
    visibility: "public",
    commerceStatus: "request_only",
    fulfillmentReadiness: "operational",
    featured: isHighPriority,
    priority: isHighPriority ? 10 : 0,

    categories: ["automations", "workflow-automation", "operations"],
    tags: [...service.tools, "automation", "workflow", "ai"],
    goals: ["automate-operations", "save-staff-time", "grow-revenue"],
    problemsSolved: [service.problem],
    industries: service.relatedIndustries,
    audiences: ["small-business", "founder-operator", "professional-practice"],

    deliveryModel: "automation",
    automationLevel: "mostly_automated",
    setupEffort: "low",
    ongoingEffort: "none",
    timeToValue: service.timeline,

    pricingModel: "custom",
    priceDisplay: "Custom Setup & Retainer",
    billingCadence: "monthly",

    cta: {
      label: "Book Free Audit",
      href: "/book",
      type: "book",
    },
    canonicalUrl: `/what-we-automate/${service.slug}`,

    relatedOfferingIds: [],
    source: "skill-corner-automation",
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-09-22T00:00:00Z",

    tools: service.tools,
    whatWeBuild: service.whatWeBuild,
    timeline: service.timeline,
    outcome: service.outcome,
  };
}

export function getAllAutomationOfferings(): AutomationOffering[] {
  return services.map(adaptAutomationService);
}
