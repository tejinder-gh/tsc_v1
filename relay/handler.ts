/**
 * What: Core HTTP request handling pipeline for the stateless SMS relay endpoint.
 * Why: Orchestrates method verification, security headers, cryptographic authentication,
 *      strict payload validation, delivery adapter dispatch, and response formatting
 *      with zero persistence of SMS data and defensive error shielding.
 */

import { createDeliveryAdapter } from "./adapters/createDeliveryAdapter";
import type { DeliveryAdapter } from "./adapters/DeliveryAdapter";
import { type VerifyOptions, verifyRelayRequest } from "./auth/verifyRelayRequest";
import { getRelayConfig, type RelayConfig } from "./config/relayConfig";
import {
  AuthenticationError,
  InvalidContentTypeError,
  InvalidMethodError,
  PayloadTooLargeError,
  PayloadValidationError,
  RelayError,
} from "./errors/RelayError";
import { buildRelayMessage, validateAndParsePayload } from "./validation/relayPayloadSchema";

export interface RelayHandlerDependencies {
  config?: RelayConfig;
  adapter?: DeliveryAdapter;
  verifyOptions?: VerifyOptions;
}

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

export function createRelayJsonResponse(
  status: number,
  body: unknown,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...SECURITY_HEADERS,
      ...extraHeaders,
    },
  });
}

export function handleMethodNotAllowed(): Response {
  return createRelayJsonResponse(
    405,
    {
      success: false,
      code: "METHOD_NOT_ALLOWED",
      error: { code: "METHOD_NOT_ALLOWED" },
    },
    { Allow: "POST" },
  );
}

export async function handleRelayRequest(
  request: Request,
  deps: RelayHandlerDependencies = {},
): Promise<Response> {
  // 1. Method verification
  if (request.method !== "POST") {
    return handleMethodNotAllowed();
  }

  try {
    const config = deps.config ?? getRelayConfig();
    const adapter = deps.adapter ?? createDeliveryAdapter(config);

    // 2. Cryptographic authentication & envelope verification
    const verified = await verifyRelayRequest(request, config, deps.verifyOptions);

    // 3. Strict payload validation
    const payload = validateAndParsePayload(verified.rawBody);

    // 4. Construct normalized message
    const message = buildRelayMessage(payload, {
      relayId: verified.relayId,
      deviceId: verified.deviceId,
    });

    // 5. Invoke pluggable delivery adapter
    const deliveryResult = await adapter.deliver(message, {
      relayId: verified.relayId,
      deviceId: verified.deviceId,
      eventId: payload.eventId,
      receivedAt: payload.receivedAt,
    });

    // 6. Handle adapter result
    if (deliveryResult.success) {
      return createRelayJsonResponse(200, {
        success: true,
        eventId: payload.eventId,
        provider: deliveryResult.provider,
      });
    }

    // Classify downstream delivery failure
    if (deliveryResult.retryable) {
      return createRelayJsonResponse(503, {
        success: false,
        retryable: true,
        code: deliveryResult.code || "DELIVERY_TEMPORARILY_UNAVAILABLE",
        error: {
          code: deliveryResult.code || "DELIVERY_TEMPORARILY_UNAVAILABLE",
          retryable: true,
        },
      });
    }

    return createRelayJsonResponse(502, {
      success: false,
      retryable: false,
      code: deliveryResult.code || "DELIVERY_REJECTED",
      error: {
        code: deliveryResult.code || "DELIVERY_REJECTED",
        retryable: false,
      },
    });
  } catch (error: unknown) {
    // 7. Defensive error shielding
    if (error instanceof InvalidMethodError) {
      return handleMethodNotAllowed();
    }

    if (error instanceof AuthenticationError) {
      // Never expose why authentication failed (relay ID vs device ID vs HMAC)
      return createRelayJsonResponse(401, {
        success: false,
        code: "AUTHENTICATION_FAILED",
        error: { code: "AUTHENTICATION_FAILED" },
      });
    }

    if (error instanceof InvalidContentTypeError) {
      return createRelayJsonResponse(400, {
        success: false,
        code: "INVALID_CONTENT_TYPE",
        error: { code: "INVALID_CONTENT_TYPE" },
      });
    }

    if (error instanceof PayloadTooLargeError) {
      return createRelayJsonResponse(413, {
        success: false,
        code: "PAYLOAD_TOO_LARGE",
        error: { code: "PAYLOAD_TOO_LARGE" },
      });
    }

    if (error instanceof PayloadValidationError) {
      return createRelayJsonResponse(422, {
        success: false,
        code: "INVALID_PAYLOAD",
        error: { code: "INVALID_PAYLOAD" },
      });
    }

    if (error instanceof RelayError) {
      return createRelayJsonResponse(error.statusCode, {
        success: false,
        retryable: error.retryable,
        code: error.code,
        error: {
          code: error.code,
          retryable: error.retryable,
        },
      });
    }

    // Unexpected internal errors return 500 with retryable: true
    return createRelayJsonResponse(500, {
      success: false,
      retryable: true,
      code: "INTERNAL_ERROR",
      error: {
        code: "INTERNAL_ERROR",
        retryable: true,
      },
    });
  }
}
