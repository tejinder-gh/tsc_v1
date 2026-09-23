/**
 * POST /api/internal/v1/context/search
 * Canonical Context Search Endpoint
 *
 * Enforces authorization before query execution:
 * 1. Authenticates agent credentials
 * 2. Authorizes context.read for the requested domain/subdomain
 * 3. Intersects query against canonical resource_context_index
 * 4. Returns ranked top 1-2 canonical resources
 */

import { type NextRequest, NextResponse } from "next/server";
import { authenticateAgent } from "@/lib/second-brain/auth/authenticate";
import { authorize } from "@/lib/second-brain/auth/authorize";
import { internalApiErrorResponse } from "@/lib/second-brain/http";
import { ContextRepository } from "@/lib/second-brain/repositories/ContextRepository";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("x-api-key");
    const authContext = await authenticateAgent(authHeader);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body", code: "BAD_REQUEST" },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "JSON body must be an object", code: "BAD_REQUEST" },
        { status: 400 },
      );
    }

    const { domain, subdomain, keywords = [], limit = 2 } = body as Record<string, unknown>;

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { error: "Missing required parameter: domain", code: "MISSING_DOMAIN" },
        { status: 400 },
      );
    }
    const normalizedSubdomain = typeof subdomain === "string" ? subdomain : undefined;

    // Authorize context.read for requested domain/subdomain
    const authResult = authorize({
      context: authContext,
      action: "context.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: `domain:${domain}`,
      evalContext: {
        domain,
        subdomain: normalizedSubdomain,
      },
    });

    if (!authResult.authorized) {
      return NextResponse.json(
        {
          error: "Forbidden",
          code: "FORBIDDEN",
          reason: authResult.reason || `Not authorized to access context domain: ${domain}`,
        },
        { status: 403 },
      );
    }

    // Authorization passed: execute canonical Context RAG search
    const matches = await ContextRepository.searchContext({
      domain,
      subdomain: normalizedSubdomain,
      keywords: Array.isArray(keywords)
        ? keywords.filter((value): value is string => typeof value === "string")
        : [],
      limit:
        typeof limit === "number" && Number.isInteger(limit) ? Math.max(1, Math.min(limit, 10)) : 2,
    });

    return NextResponse.json({
      domain,
      subdomain: normalizedSubdomain || null,
      count: matches.length,
      matches,
    });
  } catch (error: unknown) {
    return internalApiErrorResponse(error, "POST /api/internal/v1/context/search");
  }
}
