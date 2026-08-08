"use server";

import { demoClients } from "../../../automations/clients";
import { buildSenders } from "../../../automations/channels";
import { systemClock } from "../../../automations/core/clock";
import { FileDraftStore } from "../../../automations/core/drafts";
import { FileIdempotencyStore } from "../../../automations/core/idempotency";
import { consoleLogger } from "../../../automations/core/logger";
import { dispatch } from "../../../automations/runtime/dispatch";
import type { DraftAction, SendAction } from "../../../automations/core/types";
import { revalidatePath } from "next/cache";

function getClient(clientId: string) {
  const client = demoClients.find((c) => c.config.id === clientId);
  if (!client) throw new Error(`Client ${clientId} not found`);
  return client;
}

export async function getPendingDrafts(clientId: string): Promise<DraftAction[]> {
  const store = new FileDraftStore(`.automations/drafts/${clientId}.json`);
  return store.getPending();
}

export async function approveDraft(clientId: string, draftId: string, editedBody: string) {
  const client = getClient(clientId);
  const draftStore = new FileDraftStore(`.automations/drafts/${clientId}.json`);

  const drafts = draftStore.getPending();
  const draft = drafts.find((d) => d.meta.idempotencyKey === draftId);

  if (!draft) {
    throw new Error("Draft not found or already processed.");
  }

  if (!draft.onApproval) {
    throw new Error("Cannot send draft without an onApproval OutboundMessage definition.");
  }

  // Create a SendAction from the DraftAction
  const sendAction: SendAction = {
    kind: "send",
    message: {
      ...draft.onApproval,
      body: editedBody,
    },
    meta: {
      ...draft.meta,
      // Create a unique key for the actual send so it doesn't collide with the draft's markSent.
      idempotencyKey: `${draft.meta.idempotencyKey}:sent`,
    },
  };

  const idempotency = new FileIdempotencyStore(`.automations/idempotency/${clientId}.json`);
  const senders = buildSenders(client.config, consoleLogger);

  await dispatch([sendAction], {
    config: client.config,
    senders,
    idempotency,
    clock: systemClock,
    logger: consoleLogger,
  });

  draftStore.remove(draftId);
  revalidatePath("/dashboard/drafts");
}

export async function rejectDraft(clientId: string, draftId: string) {
  const draftStore = new FileDraftStore(`.automations/drafts/${clientId}.json`);
  draftStore.remove(draftId);
  revalidatePath("/dashboard/drafts");
}
