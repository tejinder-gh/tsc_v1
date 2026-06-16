/**
 * What: The orchestrator. Given one validated client config, it runs every enabled automation
 *       through its recipe and returns the full set of due Actions plus any per-automation errors.
 * Why: This is the loop that makes the whole system "one engine, many clients, many products".
 *       It is deliberately tiny and generic: it knows nothing about reminders, reviews, or
 *       invoices - only how to look up a recipe, validate its config, and collect what it decides.
 * How: For each enabled automation it builds a RecipeContext (namespaced by automation id for
 *       idempotency) and calls the registry's validateAndPlan. A failure in one automation is
 *       captured, logged, and isolated - the other automations still run. The engine never sends;
 *       it returns a plan for the runtime to dispatch.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import type { Integrations } from "../integrations/types";
import type { Clock } from "./clock";
import type { ClientConfig } from "./config";
import type { IdempotencyStore } from "./idempotency";
import type { Logger } from "./logger";
import type { RecipeContext } from "./recipe";
import type { RecipeRegistry } from "./registry";
import type { Action } from "./types";

export interface EngineDeps {
  registry: RecipeRegistry;
  integrations: Integrations;
  idempotency: IdempotencyStore;
  clock: Clock;
  logger: Logger;
}

export interface AutomationError {
  automationId: string;
  recipe: string;
  message: string;
}

export interface EngineResult {
  clientId: string;
  ranAt: string;
  actions: Action[];
  errors: AutomationError[];
}

/** Plan all due actions for one client. Pure of side effects beyond reads + logging. */
export async function planClient(config: ClientConfig, deps: EngineDeps): Promise<EngineResult> {
  const ranAt = deps.clock.now();
  const actions: Action[] = [];
  const errors: AutomationError[] = [];

  for (const automation of config.automations) {
    if (!automation.enabled) {
      deps.logger.debug("automation disabled, skipping", {
        clientId: config.id,
        automation: automation.id,
      });
      continue;
    }

    const recipe = deps.registry.get(automation.recipe);
    if (!recipe) {
      const message = `Unknown recipe "${automation.recipe}" - not in registry.`;
      deps.logger.error(message, { clientId: config.id, automation: automation.id });
      errors.push({ automationId: automation.id, recipe: automation.recipe, message });
      continue;
    }

    const ctx: RecipeContext = {
      clientId: config.id,
      automationId: automation.id,
      business: config.business,
      now: ranAt,
      idempotency: deps.idempotency,
      integrations: deps.integrations,
      notify: config.notify,
      logger: deps.logger,
    };

    try {
      const planned = await recipe.validateAndPlan(automation.config, ctx);
      actions.push(...planned);
      deps.logger.info("automation planned", {
        clientId: config.id,
        automation: automation.id,
        recipe: automation.recipe,
        actions: planned.length,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      deps.logger.error("automation failed", {
        clientId: config.id,
        automation: automation.id,
        recipe: automation.recipe,
        error: message,
      });
      errors.push({ automationId: automation.id, recipe: automation.recipe, message });
    }
  }

  return { clientId: config.id, ranAt, actions, errors };
}
