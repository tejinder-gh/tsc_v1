/**
 * What: The demo client roster - each example client paired with its (in-memory) integrations.
 * Why: One import point for the CLI and tests to iterate "every client we run", mirroring how a
 *       production scheduler would load real client configs from a directory or database.
 * How: Bundles each ClientConfig with inMemoryIntegrations over its demo dataset. Re-exports
 *       DEMO_NOW so callers can pin a deterministic clock.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import type { ClientConfig } from "../core/config";
import { inMemoryIntegrations } from "../integrations/memory";
import type { Integrations } from "../integrations/types";
import { brightSmileDentalConfig, brightSmileDentalData } from "./brightsmile-dental";
import { radianceSalonConfig, radianceSalonData } from "./radiance-salon";

export { DEMO_NOW } from "./demo-clock";

export interface DemoClient {
  config: ClientConfig;
  integrations: Integrations;
}

export const demoClients: DemoClient[] = [
  { config: radianceSalonConfig, integrations: inMemoryIntegrations(radianceSalonData) },
  { config: brightSmileDentalConfig, integrations: inMemoryIntegrations(brightSmileDentalData) },
];
