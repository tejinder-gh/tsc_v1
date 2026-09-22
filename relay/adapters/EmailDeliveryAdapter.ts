/**
 * What: Production Email delivery adapter for SMS Relay.
 * Why: Forwards received SMS messages directly to a target email address
 *      (e.g. Canadian destination inbox) using SendGrid or Resend HTTP APIs
 *      without requiring external SDK dependencies.
 */

import { ConfigurationError } from "../errors/RelayError";
import type {
  DeliveryAdapter,
  DeliveryContext,
  DeliveryResult,
  RelayMessage,
} from "./DeliveryAdapter";

export interface EmailAdapterConfig {
  to: string;
  from: string;
  apiKey?: string;
  provider: "sendgrid" | "resend" | "mock";
}

export class EmailDeliveryAdapter implements DeliveryAdapter {
  constructor(private readonly config: EmailAdapterConfig) {
    if (!config.to) {
      throw new ConfigurationError(
        "EmailDeliveryAdapter requires a destination address (SMS_RELAY_EMAIL_TO)",
      );
    }
    if (!config.from) {
      throw new ConfigurationError(
        "EmailDeliveryAdapter requires a sender address (SMS_RELAY_EMAIL_FROM)",
      );
    }
    if (config.provider !== "mock" && !config.apiKey) {
      throw new ConfigurationError(
        `EmailDeliveryAdapter requires an API key for provider ${config.provider}`,
      );
    }
  }

  async deliver(message: RelayMessage, context: DeliveryContext): Promise<DeliveryResult> {
    const simText =
      message.sim?.slotIndex !== undefined ? ` [SIM ${message.sim.slotIndex + 1}]` : "";
    const cleanPreview = message.body.split("\n")[0].trim().slice(0, 40);
    const subject = `[SMS] ${message.sender}${simText}: ${cleanPreview}${message.body.length > 40 ? "..." : ""}`;

    const textContent = [
      `Sender:   ${message.sender}`,
      `Time:     ${message.receivedAt}`,
      `Device:   ${context.deviceId}`,
      `Relay:    ${context.relayId}`,
      message.sim?.slotIndex !== undefined ? `SIM Slot: ${message.sim.slotIndex}` : null,
      message.sim?.subscriptionId !== undefined ? `Sub ID:   ${message.sim.subscriptionId}` : null,
      `Event ID: ${context.eventId}`,
      "",
      "-------------------- SMS MESSAGE --------------------",
      message.body,
      "-----------------------------------------------------",
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    if (this.config.provider === "mock") {
      return {
        success: true,
        provider: "email-mock",
        providerMessageId: `mock-${context.eventId}`,
      };
    }

    if (this.config.provider === "sendgrid") {
      return this.sendViaSendGrid(subject, textContent, context.eventId);
    }

    return this.sendViaResend(subject, textContent, context.eventId);
  }

  private async sendViaSendGrid(
    subject: string,
    textContent: string,
    eventId: string,
  ): Promise<DeliveryResult> {
    const payload = {
      personalizations: [{ to: [{ email: this.config.to }] }],
      from: { email: this.config.from, name: "SMS Relay" },
      subject,
      content: [{ type: "text/plain", value: textContent }],
      custom_args: { eventId },
    };

    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const messageId = response.headers.get("x-message-id") || undefined;
        return {
          success: true,
          provider: "sendgrid",
          providerMessageId: messageId,
        };
      }

      // Downstream classification
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
      // Network timeouts, connection resets, DNS failures are safe to retry
      return {
        success: false,
        retryable: true,
        code: "DELIVERY_TEMPORARILY_UNAVAILABLE",
      };
    }
  }

  private async sendViaResend(
    subject: string,
    textContent: string,
    eventId: string,
  ): Promise<DeliveryResult> {
    const payload = {
      from: this.config.from,
      to: [this.config.to],
      subject,
      text: textContent,
      headers: {
        "X-Event-ID": eventId,
      },
    };

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const json = (await response.json().catch(() => ({}))) as { id?: string };
        return {
          success: true,
          provider: "resend",
          providerMessageId: json.id,
        };
      }

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
