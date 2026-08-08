import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only the operator dashboard requires a Clerk session. Every other route (the
// marketing site, API routes, etc.) passes through untouched.
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/dashboard(.*)"],
};
