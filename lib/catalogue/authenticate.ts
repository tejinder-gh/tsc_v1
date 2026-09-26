/**
 * Catalogue Authentication Helper
 * Authenticates API keys against the database security schema (second_brain_security.authenticate_agent)
 * Supports:
 * 1. Bearer <key> in Authorization header
 * 2. x-api-key header
 * 3. ?key=<key> or ?apiKey=<key> query parameter
 * 4. Both standard 'key_id.secret' and direct single-token database credentials
 */

import type { NextRequest } from "next/server";
import { dbQuery } from "@/lib/second-brain/db/client";
import type {
  AuthenticatedContext,
  CredentialScope,
  CredentialSummary,
  Principal,
  PrincipalGrant,
} from "@/lib/second-brain/types/iam";

export class CatalogueAuthError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 401, code = "AUTH_FAILED") {
    super(message);
    this.name = "CatalogueAuthError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

interface AuthDbPayload {
  authenticated: boolean;
  error?: string;
  principal: Principal;
  credential: CredentialSummary;
  principalGrants?: PrincipalGrant[];
  credentialScopes?: CredentialScope[];
}

export function extractApiKey(request: NextRequest): string | null {
  // 1. Authorization header (Bearer <key> or raw token)
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    let token = authHeader.trim();
    if (token.toLowerCase().startsWith("bearer ")) {
      token = token.slice(7).trim();
    }
    if (token.length > 0) return token;
  }

  // 2. x-api-key header
  const xApiKey = request.headers.get("x-api-key");
  if (xApiKey && xApiKey.trim().length > 0) {
    return xApiKey.trim();
  }

  // 3. Query parameter: ?key= or ?apiKey=
  const url = request.nextUrl || new URL(request.url);
  const queryKey = url.searchParams.get("key") || url.searchParams.get("apiKey");
  if (queryKey && queryKey.trim().length > 0) {
    return queryKey.trim();
  }

  return null;
}

export async function authenticateCatalogueKey(
  rawKey: string | null | undefined,
): Promise<AuthenticatedContext> {
  if (!rawKey || rawKey.trim().length === 0) {
    throw new CatalogueAuthError(
      "Missing API key credentials. Provide an API key via 'Authorization: Bearer <key>', 'x-api-key: <key>', or '?key=<key>'.",
      401,
      "MISSING_CREDENTIALS",
    );
  }

  const token = rawKey.trim();
  let keyId: string;
  let secret: string;
  let isSingleToken = false;

  const dotIndex = token.indexOf(".");
  if (dotIndex !== -1) {
    keyId = token.slice(0, dotIndex).trim();
    secret = token.slice(dotIndex + 1).trim();
    if (!keyId || !secret) {
      throw new CatalogueAuthError(
        "Invalid key format: key_id and secret must both be non-empty",
        401,
        "EMPTY_CREDENTIALS",
      );
    }
  } else {
    // Single-token format for direct DB insertion
    keyId = token;
    secret = token;
    isSingleToken = true;
  }

  const queryText = "SELECT second_brain_security.authenticate_agent($1, $2) AS auth_result;";

  let result: Awaited<ReturnType<typeof dbQuery<{ auth_result: AuthDbPayload }>>>;
  try {
    result = await dbQuery<{ auth_result: AuthDbPayload }>(queryText, [keyId, secret]);

    // If single-token and failed, try secret = "" as fallback
    if (isSingleToken && !result.rows?.[0]?.auth_result?.authenticated) {
      const fallbackResult = await dbQuery<{ auth_result: AuthDbPayload }>(queryText, [keyId, ""]);
      if (fallbackResult.rows?.[0]?.auth_result?.authenticated) {
        result = fallbackResult;
      }
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    if (errMessage.includes("SECOND_BRAIN_DATABASE_URL is not configured")) {
      throw new CatalogueAuthError(
        "Database authentication service is not configured. Please ensure SECOND_BRAIN_DATABASE_URL is set in environment.",
        503,
        "DATABASE_NOT_CONFIGURED",
      );
    }
    throw new CatalogueAuthError("Database authentication error occurred.", 503, "DATABASE_ERROR");
  }

  if (!result.rows || result.rows.length === 0 || !result.rows[0].auth_result) {
    throw new CatalogueAuthError("Authentication failed", 401, "AUTH_FAILED");
  }

  const authData = result.rows[0].auth_result;

  if (!authData.authenticated) {
    const errorReason = authData.error;
    switch (errorReason) {
      case "KEY_DISABLED":
        throw new CatalogueAuthError("Credential key is currently disabled", 401, "KEY_DISABLED");
      case "KEY_REVOKED":
        throw new CatalogueAuthError("Credential key has been revoked", 401, "KEY_REVOKED");
      case "KEY_EXPIRED":
        throw new CatalogueAuthError("Credential key has expired", 401, "KEY_EXPIRED");
      case "PRINCIPAL_DISABLED":
        throw new CatalogueAuthError(
          "Machine principal identity is disabled",
          403,
          "PRINCIPAL_DISABLED",
        );
      default:
        throw new CatalogueAuthError("Invalid API key or secret", 401, "INVALID_CREDENTIALS");
    }
  }

  // Check for any explicit DENY on catalogue or meta.endpoints
  const grants = authData.principalGrants || [];
  const scopes = authData.credentialScopes || [];

  const isExplicitlyDenied = [...grants, ...scopes].some(
    (rule) =>
      rule.effect === "DENY" &&
      (rule.action === "*" ||
        rule.action === "catalogue.read" ||
        rule.action === "meta.endpoints.read" ||
        rule.resourceKey === "/api/catalogue"),
  );

  if (isExplicitlyDenied) {
    throw new CatalogueAuthError(
      "Forbidden: Access to the catalogue has been explicitly denied for this machine principal or key scope.",
      403,
      "FORBIDDEN",
    );
  }

  return {
    authenticated: true,
    principal: authData.principal,
    credential: authData.credential,
    principalGrants: grants,
    credentialScopes: scopes,
  };
}
