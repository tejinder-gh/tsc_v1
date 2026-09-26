/**
 * GET /api/catalogue
 * Authenticated Public Route & API Catalog Introspection Endpoint
 *
 * Rules:
 * 1. Requires valid API key authentication matching the database machine identity schema
 *    (second_brain_security.authenticate_agent) via Bearer token, x-api-key, or ?key=.
 * 2. Exposes all publicly available API endpoints, machine-readable specifications,
 *    marketing/conversion pages, dynamic hubs, and permanent redirects.
 * 3. Supports filtering via ?type=api|document|page|redirect.
 * 4. Supports dynamic slug expansion via ?expand=slugs or ?expand=true.
 * 5. Supports dynamic OpenAPI 3.0 export via ?format=openapi.
 */

import { type NextRequest, NextResponse } from "next/server";
import {
  authenticateCatalogueKey,
  CatalogueAuthError,
  extractApiKey,
} from "@/lib/catalogue/authenticate";
import {
  getPublicEndpointsRegistry,
  type PublicEndpointDefinition,
} from "@/lib/catalogue/public-routes";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const rawKey = extractApiKey(request);
    const authContext = await authenticateCatalogueKey(rawKey);

    const url = request.nextUrl || new URL(request.url);
    const typeFilter = url.searchParams.get("type")?.toLowerCase();
    const expandSlugs =
      url.searchParams.get("expand")?.toLowerCase() === "slugs" ||
      url.searchParams.get("expand")?.toLowerCase() === "true";
    const format = url.searchParams.get("format")?.toLowerCase();

    const allEndpoints = getPublicEndpointsRegistry();

    // 1. Filter by type if requested
    let filtered = allEndpoints;
    if (typeFilter && ["api", "document", "page", "redirect"].includes(typeFilter)) {
      filtered = filtered.filter((ep) => ep.type === typeFilter);
    }

    // 2. Expand dynamic slugs if requested
    interface OutputEndpoint extends PublicEndpointDefinition {
      concreteUrl?: string;
    }

    let finalEndpoints: OutputEndpoint[] = filtered;

    if (expandSlugs) {
      const expanded: OutputEndpoint[] = [];
      for (const ep of filtered) {
        expanded.push(ep);
        if (ep.dynamicSlugs && ep.dynamicSlugs.length > 0) {
          const basePath = ep.path.replace("/[slug]", "");
          for (const slug of ep.dynamicSlugs) {
            expanded.push({
              ...ep,
              path: `${basePath}/${slug}`,
              title: `${ep.title} (${slug})`,
              concreteUrl: `${basePath}/${slug}`,
              dynamicSlugs: undefined,
            });
          }
        }
      }
      finalEndpoints = expanded;
    }

    // 3. Format: OpenAPI 3.0 Dynamic Export for public APIs
    if (format === "openapi") {
      const apiEndpoints = allEndpoints.filter((ep) => ep.type === "api");
      const paths: Record<string, Record<string, unknown>> = {};

      for (const ep of apiEndpoints) {
        if (!paths[ep.path]) {
          paths[ep.path] = {};
        }

        const methodKey = ep.method.toLowerCase();
        paths[ep.path][methodKey] = {
          summary: ep.title,
          description: `${ep.description}\n\n**Authentication:** ${ep.authDetails || "None"}`,
          operationId: ep.path.replace(/^\/api\//, "").replace(/\//g, "-"),
          tags: [ep.category || "Public APIs"],
          parameters: ep.queryParams
            ? Object.entries(ep.queryParams).map(([name, desc]) => ({
                name,
                in: "query",
                description: desc,
                required: false,
                schema: { type: "string" },
              }))
            : [],
          requestBody: ep.requestSchema
            ? {
                required: true,
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: Object.fromEntries(
                        Object.entries(ep.requestSchema).map(([k, v]) => [
                          k,
                          { type: typeof v === "string" ? v : "string" },
                        ]),
                      ),
                    },
                  },
                },
              }
            : undefined,
          responses: {
            "200": {
              description: "Successful response",
              content: {
                [ep.contentType || "application/json"]: {
                  schema: { type: "object" },
                },
              },
            },
            "401": { description: "Unauthorized - API key missing or invalid" },
            "403": { description: "Forbidden" },
            "429": { description: "Rate limit exceeded (10 requests per minute)" },
          },
        };
      }

      return NextResponse.json(
        {
          openapi: "3.0.3",
          info: {
            title: "The Skill Corner Public API Specification",
            version: "1.0.0",
            description: `Authoritative public API specification exported for ${authContext.principal.displayName} (${authContext.credential.keyId})`,
          },
          paths,
        },
        {
          headers: {
            "Cache-Control": "private, no-cache, no-store, must-revalidate",
          },
        },
      );
    }

    // 4. Default JSON Catalog response
    const summary = {
      totalEndpoints: finalEndpoints.length,
      apiEndpoints: finalEndpoints.filter((ep) => ep.type === "api").length,
      publicPages: finalEndpoints.filter((ep) => ep.type === "page").length,
      machineReadableDocuments: finalEndpoints.filter((ep) => ep.type === "document").length,
      redirects: finalEndpoints.filter((ep) => ep.type === "redirect").length,
    };

    return NextResponse.json(
      {
        domain: "The Skill Corner Public API & Route Catalogue",
        version: "1.0.0",
        generatedAt: new Date().toISOString(),
        authenticatedAs: {
          principal: authContext.principal.key,
          displayName: authContext.principal.displayName,
          principalType: authContext.principal.principalType,
          keyId: authContext.credential.keyId,
        },
        summary,
        endpoints: finalEndpoints,
      },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      },
    );
  } catch (error: unknown) {
    if (error instanceof CatalogueAuthError) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          code: error.code,
          message: error.message,
        },
        {
          status: error.statusCode,
          headers: {
            "Cache-Control": "no-store",
            "WWW-Authenticate": 'Bearer realm="TheSkillCorner-Public-Catalogue"',
          },
        },
      );
    }

    console.error("[Catalogue Error] Unexpected error in /api/catalogue", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred while processing the catalogue request.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
