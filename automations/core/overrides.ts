/**
 * What: Configuration overrides for client automations.
 * Why: The base configurations are hardcoded in TypeScript files (e.g. `radiance-salon.ts`).
 *       To allow a UI dashboard to toggle flows on and off without rewriting source code,
 *       we store boolean overrides in a local JSON file.
 * How: Reads/writes to `.automations/overrides/<clientId>.json` and provides a helper
 *       to merge these overrides into a `ClientConfig`.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { ClientConfig } from "./config";

/**
 * Reads the overrides for a given client from `.automations/overrides/<clientId>.json`.
 * The overrides file is a simple Record<string, boolean> where the key is the automationId.
 */
export function getAutomationOverrides(clientId: string): Record<string, boolean> {
  const path = `.automations/overrides/${clientId}.json`;
  if (!existsSync(path)) return {};
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * Saves an override for a specific automation for a client.
 */
export function setAutomationOverride(
  clientId: string,
  automationId: string,
  enabled: boolean,
): void {
  const path = `.automations/overrides/${clientId}.json`;
  const current = getAutomationOverrides(clientId);
  current[automationId] = enabled;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(current, null, 2));
}

/**
 * Takes a base ClientConfig and returns a new ClientConfig with the overrides applied
 * to its automations array.
 */
export function applyOverrides(config: ClientConfig): ClientConfig {
  const overrides = getAutomationOverrides(config.id);

  if (Object.keys(overrides).length === 0) return config;

  return {
    ...config,
    automations: config.automations.map((a) => {
      const overridden = overrides[a.id];
      if (typeof overridden === "boolean") {
        return { ...a, enabled: overridden };
      }
      return a;
    }),
  };
}
