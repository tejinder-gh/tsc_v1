/**
 * What: The Anthropic ChatModel adapter - the production default for interpreting inbound replies.
 * Why: Claude with structured outputs gives the most reliable intent reads; this is what runs live.
 *      Kept behind the ChatModel interface so dev can swap in Ollama without the interpreter caring.
 * How: Calls the official SDK's messages.create with a json_schema output format and low effort
 *      (this is classification, not reasoning). The client is created lazily so importing this file
 *      - or selecting a different provider - never requires an API key until an actual call.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 *             Anthropic API usage per the claude-api skill reference.
 * When: 2026-06.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { ChatModel, JsonChatRequest } from "./types";

interface AnthropicLike {
  messages: {
    create(body: unknown): Promise<{
      content: Array<{ type: string; text?: string }>;
      stop_reason?: string;
    }>;
  };
}

export class AnthropicChatModel implements ChatModel {
  readonly label: string;
  private client?: AnthropicLike;

  constructor(
    private readonly model = "claude-opus-4-8",
    private readonly factory: () => AnthropicLike = () =>
      new Anthropic() as unknown as AnthropicLike,
  ) {
    this.label = `anthropic:${model}`;
  }

  async completeJson(request: JsonChatRequest): Promise<string> {
    this.client ??= this.factory();
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: request.maxTokens ?? 1024,
      system: request.system,
      messages: [{ role: "user", content: request.user }],
      output_config: { effort: "low", format: { type: "json_schema", schema: request.schema } },
    });
    if (response.stop_reason === "refusal") throw new Error("Anthropic refused the request");
    const text = response.content.find((b) => b.type === "text")?.text;
    if (!text) throw new Error("Anthropic returned no text content");
    return text;
  }
}
