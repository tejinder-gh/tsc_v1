import { describe, expect, it } from "vitest";
import { buildSenders } from "../channels";
import { DEMO_NOW } from "../clients/demo-clock";
import { radianceSalonConfig, radianceSalonData } from "../clients/radiance-salon";
import { fixedClock } from "../core/clock";
import { MemoryIdempotencyStore } from "../core/idempotency";
import { noopLogger } from "../core/logger";
import { MemoryConversationStore } from "../inbound/conversation";
import { type IngestDeps, ingestInbound } from "../inbound/handle";
import { compositeInterpreter } from "../inbound/interpreter";
import { LlmInterpreter } from "../inbound/llm-interpreter";
import type { ChatModel } from "../inbound/models";
import { rulesInterpreter } from "../inbound/rules-interpreter";
import { MemorySuppressionStore } from "../inbound/suppression";
import type { InboundMessage } from "../inbound/types";
import { parseTwilioInbound } from "../inbound/webhook";
import { inMemoryIntegrations } from "../integrations/memory";
import { dispatch } from "../runtime/dispatch";
import { runClient } from "../runtime/run";

function inbound(over: Partial<InboundMessage>): InboundMessage {
  return {
    id: "M1",
    channel: "sms",
    from: "+14165550114",
    body: "",
    receivedAt: DEMO_NOW,
    ...over,
  };
}

function baseDeps(over: Partial<IngestDeps>): IngestDeps {
  return {
    clientId: radianceSalonConfig.id,
    business: radianceSalonConfig.business,
    interpreter: rulesInterpreter,
    suppression: new MemorySuppressionStore(),
    conversations: new MemoryConversationStore(),
    idempotency: new MemoryIdempotencyStore(),
    notify: radianceSalonConfig.notify,
    handoffTo: "owner",
    logger: noopLogger,
    ...over,
  };
}

describe("rules interpreter", () => {
  it("classifies the compliance-critical keywords with full confidence", async () => {
    const cases: Array<[string, string]> = [
      ["STOP", "opt_out"],
      ["unsubscribe", "opt_out"],
      ["START", "opt_in"],
      ["C", "confirm"],
      ["yes", "confirm"],
    ];
    for (const [body, intent] of cases) {
      const read = await rulesInterpreter.interpret(inbound({ body }), {
        businessName: "X",
        history: [],
      });
      expect(read.intent).toBe(intent);
      expect(read.confidence).toBe(1);
    }
  });

  it("recognizes phrases and leaves the rest unknown", async () => {
    const ctx = { businessName: "X", history: [] };
    expect(
      (await rulesInterpreter.interpret(inbound({ body: "not interested" }), ctx)).intent,
    ).toBe("not_interested");
    expect(
      (await rulesInterpreter.interpret(inbound({ body: "can I reschedule?" }), ctx)).intent,
    ).toBe("reschedule");
    expect(
      (await rulesInterpreter.interpret(inbound({ body: "do you sell gift cards?" }), ctx)).intent,
    ).toBe("unknown");
  });
});

describe("ingestInbound effects", () => {
  it("opts a contact out on STOP and acknowledges", async () => {
    const suppression = new MemorySuppressionStore();
    const deps = baseDeps({ suppression, resolveContact: () => "c-noor" });
    const result = await ingestInbound(inbound({ body: "STOP" }), deps);

    expect(result.interpretation.intent).toBe("opt_out");
    expect(suppression.isOptedOut("c-noor", "sms")).toBe(true);
    expect(result.actions).toHaveLength(1);
    expect(result.actions[0].kind === "send" && result.actions[0].message.body).toContain(
      "unsubscribed",
    );
  });

  it("records a confirmation on C", async () => {
    const suppression = new MemorySuppressionStore();
    const result = await ingestInbound(
      inbound({ body: "C" }),
      baseDeps({ suppression, resolveContact: () => "c-liam" }),
    );
    expect(result.interpretation.intent).toBe("confirm");
    expect(suppression.isConfirmed("c-liam")).toBe(true);
  });

  it("stops the last outbound automation on 'not interested'", async () => {
    const suppression = new MemorySuppressionStore();
    const conversations = new MemoryConversationStore();
    conversations.append("c-noor", {
      direction: "out",
      channel: "sms",
      body: "win-back check-in",
      at: DEMO_NOW,
      automationId: "winback",
    });
    await ingestInbound(
      inbound({ body: "no thanks, not interested" }),
      baseDeps({ suppression, conversations, resolveContact: () => "c-noor" }),
    );
    expect(suppression.isStopped("c-noor", "winback")).toBe(true);
  });

  it("is idempotent on the provider message id", async () => {
    const deps = baseDeps({ resolveContact: () => "c-noor" });
    const first = await ingestInbound(inbound({ id: "DUP", body: "STOP" }), deps);
    const second = await ingestInbound(inbound({ id: "DUP", body: "STOP" }), deps);
    expect(first.deduped).toBe(false);
    expect(second.deduped).toBe(true);
    expect(second.actions).toHaveLength(0);
  });
});

