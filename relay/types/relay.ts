/**
 * What: Core types for the stateless SMS relay subsystem.
 * Why: Establishes a strict contract between the Android capture layer,
 *      Next.js Route Handlers, authentication, schema validation, and pluggable
 *      downstream delivery adapters.
 */

export interface RelayHeaders {
  relayId: string;
  deviceId: string;
  timestamp: string;
  nonce: string;
  signature: string;
  version: string;
}

export interface SimMetadata {
  slotIndex?: number;
  subscriptionId?: number;
}

/**
 * Event payload received in the HTTP body.
 * Note: version and deviceId are deliberately omitted from the body because
 * they are already authenticated via X-Relay-Version and X-Relay-Device headers.
 */
export interface RelayPayload {
  eventId: string;
  sender: string;
  body: string;
  receivedAt: string;
  sim?: SimMetadata;
}

/**
 * Normalized message passed downstream to delivery adapters, combining
 * authenticated envelope metadata with event payload.
 */
export interface RelayMessage extends RelayPayload {
  relayId: string;
  deviceId: string;
}

export interface DeliveryContext {
  relayId: string;
  deviceId: string;
  eventId: string;
  receivedAt: string;
}

export type DeliveryResult =
  | {
      success: true;
      provider?: string;
      providerMessageId?: string;
    }
  | {
      success: false;
      retryable: boolean;
      code: string;
    };

export interface RelaySuccessResponse {
  success: true;
  eventId: string;
  provider?: string;
}

export interface RelayErrorResponse {
  success: false;
  code: string;
  retryable?: boolean;
  error?: {
    code: string;
    retryable?: boolean;
  };
}

export type RelayResponse = RelaySuccessResponse | RelayErrorResponse;
