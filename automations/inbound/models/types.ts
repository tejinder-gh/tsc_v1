/**
 * What: The ChatModel contract - a provider-neutral "give me JSON matching this schema" call that
 *       the LLM interpreter depends on instead of any one vendor's SDK.
 * Why: Dev should be able to run the interpreter on anything - a local Ollama model, an
 *       OpenAI-compatible endpoint, or Claude in production - without touching the interpreter. One
 *       narrow interface makes the model a swappable detail, and makes the interpreter trivially
 *       testable with a stub.
 * How: completeJson takes a system+user prompt and a JSON schema and returns the model's raw JSON
 *       text. Each adapter enforces the schema as far as its provider allows; the interpreter
 *       re-validates with Zod regardless, so a weaker provider degrades to "unknown", never garbage.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06.
 */

export interface JsonChatRequest {
  system: string;
  user: string;
  /** JSON Schema the response must satisfy. */
  schema: Record<string, unknown>;
  maxTokens?: number;
}

export interface ChatModel {
  /** Human label for logs, e.g. "ollama:llama3.1" or "anthropic:claude-opus-4-8". */
  readonly label: string;
  /** Return the model's response as a raw JSON string. May throw on transport/provider errors. */
  completeJson(request: JsonChatRequest): Promise<string>;
}

/** Shared helper: read up to 300 chars of an error body without throwing. */
export async function safeText(response: Response): Promise<string> {
  try {
    return (await response.text()).slice(0, 300);
  } catch {
    return "(no body)";
  }
}
