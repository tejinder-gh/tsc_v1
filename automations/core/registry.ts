/**
 * What: The recipe registry - the catalogue the engine looks products up in by id, plus a
 *       type-erasure wrapper that validates a client's raw config against the recipe's schema
 *       before planning.
 * Why: Client configs reference recipes by string id. The registry is the one place that maps
 *       those strings to implementations, so the product catalogue is open for extension (drop in
 *       a new recipe) while the engine stays closed. Erasing the generic config type here keeps the
 *       engine loop simple and type-safe at the only place it matters: config validation.
 * How: register() stores an ErasedRecipe whose validateAndPlan parses the raw config with the
 *       recipe's Zod schema (throwing a readable RecipeConfigError on failure) and then delegates
 *       to the typed plan().
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import type { z } from "zod";
import type { Recipe, RecipeContext } from "./recipe";
import type { Action } from "./types";

export class RecipeConfigError extends Error {
  constructor(recipeId: string, error: z.ZodError) {
    const issues = error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    super(`Invalid config for recipe "${recipeId}":\n${issues}`);
    this.name = "RecipeConfigError";
  }
}

export interface ErasedRecipe {
  id: string;
  title: string;
  summary: string;
  validateAndPlan(rawConfig: unknown, ctx: RecipeContext): Promise<Action[]>;
}

function erase<TConfig>(recipe: Recipe<TConfig>): ErasedRecipe {
  return {
    id: recipe.id,
    title: recipe.title,
    summary: recipe.summary,
    validateAndPlan: (rawConfig, ctx) => {
      const parsed = recipe.schema.safeParse(rawConfig);
      if (!parsed.success) throw new RecipeConfigError(recipe.id, parsed.error);
      return recipe.plan(parsed.data, ctx);
    },
  };
}

export class RecipeRegistry {
  private readonly recipes = new Map<string, ErasedRecipe>();

  register<TConfig>(recipe: Recipe<TConfig>): this {
    if (this.recipes.has(recipe.id)) {
      throw new Error(`Recipe "${recipe.id}" is already registered.`);
    }
    this.recipes.set(recipe.id, erase(recipe));
    return this;
  }

  get(id: string): ErasedRecipe | undefined {
    return this.recipes.get(id);
  }

  list(): ErasedRecipe[] {
    return [...this.recipes.values()];
  }
}
