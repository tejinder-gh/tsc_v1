/**
 * What: A ChatModel adapter for any OpenAI-compatible Chat Completions endpoint - OpenAI itself,
 *       LM Studio, vLLM, Together, or Ollama's /v1 compatibility shim.
 * Why: "Use any model" shouldn't stop at two vendors. A huge range of local and hosted servers
 *       speak the OpenAI wire format, so one adapter unlocks all of them behind the same interface.
 * How: POSTs to {baseUrl}/chat/completions with response_format json_schema (falling back is the
 *      provider's concern; the interpreter re-validates anyway), temperature 0, optional bearer
 *      auth. Returns the first choice's message content.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06.
 */

import { type ChatModel, type JsonChatRequest, safeText } from "./types";

export class OpenAiCompatibleChatModel implements ChatModel {
  readonly label: string;

  constructor(
    private readonly model: string,
    private readonly baseUrl: string,
    private readonly apiKey?: string,
  ) {
    this.label = `openai:${model}`;
  }

  async completeJson(request: JsonChatRequest): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0,
        response_format: {
          type: "json_schema",
          json_schema: { name: "interpretation", schema: request.schema, strict: true },
        },
        messages: [
          { role: "system", content: request.system },
          { role: "user", content: request.user },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAI-compatible endpoint responded ${response.status}: ${await safeText(response)}`,
      );
    }
    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenAI-compatible endpoint returned no content");
    return content;
  }
}
