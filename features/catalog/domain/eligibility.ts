import { getPlansByService } from "./plans";
import type { CanonicalService, CatalogVisibility, ServiceDeliveryType } from "./types";

export type EligibilityCriteria = {
  includeFixtures?: boolean;
  allowedVisibility?: CatalogVisibility[];
  hardLocation?: string; // Explicit hard geographic constraint (e.g. "Ontario")
  hardMaxBudget?: number; // Explicit ceiling constraint in cents (e.g. 5000 = $50.00 max)
  hardDeliveryType?: ServiceDeliveryType; // Explicit delivery constraint (e.g. "automation")
  isCommercialReadyOnly?: boolean; // Must have verified operational fulfillment
};

/**
 * Hard eligibility evaluation. Runs BEFORE scoring.
 * A service that fails hard eligibility is strictly excluded from results.
 */
export function checkEligibility(
  service: CanonicalService,
  criteria: EligibilityCriteria = {},
): boolean {
  // 1. Fixture isolation (demo/test offerings hidden from standard production browsing)
  if (!criteria.includeFixtures && service.isFixture) {
    return false;
  }

  // 2. Catalog visibility
  const allowedVisibility = criteria.allowedVisibility ?? ["public"];
  if (!allowedVisibility.includes(service.visibility)) {
    return false;
  }

  // 3. Commercial readiness check (if caller requires verified transactivity)
  if (criteria.isCommercialReadyOnly) {
    if (
      service.commerceStatus !== "purchasable" ||
      service.fulfillmentReadiness !== "operational"
    ) {
      return false;
    }
  }

  // 4. Hard location constraint
  if (criteria.hardLocation) {
    const loc = criteria.hardLocation.trim().toLowerCase();
    const isGlobal = service.geographicScope === "global";
    const supportsLocation = service.supportedLocations.some(
      (supported) =>
        supported.toLowerCase() === loc ||
        loc.includes(supported.toLowerCase()) ||
        supported.toLowerCase().includes(loc),
    );
    if (!isGlobal && !supportsLocation) {
      return false;
    }
  }

  // 5. Hard maximum budget constraint (strict ceiling)
  if (criteria.hardMaxBudget !== undefined && criteria.hardMaxBudget >= 0) {
    const plans = getPlansByService(service.id);
    if (plans.length > 0) {
      const minPlanPrice = Math.min(...plans.map((p) => p.priceAmountCents));
      if (minPlanPrice > criteria.hardMaxBudget) {
        return false;
      }
    }
  }

  // 6. Hard delivery type constraint
  if (criteria.hardDeliveryType && service.deliveryType !== criteria.hardDeliveryType) {
    return false;
  }

  return true;
}
