# Android SMS Relay - API Contract & Security Specification

**Version:** 1  
**Endpoint:** `POST /api/v1/relay`  
**Runtime:** Node.js (Stateless Next.js Route Handler)  
**Authentication:** HMAC-SHA256 with Canonical Request Signing  

---

## 1. Architectural Principles

1. **Strictly Stateless:** The relay API does not persist SMS bodies or maintain server-side databases, Redis instances, queues, or event logs.
2. **Loosely Coupled:** The Android application is agnostic of downstream delivery mechanisms. It transmits normalized, cryptographically signed SMS events to this single endpoint.
3. **Defense in Depth:** Every request is authenticated prior to JSON parsing or schema validation. Unauthenticated requests are rejected with a generic `401 AUTHENTICATION_FAILED` without leaking internal credential status.
4. **Byte-Level Integrity:** Signatures are computed over the exact raw HTTP body bytes received, preventing JSON serialization or whitespace discrepancies.

---

## 2. HTTP Endpoint & Allowed Methods

- **URL Path:** `/api/v1/relay`
- **Method:** `POST` only
- **Content-Type:** `application/json` (or `application/json; charset=utf-8`)
- **Max Body Size:** 16 KB (16,384 bytes)

All other HTTP methods (`GET`, `PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS`) return:
```http
HTTP/1.1 405 Method Not Allowed
Allow: POST
Cache-Control: no-store
Content-Type: application/json
X-Content-Type-Options: nosniff

{
  "success": false,
  "code": "METHOD_NOT_ALLOWED"
}
```

---

## 3. Required Request Headers

All headers listed below are mandatory. Missing or malformed headers result in `401 Unauthorized`.

| Header Name | Format / Example | Description |
|---|---|---|
| `X-Relay-Version` | `1` | Protocol version. Bound in HMAC canonical string. |
| `X-Relay-ID` | `india-sms` | Logical relay identifier configured on server. |
| `X-Relay-Device` | `india-phone-primary` | Authorized physical device identifier. |
| `X-Relay-Timestamp` | `1789587712` | Unix epoch timestamp in seconds (integer). |
| `X-Relay-Nonce` | `a1c49f6f02d64bcbbca124310e785bc4` | Exactly 32 hexadecimal characters. |
| `X-Relay-Signature` | `ccca291cbc7a51b49a461d...` | Exactly 64 hexadecimal characters (HMAC-SHA256). |
| `Content-Type` | `application/json` | Request payload MIME type. |

---

## 4. Request Body Schema

The body must be valid JSON matching the strict schema. Unknown properties are rejected (`422 INVALID_PAYLOAD`).

> [!NOTE]
> `deviceId` and `version` are deliberately **not** included in the JSON body. They are already authenticated via `X-Relay-Device` and `X-Relay-Version` headers and cryptographically bound in the canonical HMAC signature.

### Schema Definition
```typescript
{
  eventId: string;    // UUID v4 format (unique per captured SMS event)
  sender: string;     // Phone number or alphanumeric sender ID (max 128 chars)
  body: string;       // SMS message content (max 4,096 chars)
  receivedAt: string; // ISO 8601 UTC timestamp string (e.g. "2026-09-16T17:35:44.291Z")
  sim?: {             // Optional dual-SIM metadata
    slotIndex?: number;      // SIM slot index (0-based integer, >= 0)
    subscriptionId?: number; // Android Subscription ID (integer)
  };
}
```

### Example Request Body
```json
{
  "eventId": "748ffec8-47dd-4acb-a908-63bdbbb1d834",
  "sender": "VM-HDFCBK",
  "body": "Your OTP is 123456",
  "receivedAt": "2026-09-16T17:35:44.291Z",
  "sim": {
    "slotIndex": 0
  }
}
```

---

## 5. Canonical Request Signing

Both the Android application and the Next.js backend construct the exact same canonical string joined by newline characters (`\n`).

### Canonical String Format
```text
VERSION
HTTP_METHOD
REQUEST_PATH
RELAY_ID
DEVICE_ID
TIMESTAMP
NONCE
BODY_SHA256
```

### Field Specifications
1. **VERSION**: `X-Relay-Version` header value (e.g. `1`).
2. **HTTP_METHOD**: Uppercase method (`POST`).
3. **REQUEST_PATH**: Exact request path (`/api/v1/relay`).
4. **RELAY_ID**: Exact `X-Relay-ID` header string.
5. **DEVICE_ID**: Exact `X-Relay-Device` header string.
6. **TIMESTAMP**: Exact `X-Relay-Timestamp` epoch seconds string.
7. **NONCE**: Exact `X-Relay-Nonce` 32-character hex string.
8. **BODY_SHA256**: Lowercase hexadecimal digest of `SHA-256(raw_http_body_bytes)`.

### Raw Body Hashing Rule
The HMAC must operate on the **exact raw byte sequence** sent over the wire. Do not parse JSON and re-serialize it prior to hashing, because key ordering, whitespace, and Unicode representations will change the byte sequence.

