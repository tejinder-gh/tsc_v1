import { describe, expect, it } from "vitest";
import nextConfig, { contentSecurityPolicy, securityHeaders } from "../next.config.mjs";

describe("Production Baseline Security Headers (Ticket A4)", () => {
  it("exports valid securityHeaders array", () => {
    expect(Array.isArray(securityHeaders)).toBe(true);
    expect(securityHeaders.length).toBeGreaterThanOrEqual(6);
  });

  it("configures nextConfig.headers() covering /:path*", async () => {
    expect(nextConfig.headers).toBeDefined();
    if (!nextConfig.headers) throw new Error("headers() not defined on nextConfig");
    const headerRules = await nextConfig.headers();
    expect(Array.isArray(headerRules)).toBe(true);

    const rootRule = headerRules.find((rule: { source: string }) => rule.source === "/:path*");
    expect(rootRule).toBeDefined();
    expect(rootRule?.headers).toEqual(securityHeaders);
  });

  it("includes required security headers with exact baseline policies", () => {
    const headersMap = new Map(securityHeaders.map((h) => [h.key, h.value]));

    // 1. Content-Type Options
    expect(headersMap.get("X-Content-Type-Options")).toBe("nosniff");

    // 2. Framing Protection
    expect(headersMap.get("X-Frame-Options")).toBe("SAMEORIGIN");

    // 3. Referrer Policy
    expect(headersMap.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");

    // 4. Permissions Policy
    const permissions = headersMap.get("Permissions-Policy");
    expect(permissions).toBeDefined();
    expect(permissions).toContain("camera=()");
    expect(permissions).toContain("microphone=()");
    expect(permissions).toContain("geolocation=()");
    expect(permissions).toContain("browsing-topics=()");
    expect(permissions).toContain("payment=()");

    // 5. Cross-Origin Opener Policy (allows Clerk OAuth popups)
    expect(headersMap.get("Cross-Origin-Opener-Policy")).toBe("same-origin-allow-popups");

    // 6. CSP Header present
    expect(headersMap.get("Content-Security-Policy")).toBe(contentSecurityPolicy);
  });

  describe("Content Security Policy (CSP) Directives", () => {
    const directives = contentSecurityPolicy
      .split("; ")
      .reduce<Record<string, string[]>>((acc, directiveStr) => {
        const parts = directiveStr.trim().split(/\s+/);
        const name = parts[0];
        const values = parts.slice(1);
        acc[name] = values;
        return acc;
      }, {});

    it("enforces mandatory baseline directives", () => {
      expect(directives["default-src"]).toEqual(["'self'"]);
      expect(directives["base-uri"]).toEqual(["'self'"]);
      expect(directives["object-src"]).toEqual(["'none'"]);
      expect(directives["frame-ancestors"]).toEqual(["'self'"]);
    });

    it("authorizes required origins for script execution without data: or bare *", () => {
      const scriptSrc = directives["script-src"];
      expect(scriptSrc).toBeDefined();
      expect(scriptSrc).toContain("'self'");
      expect(scriptSrc).toContain("'unsafe-inline'"); // documented runtime requirement for Next.js hydration
      expect(scriptSrc).toContain("https://challenges.cloudflare.com"); // Clerk Turnstile
      expect(scriptSrc).toContain("https://*.clerk.accounts.dev"); // Clerk dev
      expect(scriptSrc).toContain("https://clerk.theskillcorner.com"); // Clerk prod
      expect(scriptSrc).toContain("https://app.cal.com"); // Cal.com embed
      expect(scriptSrc).toContain("https://stats.theskillcorner.com"); // Plausible
      expect(scriptSrc).toContain("https://www.googletagmanager.com"); // GA/GTM

      // Non-negotiable invariant: NEVER add data: to script-src
      expect(scriptSrc).not.toContain("data:");
      expect(scriptSrc).not.toContain("*");
    });

    it("restricts form-action to self and Clerk auth endpoints", () => {
      const formAction = directives["form-action"];
      expect(formAction).toBeDefined();
      expect(formAction).toContain("'self'");
      expect(formAction).toContain("https://api.clerk.com");
      expect(formAction).toContain("https://*.clerk.accounts.dev");
      expect(formAction).toContain("https://clerk.theskillcorner.com");
    });

    it("authorizes framing only for self, Cal.com, Clerk, and Cloudflare", () => {
      const frameSrc = directives["frame-src"];
      expect(frameSrc).toBeDefined();
      expect(frameSrc).toContain("'self'");
      expect(frameSrc).toContain("https://cal.com");
      expect(frameSrc).toContain("https://app.cal.com");
      expect(frameSrc).toContain("https://challenges.cloudflare.com");
    });

    it("does not use bare wildcard * across any directive", () => {
      for (const [directiveName, sources] of Object.entries(directives)) {
        for (const source of sources) {
          expect(
            source,
            `Directive ${directiveName} contains illegal bare wildcard: ${source}`,
          ).not.toBe("*");
        }
      }
    });
  });
});
