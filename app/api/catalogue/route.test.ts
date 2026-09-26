/**
 * Tests for GET /api/catalogue and GET /api/catalog
 * Validates database authentication matching model access control,
 * credential error handling, filtering, slug expansion, and OpenAPI generation.
 */

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";
import { setMockQueryHandler } from "@/lib/second-brain/db/client";
import { GET as getCatalogAlias } from "../catalog/route";
import { GET } from "./route";

describe("GET /api/catalogue (Public Endpoints Catalog)", () => {
  beforeEach(() => {
    setMockQueryHandler(null);
  });

  it("returns 401 MISSING_CREDENTIALS when no key is provided", async () => {
    const req = new NextRequest("http://localhost:3000/api/catalogue");
    const res = await GET(req);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.code).toBe("MISSING_CREDENTIALS");
    expect(body.error).toBe("Unauthorized");
  });

  it("returns 401 INVALID_CREDENTIALS when key is rejected by database", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: false,
            error: "KEY_NOT_FOUND",
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const req = new NextRequest("http://localhost:3000/api/catalogue", {
      headers: {
        authorization: "Bearer sb_live_chatgpt_invalid.secret123",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.code).toBe("INVALID_CREDENTIALS");
  });

  it("returns 401 KEY_REVOKED when key is revoked in database", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: false,
            error: "KEY_REVOKED",
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const req = new NextRequest("http://localhost:3000/api/catalogue", {
      headers: {
        "x-api-key": "sb_live_claude_revoked.secret123",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.code).toBe("KEY_REVOKED");
  });

  it("returns 403 PRINCIPAL_DISABLED when machine principal identity is disabled", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: false,
            error: "PRINCIPAL_DISABLED",
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const req = new NextRequest("http://localhost:3000/api/catalogue?key=sb_live_disabled.sec");
    const res = await GET(req);

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe("PRINCIPAL_DISABLED");
  });

  it("returns 403 FORBIDDEN when caller has an explicit DENY on catalogue", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: true,
            principal: {
              id: "p-1",
              key: "chatgpt",
              displayName: "ChatGPT Assistant",
              principalType: "agent",
              enabled: true,
            },
            credential: {
              id: "c-1",
              keyId: "sb_live_chatgpt_123",
              description: "Test Key",
            },
            principalGrants: [
              {
                grantId: "g-deny",
                effect: "DENY",
                action: "catalogue.read",
                resourceType: "API_ENDPOINT",
                resourceKey: "/api/catalogue",
              },
            ],
            credentialScopes: [],
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const req = new NextRequest("http://localhost:3000/api/catalogue", {
      headers: {
        authorization: "Bearer sb_live_chatgpt_123.validsecret",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe("FORBIDDEN");
  });

  it("returns 200 and full catalogue when authenticated with Bearer header", async () => {
    setMockQueryHandler(async (_text, params) => {
      expect(params?.[0]).toBe("sb_live_chatgpt_123");
      expect(params?.[1]).toBe("validsecret");

      return {
        rows: [
          {
            auth_result: {
              authenticated: true,
              principal: {
                id: "p-1",
                key: "chatgpt",
                displayName: "ChatGPT Assistant",
                principalType: "agent",
                enabled: true,
              },
              credential: {
                id: "c-1",
                keyId: "sb_live_chatgpt_123",
                description: "Test Key",
              },
              principalGrants: [],
              credentialScopes: [],
            },
          },
        ],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    });

    const req = new NextRequest("http://localhost:3000/api/catalogue", {
      headers: {
        authorization: "Bearer sb_live_chatgpt_123.validsecret",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.domain).toBe("The Skill Corner Public API & Route Catalogue");
    expect(body.authenticatedAs.principal).toBe("chatgpt");
    expect(body.summary.totalEndpoints).toBeGreaterThan(20);
    expect(body.summary.apiEndpoints).toBeGreaterThanOrEqual(6);
    expect(body.summary.publicPages).toBeGreaterThanOrEqual(15);
    expect(body.summary.machineReadableDocuments).toBe(6);

    // Verify key public endpoints exist in catalogue
    const paths = body.endpoints.map((ep: { path: string }) => ep.path);
    expect(paths).toContain("/api/lead");
    expect(paths).toContain("/api/newsletter/subscribe");
    expect(paths).toContain("/api/inbound");
    expect(paths).toContain("/api/cron");
    expect(paths).toContain("/api/v1/relay");
    expect(paths).toContain("/api/catalogue");
    expect(paths).toContain("/llms.txt");
    expect(paths).toContain("/pricing.md");
    expect(paths).toContain("/");
    expect(paths).toContain("/what-we-automate");
    expect(paths).toContain("/digital-services");
    expect(paths).toContain("/industries");
  });

  it("authenticates single-token keys directly matching DB records", async () => {
    setMockQueryHandler(async (_text, params) => {
      // Direct single-token maps token to keyId and secret
      expect(params?.[0]).toBe("cat_direct_token_123");
      expect(params?.[1]).toBe("cat_direct_token_123");

      return {
        rows: [
          {
            auth_result: {
              authenticated: true,
              principal: {
                id: "p-2",
                key: "claude",
                displayName: "Claude Assistant",
                principalType: "agent",
                enabled: true,
              },
              credential: {
                id: "c-2",
                keyId: "cat_direct_token_123",
                description: "Single Token Key",
              },
              principalGrants: [],
              credentialScopes: [],
            },
          },
        ],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      };
    });

    const req = new NextRequest("http://localhost:3000/api/catalogue", {
      headers: {
        "x-api-key": "cat_direct_token_123",
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.authenticatedAs.keyId).toBe("cat_direct_token_123");
  });

  it("filters endpoints by ?type=api", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: true,
            principal: {
              id: "p-1",
              key: "chatgpt",
              displayName: "ChatGPT",
              principalType: "agent",
              enabled: true,
            },
            credential: { id: "c-1", keyId: "k-1", description: null },
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const req = new NextRequest("http://localhost:3000/api/catalogue?key=k-1.secret&type=api");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.endpoints.length).toBe(body.summary.apiEndpoints);
    for (const ep of body.endpoints) {
      expect(ep.type).toBe("api");
    }
  });

  it("filters endpoints by ?type=document", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: true,
            principal: {
              id: "p-1",
              key: "chatgpt",
              displayName: "ChatGPT",
              principalType: "agent",
              enabled: true,
            },
            credential: { id: "c-1", keyId: "k-1", description: null },
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const req = new NextRequest("http://localhost:3000/api/catalogue?key=k-1.secret&type=document");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.endpoints.length).toBe(6);
    for (const ep of body.endpoints) {
      expect(ep.type).toBe("document");
    }
  });

  it("expands dynamic slugs into concrete URLs when ?expand=slugs is set", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: true,
            principal: {
              id: "p-1",
              key: "chatgpt",
              displayName: "ChatGPT",
              principalType: "agent",
              enabled: true,
            },
            credential: { id: "c-1", keyId: "k-1", description: null },
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const req = new NextRequest("http://localhost:3000/api/catalogue?key=k-1.secret&expand=slugs");
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    const paths = body.endpoints.map((ep: { path: string }) => ep.path);

    // Dynamic slug expansions should be present
    expect(paths).toContain("/digital-services/ai-agent-development");
    expect(paths).toContain("/what-we-automate/ai-receptionist");
    expect(paths).toContain("/industries/retail-stores");
    expect(paths).toContain("/newsletters/tech-founder-briefing");
  });

  it("generates valid OpenAPI 3.0 specification when ?format=openapi is requested", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: true,
            principal: {
              id: "p-1",
              key: "chatgpt",
              displayName: "ChatGPT",
              principalType: "agent",
              enabled: true,
            },
            credential: { id: "c-1", keyId: "k-1", description: null },
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const req = new NextRequest(
      "http://localhost:3000/api/catalogue?key=k-1.secret&format=openapi",
    );
    const res = await GET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.openapi).toBe("3.0.3");
    expect(body.info.title).toContain("The Skill Corner Public API Specification");
    expect(body.paths["/api/lead"]).toBeDefined();
    expect(body.paths["/api/newsletter/subscribe"]).toBeDefined();
    expect(body.paths["/api/inbound"]).toBeDefined();
    expect(body.paths["/api/catalogue"]).toBeDefined();
  });

  it("serves the /api/catalog alias identically", async () => {
    setMockQueryHandler(async () => ({
      rows: [
        {
          auth_result: {
            authenticated: true,
            principal: {
              id: "p-1",
              key: "chatgpt",
              displayName: "ChatGPT",
              principalType: "agent",
              enabled: true,
            },
            credential: { id: "c-1", keyId: "k-1", description: null },
          },
        },
      ],
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
    }));

    const req = new NextRequest("http://localhost:3000/api/catalog?key=k-1.secret");
    const res = await getCatalogAlias(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.domain).toBe("The Skill Corner Public API & Route Catalogue");
  });
});
