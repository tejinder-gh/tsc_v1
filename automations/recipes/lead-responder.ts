/**
 * What: The "Lead qualification & triage" product (content/services.ts: lead-qualification) -
 *       reply to every new inbound lead within minutes and flag the hot ones to a human.
 * Why: Leads go cold in minutes; speed-to-lead is the whole game. This is a trigger recipe (not a
 *       ladder), which is why it's built with defineRecipe directly - showcasing the engine's
 *       notify primitive alongside sends.
 * How: Pulls new leads from the CRM within a lookback window, sends each a one-shot instant reply
 *       (deduped per lead via idempotency), and - when a lead matches the configured high-value
 *       keywords - raises a NotifyAction to a named internal destination so a person takes over.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import { z } from "zod";
import { buildKey } from "../core/idempotency";
import { defineRecipe, requireIntegration } from "../core/recipe";
import type { Action, NotifyAction } from "../core/types";
import { oneShotSend } from "./send";
import { channelSchema, firstName } from "./shared";

const configSchema = z.object({
  lookbackHours: z.number().int().min(1).max(168).default(48),
  reply: z
    .object({
      channel: channelSchema.default("auto"),
      subject: z.string().optional(),
      body: z
        .string()
        .min(1)
        .default(
          "Hi {{firstName}}, thanks for reaching out to {{business}}! We got your message and someone will follow up shortly. To grab a time right now: {{bookingLink}}",
        ),
    })
    .default({}),
  /** Optional hot-lead routing. notifyTo must name a destination in the client's notify map. */
  qualify: z
    .object({
      keywords: z.array(z.string().min(1)).min(1),
      notifyTo: z.string().min(1),
    })
    .optional(),
});

type Config = z.infer<typeof configSchema>;

export const leadResponderRecipe = defineRecipe<Config>({
  id: "lead-responder",
  title: "Lead qualification & instant reply",
  summary: "Instant reply to every new lead, with hot-lead alerts routed to a human.",
  schema: configSchema,
  async plan(config, ctx) {
    const crm = requireIntegration(ctx, "crm", "lead-responder");
    const since = new Date(
      new Date(ctx.now).getTime() - config.lookbackHours * 3_600_000,
    ).toISOString();
    const leads = await crm.newLeads(since);
    const actions: Action[] = [];

    for (const lead of leads) {
      const replyKey = buildKey(ctx.clientId, ctx.automationId, "reply", lead.id);
      if (!ctx.idempotency.has(replyKey)) {
        const result = oneShotSend({
          clientId: ctx.clientId,
          automationId: ctx.automationId,
          recipeId: "lead-responder",
          contact: lead.contact,
          channel: config.reply.channel,
          subject: config.reply.subject,
          body: config.reply.body,
          variables: {
            firstName: firstName(lead.contact.name),
            business: ctx.business.name,
            source: lead.source ?? "your inquiry",
            bookingLink: ctx.business.bookingLink ?? "reply to this message",
          },
          idempotencyKey: replyKey,
          tags: { leadSource: lead.source ?? "unknown" },
        });
        if ("undeliverable" in result) {
          ctx.logger.warn("lead reply undeliverable", {
            lead: lead.id,
            reason: result.undeliverable,
          });
        } else {
          actions.push(result);
        }
      }

      const notify = maybeNotify(config, lead, ctx);
      if (notify) actions.push(notify);
    }

    return actions;
  },
});

function maybeNotify(
  config: Config,
  lead: {
    id: string;
    contact: { name?: string; email?: string; phone?: string };
    message?: string;
    source?: string;
  },
  ctx: Parameters<typeof leadResponderRecipe.plan>[1],
): NotifyAction | null {
  if (!config.qualify) return null;
  const haystack = `${lead.message ?? ""} ${lead.source ?? ""}`.toLowerCase();
  const isHot = config.qualify.keywords.some((k) => haystack.includes(k.toLowerCase()));
  if (!isHot) return null;

  const destination = ctx.notify[config.qualify.notifyTo];
  if (!destination) {
    ctx.logger.warn("qualify.notifyTo names an unknown destination", {
      notifyTo: config.qualify.notifyTo,
    });
    return null;
  }

  const notifyKey = buildKey(ctx.clientId, ctx.automationId, "notify", lead.id);
  if (ctx.idempotency.has(notifyKey)) return null;

  const who = lead.contact.name ?? lead.contact.phone ?? lead.contact.email ?? "Unknown";
  return {
    kind: "notify",
    to: config.qualify.notifyTo,
    summary: `Hot lead: ${who}${lead.message ? ` - "${lead.message}"` : ""}`,
    meta: {
      clientId: ctx.clientId,
      automationId: ctx.automationId,
      recipeId: "lead-responder",
      contactId: lead.contact.email ?? lead.contact.phone ?? lead.id,
      idempotencyKey: notifyKey,
      tags: { leadId: lead.id },
    },
  };
}