```typescript
const bodySha256 = crypto
  .createHash("sha256")
  .update(rawBodyBytes)
  .digest("hex")
  .toLowerCase();
```

### HMAC-SHA256 Calculation
```typescript
const signature = crypto
  .createHmac("sha256", sharedSecret)
  .update(canonicalString, "utf8")
  .digest("hex")
  .toLowerCase();
```

---

## 6. Timestamp Freshness & Nonce Replay Boundary

- **Timestamp Window:** Configured by `SMS_RELAY_TIMESTAMP_WINDOW_SECONDS` (default: `300` seconds / 5 minutes).
- **Freshness Rule:** `abs(serverTimeSeconds - requestTimestamp) <= 300`
- **Stateless Replay Consideration:** Because the server operates without a persistent database or distributed cache, global nonce uniqueness cannot be verified across server restarts or multiple instances.
- **V1 Replay Mitigation:**
  - `X-Relay-Nonce` provides signing entropy, uniqueness for diagnostics, and prevents cross-message collisions.
  - The real replay protection boundary is **TLS encryption + HMAC signature + timestamp within ±300 seconds**.
  - Requests captured by a man-in-the-middle could theoretically be replayed within the 300-second window. This is an intentional, acceptable tradeoff for a lightweight stateless relay.

---

## 7. HTTP Response Codes & Retry Contract

Android's capture and dispatch layer (e.g. WorkManager) must follow this retry classification:

| HTTP Status | Response Code | Description | Android Retry? |
|---|---|---|---|
| **200 OK** | *(none / success)* | Message delivered to adapter | **NO** (Success) |
| **400 Bad Request** | `INVALID_CONTENT_TYPE` | Content-Type is not `application/json` | **NO** (Client error) |
| **401 Unauthorized** | `AUTHENTICATION_FAILED` | Bad HMAC, timestamp expired, invalid ID | **NO** (Permanent config error) |
| **405 Method Not Allowed** | `METHOD_NOT_ALLOWED` | Non-POST method used | **NO** (Bug) |
| **413 Payload Too Large** | `PAYLOAD_TOO_LARGE` | Request exceeds 16 KB limit | **NO** (Payload too large) |
| **422 Unprocessable** | `INVALID_PAYLOAD` | Schema validation failure | **NO** (Malformed payload) |
| **502 Bad Gateway** | `DELIVERY_REJECTED` | Downstream provider permanently rejected (4xx) | **NO** (Do not retry) |
| **503 Service Unavailable**| `DELIVERY_TEMPORARILY_UNAVAILABLE` | Downstream rate limit (429) or 5xx/network timeout | **YES** (Exponential backoff) |
| **500 Internal Error** | `INTERNAL_ERROR` | Unexpected server exception | **YES** (Transient server error) |

### Success Response (200 OK)
```json
{
  "success": true,
  "eventId": "748ffec8-47dd-4acb-a908-63bdbbb1d834",
  "provider": "email"
}
```

### Authentication Failure (401 Unauthorized)
```json
{
  "success": false,
  "code": "AUTHENTICATION_FAILED"
}
```

### Temporary Downstream Failure (503 Service Unavailable)
```json
{
  "success": false,
  "retryable": true,
  "code": "DELIVERY_TEMPORARILY_UNAVAILABLE"
}
```

---

## 8. Deterministic Interoperability Test Vector

The following deterministic test vector is verified by automated tests in both TypeScript and Android suites:

### Input Parameters
- **Protocol Version (`X-Relay-Version`):** `1`
- **HTTP Method:** `POST`
- **Request Path:** `/api/v1/relay`
- **Relay ID (`X-Relay-ID`):** `india-sms`
- **Device ID (`X-Relay-Device`):** `india-phone-primary`
- **Timestamp (`X-Relay-Timestamp`):** `1789587712`
- **Nonce (`X-Relay-Nonce`):** `a1c49f6f02d64bcbbca124310e785bc4`
- **Shared HMAC Secret:** `super-secure-shared-hmac-secret-32b`

### Exact Raw JSON Body (186 bytes, UTF-8, no trailing newline)
```json
{"eventId":"748ffec8-47dd-4acb-a908-63bdbbb1d834","sender":"VM-HDFCBK","body":"Your OTP is 123456","receivedAt":"2026-09-16T17:35:44.291Z","sim":{"slotIndex":0}}
```

### SHA-256 Body Hash
```text
b33b2661fcb8580fcb7d7413bc80969689abaca5b5615e21640d87b588a59505
```

### Canonical Request String
*(8 lines separated by single `\n` characters)*
```text
1
POST
/api/v1/relay
india-sms
india-phone-primary
1789587712
a1c49f6f02d64bcbbca124310e785bc4
b33b2661fcb8580fcb7d7413bc80969689abaca5b5615e21640d87b588a59505
```

### Expected HMAC-SHA256 Signature (`X-Relay-Signature`)
```text
ccca291cbc7a51b49a461d06957dd6b8ea2f388caee8557352f4b180c011cd28
```
