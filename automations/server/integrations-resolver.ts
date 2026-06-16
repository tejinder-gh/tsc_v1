/**
 * What: Resolves a client id to its live Integrations bundle - the seam where a client's real tools
 *       (booking system, POS, CRM, reviews) get wired in for a scheduled run.
 * Why: The scheduler knows *which* clients to run but not *how* to read each one's data; that varies
 *       per client (Jane vs Fresha vs Square). Isolating it behind one function lets the scheduler
 *       stay generic while real adapters drop in per client without touching it.
 * How: A simple resolver type plus a demo implementation that returns the in-memory datasets for the
 *       example clients, so the scheduler runs end-to-end out of the box. Replace/extend this with
 *       real adapters (implementing the integrations/types.ts ports) for production clients.
 * From Where: TheSkillCorner automation-engine - scheduler, 2026-06.
 * When: 2026-06.
 */

import { brightSmileDentalData } from "../clients/brightsmile-dental";
import { radianceSalonData } from "../clients/radiance-salon";
import { inMemoryIntegrations } from "../integrations/memory";
import type { Integrations } from "../integrations/types";

/** Returns the integrations for a client, or undefined if none are wired (the client is skipped). */
export type IntegrationsResolver = (clientId: string) => Integrations | undefined;

/** Demo resolver: maps the example clients to their fixture datasets. */
export const demoIntegrationsResolver: IntegrationsResolver = (clientId) => {
  switch (clientId) {
    case "radiance-salon":
      return inMemoryIntegrations(radianceSalonData);
    case "brightsmile-dental":
      return inMemoryIntegrations(brightSmileDentalData);
    default:
      return undefined;
  }
};
