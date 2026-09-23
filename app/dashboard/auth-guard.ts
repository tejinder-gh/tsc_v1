import { auth } from "@clerk/nextjs/server";
import { demoClients } from "@/automations/clients";

const ALLOWED_CLIENT_IDS = new Set(demoClients.map((c) => c.config.id));

export function getAuthorizedOperatorUserIds(env: NodeJS.ProcessEnv = process.env): Set<string> {
  const raw = env.DASHBOARD_OPERATOR_USER_IDS || "";
  const ids = raw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  return new Set(ids);
}

export async function assertOperatorAuthenticated(): Promise<{ userId: string }> {
  let clerkUserId: string | null = null;

  try {
    const session = await auth();
    clerkUserId = session.userId;
  } catch {
    // Clerk auth() may throw when keys are unset
  }

  // If a Clerk user session exists, enforce the operator allowlist
  if (clerkUserId) {
    const authorizedIds = getAuthorizedOperatorUserIds();
    if (authorizedIds.has(clerkUserId)) {
      return { userId: clerkUserId };
    }
    throw new Error("Forbidden: User is not an authorized dashboard operator");
  }

  // Gracefully allow local development operator access ONLY in development AND when explicitly opted in
  if (process.env.NODE_ENV === "development" && process.env.ALLOW_DEV_OPERATOR_AUTH === "true") {
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
