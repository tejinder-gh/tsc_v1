/**
 * What: The Recipe contract - the unit a client actually buys (an "AI receptionist", a
 *       "booking & reminders" ladder, a "win-back" campaign) - plus the context handed to it.
 * Why: A uniform Recipe shape lets the orchestrator treat all 19 catalogue products identically:
 *       validate config, call plan(), collect actions. New product = new Recipe object in the
 *       registry, nothing else. This is the extension point that keeps the engine itself closed.
 * How: Recipe is generic over its validated config type and carries a Zod schema so the engine can
 *       validate per-client config at the boundary. plan() is async (integrations do I/O) and pure
 *       w.r.t. sending - it only decides Action[]. requireIntegration centralises the "this product
 *       needs a calendar but the client didn't wire one" failure into one clear message.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import type { z } from "zod";
import type { Integrations } from "../integrations/types";
import type { BusinessProfile } from "./config";
import type { IdempotencyStore } from "./idempotency";
import type { Logger } from "./logger";
import type { Action, IsoTimestamp } from "./types";

/** Everything a recipe needs to decide what to do, supplied by the orchestrator. */
export interface RecipeContext {
  clientId: string;
  /** The automation instance id from client config; namespaces idempotency + reporting. */
  automationId: string;
  business: BusinessProfile;
  now: IsoTimestamp;
  idempotency: IdempotencyStore;
  integrations: Integrations;
  /** Internal notify destinations declared in client config, by name. */
  notify: Record<string, { email?: string; sms?: string }>;
  logger: Logger;
}

export interface Recipe<TConfig> {
  /** Stable id referenced by client configs (e.g. "booking-reminders"). */
  id: string;
  /** Human title for dashboards. */
  title: string;
  /** One line on what it does, for operator-facing tooling. */
  summary: string;
  /**
   * Validates the per-client config block. The input type is `unknown` (not TConfig) so schemas
   * that apply defaults - where parsed output is richer than raw input - still satisfy the contract.
   */
  schema: z.ZodType<TConfig, z.ZodTypeDef, unknown>;
  /** Decide the actions due right now. Must not send; the runtime dispatches. */
  plan(config: TConfig, ctx: RecipeContext): Promise<Action[]>;
}

/** Helper to define a recipe with inferred config type from its schema. */
export function defineRecipe<TConfig>(recipe: Recipe<TConfig>): Recipe<TConfig> {
  return recipe;
}

export class MissingIntegrationError extends Error {
  constructor(recipeId: string, integration: string) {
    super(
      `Recipe "${recipeId}" needs the "${integration}" integration, but this client has not wired one.`,
    );
    this.name = "MissingIntegrationError";
  }
}

/** Assert an integration is present, returning it narrowed and non-undefined. */
export function requireIntegration<K extends keyof Integrations>(
  ctx: RecipeContext,
  key: K,
  recipeId: string,
): NonNullable<Integrations[K]> {
  const value = ctx.integrations[key];
  if (!value) throw new MissingIntegrationError(recipeId, String(key));
  return value as NonNullable<Integrations[K]>;
}
