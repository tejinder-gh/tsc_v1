/**
 * GET /api/internal/v1/endpoints
 * Authorized Introspection Endpoint (Swagger/OpenAPI Catalog)
 *
 * Rules:
 * 1. Requires explicit capability: meta.endpoints.read
 * 2. Filters output: returns only the endpoints/capabilities that the authenticated
 *    credential can actually execute.
 * 3. Never publicly exposes the private API attack surface.
 * 4. Supports ?format=openapi for standard OpenAPI 3.0 schema export.
 */

import { type NextRequest, NextResponse } from "next/server";
import { AuthenticationError, authenticateAgent } from "@/lib/second-brain/auth/authenticate";
import { authorize } from "@/lib/second-brain/auth/authorize";
import { SECOND_BRAIN_ROUTES } from "@/lib/second-brain/routes-registry";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("x-api-key");
    const authContext = await authenticateAgent(authHeader);

    // Enforce authorization for the introspection capability itself
    const introspectionAuth = authorize({
      context: authContext,
      action: "meta.endpoints.read",
      resourceType: "API_ENDPOINT",
      resourceKey: "/api/internal/v1/endpoints",
    });

    if (!introspectionAuth.authorized) {
      return NextResponse.json(
        {
          error: "Forbidden",
          code: "FORBIDDEN",
          reason: introspectionAuth.reason || "Caller lacks meta.endpoints.read capability",
        },
        { status: 403 },
      );
    }

    // Filter endpoints: caller only sees what their credential is authorized to call
    const authorizedRoutes = SECOND_BRAIN_ROUTES.filter((route) => {
      if (route.actionRequired === "meta.endpoints.read") return true;

      const check = authorize({
        context: authContext,
        action: route.actionRequired,
        resourceType: route.resourceType,
        resourceKey: route.resourceKey,
      });

      return check.authorized;
    });

    const url = new URL(request.url);
    const format = url.searchParams.get("format")?.toLowerCase();

    if (format === "openapi") {
      // Dynamic OpenAPI 3.0 export filtered to caller's permitted operations
      const paths: Record<string, any> = {};

      for (const route of authorizedRoutes) {
        if (!paths[route.path]) {
          paths[route.path] = {};
        }

        paths[route.path][route.method.toLowerCase()] = {
          operationId: route.id,
          summary: route.description,
          description: `${route.description}\n\n**Where to Use:** ${route.whereToUse}`,
          parameters: route.howToUse.queryParams
            ? Object.entries(route.howToUse.queryParams).map(([paramName, paramDesc]) => ({
                name: paramName,
                in: "query",
                description: paramDesc,
                schema: { type: "string" },
              }))
            : [],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  example: route.sampleResponse,
                },
              },
            },
            "401": { description: "Authentication failed" },
            "403": { description: "Forbidden - missing required capability" },
          },
        };
      }

      return NextResponse.json({
        openapi: "3.0.3",
        info: {
          title: "Second Brain Agent IAM API",
          version: "1.0.0",
          description: `Authorized API catalog for ${authContext.principal.displayName} (${authContext.credential.keyId})`,
        },
        paths,
      });
    }

    return NextResponse.json({
      domain: "Second Brain API",
      version: "1.0.0",
      caller: {
        principal: authContext.principal.key,
        displayName: authContext.principal.displayName,
        keyId: authContext.credential.keyId,
      },
      authorizedEndpointsCount: authorizedRoutes.length,
      endpoints: authorizedRoutes.map((route) => ({
        id: route.id,
        path: route.path,
        method: route.method,
        actionRequired: route.actionRequired,
        description: route.description,
        howToUse: route.howToUse,
        whereToUse: route.whereToUse,
        sampleRequest: route.sampleRequest,
        sampleResponse: route.sampleResponse,
      })),
    });
  } catch (err: any) {
    if (err instanceof AuthenticationError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.statusCode });
    }

    console.error("Error in GET /api/internal/v1/endpoints", err);
    return NextResponse.json(
      { error: "Internal server error", message: err?.message },
      { status: 500 },
    );
  }
}