describe("LLM interpreter (stubbed) + composite escalation", () => {
  it("escalates an open question to the LLM and replies with its drafted answer", async () => {
    const model: ChatModel = {
      label: "stub",
      completeJson: async () =>
        JSON.stringify({
          intent: "question",
          confidence: 0.9,
          reply: "We're open until 6pm today - come on by!",
        }),
    };
    const interpreter = compositeInterpreter(rulesInterpreter, new LlmInterpreter({ model }));
    const result = await ingestInbound(
      inbound({ body: "what time do you close today?" }),
      baseDeps({ interpreter, resolveContact: () => "c-amara" }),
    );
    expect(result.interpretation.intent).toBe("question");
    expect(result.interpretation.source).toBe("llm");
    expect(result.actions[0].kind === "send" && result.actions[0].message.body).toContain(
      "open until 6pm",
    );
  });

  it("never escalates a STOP to the LLM", async () => {
    let called = false;
    const model: ChatModel = {
      label: "stub",
      completeJson: async () => {
        called = true;
        return '{"intent":"question","confidence":1}';
      },
    };
    const interpreter = compositeInterpreter(rulesInterpreter, new LlmInterpreter({ model }));
    const result = await ingestInbound(inbound({ body: "STOP" }), baseDeps({ interpreter }));
    expect(result.interpretation.intent).toBe("opt_out");
    expect(called).toBe(false);
  });
});

describe("webhook normalization", () => {
  it("maps a Twilio inbound payload to an InboundMessage", () => {
    const msg = parseTwilioInbound(
      { MessageSid: "SM123", From: "+14165550114", To: "+15550000000", Body: "STOP" },
      DEMO_NOW,
    );
    expect(msg).toMatchObject({ id: "SM123", channel: "sms", from: "+14165550114", body: "STOP" });
  });
});

describe("closed loop: outbound honours an inbound opt-out", () => {
  it("suppresses a contact's next message after they reply STOP", async () => {
    const suppression = new MemorySuppressionStore();
    const conversations = new MemoryConversationStore();
    const clock = fixedClock(DEMO_NOW);
    const integrations = inMemoryIntegrations(radianceSalonData);

    // Day 1: the full plan goes out, including Noor's win-back check-in.
    const run1 = await runClient(radianceSalonConfig, {
      integrations,
      idempotency: new MemoryIdempotencyStore(),
      clock,
      logger: noopLogger,
      suppression,
      conversations,
    });
    expect(run1.dispatch.sent).toBe(5);
    expect(conversations.lastOutboundAutomationId("c-noor")).toBe("winback");

    // Noor texts STOP. The opt-out is written; the acknowledgement still sends (transactional).
    const inboundIdem = new MemoryIdempotencyStore();
    const ingest = await ingestInbound(inbound({ id: "SM-stop", body: "STOP" }), {
      ...baseDeps({ suppression, conversations, idempotency: inboundIdem }),
      resolveContact: (_c, addr) => (addr === "+14165550114" ? "c-noor" : undefined),
    });
    expect(suppression.isOptedOut("c-noor", "sms")).toBe(true);

    const ackReport = await dispatch(ingest.actions, {
      config: radianceSalonConfig,
      senders: buildSenders(radianceSalonConfig, noopLogger),
      idempotency: inboundIdem,
      clock,
      logger: noopLogger,
      suppression,
      conversations,
    });
    expect(ackReport.sent).toBe(1); // the unsubscribe ack went out despite the opt-out
    expect(ackReport.suppressed).toBe(0);

    // A later run (fresh idempotency = new day): Noor is now suppressed, the rest still send.
    const run2 = await runClient(radianceSalonConfig, {
      integrations,
      idempotency: new MemoryIdempotencyStore(),
      clock,
      logger: noopLogger,
      suppression,
      conversations,
    });
    expect(run2.dispatch.suppressed).toBe(1);
    expect(run2.dispatch.sent).toBe(4);
  });
});
