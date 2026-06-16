/**
 * What: The LLM interpreter - reads open-ended replies the rules can't classify ("can you do
 *       Saturday instead?", "do you take walk-ins?") and returns a structured intent, plus a
 *       drafted on-brand reply for genuine questions. This is the "intelligent" half of ingestion.
 * Why: Real customers don't text keywords. Speed-to-lead, the AI receptionist, and two-way texting
 *       all need natural-language understanding - but only for the messages rules can't settle, so
 *       cost stays bounded and opt-outs never touch a model.
 * How: Depends only on a ChatModel (Anthropic, Ollama, or any OpenAI-compatible server), so the
 *       same interpreter runs locally in dev or on Claude in production. It asks for JSON against a
 *       schema, then re-validates the result with Zod - so a weaker model degrades to a safe
 *       "handoff", never garbage. The model is injected, so tests stub it and never hit a network.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06.
 */

import { z } from "zod";
import type { ChatModel } from "./models";
import type { InboundMessage, Interpretation, InterpretContext, Interpreter } from "./types";

const INTENTS = [
  "opt_out",
  "opt_in",
  "confirm",
  "reschedule",
  "not_interested",
  "question",
  "positive",
  "handoff",
  "unknown",
] as const;

const llmSchema = z.object({
  intent: z.enum(INTENTS),
  confidence: z.number(),
  requestedTimeText: z.string().optional(),
  /** A short, on-brand reply to send back - only meaningful for the "question" intent. */
  reply: z.string().optional(),
});

/** The structured-output JSON schema the model must satisfy (provider-neutral). */
const OUTPUT_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    intent: { type: "string", enum: [...INTENTS] },
    confidence: { type: "number" },
    requestedTimeText: { type: "string" },
    reply: { type: "string" },
  },
  required: ["intent", "confidence"],
};

export interface LlmInterpreterOptions {
  /** The model backing this interpreter (see createChatModel). */
  model: ChatModel;
}

export class LlmInterpreter implements Interpreter {
  private readonly model: ChatModel;

  constructor(options: LlmInterpreterOptions) {
    this.model = options.model;
  }

  async interpret(message: InboundMessage, ctx: InterpretContext): Promise<Interpretation> {
    // A transport/provider error propagates so the composite can fall back to the rules read.
    const text = await this.model.completeJson({
      system: buildSystemPrompt(ctx),
      user: buildUserPrompt(message, ctx),
      schema: OUTPUT_SCHEMA,
      maxTokens: 1024,
    });

    const read = parseRead(text);
    if (!read) {
      // Refusal/invalid JSON: fail safe to a human rather than guess.
      return { intent: "handoff", confidence: 0, source: "llm" };
    }
    return {
      intent: read.intent,
      confidence: clamp01(read.confidence),
      requestedTimeText: read.requestedTimeText,
      suggestedReply: read.reply,
      source: "llm",
    };
  }
}

function parseRead(text: string): z.infer<typeof llmSchema> | null {
  try {
    const parsed = llmSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function buildSystemPrompt(ctx: InterpretContext): string {
  const voice = ctx.brandVoice ? ` The business voice is: ${ctx.brandVoice}` : "";
  return [
    `You classify inbound text/email replies for ${ctx.businessName}, a local business.`,
    "Return JSON only matching the provided schema: the single best intent for the customer's",
    "latest message, a confidence from 0 to 1, and - only when the intent is 'question' - a short,",
    "friendly reply in the business's voice answering it directly. For a reschedule, put any time",
    "the customer named in requestedTimeText. Never invent facts (hours, prices, availability) you",
    "weren't given; if a question needs info you don't have, use intent 'handoff' so a human answers.",
    voice,
  ].join(" ");
}

function buildUserPrompt(message: InboundMessage, ctx: InterpretContext): string {
  const history = ctx.history
    .map((e) => `${e.direction === "in" ? "Customer" : "Business"}: ${e.body}`)
    .join("\n");
  const lead = history ? `Recent conversation:\n${history}\n\n` : "";
  return `${lead}Latest customer message:\n${message.body}`;
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}
