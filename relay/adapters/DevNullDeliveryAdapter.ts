/**
 * What: Dev-Null delivery adapter for local testing and benchmarks.
 * Why: Accepts verified messages and immediately returns success without logging
 *      or persisting sensitive SMS content.
 */

import type {
  DeliveryAdapter,
  DeliveryContext,
  DeliveryResult,
  RelayMessage,
} from "./DeliveryAdapter";

export class DevNullDeliveryAdapter implements DeliveryAdapter {
  async deliver(_message: RelayMessage, _context: DeliveryContext): Promise<DeliveryResult> {
    return {
      success: true,
      provider: "dev-null",
    };
  }
}
