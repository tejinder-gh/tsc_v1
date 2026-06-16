/**
 * What: The Twilio SMS sender - delivers a rendered message via Twilio's REST API.
 * Why: SMS is the highest-converting channel for every reminder/win-back product in the
 *       catalogue, and Twilio is the provider named across content/services.ts. This is the real,
 *       production adapter behind those promises.
 * How: Constructed from credentials read out of the environment (var names supplied by client
 *       config). send() POSTs the standard Messages.json form payload with Basic auth using the
 *       global fetch (Node 18+). Provider/HTTP failures are caught and returned as ok:false so a
 *       single bad number never aborts a batch of dozens of reminders.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import type { DeliveryResult, OutboundMessage } from "../core/types";
import type { ChannelSender } from "./types";

export interface TwilioCredentials {
  accountSid: string;
  authToken: string;
  from: string;
}

export class TwilioSmsSender implements ChannelSender {
  constructor(private readonly creds: TwilioCredentials) {}

  async send(message: OutboundMessage): Promise<DeliveryResult> {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${this.creds.accountSid}/Messages.json`;
    const auth = Buffer.from(`${this.creds.accountSid}:${this.creds.authToken}`).toString("base64");
    const body = new URLSearchParams({
      From: this.creds.from,
      To: message.to,
      Body: message.body,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      if (!response.ok) {
        const detail = await safeText(response);
        return {
          ok: false,
          channel: "sms",
          to: message.to,
          error: `Twilio responded ${response.status}: ${detail}`,
        };
      }

      const data = (await response.json()) as { sid?: string };
      return { ok: true, channel: "sms", to: message.to, providerId: data.sid };
    } catch (error: unknown) {
      return {
        ok: false,
        channel: "sms",
        to: message.to,
        error: error instanceof Error ? error.message : "Network error reaching Twilio",
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
