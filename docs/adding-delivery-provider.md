# Adding a Delivery Provider to the SMS Relay

The SMS relay uses **Dependency Inversion** to decouple the Android capture layer and the Next.js HMAC authentication boundary from downstream delivery mechanisms.

Adding a new destination (e.g., Telegram, Pushover, Discord, Slack, Microsoft Teams) requires **zero changes** to:
- The Android SMS capture service, SQLite/Room database, or WorkManager jobs
- The HMAC-SHA256 canonical request format
- Route authentication (`verifyRelayRequest.ts`)
- Schema validation (`relayPayloadSchema.ts`)
- The Next.js Route Handler (`/api/v1/relay/route.ts`)

---

## Step 1: Implement the `DeliveryAdapter` Interface

Create a new file under `relay/adapters/`, for example `relay/adapters/TelegramDeliveryAdapter.ts`:

```typescript
import type {
  DeliveryAdapter,
  DeliveryContext,
  DeliveryResult,
  RelayMessage,
} from "./DeliveryAdapter";

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export class TelegramDeliveryAdapter implements DeliveryAdapter {
  constructor(private readonly config: TelegramConfig) {}

  async deliver(message: RelayMessage, context: DeliveryContext): Promise<DeliveryResult> {
    const simNotice = message.sim?.slotIndex !== undefined ? ` [SIM ${message.sim.slotIndex + 1}]` : "";
    const text = [
      `📩 *New SMS Received*${simNotice}`,
      `*From:* \`${message.sender}\``,
      `*Time:* ${message.receivedAt}`,
      `*Device:* ${context.deviceId}`,
      `*Event ID:* \`${context.eventId}\``,
      "",
      "```",
      message.body,
      "```",
    ].join("\n");

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.config.botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: this.config.chatId,
            text,
            parse_mode: "Markdown",
          }),
          signal: AbortSignal.timeout(10000),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          provider: "telegram",
          providerMessageId: String(data.result?.message_id),
        };
      }

      // Classify retryable vs permanent errors
      if (response.status === 429 || response.status >= 500) {
        return {
          success: false,
          retryable: true,
          code: "DELIVERY_TEMPORARILY_UNAVAILABLE",
        };
      }

      return {
        success: false,
        retryable: false,
        code: "DELIVERY_REJECTED",
      };
    } catch {
      return {
        success: false,
        retryable: true,
        code: "DELIVERY_TEMPORARILY_UNAVAILABLE",
      };
    }
  }
}
```

---

## Step 2: Register in the Adapter Factory

In `relay/adapters/createDeliveryAdapter.ts`, import your new adapter and add a case to the factory switch:

```typescript
import { TelegramDeliveryAdapter } from "./TelegramDeliveryAdapter";

export function createDeliveryAdapter(
  config: RelayConfig,
  env: Record<string, string | undefined> = process.env,
): DeliveryAdapter {
  switch (config.deliveryProvider) {
    case "telegram": {
      const botToken = env.SMS_RELAY_TELEGRAM_BOT_TOKEN?.trim() || "";
      const chatId = env.SMS_RELAY_TELEGRAM_CHAT_ID?.trim() || "";
      return new TelegramDeliveryAdapter({ botToken, chatId });
    }
    // ... existing cases (email, webhook, dev-null)
  }
}
```

---

## Step 3: Update Configuration Schema

In `relay/config/relayConfig.ts`, extend the provider enum:

```typescript
deliveryProvider: z.enum(["email", "webhook", "dev-null", "telegram"]).default("email"),
```

---

## Step 4: Configure Environment Variables

In `.env.local` (or production environment):

```bash
SMS_RELAY_DELIVERY_PROVIDER=telegram
SMS_RELAY_TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
SMS_RELAY_TELEGRAM_CHAT_ID=987654321
```

Restart or re-deploy the Next.js app. The Android capture device will immediately begin delivering messages to Telegram without needing any app updates or credential changes.
