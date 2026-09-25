import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {
  type NextFetchEvent,
  type NextMiddleware,
  type NextRequest,
  NextResponse,
} from "next/server";

// Only the operator dashboard requires a Clerk session. Every other route (the
// marketing site, API routes, etc.) passes through untouched.
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export function isClerkConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
}

export function isDevOperatorAuthAllowed(): boolean {
  return process.env.NODE_ENV === "development" && process.env.ALLOW_DEV_OPERATOR_AUTH === "true";
}

let cachedClerkHandler: NextMiddleware | null = null;

function getClerkHandler() {
  if (!isClerkConfigured()) {
    return null;
  }
  if (!cachedClerkHandler) {
    cachedClerkHandler = clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    });
  }
  return cachedClerkHandler;
}

export async function proxy(req: NextRequest, event: NextFetchEvent) {
  if (isProtectedRoute(req)) {
    const handler = getClerkHandler();

    if (!handler) {
      if (isDevOperatorAuthAllowed()) {
        return NextResponse.next();
      }

      // In production or unapproved development, fail closed with HTTP 503
      return new NextResponse(
        "Operator dashboard is temporarily unavailable. Identity services are not configured.",
        {
          status: 503,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
          },
        },
      );
    }

    return handler(req, event);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/dashboard(.*)"],
};
