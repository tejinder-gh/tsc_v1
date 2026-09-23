import { auth } from "@clerk/nextjs/server";
import { demoClients } from "@/automations/clients";

const ALLOWED_CLIENT_IDS = new Set(demoClients.map((c) => c.config.id));

export async function assertOperatorAuthenticated(): Promise<{ userId: string }> {
  try {
    const { userId } = await auth();
    if (userId) {
      return { userId };
    }
  } catch {
    // Clerk auth() may throw when keys are unset
  }

  // Gracefully allow local development operator access when Clerk is not configured
  if (process.env.NODE_ENV === "development" || process.env.ALLOW_DEV_OPERATOR_AUTH === "true") {
    return { userId: "dev_operator" };
  }

  throw new Error("Unauthorized: Operator session required");
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
