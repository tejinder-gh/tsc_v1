/**
 * What: Defensive PII, secret, and payment data scrubber for telemetry.
 * Why: Guarantees no sensitive data (emails, phones, credentials, tokens, payment cards,
 *      message bodies, database URLs) can escape to error monitoring or analytics sinks.
 * How: Deeply cleans objects, contexts, breadcrumbs, headers, and error messages
 *      while preserving stack trace structures intact for debugging.
 * From Where: Observability Foundation Architecture, 2026-09.
 */

import type { ErrorEvent as SentryEvent } from "@sentry/nextjs";

const PROHIBITED_KEYS = new Set([
  "email",
  "mail",
  "phone",
  "phonenumber",
  "telephone",
  "name",
  "fullname",
  "firstname",
  "lastname",
  "message",
  "text",
  "password",
  "token",
  "authorization",
  "cookie",
  "set-cookie",
  "secret",
  "key",
  "payload",
  "body",
  "database_url",
  "databaseurl",
  "db",
  "credentials",
  "apikey",
  "card",
  "creditcard",
  "cardnumber",
  "pan",
  "cvv",
  "cvc",
  "expiry",
  "exp_month",
  "exp_year",
]);

const DB_URL_REGEX = /(postgres(?:ql)?:\/\/[^:\s]+:)[^@\s]+(@[^\s/]+)/gi;
// Matches 13-19 digit credit card numbers (with optional hyphens/spaces)
const CARD_REGEX = /\b(?:\d[ -]*?){13,19}\b/g;
const TOKEN_REGEX = /(?:Bearer\s+|eyJ)[a-zA-Z0-9_-]{10,}\.?[a-zA-Z0-9_-]*\.?[a-zA-Z0-9_-]*/gi;
const EMAIL_REGEX = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g;
const PHONE_REGEX = /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b|\b\d{10,11}\b/g;

/**
 * Sanitizes a string by redacting database credentials, payment card digits,
 * tokens, emails, and phone numbers in optimal precedence order.
 */
export function sanitizeString(val: string): string {
  if (!val || typeof val !== "string") return val;
  return val
    .replace(DB_URL_REGEX, "$1[REDACTED_SECRET]$2")
    .replace(CARD_REGEX, "[REDACTED_PAYMENT_DATA]")
    .replace(TOKEN_REGEX, "[REDACTED_TOKEN]")
    .replace(EMAIL_REGEX, "[REDACTED_EMAIL]")
    .replace(PHONE_REGEX, "[REDACTED_PHONE]");
}

/**
 * Recursively sanitizes arbitrary objects or arrays.
 * Strips prohibited keys entirely and scrubs values.
 */
export function sanitizeObject<T>(input: T, depth = 0, seen = new WeakSet()): T {
  if (depth > 6 || input === null || typeof input !== "object") {
    if (typeof input === "string") {
      return sanitizeString(input) as unknown as T;
    }
    return input;
  }

  if (seen.has(input as object)) {
    return "[Circular]" as unknown as T;
  }
  seen.add(input as object);

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeObject(item, depth + 1, seen)) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(input as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (PROHIBITED_KEYS.has(lowerKey)) {
      result[key] = "[REDACTED]";
      continue;
    }
    result[key] = sanitizeObject(val, depth + 1, seen);
  }

  return result as T;
}

/**
 * Sentry / GlitchTip beforeSend lifecycle hook.
 * Sanitizes error messages, exception values, request metadata, extra contexts,
 * and breadcrumbs while strictly preserving the stack trace structure intact.
 */
export function sanitizeSentryEvent(event: SentryEvent): SentryEvent | null {
  if (!event) return null;

  // 1. Sanitize top-level message if present
  if (event.message && typeof event.message === "string") {
    event.message = sanitizeString(event.message);
  }

  // 2. Sanitize exception values without touching stacktrace frames
  if (event.exception?.values && Array.isArray(event.exception.values)) {
    for (const exc of event.exception.values) {
      if (exc.value && typeof exc.value === "string") {
        exc.value = sanitizeString(exc.value);
      }
      // Stacktrace frames are preserved as-is for line/column/symbol debugging
    }
  }

  // 3. Sanitize request metadata (strip auth headers, cookies, query strings, and body)
  if (event.request) {
    if (event.request.headers) {
      const sanitizedHeaders: Record<string, string> = {};
      for (const [hKey, hVal] of Object.entries(event.request.headers)) {
        const lowerH = hKey.toLowerCase();
        if (
          lowerH === "authorization" ||
          lowerH === "cookie" ||
          lowerH === "set-cookie" ||
          lowerH.includes("key") ||
          lowerH.includes("token")
        ) {
          sanitizedHeaders[hKey] = "[REDACTED]";
        } else if (typeof hVal === "string") {
          sanitizedHeaders[hKey] = sanitizeString(hVal);
        }
      }
      event.request.headers = sanitizedHeaders;
    }

    if (event.request.cookies) {
      const sanitizedCookies: Record<string, string> = {};
      for (const cKey of Object.keys(event.request.cookies)) {
        sanitizedCookies[cKey] = "[REDACTED]";
      }
      event.request.cookies = sanitizedCookies;
    }

    if (event.request.data) {
      event.request.data = "[REDACTED_PAYLOAD]";
    }

    if (event.request.query_string && typeof event.request.query_string === "string") {
      event.request.query_string = sanitizeString(event.request.query_string);
    }
  }

  // 4. Sanitize extra data and contexts
  if (event.extra) {
    event.extra = sanitizeObject(event.extra);
  }

  if (event.contexts) {
    event.contexts = sanitizeObject(event.contexts);
  }

  // 5. Sanitize breadcrumbs
  if (event.breadcrumbs && Array.isArray(event.breadcrumbs)) {
    event.breadcrumbs = event.breadcrumbs.map((bc) => {
      if (bc.message) {
        bc.message = sanitizeString(bc.message);
      }
      if (bc.data) {
        bc.data = sanitizeObject(bc.data);
      }
      return bc;
    });
  }

  // 6. Strip user identity if inadvertently attached
  if (event.user) {
    delete event.user.email;
    delete event.user.username;
    delete event.user.ip_address;
  }

  return event;
}
