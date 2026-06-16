/**
 * What: The SendGrid email sender - delivers a rendered message via SendGrid's v3 API.
 * Why: Email is the fallback channel for contacts without SMS consent and the primary channel for
 *       longer touches (newsletters, engagement letters). SendGrid is HTTP-only, so it needs no
 *       extra npm dependency - keeping the engine lean.
 * How: Constructed from an API key and verified sender (key read from the environment by the var
 *       name in client config). send() POSTs the v3 mail payload; non-2xx and network errors come
 *       back as ok:false rather than throwing, matching the Twilio adapter's contract.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06; an SMTP transport (nodemailer) can implement the same ChannelSender later.
 */

import type { DeliveryResult, OutboundMessage } from "../core/types";
import type { ChannelSender } from "./types";

export interface SendGridCredentials {
  apiKey: string;
  fromAddress: string;
  fromName?: string;
}

export class SendGridEmailSender implements ChannelSender {
  constructor(private readonly creds: SendGridCredentials) {}

  async send(message: OutboundMessage): Promise<DeliveryResult> {
    const payload = {
      personalizations: [{ to: [{ email: message.to }] }],
      from: { email: this.creds.fromAddress, name: this.creds.fromName },
      reply_to: message.replyTo ? { email: message.replyTo } : undefined,
      subject: message.subject ?? "(no subject)",
      content: [{ type: "text/plain", value: message.body }],
    };

    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.creds.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const detail = await safeText(response);
        return {
          ok: false,
          channel: "email",
          to: message.to,
          error: `SendGrid responded ${response.status}: ${detail}`,
        };
      }

      // SendGrid returns the message id in a response header on success.
      return {
        ok: true,
        channel: "email",
        to: message.to,
        providerId: response.headers.get("x-message-id") ?? undefined,
      };
    } catch (error: unknown) {
      return {
        ok: false,
        channel: "email",
        to: message.to,
        error: error instanceof Error ? error.message : "Network error reaching SendGrid",
      };
    }
  }
}

async function safeText(response: Response): Promise<string> {
  try {
    return (await response.text()).slice(0, 300);
  } catch {
    return "(no body)";
  }
}
