/**
 * What: Factory function to instantiate configured delivery adapters.
 * Why: Keeps provider instantiation isolated from the Route Handler, enabling
 *      seamless addition of new downstream delivery mechanisms (Email, Webhook,
 *      Telegram, Pushover, Discord, etc.) with zero changes to the API route.
 */

import type { RelayConfig } from "../config/relayConfig";
import { ConfigurationError } from "../errors/RelayError";
import type { DeliveryAdapter } from "./DeliveryAdapter";
import { DevNullDeliveryAdapter } from "./DevNullDeliveryAdapter";
import { EmailDeliveryAdapter } from "./EmailDeliveryAdapter";
import { WebhookDeliveryAdapter } from "./WebhookDeliveryAdapter";

export function createDeliveryAdapter(
  config: RelayConfig,
  env: Record<string, string | undefined> = process.env,
): DeliveryAdapter {
  switch (config.deliveryProvider) {
    case "email": {
      const to = env.SMS_RELAY_EMAIL_TO?.trim() || "";
      const from = env.SMS_RELAY_EMAIL_FROM?.trim() || "sms-relay@theskillcorner.com";

      const sendgridKey = env.SMS_RELAY_SENDGRID_API_KEY?.trim() || env.SENDGRID_API_KEY?.trim();
      const resendKey = env.SMS_RELAY_RESEND_API_KEY?.trim() || env.RESEND_API_KEY?.trim();

      const backendPreference = env.SMS_RELAY_EMAIL_BACKEND?.toLowerCase().trim();

      let provider: "sendgrid" | "resend" | "mock" = "sendgrid";
      let apiKey = sendgridKey;

      if (backendPreference === "resend" || (!sendgridKey && resendKey)) {
        provider = "resend";
        apiKey = resendKey;
      } else if (!sendgridKey && !resendKey) {
        if (env.NODE_ENV === "test" || env.SMS_RELAY_EMAIL_MOCK === "true") {
          provider = "mock";
        } else {
          throw new ConfigurationError(
            "EmailDeliveryAdapter requires an API key (SMS_RELAY_SENDGRID_API_KEY, SENDGRID_API_KEY, SMS_RELAY_RESEND_API_KEY, or RESEND_API_KEY)",
          );
        }
      }

      return new EmailDeliveryAdapter({
        to,
        from,
        apiKey,
        provider,
      });
    }

    case "webhook": {
      const webhookUrl = env.SMS_RELAY_WEBHOOK_URL?.trim() || "";
      const authToken = env.SMS_RELAY_WEBHOOK_TOKEN?.trim();
      return new WebhookDeliveryAdapter({
        webhookUrl,
        authToken,
      });
    }

    case "dev-null":
      return new DevNullDeliveryAdapter();

    default:
      throw new ConfigurationError(`Unsupported delivery provider: ${config.deliveryProvider}`);
  }
}
