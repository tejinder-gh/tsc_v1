/**
 * What: Request authentication and HMAC-SHA256 signature verification.
 * Why: Enforces relay identity, device authorization, timestamp freshness,
 *      nonce formatting, and cryptographic proof of body integrity before any
 *      JSON parsing or downstream delivery takes place.
 */

import type { RelayConfig } from "../config/relayConfig";
import {
  AuthenticationError,
  InvalidContentTypeError,
  MissingHeaderError,
  PayloadTooLargeError,
  TimestampError,
} from "../errors/RelayError";
import { buildCanonicalRequest, computeHmacSignature, hashRawBody } from "./canonicalRequest";
import {
  buildRelayNonceKey,
  getDefaultNonceDeduplicator,
  type NonceDeduplicator,
} from "./nonceStore";
import { safeEqualHex } from "./safeEqualHex";

const NONCE_REGEX = /^[0-9a-fA-F]{32}$/;
const SIGNATURE_REGEX = /^[0-9a-fA-F]{64}$/;
const CONTENT_TYPE_JSON_REGEX = /^application\/json(?:;\s*charset=[^;]+)?$/i;

export interface VerifiedRelayRequest {
  relayId: string;
  deviceId: string;
  timestamp: string;
  nonce: string;
  version: number;
  signature: string;
  rawBody: Buffer;
  bodyHash: string;
  pathname: string;
}

export interface VerifyOptions {
  nowSeconds?: number;
  nonceDeduplicator?: NonceDeduplicator;
  failClosed?: boolean;
}

/**
 * Extracts and strictly validates headers, checks timestamp freshness,
 * verifies raw body HMAC-SHA256 signature against the canonical request,
 * and returns the verified metadata and raw byte buffer.
 */
export async function verifyRelayRequest(
  request: Request,
  config: RelayConfig,
  options: VerifyOptions = {},
): Promise<VerifiedRelayRequest> {
  // 1. Validate Content-Type
  const contentType = request.headers.get("content-type");
  if (!contentType || !CONTENT_TYPE_JSON_REGEX.test(contentType.trim())) {
    throw new InvalidContentTypeError(contentType);
  }

  // 2. Early Content-Length check to reject oversized payloads before expensive crypto
  const contentLengthStr = request.headers.get("content-length");
  if (contentLengthStr) {
    const contentLength = Number.parseInt(contentLengthStr, 10);
    if (!Number.isNaN(contentLength) && contentLength > config.maxBodyBytes) {
      throw new PayloadTooLargeError(contentLength, config.maxBodyBytes);
    }
  }

  // 3. Extract and require security headers
  const relayId = request.headers.get("x-relay-id")?.trim();
  if (!relayId) {
    throw new MissingHeaderError("X-Relay-ID");
  }

  const deviceId = request.headers.get("x-relay-device")?.trim();
  if (!deviceId) {
    throw new MissingHeaderError("X-Relay-Device");
  }

  const timestampStr = request.headers.get("x-relay-timestamp")?.trim();
  if (!timestampStr) {
    throw new MissingHeaderError("X-Relay-Timestamp");
  }

  const nonce = request.headers.get("x-relay-nonce")?.trim();
  if (!nonce) {
    throw new MissingHeaderError("X-Relay-Nonce");
  }

  const signature = request.headers.get("x-relay-signature")?.trim();
  if (!signature) {
    throw new MissingHeaderError("X-Relay-Signature");
  }

  const versionStr = request.headers.get("x-relay-version")?.trim();
  if (!versionStr) {
    throw new MissingHeaderError("X-Relay-Version");
  }

  // 4. Validate header formats
  if (versionStr !== "1") {
    throw new AuthenticationError("Unsupported relay version");
  }
  const version = 1;

  if (!NONCE_REGEX.test(nonce)) {
    throw new AuthenticationError("Invalid nonce format: must be 32 hexadecimal characters");
  }

  if (!SIGNATURE_REGEX.test(signature)) {
    throw new AuthenticationError("Invalid signature format: must be 64 hexadecimal characters");
  }

  // 5. Validate Relay ID
  if (relayId !== config.relayId) {
    throw new AuthenticationError("Relay ID mismatch");
  }

  // 6. Validate Device ID
  if (!config.allowedDeviceIds.includes(deviceId)) {
    throw new AuthenticationError("Device ID not authorized");
  }

  // 7. Validate Timestamp Freshness
  const requestTimestamp = Number.parseInt(timestampStr, 10);
  if (Number.isNaN(requestTimestamp) || !/^\d+$/.test(timestampStr)) {
    throw new TimestampError("Invalid timestamp format: must be integer epoch seconds");
  }

  const nowSeconds = options.nowSeconds ?? Math.floor(Date.now() / 1000);
  const timeDifference = Math.abs(nowSeconds - requestTimestamp);
  if (timeDifference > config.timestampWindowSeconds) {
    throw new TimestampError(
      `Timestamp outside freshness window (${timeDifference}s > ${config.timestampWindowSeconds}s)`,
    );
  }

  // 8. Read raw body bytes
  const arrayBuffer = await request.arrayBuffer();
  const rawBody = Buffer.from(arrayBuffer);

  if (rawBody.length > config.maxBodyBytes) {
    throw new PayloadTooLargeError(rawBody.length, config.maxBodyBytes);
  }

  // 9. Compute body SHA-256
  const bodyHash = hashRawBody(rawBody);

  // 10. Construct Canonical Request with VERSION as first element
  const pathname = new URL(request.url).pathname;
  const canonical = buildCanonicalRequest({
    version: versionStr,
    method: request.method,
    pathname,
    relayId,
    deviceId,
    timestamp: timestampStr,
    nonce,
    bodyHash,
  });

  // 11. Compute HMAC-SHA256 and perform constant-time comparison
  const expectedSignature = computeHmacSignature(canonical, config.hmacSecret);
  if (!safeEqualHex(expectedSignature, signature)) {
    throw new AuthenticationError("HMAC signature verification failed");
  }

  // 12. Atomic Distributed Nonce Replay Check (P0)
  const deduplicator = options.nonceDeduplicator ?? getDefaultNonceDeduplicator();
  const nonceKey = buildRelayNonceKey(relayId, deviceId, nonce);
  const ttlSeconds = config.timestampWindowSeconds;
  const failClosed = options.failClosed ?? true;

  try {
    const isNew = await deduplicator.claimNonce(nonceKey, ttlSeconds);
    if (!isNew) {
      throw new AuthenticationError("Replay detected: duplicate nonce");
    }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    if (failClosed) {
      throw new AuthenticationError("Nonce deduplication backend failed");
    }
    console.warn("[relay] Nonce deduplication failed in fail-open mode; permitting request", error);
  }

  return {
    relayId,
    deviceId,
    timestamp: timestampStr,
    nonce,
    version,
    signature,
    rawBody,
    bodyHash,
    pathname,
  };
}
