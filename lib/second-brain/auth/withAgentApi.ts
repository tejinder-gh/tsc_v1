/**
 * Standardized internal route-handler wrapper for Second Brain agent APIs.
 *
 * Centralizes:
 * - Credential extraction & machine authentication
 * - Authorization & fine-grained permission checks
 * - Bounded request body reading & strict schema validation
 * - Uniform shielded error responses (shielding secrets, stack traces, and database internals)
 *
 * Preserves explicit endpoint routes without generic RPC churn.
 */

import { type NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import { readBoundedBody } from "@/lib/request-limit";
import { internalApiErrorResponse } from "../http";
import type { AuthenticatedContext } from "../types/iam";
import { authenticateAgent } from "./authenticate";
import { authorize } from "./authorize";

export interface AgentApiPermission<TBody = unknown, TParams = unknown> {
  action: string;
  resourceType: string;
  resourceKey?:
    | string
    | ((context: { request: NextRequest; body?: TBody; params?: TParams }) => string);
  evalContext?: (context: {
    request: NextRequest;
    body?: TBody;
    params?: TParams;
  }) => Record<string, unknown>;
}

export interface AgentApiOptions<TBody = unknown, TParams = unknown> {
  operation: string;
  permission: AgentApiPermission<TBody, TParams>;
  schema?: z.ZodType<TBody, z.ZodTypeDef, unknown>;
  maxBodyBytes?: number;
  handler: (context: {
    request: NextRequest;
    body: TBody;
    params: TParams;
    authContext: AuthenticatedContext;
  }) => Promise<NextResponse>;
}

export function withAgentApi<TBody = unknown, TParams = unknown>(
  options: AgentApiOptions<TBody, TParams>,
) {
  return async function handle(
    request: NextRequest,
    segmentData?: { params?: Promise<TParams> | TParams },
  ): Promise<NextResponse> {
    try {
      // 1. Resolve params if dynamic route
      const params = segmentData?.params
        ? await Promise.resolve(segmentData.params)
        : ({} as TParams);

      // 2. Machine Authentication
      const authHeader = request.headers.get("authorization") || request.headers.get("x-api-key");
      const authContext = await authenticateAgent(authHeader);

      // 3. Request parsing & schema validation
      let parsedBody = undefined as TBody;
      if (options.schema) {
        const maxBytes = options.maxBodyBytes ?? 64 * 1024;
        const bounded = await readBoundedBody(request, maxBytes);
        if (!bounded.ok) {
          return NextResponse.json(
            { error: bounded.error, code: "PAYLOAD_TOO_LARGE" },
            { status: bounded.status },
          );
        }

        let rawJson: unknown;
        try {
          rawJson = JSON.parse(bounded.text);
        } catch {
          return NextResponse.json(
            { error: "Invalid JSON body", code: "BAD_REQUEST" },
            { status: 400 },
          );
        }

        if (!rawJson || typeof rawJson !== "object" || Array.isArray(rawJson)) {
          return NextResponse.json(
            { error: "JSON body must be an object", code: "BAD_REQUEST" },
            { status: 400 },
          );
        }

        const parseResult = options.schema.safeParse(rawJson);
        if (!parseResult.success) {
          const firstIssue = parseResult.error.issues[0];
          return NextResponse.json(
            {
              error: firstIssue?.message || "Validation failed",
              code: "BAD_REQUEST",
              details: parseResult.error.flatten(),
            },
            { status: 400 },
          );
        }
        parsedBody = parseResult.data;
      }

      // 4. Authorization & Policy Enforcement
      const resolvedResourceKey =
        typeof options.permission.resourceKey === "function"
          ? options.permission.resourceKey({ request, body: parsedBody, params })
          : options.permission.resourceKey || "*";

      const resolvedEvalContext = options.permission.evalContext
        ? options.permission.evalContext({ request, body: parsedBody, params })
        : undefined;

      const authResult = authorize({
        context: authContext,
        action: options.permission.action,
        resourceType: options.permission.resourceType,
        resourceKey: resolvedResourceKey,
        evalContext: resolvedEvalContext,
      });

      if (!authResult.authorized) {
        return NextResponse.json(
          {
            error: "Forbidden",
            code: "FORBIDDEN",
            reason: authResult.reason || "Forbidden",
          },
          { status: 403 },
        );
      }

      // 5. Route-specific Execution
      return await options.handler({
        request,
        body: parsedBody,
        params,
        authContext,
      });
    } catch (error: unknown) {
      return internalApiErrorResponse(error, options.operation);
    }
  };
}
