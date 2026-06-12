/**
 * What: Client-side lead submission helper - POSTs to /api/lead and fires the
 *       lead_captured analytics event on delivered submissions.
 * Why: Five capture surfaces submit leads; centralizing fetch, error handling, and the
 *      analytics side effect keeps them consistent (every submit must fire an event).
 * How: JSON POST; throws a user-presentable Error on any failure so forms can show it.
 *      The current pathname is attached as `page` for webhook context. Analytics fire
 *      only when the response's `delivered` flag is not false - honeypot-caught bots
 *      and undelivered dev/preview submissions must not pollute the conversion goal.
 * From Where: TheSkillCorner marketing site build brief (capture system spec), 2026-06;
 *      delivered-flag tracking per /plan-eng-review Engineering Spec, 2026-06-12.
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

  let delivered = true;
  try {
    const data = (await response.json()) as { delivered?: boolean };
    delivered = data.delivered !== false;
  } catch {
    // Non-JSON success body: assume delivered so analytics still fire.
  }

  if (delivered) {
    track("lead_captured", {
      location: payload.lead_source,
      segment: payload.segment ?? "unknown",
    });
  }
}
