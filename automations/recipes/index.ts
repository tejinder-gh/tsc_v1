/**
 * What: The recipe catalogue - registers every shippable automation into a RecipeRegistry.
 * Why: One place lists what's for sale. The runtime builds the registry from here; client configs
 *       reference these ids. Adding a product to the business is: write the recipe, add one line.
 * How: createRegistry() instantiates a fresh registry with every recipe registered. Kept as a
 *       factory (not a singleton) so tests get isolated registries.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06; register new recipes here as the catalogue in content/services.ts is productized.
 */

import { RecipeRegistry } from "../core/registry";
import { bookingRemindersRecipe } from "./booking-reminders";
import { invoiceRemindersRecipe } from "./invoice-reminders";
import { leadResponderRecipe } from "./lead-responder";
import { noShowRebookRecipe } from "./no-show-rebook";
import { reviewBoosterRecipe } from "./review-booster";
import { reviewResponderRecipe } from "./review-responder";
import { winBackRecipe } from "./win-back";

export function createRegistry(): RecipeRegistry {
  return new RecipeRegistry()
    .register(bookingRemindersRecipe)
    .register(noShowRebookRecipe)
    .register(reviewBoosterRecipe)
    .register(reviewResponderRecipe)
    .register(winBackRecipe)
    .register(invoiceRemindersRecipe)
    .register(leadResponderRecipe);
}

export {
  bookingRemindersRecipe,
  invoiceRemindersRecipe,
  leadResponderRecipe,
  noShowRebookRecipe,
  reviewBoosterRecipe,
  reviewResponderRecipe,
  winBackRecipe,
};
