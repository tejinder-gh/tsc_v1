/**
 * What: createChatModel - selects the interpreter's model from explicit config or environment,
 *       defaulting to Claude in production and letting dev point at Ollama or any OpenAI-compatible
 *       server with one env var.
 * Why: This is the single switch that satisfies "allow dev to use any model including Ollama". A
 *       developer sets INTERPRETER_PROVIDER=ollama and runs entirely locally; production sets
 *       nothing and gets Claude. Nothing else in the system changes.
 * How: Resolves provider/model/baseUrl from a ModelConfig or the matching env vars, then constructs
 *       the right adapter. Secrets (API keys) are read from the environment, never config.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06.
 */

import { AnthropicChatModel } from "./anthropic";
import { OllamaChatModel } from "./ollama";
import { OpenAiCompatibleChatModel } from "./openai-compatible";
import type { ChatModel } from "./types";

export type ModelProvider = "anthropic" | "ollama" | "openai";

export interface ModelConfig {
  provider?: ModelProvider;
  /** Model id/name. Provider-specific (e.g. "claude-opus-4-8", "llama3.1", "gpt-4o-mini"). */
  model?: string;
  /** Ollama host or OpenAI-compatible base URL. */
  baseUrl?: string;
  /** Env var holding the API key (OpenAI-compatible providers). */
  apiKeyEnv?: string;
}

/**
 * Resolution order per field: explicit config, then env, then a sensible default.
 * Env vars: INTERPRETER_PROVIDER, INTERPRETER_MODEL, OLLAMA_HOST, OPENAI_BASE_URL, OPENAI_API_KEY.
 */
export function createChatModel(
  config: ModelConfig = {},
  env: Record<string, string | undefined> = process.env,
): ChatModel {
  const provider =
    config.provider ?? (env.INTERPRETER_PROVIDER as ModelProvider | undefined) ?? "anthropic";
  const model = config.model ?? env.INTERPRETER_MODEL;

  switch (provider) {
    case "ollama":
      return new OllamaChatModel(
        model ?? "llama3.1",
        config.baseUrl ?? env.OLLAMA_HOST ?? "http://localhost:11434",
      );
    case "openai":
      return new OpenAiCompatibleChatModel(
        model ?? "gpt-4o-mini",
        config.baseUrl ?? env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
        env[config.apiKeyEnv ?? "OPENAI_API_KEY"],
      );
    default:
      return new AnthropicChatModel(model ?? "claude-opus-4-8");
  }
}

export { AnthropicChatModel } from "./anthropic";
export { OllamaChatModel } from "./ollama";
export { OpenAiCompatibleChatModel } from "./openai-compatible";
export type { ChatModel } from "./types";
