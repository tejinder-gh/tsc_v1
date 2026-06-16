import { createHmac } from "node:crypto";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildSenders } from "../channels";
import { DEMO_NOW } from "../clients/demo-clock";
import { radianceSalonConfig } from "../clients/radiance-salon";
import { fixedClock } from "../core/clock";
import { MemoryIdempotencyStore } from "../core/idempotency";
import { noopLogger } from "../core/logger";
import type { SendAction } from "../core/types";
import { FileContactIndex, MemoryContactIndex } from "../inbound/contact-index";
import { FileConversationStore, MemoryConversationStore } from "../inbound/conversation";
import type { ChatModel } from "../inbound/models";
import { createChatModel } from "../inbound/models";
import { FileSuppressionStore, MemorySuppressionStore } from "../inbound/suppression";
import { validateTwilioSignature } from "../inbound/twilio-signature";
import { dispatch } from "../runtime/dispatch";
import { processInbound } from "../server/process-inbound";

const stubModel: ChatModel = {
  label: "stub",
  completeJson: async () => '{"intent":"unknown","confidence":0}',
};

describe("createChatModel (any provider including Ollama)", () => {
  it("selects Ollama from env and defaults to Anthropic", () => {
    expect(createChatModel({}, { INTERPRETER_PROVIDER: "ollama" }).label).toMatch(/^ollama:/);
    expect(createChatModel({ provider: "openai", model: "gpt-4o-mini" }, {}).label).toBe(
      "openai:gpt-4o-mini",
    );
    expect(createChatModel({}, {}).label).toBe("anthropic:claude-opus-4-8");
  });
});

describe("validateTwilioSignature", () => {
  const url = "https://example.com/api/inbound";
  const params = { From: "+14165550114", To: "+15550000000", Body: "STOP", MessageSid: "SM1" };
  const token = "test-auth-token";
  const signature = () => {
    const data =
      url +
      Object.keys(params)
        .sort()
        .map((k) => k + params[k as keyof typeof params])
        .join("");
    return createHmac("sha1", token).update(Buffer.from(data, "utf-8")).digest("base64");
  };

  it("accepts a correct signature and rejects a tampered one", () => {
    expect(validateTwilioSignature(url, params, signature(), token)).toBe(true);
    expect(validateTwilioSignature(url, params, "wrong", token)).toBe(false);
    expect(validateTwilioSignature(url, { ...params, Body: "GO" }, signature(), token)).toBe(false);
  });
});

describe("file-backed persistence survives a restart", () => {
  it("reloads suppression, conversation, and contact-index state from disk", () => {
    const dir = mkdtempSync(join(tmpdir(), "tsc-auto-"));

    const sup1 = new FileSuppressionStore(join(dir, "sup.json"));
    sup1.optOut("c-1", "sms");
    expect(new FileSuppressionStore(join(dir, "sup.json")).isOptedOut("c-1", "sms")).toBe(true);

    const idx1 = new FileContactIndex(join(dir, "idx.json"));
    idx1.link("+1999", "c-1");
    expect(new FileContactIndex(join(dir, "idx.json")).lookup("+1999")).toBe("c-1");

    const conv1 = new FileConversationStore(join(dir, "conv.json"));
    conv1.append("c-1", {
      direction: "out",
      channel: "sms",
      body: "hi",
      at: DEMO_NOW,
      automationId: "winback",
    });
    expect(new FileConversationStore(join(dir, "conv.json")).lastOutboundAutomationId("c-1")).toBe(
      "winback",
    );
  });
});

describe("dispatch learns address -> contact for inbound resolution", () => {
  it("records the contact index on a successful send", async () => {
    const contactIndex = new MemoryContactIndex();
    const action: SendAction = {
      kind: "send",
      message: { channel: "sms", to: "+14165550110", body: "see you tomorrow" },
      meta: {
        clientId: "radiance-salon",
        automationId: "reminders",
        recipeId: "booking-reminders",
        contactId: "c-amara",
        idempotencyKey: "k1",
      },
    };
    await dispatch([action], {
      config: radianceSalonConfig,
      senders: buildSenders(radianceSalonConfig, noopLogger),
      idempotency: new MemoryIdempotencyStore(),
      clock: fixedClock(DEMO_NOW),
      logger: noopLogger,
      contactIndex,
    });
    expect(contactIndex.lookup("+14165550110")).toBe("c-amara");
  });
});

describe("processInbound (the route core)", () => {
  it("resolves the sender to a contact, opts them out, and texts the ack", async () => {
    const contactIndex = new MemoryContactIndex();
    contactIndex.link("+14165550114", "c-noor"); // learned from an earlier outbound send
    const stores = {
      suppression: new MemorySuppressionStore(),
      conversations: new MemoryConversationStore(),
      idempotency: new MemoryIdempotencyStore(),
      contactIndex,
    };

    const result = await processInbound(
      {
        id: "SM-stop",
        channel: "sms",
        from: "+14165550114",
        to: "+1",
        body: "STOP",
        receivedAt: DEMO_NOW,
      },
      radianceSalonConfig,
      {
        env: {},
        logger: noopLogger,
        model: stubModel,
        stores,
        senders: buildSenders(radianceSalonConfig, noopLogger),
        clock: fixedClock(DEMO_NOW),
      },
    );

    expect(result.ingest.contactId).toBe("c-noor");
    expect(result.ingest.interpretation.intent).toBe("opt_out");
    expect(stores.suppression.isOptedOut("c-noor", "sms")).toBe(true);
    expect(result.dispatch.sent).toBe(1); // the unsubscribe acknowledgement
  });
});
