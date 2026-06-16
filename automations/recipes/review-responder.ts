/**
 * What: The "Reviews & reputation" responder (content/services.ts: reviews-and-reputation) -
 *       monitor new reviews, draft an on-brand reply for one-tap approval, and route anything
 *       negative to a human immediately.
 * Why: Unanswered reviews cost twice (the unhappy customer and the next hundred readers). This
 *       recipe shows the engine's draft + notify primitives: nothing publishes itself; a person
 *       approves, and negative reviews never sit unseen.
 * How: A trigger recipe. For each new review it builds a draft via an injectable text generator
 *       (default: a deterministic, brand-voice template; swap in a Claude-backed generator in prod)
 *       and, when the rating is at or below the negative threshold, also raises a NotifyAction.
 *       Both are deduped per review id.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06; replace defaultDraftGenerator with a Claude API call for richer, on-brand copy.
 */

import { z } from "zod";
import type { BusinessProfile } from "../core/config";
import { buildKey } from "../core/idempotency";
import { defineRecipe, requireIntegration } from "../core/recipe";
import type { Action, DraftAction, NotifyAction } from "../core/types";
import type { Review } from "../integrations/types";

const configSchema = z.object({
  lookbackDays: z.number().int().min(1).max(30).default(3),
  /** Reviews at or below this rating are routed to a human as well as drafted. */
  negativeMaxRating: z.number().int().min(1).max(4).default(3),
  /** Destination (in the client's notify map) that negative reviews alert. */
  notifyTo: z.string().min(1).optional(),
});

type Config = z.infer<typeof configSchema>;

/** Generates draft reply copy. Deterministic default; a Claude-backed impl can replace it. */
export type DraftGenerator = (review: Review, business: BusinessProfile) => string;

export const defaultDraftGenerator: DraftGenerator = (review, business) => {
  const author = review.author ?? "there";
  if (review.rating >= 4) {
    return `Hi ${author}, thank you so much for the wonderful review and for choosing ${business.name}! It genuinely makes our day. We can't wait to see you again. — The ${business.name} team`;
  }
  return `Hi ${author}, thank you for taking the time to share this, and we're sorry your experience at ${business.name} fell short. We'd really like to make it right — please reach out to us directly so we can help. — The ${business.name} team`;
};

export function makeReviewResponderRecipe(generate: DraftGenerator = defaultDraftGenerator) {
  return defineRecipe<Config>({
    id: "review-responder",
    title: "Reviews & reputation",
    summary: "Draft on-brand replies to new reviews for approval; route negatives to a human.",
    schema: configSchema,
    async plan(config, ctx) {
      const reviews = requireIntegration(ctx, "reviews", "review-responder");
      const since = new Date(
        new Date(ctx.now).getTime() - config.lookbackDays * 86_400_000,
      ).toISOString();
      const incoming = await reviews.newReviews(since);
      const actions: Action[] = [];

      for (const review of incoming) {
        const draftKey = buildKey(ctx.clientId, ctx.automationId, "draft", review.id);
        if (!ctx.idempotency.has(draftKey)) {
          const draft: DraftAction = {
            kind: "draft",
            purpose: "review-reply",
            content: { body: generate(review, ctx.business) },
            meta: {
              clientId: ctx.clientId,
              automationId: ctx.automationId,
              recipeId: "review-responder",
              contactId: review.contact?.id ?? review.id,
              idempotencyKey: draftKey,
              tags: { platform: review.platform, rating: review.rating },
            },
          };
          actions.push(draft);
        }

        if (review.rating <= config.negativeMaxRating && config.notifyTo) {
          const alert = buildNegativeAlert(config.notifyTo, review, ctx);
          if (alert) actions.push(alert);
        }
      }

      return actions;
    },
  });
}

/** Convenience: the recipe with the default (template) draft generator. */
export const reviewResponderRecipe = makeReviewResponderRecipe();

function buildNegativeAlert(
  notifyTo: string,
  review: Review,
  ctx: Parameters<ReturnType<typeof makeReviewResponderRecipe>["plan"]>[1],
): NotifyAction | null {
  if (!ctx.notify[notifyTo]) {
    ctx.logger.warn("review-responder notifyTo names an unknown destination", { notifyTo });
    return null;
  }
  const notifyKey = buildKey(ctx.clientId, ctx.automationId, "notify", review.id);
  if (ctx.idempotency.has(notifyKey)) return null;

  return {
    kind: "notify",
    to: notifyTo,
    summary: `${review.rating}★ ${review.platform} review needs attention: "${review.text.slice(0, 140)}"`,
    meta: {
      clientId: ctx.clientId,
      automationId: ctx.automationId,
      recipeId: "review-responder",
      contactId: review.contact?.id ?? review.id,
      idempotencyKey: notifyKey,
      tags: { platform: review.platform, rating: review.rating },
    },
  };
}
