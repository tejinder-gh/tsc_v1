/**
 * What: The Ollama ChatModel adapter - runs the interpreter against a local Ollama model.
 * Why: This is the "any model, including Ollama" path. In dev you point the interpreter at a model
 *      running on your own machine - no API key, no cost, no data leaving the box - which is ideal
 *      for iterating on prompts and for offline work.
 * How: POSTs to Ollama's native /api/chat with `format` set to our JSON schema (Ollama's structured
 *      output), temperature 0 for determinism, and streaming off. Returns the message content as-is
 *      for the interpreter to validate. No SDK dependency - just fetch.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06.
 */

import { type ChatModel, type JsonChatRequest, safeText } from "./types";

export class OllamaChatModel implements ChatModel {
  readonly label: string;

  constructor(
    private readonly model = "llama3.1",
    private readonly baseUrl = "http://localhost:11434",
  ) {
    this.label = `ollama:${model}`;
  }

  async completeJson(request: JsonChatRequest): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        stream: false,
        options: { temperature: 0 },
        // Ollama enforces this JSON schema on the response (structured outputs).
        format: request.schema,
        messages: [
          { role: "system", content: request.system },
          { role: "user", content: request.user },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama responded ${response.status}: ${await safeText(response)}`);
    }
    const data = (await response.json()) as { message?: { content?: string } };
    const content = data.message?.content;
    if (!content) throw new Error("Ollama returned no message content");
    return content;
  }
}
