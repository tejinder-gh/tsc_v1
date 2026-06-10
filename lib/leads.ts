/**
 * What: Client-side lead submission helper - POSTs to /api/lead and fires the
 *       lead_captured analytics event on success.
 * Why: Four different forms submit leads; centralizing fetch, error handling, and the
 *      analytics side effect keeps them consistent (every submit must fire an event).
 * How: JSON POST; throws a user-presentable Error on any failure so forms can show it.
 *      The current pathname is attached as `page` for webhook context.
 * From Where: TheSkillCorner marketing site build brief (capture system spec), 2026-06.
 * When: 2026-06.
 */

import { track } from "./analytics";
import type { LeadPayload } from "./schemas";

export async function submitLead(payload: LeadPayload): Promise<void> {
  const body: LeadPayload = {
    ...payload,
    page: typeof window === "undefined" ? undefined : window.location.pathname,
  };

  let response: Response;
  try {
    response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  if (!response.ok) {
    throw new Error("Something went wrong sending that. Please try again, or email us directly.");
  }

  track("lead_captured", {
    location: payload.lead_source,
    segment: payload.segment ?? "unknown",
  });
}
