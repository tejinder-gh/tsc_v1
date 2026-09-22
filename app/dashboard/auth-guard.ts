import { auth } from "@clerk/nextjs/server";
import { demoClients } from "@/automations/clients";

const ALLOWED_CLIENT_IDS = new Set(demoClients.map((c) => c.config.id));

export async function assertOperatorAuthenticated(): Promise<{ userId: string }> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Operator session required");
  }
  return { userId };
}

export function assertValidClientId(clientId: string): string {
  if (!clientId || typeof clientId !== "string") {
    throw new Error("Invalid client ID");
  }

  // Prevent path traversal attempts
  if (clientId.includes("/") || clientId.includes("\\") || clientId.includes("..")) {
    throw new Error("Forbidden: Invalid client ID format");
  }

  if (!ALLOWED_CLIENT_IDS.has(clientId)) {
    throw new Error(`Forbidden: Client "${clientId}" is not authorized or does not exist`);
  }

  return clientId;
}
