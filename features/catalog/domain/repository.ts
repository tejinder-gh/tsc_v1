import { CANONICAL_SERVICES } from "../data/source-services";
import { BUNDLES, getBundleBySlug, type ServiceBundle } from "./bundles";
import { checkEligibility, type EligibilityCriteria } from "./eligibility";
import { getPlansByService, PLANS, type ServicePlan } from "./plans";
import { type ScoredServiceResult, scoreService } from "./scoring";
import type {
  CanonicalService,
  CatalogVisibility,
  CommerceStatus,
  ServiceDeliveryType,
} from "./types";

export type DiscoveryQuery = EligibilityCriteria & {
  searchQuery?: string;
  intentId?: string;
  goalId?: string;
  categoryId?: string;
  audienceId?: string;
  industryId?: string;
  preferredCadence?: string;
  approximateBudget?: number; // Soft preference budget
  preferredDeliveryType?: ServiceDeliveryType;
  sortBy?: "recommended" | "newest" | "price_asc" | "price_desc";
  limit?: number;
};

export interface ServiceRepository {
  getById(id: string): Promise<CanonicalService | null>;
  getBySlug(slug: string): Promise<CanonicalService | null>;
  list(options?: {
    visibility?: CatalogVisibility[];
    commerceStatus?: CommerceStatus[];
    includeFixtures?: boolean;
    categoryId?: string;
    goalId?: string;
    deliveryType?: ServiceDeliveryType;
    limit?: number;
  }): Promise<CanonicalService[]>;
  search(query: DiscoveryQuery): Promise<ScoredServiceResult[]>;
  getPlansByServiceId(serviceId: string): Promise<ServicePlan[]>;
  getBundleBySlug(slug: string): Promise<ServiceBundle | null>;
  listBundles(options?: { includeFixtures?: boolean }): Promise<ServiceBundle[]>;
}

export class ConfigServiceRepository implements ServiceRepository {
  private services: readonly CanonicalService[];
  private plans: readonly ServicePlan[];
  private bundles: readonly ServiceBundle[];

  constructor(services = CANONICAL_SERVICES, plans = PLANS, bundles = BUNDLES) {
    this.services = services;
    this.plans = plans;
    this.bundles = bundles;
  }

  async getById(id: string): Promise<CanonicalService | null> {
    return this.services.find((s) => s.id === id) ?? null;
  }

  async getBySlug(slug: string): Promise<CanonicalService | null> {
    return this.services.find((s) => s.slug === slug) ?? null;
  }

  async list(
    options: {
      visibility?: CatalogVisibility[];
      commerceStatus?: CommerceStatus[];
      includeFixtures?: boolean;
      categoryId?: string;
      goalId?: string;
      deliveryType?: ServiceDeliveryType;
      limit?: number;
    } = {},
  ): Promise<CanonicalService[]> {
    const defaultVisibility: CatalogVisibility[] = ["public"];
    const visibilityFilter = options.visibility ?? defaultVisibility;

    let filtered = this.services.filter((s) => {
      if (!visibilityFilter.includes(s.visibility)) return false;
      if (!options.includeFixtures && s.isFixture) return false;
      if (options.commerceStatus && !options.commerceStatus.includes(s.commerceStatus))
        return false;
      if (options.categoryId && s.categoryId !== options.categoryId) return false;
      if (options.goalId && !s.goalIds.includes(options.goalId)) return false;
      if (options.deliveryType && s.deliveryType !== options.deliveryType) return false;
      return true;
    });

    if (options.limit && options.limit > 0) {
      filtered = filtered.slice(0, options.limit);
    }
    return filtered;
  }

  async search(query: DiscoveryQuery): Promise<ScoredServiceResult[]> {
    // 1. Hard eligibility filtering
    const eligibleServices = this.services.filter((service) => checkEligibility(service, query));

    // 2. Score each eligible service across all dimensions
    const scored = eligibleServices.map((service) => {
      const defaultPlan =
        this.plans.find((p) => p.serviceId === service.id && p.recommended) ||
        this.plans.find((p) => p.serviceId === service.id);
      return scoreService(service, query, defaultPlan?.priceAmountCents);
    });

    // 3. Sort according to criteria
    scored.sort((a, b) => {
      if (query.sortBy === "newest") {
        return new Date(b.service.createdAt).getTime() - new Date(a.service.createdAt).getTime();
      }
      if (query.sortBy === "price_asc" || query.sortBy === "price_desc") {
        const planA = this.plans.find((p) => p.serviceId === a.serviceId);
        const planB = this.plans.find((p) => p.serviceId === b.serviceId);
        const priceA = planA?.priceAmountCents ?? 0;
        const priceB = planB?.priceAmountCents ?? 0;
        return query.sortBy === "price_asc" ? priceA - priceB : priceB - priceA;
      }
      // Default: Recommended by score
      return b.score - a.score;
    });

    if (query.limit && query.limit > 0) {
      return scored.slice(0, query.limit);
    }
    return scored;
  }

  async getPlansByServiceId(serviceId: string): Promise<ServicePlan[]> {
    return getPlansByService(serviceId);
  }

  async getBundleBySlug(slug: string): Promise<ServiceBundle | null> {
    return getBundleBySlug(slug) ?? null;
  }

  async listBundles(options: { includeFixtures?: boolean } = {}): Promise<ServiceBundle[]> {
    return this.bundles.filter((b) => options.includeFixtures || !b.isFixture);
  }
}

export const serviceRepository = new ConfigServiceRepository();
