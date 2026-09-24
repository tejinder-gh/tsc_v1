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

import { NextResponse } from "next/server";
import { withAgentApi } from "@/lib/second-brain/auth/withAgentApi";
import { ContextService } from "@/lib/second-brain/services/ContextService";
import {
  type ContextSearchInput,
  contextSearchSchema,
} from "@/lib/second-brain/validation/schemas";

export const POST = withAgentApi<ContextSearchInput>({
  operation: "POST /api/internal/v1/context/search",
  schema: contextSearchSchema,
  permission: {
    action: "context.read",
    resourceType: "SECOND_BRAIN_DOMAIN",
    resourceKey: ({ body }) => `domain:${body?.domain}`,
    evalContext: ({ body }) => ({
      domain: body?.domain,
      subdomain: body?.subdomain,
    }),
  },
  handler: async ({ body, authContext }) => {
    const { domain, subdomain, keywords = [], limit = 2 } = body;

    const matches = await ContextService.search(
      {
        domain,
        subdomain,
        keywords,
        limit,
      },
      {
        type: "agent",
        authContext,
      },
    );

    return NextResponse.json({
      domain,
      subdomain: subdomain || null,
      count: matches.length,
      matches,
    });
  },
});
