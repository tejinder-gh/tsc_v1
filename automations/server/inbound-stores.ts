/**
 * What: Per-client, file-backed store singletons - the durable state the inbound route and the
 *       outbound scheduler share (suppression, conversation history, idempotency, contact index).
 * Why: Production needs persistence: an opt-out must survive a restart, and re-delivered webhooks
 *       must dedupe across requests. These have to be the *same* instances the scheduler's
 *       runClient uses, or the closed loop breaks - so they're process-level singletons keyed by
 *       client id, constructed once.
 * How: Lazily build the four File* stores under a per-client data directory (AUTOMATIONS_DATA_DIR,
 *       default ./.automations) and cache them. Swap these File* stores for DB-backed ones with the
 *       same interfaces to run multi-instance - nothing else changes.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06.
 */

import { FileIdempotencyStore, type IdempotencyStore } from "../core/idempotency";
import { type ContactIndex, FileContactIndex } from "../inbound/contact-index";
import { type ConversationStore, FileConversationStore } from "../inbound/conversation";
import { FileSuppressionStore, type SuppressionStore } from "../inbound/suppression";

export interface InboundStores {
  suppression: SuppressionStore;
  conversations: ConversationStore;
  idempotency: IdempotencyStore;
  contactIndex: ContactIndex;
}

const cache = new Map<string, InboundStores>();

export function getInboundStores(
  clientId: string,
  env: Record<string, string | undefined> = process.env,
): InboundStores {
  const cached = cache.get(clientId);
  if (cached) return cached;

  const base = `${env.AUTOMATIONS_DATA_DIR ?? ".automations"}/${clientId}`;
  const stores: InboundStores = {
    suppression: new FileSuppressionStore(`${base}/suppression.json`),
    conversations: new FileConversationStore(`${base}/conversation.json`),
    idempotency: new FileIdempotencyStore(`${base}/idempotency.json`),
    contactIndex: new FileContactIndex(`${base}/contacts.json`),
  };
  cache.set(clientId, stores);
  return stores;
}
