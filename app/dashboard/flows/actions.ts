"use server";

import { revalidatePath } from "next/cache";
import { demoClients } from "@/automations/clients";
import { applyOverrides, setAutomationOverride } from "@/automations/core/overrides";
import { assertOperatorAuthenticated, assertValidClientId } from "../auth-guard";

export async function getClientsWithFlows() {
  await assertOperatorAuthenticated();

  return demoClients.map((client) => {
    const config = applyOverrides(client.config);
    return {
      id: config.id,
      name: config.business.name,
      automations: config.automations,
    };
  });
}

export async function toggleFlow(clientId: string, automationId: string, enabled: boolean) {
  await assertOperatorAuthenticated();
  const validClientId = assertValidClientId(clientId);

  if (!automationId || typeof automationId !== "string") {
    throw new Error("Invalid automation ID");
  }

  const client = demoClients.find((c) => c.config.id === validClientId);
  if (!client?.config.automations.some((a) => a.id === automationId)) {
    throw new Error(`Unknown automation ID "${automationId}" for client "${validClientId}"`);
  }

  setAutomationOverride(validClientId, automationId, enabled);
  revalidatePath("/dashboard/flows");
}
