/**
 * What: The channel-sender contract and a small env-var reader.
 * Why: The engine decides messages; senders deliver them. One interface means the runtime
 *       dispatch loop is identical whether we're texting via Twilio, emailing via SendGrid, or
 *       printing to the console in a dry-run.
 * How: ChannelSender.send takes a fully rendered OutboundMessage and returns a DeliveryResult
 *       (never throws for an expected provider failure - it reports ok:false so one bad number
 *       doesn't abort a batch). requireEnv enforces the house rule that secrets come from the
 *       environment, failing fast and loudly when a configured var is absent.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06.
 */

import type { DeliveryResult, OutboundMessage } from "../core/types";

export interface ChannelSender {
  send(message: OutboundMessage): Promise<DeliveryResult>;
}

/** Read a required secret from the environment by var name. Throws if missing/empty. */
export function requireEnv(
  name: string,
  env: Record<string, string | undefined> = process.env,
): string {
  const value = env[name];
  if (!value) {
    throw new Error(
      `Required environment variable "${name}" is not set. Channel credentials must come from the environment, never config files.`,
    );
  }
  return value;
}
