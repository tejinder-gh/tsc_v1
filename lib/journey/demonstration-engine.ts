import type { DemonstrationConfig, DemonstrationScenario } from "./demonstration-config";

/** Returns the configured scenario at an index, falling back to the first deterministic example. */
export function selectDemonstrationScenario(
  config: DemonstrationConfig,
  requestedIndex = 0,
): DemonstrationScenario {
  return config.scenarios[requestedIndex] ?? config.scenarios[0];
}

/** Cycles through configured examples in declaration order; it never selects randomly. */
export function selectAlternateDemonstrationScenario(
  config: DemonstrationConfig,
  currentIndex: number,
): DemonstrationScenario {
  const nextIndex = (Math.max(0, currentIndex) + 1) % config.scenarios.length;
  return selectDemonstrationScenario(config, nextIndex);
}
