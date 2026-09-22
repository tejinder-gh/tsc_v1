/**
 * Database-Side Agent Authentication Helper
 * Extracts credentials and validates against second_brain_security.authenticate_agent()
 */

import { dbQuery } from "../db/client";
import type { AuthenticatedContext } from "../types/iam";

export class AuthenticationError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 401, code = "AUTH_FAILED") {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function parseApiKey(rawKeyOrHeader: string | null | undefined): {
  keyId: string;
  secret: string;
} {
  if (!rawKeyOrHeader) {
    throw new AuthenticationError("Missing API key credentials", 401, "MISSING_CREDENTIALS");
  }

  let token = rawKeyOrHeader.trim();
  if (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim();
  }

  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) {
    throw new AuthenticationError(
      "Malformed API key format. Expected format: key_id.secret",
      401,
      "MALFORMED_CREDENTIALS",
    );
  }

  const keyId = token.slice(0, dotIndex).trim();
  const secret = token.slice(dotIndex + 1).trim();

  if (!keyId || !secret) {
    throw new AuthenticationError(
      "Invalid key format: key_id and secret must both be non-empty",
      401,
      "EMPTY_CREDENTIALS",
    );
  }

  return { keyId, secret };
}

export async function authenticateAgent(
  rawKeyOrHeader: string | null | undefined,
): Promise<AuthenticatedContext> {
  const { keyId, secret } = parseApiKey(rawKeyOrHeader);

  const queryText = "SELECT second_brain_security.authenticate_agent($1, $2) AS auth_result;";
  const result = await dbQuery<{ auth_result: any }>(queryText, [keyId, secret]);

  if (!result.rows || result.rows.length === 0 || !result.rows[0].auth_result) {
    throw new AuthenticationError("Authentication failed", 401, "AUTH_FAILED");
  }

  const authData = result.rows[0].auth_result;

  if (!authData.authenticated) {
    const errorReason = authData.error;
    switch (errorReason) {
      case "KEY_DISABLED":
        throw new AuthenticationError("Credential key is currently disabled", 401, "KEY_DISABLED");
      case "KEY_REVOKED":
        throw new AuthenticationError("Credential key has been revoked", 401, "KEY_REVOKED");
      case "KEY_EXPIRED":
        throw new AuthenticationError("Credential key has expired", 401, "KEY_EXPIRED");
      case "PRINCIPAL_DISABLED":
        throw new AuthenticationError(
          "Machine principal identity is disabled",
          403,
          "PRINCIPAL_DISABLED",
        );
      default:
        throw new AuthenticationError("Invalid API key or secret", 401, "INVALID_CREDENTIALS");
    }
  }

  return {
    authenticated: true,
    principal: authData.principal,
    credential: authData.credential,
    principalGrants: authData.principalGrants || [],
    credentialScopes: authData.credentialScopes || [],
  };
}
