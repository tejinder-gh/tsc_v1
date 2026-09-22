/**
 * What: Canonical request construction and cryptographic hashing helpers.
 * Why: Guarantees that the Android application and Next.js backend construct
 *      the exact same byte-for-byte signing string for HMAC-SHA256 verification,
 *      cryptographically binding the protocol version, HTTP method, path,
 *      envelope headers, and raw body hash.
 */

import { createHash, createHmac } from "node:crypto";

export interface CanonicalRequestParams {
  version: string | number;
  method: string;
  pathname: string;
  relayId: string;
  deviceId: string;
  timestamp: string;
  nonce: string;
  bodyHash: string;
}

/**
 * Computes the SHA-256 hash of the exact raw HTTP body bytes as a lowercase hex string.
 */
export function hashRawBody(rawBody: Buffer | Uint8Array | string): string {
  return createHash("sha256").update(rawBody).digest("hex").toLowerCase();
}

/**
 * Builds the newline-separated canonical request string.
 *
 * Format:
 *   VERSION
 *   HTTP_METHOD
 *   REQUEST_PATH
 *   RELAY_ID
 *   DEVICE_ID
 *   TIMESTAMP
 *   NONCE
 *   BODY_SHA256
 */
export function buildCanonicalRequest(params: CanonicalRequestParams): string {
  return [
    String(params.version),
    params.method.toUpperCase(),
    params.pathname,
    params.relayId,
    params.deviceId,
    params.timestamp,
    params.nonce,
    params.bodyHash.toLowerCase(),
  ].join("\n");
}

/**
 * Computes the HMAC-SHA256 signature of the canonical request string using the shared secret.
 * Output is a lowercase hexadecimal string (64 characters).
 */
export function computeHmacSignature(canonicalRequest: string, secret: string): string {
  return createHmac("sha256", secret).update(canonicalRequest, "utf8").digest("hex").toLowerCase();
}
