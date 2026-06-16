/**
 * What: The console (dry-run) sender - prints what *would* be sent and reports success.
 * Why: Every new client onboards in dry-run first: you watch a full day of real plans render
 *       against their real data with zero risk of texting a customer. It's also what the test
 *       suite and the demo use, so "ready to monetize" is verifiable without any provider account.
 * How: Implements ChannelSender by logging the message through the provided Logger and returning
 *       ok:true. No network, no secrets.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import type { Logger } from "../core/logger";
import type { DeliveryResult, OutboundMessage } from "../core/types";
import type { ChannelSender } from "./types";

export class ConsoleSender implements ChannelSender {
  constructor(private readonly logger: Logger) {}

  async send(message: OutboundMessage): Promise<DeliveryResult> {
    this.logger.info("[dry-run] would send", {
      channel: message.channel,
      to: message.to,
      subject: message.subject,
      body: message.body,
    });
    return { ok: true, channel: message.channel, to: message.to, providerId: "dry-run" };
  }
}
