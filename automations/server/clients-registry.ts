/**
 * What: The server-side roster of live client configs, plus resolution of an inbound destination
 *       number to the client it belongs to.
 * Why: A single inbound webhook serves every client. To process a reply, the route must know which
 *       business the customer texted - i.e. which Twilio number received it - so it loads the right
 *       config, stores, and notify destinations.
 * How: Lists the known ClientConfigs and matches the inbound `To` number against each client's
 *       configured sender number (read from the env var its config names). An INBOUND_DEFAULT_CLIENT
 *       env var is the fallback for single-tenant or local-dev setups.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06; in a real multi-tenant deployment, source this list from your client database.
 */

import { brightSmileDentalConfig } from "../clients/brightsmile-dental";
import { radianceSalonConfig } from "../clients/radiance-salon";
import type { ClientConfig } from "../core/config";

export const knownClients: readonly ClientConfig[] = [radianceSalonConfig, brightSmileDentalConfig];

export function resolveClientByNumber(
  toNumber: string | undefined,
  env: Record<string, string | undefined> = process.env,
): ClientConfig | undefined {
  if (toNumber) {
    const match = knownClients.find((client) => {
      const fromEnv = client.channels.sms?.fromEnv;
      return fromEnv ? env[fromEnv] === toNumber : false;
    });
    if (match) return match;
  }
  const fallback = env.INBOUND_DEFAULT_CLIENT;
  return fallback ? knownClients.find((c) => c.id === fallback) : undefined;
}

/** First configured notify destination - the default human-handoff target for inbound. */
export function defaultHandoffTo(client: ClientConfig): string | undefined {
  return Object.keys(client.notify)[0];
}
