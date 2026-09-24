/**
 * What: Production Email delivery adapter for SMS Relay.
 * Why: Forwards received SMS messages directly to a target email address
 *      (e.g. Canadian destination inbox) using SendGrid or Resend HTTP APIs
 *      without requiring external SDK dependencies.
 */

import { sendResendEmail, sendSendGridEmail } from "@/lib/email/transport";
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
    // biome-ignore lint/suspicious/noControlCharactersInRegex: Required for email header injection protection
    const sanitizedSender = message.sender.replace(/[\r\n\x00-\x1f\x7f]+/g, " ").trim();
    const simText =
      message.sim?.slotIndex !== undefined ? ` [SIM ${message.sim.slotIndex + 1}]` : "";
    const subject = `[SMS Relay] New message from ${sanitizedSender}${simText}`;

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
      const result = await sendSendGridEmail(
        {
          from: { email: this.config.from, name: "SMS Relay" },
          to: this.config.to,
          subject,
          text: textContent,
          customArgs: { eventId: context.eventId },
        },
        { apiKey: this.config.apiKey! },
      );

      if (result.ok) {
        return {
          success: true,
          provider: "sendgrid",
          providerMessageId: result.messageId,
        };
      }

      return {
        success: false,
        retryable: result.retryable ?? false,
        code: result.retryable ? "DELIVERY_TEMPORARILY_UNAVAILABLE" : "DELIVERY_REJECTED",
      };
    }

    const result = await sendResendEmail(
      {
        from: this.config.from,
        to: this.config.to,
        subject,
        text: textContent,
        headers: {
          "X-Event-ID": context.eventId,
        },
      },
      { apiKey: this.config.apiKey! },
    );

    if (result.ok) {
      return {
        success: true,
        provider: "resend",
        providerMessageId: result.messageId,
      };
    }

    return {
      success: false,
      retryable: result.retryable ?? false,
      code: result.retryable ? "DELIVERY_TEMPORARILY_UNAVAILABLE" : "DELIVERY_REJECTED",
    };
  }
}
