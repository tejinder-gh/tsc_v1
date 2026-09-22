/**
 * What: Constant-time hexadecimal comparison utility.
 * Why: Prevents timing attacks on HMAC signatures and secret-derived tokens.
 *      Node's crypto.timingSafeEqual throws if buffer lengths differ; this
 *      helper safely handles length mismatches and non-hex inputs.
 */

import { timingSafeEqual } from "node:crypto";

export function safeEqualHex(expectedHex: string, suppliedHex: string): boolean {
  if (typeof expectedHex !== "string" || typeof suppliedHex !== "string") {
    return false;
  }

  // HMAC-SHA256 hex digests are exactly 64 characters
  if (expectedHex.length !== suppliedHex.length) {
    return false;
  }

  const hexRegex = /^[0-9a-fA-F]+$/;
  if (!hexRegex.test(expectedHex) || !hexRegex.test(suppliedHex)) {
    return false;
  }

  const expectedBuffer = Buffer.from(expectedHex.toLowerCase(), "hex");
  const suppliedBuffer = Buffer.from(suppliedHex.toLowerCase(), "hex");

  if (expectedBuffer.length !== suppliedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, suppliedBuffer);
}
