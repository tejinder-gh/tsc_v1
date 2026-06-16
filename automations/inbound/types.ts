/**
 * What: The inbound vocabulary - an incoming message, the interpreted intent behind it, the
 *       effects that intent produces, and the Interpreter contract that turns one into the other.
 * Why: The outbound engine only speaks; this closes the loop so a customer's reply ("STOP",
 *       "yes", "can you do Saturday?") is ingested and acted on. Keeping intents and effects as a
 *       small closed vocabulary lets one handler serve every channel and every recipe.
 * How: Plain types. InboundMessage is provider-agnostic (webhooks normalise into it). An
 *       Interpretation carries a confidence so the handler can escalate low-confidence reads to a
 *       human instead of guessing. Effects are the typed decisions the handler then applies.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06.
 */

import type { Channel, IsoTimestamp, OutboundMessage } from "../core/types";

/** A normalised inbound message from any channel/provider. */
export interface InboundMessage {
  /** Provider message id (Twilio MessageSid, email Message-ID). Used to dedupe re-deliveries. */
  id: string;
  channel: Channel;
  /** Sender address: E.164 phone (sms) or email address (email). */
  from: string;
  /** Our receiving address, when the provider supplies it. */
  to?: string;
  body: string;
  receivedAt: IsoTimestamp;
  /** Resolved contact id, if the caller already knows it; otherwise the handler resolves it. */
  contactId?: string;
}

/** The closed set of intents the system understands. Compliance-critical ones are rules-only. */
export type IntentKind =
  | "opt_out" // STOP / UNSUBSCRIBE - must never depend on an LLM
  | "opt_in" // START / resubscribe
  | "confirm" // "yes" / "C" - confirming an appointment
  | "reschedule" // wants a different time
  | "not_interested" // stop chasing me (win-back / follow-up)
  | "question" // open-ended question for the AI receptionist
  | "positive" // thanks / happy reply, no action needed
  | "handoff" // complaint / urgent - escalate to a human
  | "unknown"; // rules couldn't decide; escalate to LLM or human

export interface Interpretation {
  intent: IntentKind;
  /** 0..1. The handler treats low-confidence reads cautiously (reply-draft or human handoff). */
  confidence: number;
  /** Optional extracted detail, e.g. a requested time for a reschedule. */
  requestedTimeText?: string;
  /** A suggested reply the interpreter can produce (mainly the LLM). */
  suggestedReply?: string;
  /** Which interpreter produced this read. */
  source: "rules" | "llm";
}

/** Context an interpreter may use to read a message in conversation. */
export interface InterpretContext {
  businessName: string;
  brandVoice?: string;
  /** Recent message history (most recent last) for disambiguation. */
  history: ConversationEntry[];
  /** The automation the last outbound message belonged to, if known. */
  lastOutboundAutomationId?: string;
}

export interface Interpreter {
  interpret(message: InboundMessage, ctx: InterpretContext): Promise<Interpretation>;
}

/** A typed decision the handler applies as a result of an interpretation. */
export type InboundEffect =
  | { kind: "opt_out"; channel?: Channel }
  | { kind: "opt_in"; channel?: Channel }
  | { kind: "stop_automation"; automationId: string }
  | { kind: "confirm" }
  | { kind: "reply"; message: OutboundMessage }
  | { kind: "handoff"; to: string; summary: string };

/** One stored line of a conversation, used as LLM context and for reply attribution. */
export interface ConversationEntry {
  direction: "in" | "out";
  channel: Channel;
  body: string;
  at: IsoTimestamp;
  /** For outbound entries: which automation sent it (so a reply can be attributed). */
  automationId?: string;
}
