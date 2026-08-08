"use server";

import { demoClients } from "../../../automations/clients";
import { applyOverrides, setAutomationOverride } from "../../../automations/core/overrides";
import { revalidatePath } from "next/cache";

export async function getClientsWithFlows() {
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
  setAutomationOverride(clientId, automationId, enabled);
  revalidatePath("/dashboard/flows");
}
