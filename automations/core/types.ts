/**
 * What: The shared domain vocabulary every automation speaks - contacts, channels,
 *       the actions an automation decides to take, and the context handed to a recipe.
 * Why: "Write code once, use it for many clients" only works if every recipe consumes
 *       and emits the same small set of types. This file is that contract; recipes never
 *       invent their own message or contact shapes.
 * How: Plain interfaces and string-literal unions. Times are ISO 8601 strings so configs,
 *       fixtures, and logs are human-readable and serialisable. The engine is decision-only:
 *       a recipe returns Action[]; the runtime is what actually sends. That split keeps recipes
 *       pure and testable, and makes dry-run identical to live except for the dispatch step.
 * From Where: TheSkillCorner automation-engine build, 2026-06 (productizes content/services.ts).
 * When: 2026-06; extend the Action union when a new delivery primitive is needed.
 */

/** A delivery channel an automation can use. "auto" lets the engine pick by consent. */
export type Channel = "sms" | "email";

/** An ISO-8601 timestamp (e.g. "2026-06-15T14:00:00.000Z"). */
export type IsoTimestamp = string;

/** Someone an automation communicates with: a customer, patient, lead, or client. */
export interface Contact {
  id: string;
  name?: string;
  email?: string;
  /** E.164 phone, e.g. "+14165550184". */
  phone?: string;
  /** Per-channel consent. No message goes out on a channel without explicit true. */
  consent: { sms: boolean; email: boolean };
  /** IANA zone, e.g. "America/Toronto". Used for quiet-hours and scheduling. */
  timezone?: string;
  locale?: string;
}

/** A fully rendered, ready-to-send message. No templating remains. */
export interface OutboundMessage {
  channel: Channel;
  /** Phone (sms) or email address (email). */
  to: string;
  /** Email subject; ignored for sms. */
  subject?: string;
  body: string;
  replyTo?: string;
}

/** Provenance attached to every action for idempotency, auditing, and reporting. */
export interface ActionMeta {
  clientId: string;
  automationId: string;
  recipeId: string;
  contactId: string;
  /** Stable key identifying this exact action; the runtime must never dispatch it twice. */
  idempotencyKey: string;
  /** Free-form tags for reporting (e.g. { step: "24h", value: "150" }). */
  tags?: Record<string, string | number>;
}

/** Send a rendered message to a contact over a channel. */
export interface SendAction {
  kind: "send";
  message: OutboundMessage;
  meta: ActionMeta;
}

/** Notify a human on the client's team (e.g. "hot lead", "negative review"). */
export interface NotifyAction {
  kind: "notify";
  /** Logical destination defined in client config (e.g. "owner", "front-desk"). */
  to: string;
  summary: string;
  meta: ActionMeta;
}

/**
 * Queue AI-drafted content for one-tap human approval (review replies, social posts,
 * newsletters). The runtime persists drafts; a human approves before anything publishes.
 */
export interface DraftAction {
  kind: "draft";
  /** What the draft is for, e.g. "review-reply" or "social-post". */
  purpose: string;
  /** The drafted content, channel-agnostic. */
  content: { subject?: string; body: string };
  /** Optional pre-rendered message to send on approval. */
  onApproval?: OutboundMessage;
  meta: ActionMeta;
}

/** Everything an automation can decide to do. The runtime knows how to execute each. */
export type Action = SendAction | NotifyAction | DraftAction;

/** A delivery outcome from a channel. */
export interface DeliveryResult {
  ok: boolean;
  channel: Channel;
  to: string;
  /** Provider message id when available. */
  providerId?: string;
  error?: string;
}
