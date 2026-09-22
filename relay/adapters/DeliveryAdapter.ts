/**
 * What: Delivery adapter contract and interface.
 * Why: Decouples the Next.js relay API and Android capture layer from downstream
 *      delivery mechanisms (Webhook, Slack, Discord, Email, Teams, etc.).
 */

import type { DeliveryContext, DeliveryResult, RelayMessage } from "../types/relay";

export interface DeliveryAdapter {
  deliver(message: RelayMessage, context: DeliveryContext): Promise<DeliveryResult>;
}

export type { DeliveryContext, DeliveryResult, RelayMessage };
