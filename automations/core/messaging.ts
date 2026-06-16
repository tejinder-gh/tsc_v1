/**
 * What: Channel selection and message assembly - turning a contact + a desired channel into a
 *       concrete address, respecting consent.
 * Why: Consent and channel fallback are the same for every automation, so they live in one place.
 *       A recipe should never re-implement "prefer SMS, fall back to email, but only with consent".
 * How: pickChannel resolves "auto" to the first consented channel with a usable address, or a
 *       specific channel if asked. Returns null (with no side effects) when nothing is deliverable,
 *       so the caller can record a skip rather than crash.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import type { Channel, Contact } from "./types";

export interface Deliverable {
  channel: Channel;
  to: string;
}

/**
 * Resolve a sendable (channel, address) pair for a contact.
 * - preferred "auto": try SMS (needs phone + sms consent), then email.
 * - preferred specific: use it only if consent and address exist.
 * Returns null when the contact cannot be reached on the requested channel(s).
 */
export function pickChannel(contact: Contact, preferred: Channel | "auto"): Deliverable | null {
  const sms: Deliverable | null =
    contact.consent.sms && contact.phone ? { channel: "sms", to: contact.phone } : null;
  const email: Deliverable | null =
    contact.consent.email && contact.email ? { channel: "email", to: contact.email } : null;

  if (preferred === "sms") return sms;
  if (preferred === "email") return email;
  return sms ?? email;
}

/** Why a step could not be delivered, for logging and reporting. */
export function undeliverableReason(contact: Contact, preferred: Channel | "auto"): string {
  if (preferred === "sms") {
    if (!contact.phone) return "no phone on file";
    if (!contact.consent.sms) return "no SMS consent";
  }
  if (preferred === "email") {
    if (!contact.email) return "no email on file";
    if (!contact.consent.email) return "no email consent";
  }
  return "no consented channel with a usable address";
}
