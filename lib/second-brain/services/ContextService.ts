/**
 * What: Context Service - Central domain service & authorization/audit boundary for Second Brain Context.
 * Why: Enforces the architectural invariant that privileged Second Brain context retrieval
 *      must pass through an explicit authorization, audit, and domain validation boundary
 *      whether invoked by external Agent APIs or internal Dashboard Server Actions.
 * How:
 *   HTTP Agent Route ───────┐
 *                           ├── ContextService.search(...)
 *   Dashboard Server Action ┘
 *                                  ↓
 *                          ContextRepository
 *                                  ↓
 *                              PostgreSQL
 */

import { isAuthorizedOperator } from "@/app/dashboard/auth-guard";
import { authorize } from "../auth/authorize";
import {
  ContextRepository,
  type ContextSearchResult,
  type SearchContextParams,
} from "../repositories/ContextRepository";
import type { AuthenticatedContext } from "../types/iam";

export class ContextAuthorizationError extends Error {
  readonly code = "FORBIDDEN";
  readonly statusCode = 403;

  constructor(message: string) {
    super(message);
    this.name = "ContextAuthorizationError";
  }
}

export class ContextValidationError extends Error {
  readonly code = "BAD_REQUEST";
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = "ContextValidationError";
  }
}

export type ContextCaller =
  | {
      type: "agent";
      authContext: AuthenticatedContext;
    }
  | {
      type: "operator";
      userId: string;
    };

export interface ContextAuditRecord {
  timestamp: string;
  actorType: "agent" | "operator";
  actorId: string;
  action: "context.read";
  resource: string;
  domain: string;
  subdomain?: string | null;
  keywordCount: number;
  decision: "allow" | "deny";
  resultCount?: number;
  reason?: string;
}

export type ContextAuditListener = (record: ContextAuditRecord) => void;

// biome-ignore lint/complexity/noStaticOnlyClass: service class manages static state and listeners
export class ContextService {
  private static auditListeners: Set<ContextAuditListener> = new Set();

  /**
   * Register a subscriber for context search audit events (used for audit tracking & test verification).
   */
  public static addAuditListener(listener: ContextAuditListener): () => void {
    ContextService.auditListeners.add(listener);
    return () => ContextService.auditListeners.delete(listener);
  }

  private static emitAudit(record: ContextAuditRecord): void {
    for (const listener of ContextService.auditListeners) {
      try {
        listener(record);
      } catch {
        // Audit listeners must never disrupt the primary flow
      }
    }
  }

  /**
   * Authoritative entry point for Second Brain context retrieval.
   * Enforces:
   * 1. Domain & keyword validation
   * 2. Principal / Operator authorization
   * 3. Structured audit logging
   * 4. Repository delegation
   */
  public static async search(
    params: SearchContextParams,
    caller: ContextCaller,
  ): Promise<ContextSearchResult[]> {
    // 1. Domain & Input Validation
    const domain = params.domain?.trim();
    if (!domain) {
      throw new ContextValidationError("Search domain is required");
    }
    if (domain.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(domain)) {
      throw new ContextValidationError("Invalid search domain format");
    }

    const subdomain = params.subdomain?.trim() || undefined;
    if (subdomain && (subdomain.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(subdomain))) {
      throw new ContextValidationError("Invalid search subdomain format");
    }

    const keywords = (params.keywords || [])
      .map((k) => k.trim())
      .filter((k) => k.length > 0 && k.length <= 50)
      .slice(0, 20);

    const limit = Math.min(Math.max(1, params.limit ?? 2), 10);
    const actorId = caller.type === "agent" ? caller.authContext.principal.id : caller.userId;
    const resource = `domain:${domain}`;

    // 2. Authorization Verification
    if (caller.type === "agent") {
      const authResult = authorize({
        context: caller.authContext,
        action: "context.read",
        resourceType: "SECOND_BRAIN_DOMAIN",
        resourceKey: resource,
        evalContext: { domain, subdomain },
      });

      if (!authResult.authorized) {
        ContextService.emitAudit({
          timestamp: new Date().toISOString(),
          actorType: "agent",
          actorId,
          action: "context.read",
          resource,
          domain,
          subdomain: subdomain || null,
          keywordCount: keywords.length,
          decision: "deny",
          reason: authResult.reason || "Forbidden: Insufficient agent permissions",
        });

        throw new ContextAuthorizationError(
          authResult.reason || "Forbidden: Agent is not authorized to read context for this domain",
        );
      }
    } else if (caller.type === "operator") {
      if (!isAuthorizedOperator(caller.userId)) {
        ContextService.emitAudit({
          timestamp: new Date().toISOString(),
          actorType: "operator",
          actorId,
          action: "context.read",
          resource,
          domain,
          subdomain: subdomain || null,
          keywordCount: keywords.length,
          decision: "deny",
          reason: "Forbidden: Operator not in authorized allowlist",
        });

        throw new ContextAuthorizationError(
          "Forbidden: User is not an authorized dashboard operator",
        );
      }
    } else {
      throw new ContextAuthorizationError("Unknown caller context type");
    }

    // 3. Repository Invocation
    const results = await ContextRepository.searchContext({
      domain,
      subdomain,
      keywords,
      limit,
    });

    // 4. Audit Log Emission
    ContextService.emitAudit({
      timestamp: new Date().toISOString(),
      actorType: caller.type,
      actorId,
      action: "context.read",
      resource,
      domain,
      subdomain: subdomain || null,
      keywordCount: keywords.length,
      decision: "allow",
      resultCount: results.length,
    });

    return results;
  }
}
