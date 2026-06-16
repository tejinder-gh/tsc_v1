/**
 * What: A minimal structured logger with levels and a no-op variant.
 * Why: House rules forbid bare console.log in production code and require detailed server-side
 *      error context. Recipes and the runtime log through this so output is consistent and
 *      silenceable (tests use the noop logger to keep output clean).
 * How: Logger is a four-method interface. consoleLogger writes one JSON line per event to the
 *      appropriate stream. noopLogger discards everything.
 * From Where: TheSkillCorner automation-engine build, 2026-06.
 * When: 2026-06; swap consoleLogger for pino/winston transport when shipping to a log platform.
 */

export type LogFields = Record<string, unknown>;

export interface Logger {
  debug(message: string, fields?: LogFields): void;
  info(message: string, fields?: LogFields): void;
  warn(message: string, fields?: LogFields): void;
  error(message: string, fields?: LogFields): void;
}

function emit(stream: "out" | "err", level: string, message: string, fields?: LogFields): void {
  const line = JSON.stringify({ ts: new Date().toISOString(), level, message, ...fields });
  // process streams are the lowest-level sink; this is the single sanctioned write point.
  if (stream === "err") process.stderr.write(`${line}\n`);
  else process.stdout.write(`${line}\n`);
}

export const consoleLogger: Logger = {
  debug: (m, f) => emit("out", "debug", m, f),
  info: (m, f) => emit("out", "info", m, f),
  warn: (m, f) => emit("err", "warn", m, f),
  error: (m, f) => emit("err", "error", m, f),
};

export const noopLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};
