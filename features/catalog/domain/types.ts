/**
 * Canonical Offering Domain Types for TheSkillCorner
 *
 * Provides a unified domain model capable of representing all capabilities TheSkillCorner
 * offers: Automations, Digital Services, Research/Intelligence Offerings, Newsletters,
 * Resources, and Tools.
 */

// ==========================================
// 1. Core Offering Taxonomy & Enums
// ==========================================

export type OfferingKind =
  | "service"
  | "automation"
  | "newsletter"
  | "resource"
  | "tool"
  | "agent"
  | "template";

export type CatalogVisibility = "public" | "unlisted" | "private" | "hidden";

export type CommerceStatus = "free" | "purchasable" | "request_only" | "waitlist" | "unavailable";

export type FulfillmentReadiness = "operational" | "manual" | "beta" | "planned" | "disabled";

export type ServiceDeliveryType = "ai" | "human" | "hybrid" | "automation";

export type ServiceProductType =
  | "newsletter"
  | "report"
  | "monitoring"
  | "alert"
  | "research"
  | "analysis"
  | "workflow"
  | "automation"
  | "consulting"
  | "data"
  | "tool"
  | "other";

export type ServiceCadence =
  | "instant"
  | "on_demand"
  | "daily"
  | "weekly"
  | "monthly"
  | "event_driven"
  | "continuous"
  | "custom";

export type AutomationLevel = "manual" | "assisted" | "mostly_automated" | "fully_automated";

export type EffortLevel = "none" | "low" | "medium" | "high";

export type GeographicScope = "global" | "country" | "province_state" | "city" | "custom";

// ==========================================
// 2. Base Offering Contract
// ==========================================

export interface BaseOffering {
  id: string;
  slug: string;
  kind: OfferingKind;
  title: string;
  tagline: string;
  shortDescription: string;
  longDescription?: string;
  icon?: string;
  accent?: "blue" | "violet" | "green" | "amber" | "navy";

  // Governance & Lifecycle
  status: "active" | "experimental" | "beta" | "paused" | "archived" | "draft";
  visibility: CatalogVisibility;
  commerceStatus: CommerceStatus;
  fulfillmentReadiness?: FulfillmentReadiness;
  featured: boolean;
  priority: number;

  // Taxonomy & Matching
  categories: string[];
  tags: string[];
  goals: string[];
  problemsSolved: string[];
  industries: string[];
  audiences: string[];

  // Mechanics & Expectations
  deliveryModel: ServiceDeliveryType;
  automationLevel: AutomationLevel;
  setupEffort: EffortLevel;
  ongoingEffort?: EffortLevel;
  timeToValue?: string;

  // Commercials
  pricingModel: "free" | "one_time" | "subscription" | "custom" | "included";
  priceDisplay: string;
  priceAmountCents?: number;
  currency?: string;
  billingCadence?: "one_time" | "weekly" | "monthly" | "annual";

  // Actions & Navigation
  cta: {
    label: string;
    href: string;
    type: "primary" | "secondary" | "book" | "subscribe";
  };
  canonicalUrl: string;

  // Provenance & Linkages
  relatedOfferingIds: string[];
  source:
    | "skill-corner-automation"
    | "skill-corner-digital"
    | "imported-service"
    | "newsletter"
    | "curated";
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 3. Specialized Discriminated Union
// ==========================================

export interface AutomationOffering extends BaseOffering {
  kind: "automation";
  tools: string[];
  whatWeBuild: string[];
  timeline: string;
  outcome: string;
}

export interface ServiceOffering extends BaseOffering {
  kind: "service";
  deliverables?: string[];
  features?: { title: string; description: string }[];
  process?: { stepNumber: number; title: string; description: string }[];
  requiredInputs?: string[];
}

export interface NewsletterOffering extends BaseOffering {
  kind: "newsletter";
  newsletterId: string;
  generationMode: "ai" | "manual" | "hybrid";
  cadence: ServiceCadence;
  subscriberCount?: number;
  latestIssueTitle?: string;
  latestIssueDate?: string;
}

export interface ResourceOffering extends BaseOffering {
  kind: "resource";
  format: "checklist" | "template" | "guide" | "calculator";
  downloadUrl?: string;
}

export interface ToolOffering extends BaseOffering {
  kind: "tool";
  interactiveUrl?: string;
}

export type Offering =
  | AutomationOffering
  | ServiceOffering
  | NewsletterOffering
  | ResourceOffering
  | ToolOffering;

// ==========================================
// 4. Source Application Native Contracts
// ==========================================

export type CanonicalService = {
  id: string;
  slug: string;
  version: string;

  name: string;
  tagline: string;
  shortDescription: string;
  longDescription?: string;
  icon: string;
  accent?: "blue" | "violet" | "green" | "amber";

  visibility: CatalogVisibility;
  commerceStatus: CommerceStatus;
  fulfillmentReadiness: FulfillmentReadiness;
  fulfillmentSpecVersion?: string;
  isFixture: boolean;

  categoryId: string;
  subcategoryId?: string;
  goalIds: string[];
  problemIds: string[];
  outcomeIds: string[];
  useCaseIds: string[];
  audienceIds: string[];
  roleIds?: string[];
  industryIds?: string[];
  stageIds?: string[];
  intentIds: string[];

  productType: ServiceProductType;
  deliveryType: ServiceDeliveryType;
  cadence: ServiceCadence;
  automationLevel: AutomationLevel;
  humanReviewAvailable: boolean;
  humanReviewRequired: boolean;

  geographicScope: GeographicScope;
  supportedLocations: string[];

  userEffortLevel: EffortLevel;
  setupEffort: EffortLevel;
  requiredInputs: string[];
  optionalInputs: string[];
  requiredIntegrations: string[];
  optionalIntegrations: string[];
  requiredPermissions: string[];

  planIds: string[];
  defaultPlanId?: string;

  valueProposition: string;
  deliverableSummaries: string[];
  exampleOutputs?: string[];
  maturity: "experimental" | "beta" | "proven" | "mature";
  dataFreshness?: string;
  methodologySummary?: string;

  keywords: string[];
  searchAliases: string[];
  featured: boolean;
  priority: number;

  relatedServiceIds: string[];
  prerequisiteServiceIds: string[];
  complementaryServiceIds: string[];
  alternativeServiceIds: string[];
  bundleIds: string[];

  primaryCTA: "subscribe" | "activate" | "buy" | "request" | "join_waitlist" | "learn_more";
  secondaryCTA?: string;

  owner?: string;
  backendServiceId?: string;
  automationJobId?: string;
  createdAt: string;
  updatedAt: string;
};

export type ServicePlan = {
  id: string;
  serviceId: string;
  version: string;
  name: string;
  description: string;
  billingModel: "free" | "one_time" | "subscription" | "usage_based" | "custom";
  priceAmountCents: number;
  currency: string;
  billingInterval?: "week" | "month" | "year" | "one_time";
  stripePriceId?: string;
  stripePriceEnvKey?: string;
  limits: Record<string, unknown>;
  features: string[];
  recommended?: boolean;
  active: boolean;
};

export type ServiceBundle = {
  id: string;
  slug: string;
  version: string;
  name: string;
  tagline: string;
  description: string;
  serviceIds: string[];
  planIds: string[];
  priceAmountCents: number;
  originalPriceAmountCents: number;
  savingsPercentage: number;
  currency: string;
  billingInterval: "month" | "year" | "one_time";
  stripePriceEnvKey?: string;
  commerceStatus: CommerceStatus;
  isFixture: boolean;
  featured: boolean;
};
