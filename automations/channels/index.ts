/**
 * What: buildSenders - resolves a client's channel config into live ChannelSenders, reading any
 *       secrets from the environment by the var names the config declares.
 * Why: One place decides "this client texts via Twilio and emails via SendGrid, unless we're in
 *       dry-run". The runtime dispatch loop then just looks up sender-by-channel. Honours the
 *       global dryRun flag so staging a new client is a one-line, zero-risk switch.
 * How: Per channel, branches on provider. dryRun (global or per-channel "console") yields a
 *       ConsoleSender. Real providers are constructed with requireEnv, so a missing secret fails
 *       fast at startup rather than at first send.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import type { ClientConfig } from "../core/config";
import type { Logger } from "../core/logger";
import type { Channel } from "../core/types";
import { ConsoleSender } from "./console";
import { SendGridEmailSender } from "./email-sendgrid";
import { TwilioSmsSender } from "./sms-twilio";
import { type ChannelSender, requireEnv } from "./types";

export type SenderMap = Partial<Record<Channel, ChannelSender>>;

export function buildSenders(
  config: ClientConfig,
  logger: Logger,
  env: Record<string, string | undefined> = process.env,
): SenderMap {
  const dryRun = config.channels.dryRun;
  const senders: SenderMap = {};
  const console = new ConsoleSender(logger);

  const sms = config.channels.sms;
  if (sms) {
    senders.sms =
      dryRun || sms.provider === "console"
        ? console
        : new TwilioSmsSender({
            accountSid: requireEnv(sms.accountSidEnv ?? "TWILIO_ACCOUNT_SID", env),
            authToken: requireEnv(sms.authTokenEnv ?? "TWILIO_AUTH_TOKEN", env),
            from: requireEnv(sms.fromEnv, env),
          });
  }

  const email = config.channels.email;
  if (email) {
    if (dryRun || email.provider === "console") {
      senders.email = console;
    } else if (email.provider === "sendgrid") {
      senders.email = new SendGridEmailSender({
        apiKey: requireEnv(email.apiKeyEnv ?? "SENDGRID_API_KEY", env),
        fromAddress: email.fromAddress,
        fromName: email.fromName,
      });
    } else {
      throw new Error(
        `Email provider "${email.provider}" is not bundled. Use "sendgrid" or "console", or add an SMTP ChannelSender.`,
      );
    }
  }

  return senders;
}
