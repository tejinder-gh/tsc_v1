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

import { sendSendGridEmail } from "@/lib/email/transport";
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
    const result = await sendSendGridEmail(
      {
        from: { email: this.creds.fromAddress, name: this.creds.fromName },
        to: message.to,
        replyTo: message.replyTo,
        subject: message.subject ?? "(no subject)",
        text: message.body,
      },
      { apiKey: this.creds.apiKey },
    );

    if (result.ok) {
      return {
        ok: true,
        channel: "email",
        to: message.to,
        providerId: result.messageId,
      };
    }

    return {
      ok: false,
      channel: "email",
      to: message.to,
      error: result.error ?? "Failed to send email via SendGrid",
    };
  }
}
