/**
 * What: OpenReplay session replay provider with deny-by-default route allowlist.
 * Why: Guarantees replay ONLY runs on explicit public marketing routes when explicitly
 *      enabled. Private, operator, and authenticated routes are denied by default.
 * How: Validates route eligibility BEFORE importing @openreplay/tracker; initializes
 *      in Private Mode with input hiding, zero user identification, and network sanitization.
 * From Where: Observability Foundation Architecture, 2026-09.
 */

import { getTelemetryConfig } from "../config";

/**
 * Explicit allowlist of public marketing routes eligible for session replay.
 * Deny-by-default: Any route NOT on this list (including all operator/auth routes)
 * will NEVER initialize OpenReplay.
 */
export const REPLAY_ALLOWLISTED_ROUTES: readonly string[] = [
  "/",
  "/about",
  "/how-it-works",
  "/results",
  "/book",
  "/contact",
  "/library",
  "/checklist",
  "/social",
  "/digital-services",
  "/what-we-automate",
  "/industries",
  "/newsletters",
];

export function isRouteEligibleForReplay(pathname: string): boolean {
  if (!pathname || typeof pathname !== "string") return false;

  // Structural denial: operator, auth, internal, or dev routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/dev")
  ) {
    return false;
  }

  // Deny-by-default allowlist match
  return REPLAY_ALLOWLISTED_ROUTES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

let trackerInstance: unknown = null;
let isStarted = false;

export async function startOpenReplayIfAllowed(currentPathname?: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const config = getTelemetryConfig();
  if (!config.sessionReplay.enabled || !config.sessionReplay.projectKey) {
    return false;
  }

  const path = currentPathname || window.location.pathname;
  if (!isRouteEligibleForReplay(path)) {
    return false;
  }

  if (isStarted && trackerInstance) {
    return true;
  }

  try {
    // Dynamic import strictly AFTER allowlist verification
    const TrackerModule = await import("@openreplay/tracker");
    const Tracker = TrackerModule.default || TrackerModule;

    const tracker = new Tracker({
      projectKey: config.sessionReplay.projectKey,
      ingestPoint: config.sessionReplay.ingestPoint || undefined,
      respectDoNotTrack: true,
      // InputMode: 2 is Hidden (maximum privacy, masks inputs completely)
      defaultInputMode: 2,
      obscureInputNumbers: true,
      obscureInputEmails: true,
      obscureInputDates: true,
      obscureTextNumbers: true,
      obscureTextEmails: true,
      // Disable recording console logs containing application data
      consoleMethods: null,
      // Sanitize network activity (never send request/response bodies)
      network: {
        sessionTokenHeader: false,
        failuresOnly: true,
        capturePayload: false,
        ignoreHeaders: ["Authorization", "Cookie", "Set-Cookie"],
        captureInIframes: false,
      },
    });

    // CRITICAL: NEVER call setUserID or identify - user identity is strictly prohibited
    await tracker.start();
    trackerInstance = tracker;
    isStarted = true;
    return true;
  } catch {
    // Fail-open: tracker failure must never crash or disrupt user navigation
    return false;
  }
}
