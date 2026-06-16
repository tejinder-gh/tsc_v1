/**
 * What: The deterministic rules interpreter - recognises the unambiguous, compliance-critical
 *       replies (STOP, START, YES/C, RESCHEDULE, "not interested") from keywords alone.
 * Why: Opt-out handling must never depend on an LLM - it has to be exact, instant, and free. The
 *       carrier keyword set (STOP/UNSUBSCRIBE/QUIT...) is a legal interface, so it lives in code,
 *       runs first, and returns full confidence. Anything it can't classify becomes "unknown" for
 *       the LLM (or a human) to handle.
 * How: Normalises the body and matches against keyword sets. Returns confidence 1 for exact
 *       single-word commands, lower for phrase matches, and "unknown" otherwise.
 * From Where: TheSkillCorner automation-engine - inbound/closed-loop layer, 2026-06.
 * When: 2026-06.
 */

import type { Interpretation, Interpreter } from "./types";

// Standard carrier opt-out/opt-in keywords (exact-word matches).
const OPT_OUT = new Set(["stop", "stopall", "unsubscribe", "cancel", "end", "quit", "optout"]);
const OPT_IN = new Set(["start", "unstop", "yes start", "optin", "resubscribe"]);
const CONFIRM = new Set(["c", "y", "yes", "confirm", "confirmed", "ok", "okay", "yep", "yeah"]);

const RESCHEDULE_PHRASES = [
  "reschedule",
  "change my appointment",
  "different time",
  "another time",
  "move my",
];
const NOT_INTERESTED_PHRASES = [
  "not interested",
  "no thanks",
  "no thank you",
  "stop texting",
  "remove me",
  "leave me alone",
];

export const rulesInterpreter: Interpreter = {
  async interpret(message): Promise<Interpretation> {
    const body = message.body
      .trim()
      .toLowerCase()
      .replace(/[.!]+$/, "");

    if (OPT_OUT.has(body)) return rule("opt_out", 1);
    if (OPT_IN.has(body)) return rule("opt_in", 1);
    if (CONFIRM.has(body)) return rule("confirm", 1);

    if (NOT_INTERESTED_PHRASES.some((p) => body.includes(p))) return rule("not_interested", 0.9);
    if (RESCHEDULE_PHRASES.some((p) => body.includes(p))) return rule("reschedule", 0.8);

    return rule("unknown", 0);
  },
};

function rule(intent: Interpretation["intent"], confidence: number): Interpretation {
  return { intent, confidence, source: "rules" };
}
