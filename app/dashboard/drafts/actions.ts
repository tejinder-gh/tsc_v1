"use server";

import { revalidatePath } from "next/cache";
import { buildSenders } from "@/automations/channels";
import { demoClients } from "@/automations/clients";
import { systemClock } from "@/automations/core/clock";
import { FileDraftStore } from "@/automations/core/drafts";
import { FileIdempotencyStore } from "@/automations/core/idempotency";
import { consoleLogger } from "@/automations/core/logger";
import type { DraftAction, SendAction } from "@/automations/core/types";
import { dispatch } from "@/automations/runtime/dispatch";
import { assertOperatorAuthenticated, assertValidClientId } from "../auth-guard";

function getClient(clientId: string) {
  const client = demoClients.find((c) => c.config.id === clientId);
  if (!client) throw new Error(`Client ${clientId} not found`);
  return client;
}

export async function getPendingDrafts(clientId: string): Promise<DraftAction[]> {
  await assertOperatorAuthenticated();
  const validClientId = assertValidClientId(clientId);

  const store = new FileDraftStore(`.automations/drafts/${validClientId}.json`);
  return store.getPending();
}

export async function approveDraft(clientId: string, draftId: string, editedBody: string) {
  await assertOperatorAuthenticated();
  const validClientId = assertValidClientId(clientId);

  if (!draftId || typeof draftId !== "string") {
    throw new Error("Invalid draft ID");
  }

  const client = getClient(validClientId);
  const draftStore = new FileDraftStore(`.automations/drafts/${validClientId}.json`);

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

  const idempotency = new FileIdempotencyStore(`.automations/idempotency/${validClientId}.json`);
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
  await assertOperatorAuthenticated();
  const validClientId = assertValidClientId(clientId);

  if (!draftId || typeof draftId !== "string") {
    throw new Error("Invalid draft ID");
  }

  const draftStore = new FileDraftStore(`.automations/drafts/${validClientId}.json`);
  const drafts = draftStore.getPending();
  if (!drafts.some((d) => d.meta.idempotencyKey === draftId)) {
    throw new Error("Draft not found or already processed.");
  }

  draftStore.remove(draftId);
  revalidatePath("/dashboard/drafts");
}
