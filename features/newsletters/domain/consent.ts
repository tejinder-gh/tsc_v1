/**
 * What: Newsletter consent, unsubscribe, and suppression domain models and security utilities.
 * Why: Regulatory compliance (CASL / CAN-SPAM / GDPR) requires verifiable consent records,
 *      one-click unguessable unsubscribe tokens, and suppression enforcement before delivery.
 * How: Typed consent lifecycle states (pending, active, unsubscribed, suppressed),
 *      HMAC-SHA256 signed token generation/verification for tamper-proof unsubscribe links,
 *      and suppression check invariants.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export type SubscriptionStatus = "pending" | "active" | "unsubscribed" | "suppressed";

export interface NewsletterSubscription {
  id: string;
  email: string;
  newsletterSlug: string;
  status: SubscriptionStatus;
  subscribedAt: string;
  source: string;
  consentVersion: string;
  consentContext: string;
  unsubscribedAt?: string;
  suppressedReason?: "hard_bounce" | "spam_complaint" | "manual_suppression";
}

export interface UnsubscribeTokenPayload {
  email: string;
  newsletterSlug: string;
  issuedAt: number; // Unix timestamp in seconds
}

/**
 * Generates an opaque, tamper-proof HMAC-SHA256 signed unsubscribe token.
 * Prevents arbitrary third parties from guessing identifiers or unsubscribing other users.
 */
export function generateUnsubscribeToken(
  email: string,
  newsletterSlug: string,
  secretKey: string,
  issuedAt: number = Math.floor(Date.now() / 1000),
): string {
  const data = `${email.toLowerCase().trim()}:${newsletterSlug}:${issuedAt}`;
  const signature = createHmac("sha256", secretKey).update(data).digest("hex");
  const payloadBase64 = Buffer.from(data).toString("base64url");
  return `${payloadBase64}.${signature}`;
}

/**
 * Validates an unsubscribe token and returns the parsed payload if authentic.
 * Rejects expired tokens (> 90 days) and tampered signatures.
 */
export function verifyUnsubscribeToken(
  token: string,
  secretKey: string,
  maxAgeSeconds: number = 90 * 24 * 60 * 60,
): { valid: true; payload: UnsubscribeTokenPayload } | { valid: false; reason: string } {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return { valid: false, reason: "Malformed token format" };
  }

  const [payloadBase64, signature] = parts;
  let decoded: string;
  try {
    decoded = Buffer.from(payloadBase64, "base64url").toString("utf-8");
  } catch {
    return { valid: false, reason: "Invalid base64 payload" };
  }

  const dataParts = decoded.split(":");
  if (dataParts.length !== 3) {
    return { valid: false, reason: "Invalid token payload structure" };
  }

  const [email, newsletterSlug, issuedAtStr] = dataParts;
  const issuedAt = Number.parseInt(issuedAtStr, 10);
  if (Number.isNaN(issuedAt)) {
    return { valid: false, reason: "Invalid issuance timestamp" };
  }

  // Verify HMAC signature with timing-safe comparison
  const expectedSignature = createHmac("sha256", secretKey).update(decoded).digest("hex");
  if (signature.length !== expectedSignature.length) {
    return { valid: false, reason: "Invalid signature length" };
  }

  const sigBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  if (!timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false, reason: "Signature mismatch" };
  }

  // Check expiration
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (currentTimestamp - issuedAt > maxAgeSeconds) {
    return { valid: false, reason: "Token expired" };
  }

  return {
    valid: true,
    payload: {
      email,
      newsletterSlug,
      issuedAt,
    },
  };
}

/**
 * Checks whether a given recipient is eligible to receive newsletter deliveries.
 * Invariant: Never deliver to unsubscribed or suppressed addresses.
 */
export function isDeliveryEligible(subscription: NewsletterSubscription): boolean {
  return subscription.status === "active";
}
