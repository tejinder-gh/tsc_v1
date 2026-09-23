/**
 * Authorized Introspection Endpoint Test Suite
 * Validates capability enforcement (meta.endpoints.read), output filtering,
 * and OpenAPI 3.0 schema generation.
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET } from "../../../app/api/internal/v1/endpoints/route";
import { setMockQueryHandler } from "../db/client";
import { SECOND_BRAIN_ROUTES } from "../routes-registry";

describe("GET /api/internal/v1/endpoints (Introspection Catalog)", () => {
  it("has one unique registry operation for every implemented internal route", () => {
    const registeredOperations = new Set<string>();

    for (const route of SECOND_BRAIN_ROUTES) {
      expect(route.actionRequired).toBeTruthy();
      expect(registeredOperations.has(`${route.method} ${route.path}`)).toBe(false);
      registeredOperations.add(`${route.method} ${route.path}`);

      const implementationPath = route.path
        .replace(/^\/api\//, "app/api/")
        .replace(/\[key\]/g, "[key]");
      expect(existsSync(resolve(process.cwd(), `${implementationPath}/route.ts`))).toBe(true);
    }

    expect(registeredOperations.size).toBe(11);
  });
  it("returns 403 Forbidden when caller lacks meta.endpoints.read", async () => {
    // Mock authentication with no meta.endpoints.read grant
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: true,
            principal: {
              id: "p-1",
              key: "claude",
              displayName: "Claude",
              principalType: "agent",
            },
            credential: {
              id: "c-1",
              keyId: "sb_live_claude_1",
              description: null,
              lastRotatedAt: null,
              expiresAt: null,
            },
            principalGrants: [
              {
                grantId: "g-1",
                effect: "ALLOW",
                action: "context.read",
                resourceType: "SECOND_BRAIN_DOMAIN",
                resourceKey: "domain:strategy",
                constraints: null,
                expiresAt: null,
              },
            ],
            credentialScopes: [
              {
                scopeId: "s-1",
                effect: "ALLOW",
                action: "context.read",
                resourceType: "SECOND_BRAIN_DOMAIN",
                resourceKey: "domain:strategy",
                constraints: null,
                expiresAt: null,
              },
            ],
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const req = new NextRequest("http://localhost:3000/api/internal/v1/endpoints", {
      headers: {
        authorization: "Bearer sb_live_claude_1.secret",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe("FORBIDDEN");
  });

  it("returns filtered endpoints matching caller's permitted operations when authorized", async () => {
    // Mock authentication with meta.endpoints.read AND context.read
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: true,
            principal: {
              id: "p-1",
              key: "claude",
              displayName: "Claude",
              principalType: "agent",
            },
            credential: {
              id: "c-1",
              keyId: "sb_live_claude_1",
              description: null,
              lastRotatedAt: null,
              expiresAt: null,
            },
            principalGrants: [
              {
                grantId: "g-meta",
                effect: "ALLOW",
                action: "meta.endpoints.read",
                resourceType: "API_ENDPOINT",
                resourceKey: "/api/internal/v1/endpoints",
                constraints: null,
                expiresAt: null,
              },
              {
                grantId: "g-ctx",
                effect: "ALLOW",
                action: "context.read",
                resourceType: "SECOND_BRAIN_DOMAIN",
                resourceKey: "domain:*",
                constraints: null,
                expiresAt: null,
              },
            ],
            credentialScopes: [
              {
                scopeId: "s-meta",
                effect: "ALLOW",
                action: "meta.endpoints.read",
                resourceType: "API_ENDPOINT",
                resourceKey: "/api/internal/v1/endpoints",
                constraints: null,
                expiresAt: null,
              },
              {
                scopeId: "s-ctx",
                effect: "ALLOW",
                action: "context.read",
                resourceType: "SECOND_BRAIN_DOMAIN",
                resourceKey: "domain:*",
                constraints: null,
                expiresAt: null,
              },
            ],
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const req = new NextRequest("http://localhost:3000/api/internal/v1/endpoints", {
      headers: {
        authorization: "Bearer sb_live_claude_1.secret",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.domain).toBe("Second Brain API");
    expect(body.caller.principal).toBe("claude");
    // Caller only has meta.endpoints.read and context.read, so only these two endpoints appear
    const endpointIds = (body.endpoints as Array<{ id: string }>).map((endpoint) => endpoint.id);
    expect(endpointIds).toContain("endpoints-introspection");
    expect(endpointIds).toContain("context-search");
    // Automation OS endpoints should NOT be exposed to Claude
    expect(endpointIds).not.toContain("automations-claims-acquire");
  });

  it("exports valid OpenAPI 3.0 document when format=openapi is requested", async () => {
    const req = new NextRequest("http://localhost:3000/api/internal/v1/endpoints?format=openapi", {
      headers: {
        authorization: "Bearer sb_live_claude_1.secret",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);
    const doc = await res.json();

    expect(doc.openapi).toBe("3.0.3");
    expect(doc.info.title).toContain("Second Brain Agent IAM API");
    expect(doc.paths["/api/internal/v1/context/search"]).toBeDefined();
    expect(doc.paths["/api/internal/v1/endpoints"]).toBeDefined();
  });
});
