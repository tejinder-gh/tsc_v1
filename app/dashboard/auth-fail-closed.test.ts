import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import { proxy } from "../../proxy";
import SignInPage from "../(auth)/sign-in/[[...sign-in]]/page";
import DashboardLayout from "./layout";

// Mock Clerk server
vi.mock("@clerk/nextjs/server", () => ({
  createRouteMatcher: (patterns: string[]) => {
    return (req: { nextUrl: { pathname: string } }) => {
      return patterns.some((p) => {
        const regex = new RegExp(`^${p.replace("(.*)", ".*")}`);
        return regex.test(req.nextUrl.pathname);
      });
    };
  },
  clerkMiddleware: vi.fn((_cb) => {
    return vi.fn(async () => {
      return new Response("clerk-passed", { status: 200 });
    });
  }),
}));

// Mock Clerk client components
vi.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  SignIn: () => null,
  SignedIn: ({ children }: { children: React.ReactNode }) => children,
  SignedOut: ({ children }: { children: React.ReactNode }) => children,
  RedirectToSignIn: () => null,
}));

// Mock Next image and link
vi.mock("next/image", () => ({
  default: () => null,
}));

describe("A1: Fail closed when production Clerk configuration is absent", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    delete process.env.CLERK_SECRET_KEY;
    delete process.env.ALLOW_DEV_OPERATOR_AUTH;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe("Proxy boundary protection", () => {
    it("returns HTTP 503 for /dashboard in production when Clerk keys are absent", async () => {
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";
      const req = new NextRequest("http://localhost:3000/dashboard");
      const res = await proxy(req, {} as any);

      expect(res).toBeDefined();
      expect(res!.status).toBe(503);
      const text = await res!.text();
      expect(text).toContain("Operator dashboard is temporarily unavailable");
    });

    it("returns HTTP 503 for /dashboard in development when ALLOW_DEV_OPERATOR_AUTH is not 'true'", async () => {
      (process.env as Record<string, string | undefined>).NODE_ENV = "development";
      process.env.ALLOW_DEV_OPERATOR_AUTH = "false";
      const req = new NextRequest("http://localhost:3000/dashboard/workflows");
      const res = await proxy(req, {} as any);

      expect(res).toBeDefined();
      expect(res!.status).toBe(503);
    });

    it("allows pass-through in development only when ALLOW_DEV_OPERATOR_AUTH is 'true'", async () => {
      (process.env as Record<string, string | undefined>).NODE_ENV = "development";
      process.env.ALLOW_DEV_OPERATOR_AUTH = "true";
      const req = new NextRequest("http://localhost:3000/dashboard");
      const res = await proxy(req, {} as any);

      expect(res).toBeDefined();
      expect(res!.headers.get("x-middleware-next")).toBe("1");
    });

    it("passes through non-dashboard requests without touching Clerk", async () => {
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";
      const req = new NextRequest("http://localhost:3000/about");
      const res = await proxy(req, {} as any);

      expect(res).toBeDefined();
      expect(res!.headers.get("x-middleware-next")).toBe("1");
    });
  });

  describe("Sign-in page rendering safety", () => {
    it("renders safe unavailable screen without dev details or /dashboard link in production", () => {
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";
      const element = SignInPage();
      const html = renderToStaticMarkup(element);

      expect(html).not.toContain("Dev Environment Session");
      expect(html).not.toContain("Super Administrator");
      expect(html).not.toContain("theskillcorner:local");
      expect(html).not.toContain("operator@local");
      expect(html).not.toContain('href="/dashboard"');
      expect(html).toContain("Operator Access Unavailable");
      expect(html).toContain('href="/"');
    });

    it("renders dev portal in development when ALLOW_DEV_OPERATOR_AUTH is 'true'", () => {
      (process.env as Record<string, string | undefined>).NODE_ENV = "development";
      process.env.ALLOW_DEV_OPERATOR_AUTH = "true";
      const element = SignInPage();
      const html = renderToStaticMarkup(element);

      expect(html).toContain("Dev Environment Session");
      expect(html).toContain("Super Administrator");
      expect(html).toContain('href="/dashboard"');
    });
  });

  describe("Dashboard layout safety", () => {
    it("renders static unavailable view without dashboard shell when unconfigured in production", () => {
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";
      const element = DashboardLayout({ children: "secret-data" });
      const html = renderToStaticMarkup(element);

      expect(html).toContain("Operator Dashboard Unavailable");
      expect(html).not.toContain("secret-data");
      expect(html).not.toContain("Workspace");
    });
  });
});
