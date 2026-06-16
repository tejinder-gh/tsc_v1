/**
 * What: compositeInterpreter - the two-tier "intelligent" router. Rules run first; only when they
 *       can't settle the message (or settle it with low confidence) does it escalate to the LLM.
 * Why: This is the cost/safety design in one function. Opt-outs and confirmations never reach a
 *       model (instant, free, exact); the LLM is spent only on the genuinely ambiguous tail. It is
 *       also resilient: if the LLM call throws, the rules read still stands.
 * How: Run rules. If the intent is decisive enough, return it. Otherwise, if an LLM interpreter is
 *       configured, defer to it (falling back to the rules read on error). With no LLM, return the
 *       rules read as-is (an "unknown" the handler escalates to a human).
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06.
 */

import type { Logger } from "../core/logger";
import type { InboundMessage, Interpretation, InterpretContext, Interpreter } from "./types";

export interface CompositeOptions {
  /** Below this confidence (or on "unknown"), defer to the LLM. */
  minConfidence?: number;
  logger?: Logger;
}

export function compositeInterpreter(
  rules: Interpreter,
  llm?: Interpreter,
  options: CompositeOptions = {},
): Interpreter {
  const min = options.minConfidence ?? 0.6;

  return {
    async interpret(message: InboundMessage, ctx: InterpretContext): Promise<Interpretation> {
      const rulesRead = await rules.interpret(message, ctx);
      if (rulesRead.intent !== "unknown" && rulesRead.confidence >= min) return rulesRead;
      if (!llm) return rulesRead;

      try {
        return await llm.interpret(message, ctx);
      } catch (error: unknown) {
        options.logger?.error("LLM interpreter failed; using rules read", {
          error: error instanceof Error ? error.message : String(error),
          fallbackIntent: rulesRead.intent,
        });
        return rulesRead;
      }
    },
  };
}
