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
import { AuthenticationError, authenticateAgent } from "@/lib/second-brain/auth/authenticate";
import { authorize } from "@/lib/second-brain/auth/authorize";
import { ContextRepository } from "@/lib/second-brain/repositories/ContextRepository";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("x-api-key");
    const authContext = await authenticateAgent(authHeader);

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body", code: "BAD_REQUEST" },
        { status: 400 },
      );
    }

    const { domain, subdomain, keywords = [], limit = 2 } = body;

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { error: "Missing required parameter: domain", code: "MISSING_DOMAIN" },
        { status: 400 },
      );
    }

    // Authorize context.read for requested domain/subdomain
    const authResult = authorize({
      context: authContext,
      action: "context.read",
      resourceType: "SECOND_BRAIN_DOMAIN",
      resourceKey: `domain:${domain}`,
      evalContext: {
        domain,
        subdomain,
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
      subdomain,
      keywords: Array.isArray(keywords) ? keywords : [],
      limit: typeof limit === "number" ? Math.min(limit, 10) : 2,
    });

    return NextResponse.json({
      domain,
      subdomain: subdomain || null,
      count: matches.length,
      matches,
    });
  } catch (err: any) {
    if (err instanceof AuthenticationError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.statusCode });
    }

    console.error("Error in POST /api/internal/v1/context/search", err);
    return NextResponse.json(
      { error: "Internal server error", message: err?.message },
      { status: 500 },
    );
  }
}
