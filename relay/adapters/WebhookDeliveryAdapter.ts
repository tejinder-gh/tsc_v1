/**
 * What: Generic Webhook delivery adapter for SMS Relay.
 * Why: Forwards normalized SMS messages via HTTP POST to an arbitrary downstream webhook
 *      (e.g., Zapier, Make, n8n, Slack webhook, or custom microservice)
 *      with idempotency headers.
 */

import { ConfigurationError } from "../errors/RelayError";
import type {
  DeliveryAdapter,
  DeliveryContext,
  DeliveryResult,
  RelayMessage,
} from "./DeliveryAdapter";

export interface WebhookAdapterConfig {
  webhookUrl: string;
  authToken?: string;
  timeoutMs?: number;
}

export class WebhookDeliveryAdapter implements DeliveryAdapter {
  private readonly webhookUrl: string;
  private readonly authToken?: string;
  private readonly timeoutMs: number;

  constructor(config: WebhookAdapterConfig) {
    if (!config.webhookUrl) {
      throw new ConfigurationError("WebhookDeliveryAdapter requires SMS_RELAY_WEBHOOK_URL");
    }
    this.webhookUrl = config.webhookUrl;
    this.authToken = config.authToken;
    this.timeoutMs = config.timeoutMs ?? 10000;
  }

  async deliver(message: RelayMessage, context: DeliveryContext): Promise<DeliveryResult> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Idempotency-Key": context.eventId,
      "X-Event-ID": context.eventId,
      "X-Relay-ID": context.relayId,
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(message),
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (response.ok) {
        const downstreamId =
          response.headers.get("x-delivery-id") ||
          response.headers.get("x-message-id") ||
          undefined;

        return {
          success: true,
          provider: "webhook",
          providerMessageId: downstreamId,
        };
      }

      // Classification per contract: 429 and 5xx are retryable; 4xx are permanent
      if (response.status === 429 || response.status >= 500) {
        return {
          success: false,
          retryable: true,
          code: "DELIVERY_TEMPORARILY_UNAVAILABLE",
        };
      }

      return {
        success: false,
        retryable: false,
        code: "DELIVERY_REJECTED",
      };
    } catch {
      return {
        success: false,
        retryable: true,
        code: "DELIVERY_TEMPORARILY_UNAVAILABLE",
      };
    }
  }
}
