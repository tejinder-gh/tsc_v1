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

export const PROHIBITED_LOG_KEYS = new Set([
  "body",
  "messagebody",
  "subject",
  "email",
  "phone",
  "to",
  "from",
  "contact",
  "authorization",
  "apikey",
  "token",
  "url",
  "secret",
  "password",
  "summary",
]);

export function sanitizeLogValue(val: unknown, keyName?: string): unknown {
  if (keyName && PROHIBITED_LOG_KEYS.has(keyName.toLowerCase())) {
    return undefined;
  }

  if (val === null || val === undefined) {
    return val;
  }

  if (val instanceof Error) {
    return {
      name: val.name,
      code:
        "code" in val && typeof (val as { code?: unknown }).code === "string"
          ? (val as { code?: string }).code
          : "ERROR",
    };
  }

  if (Array.isArray(val)) {
    return val.map((item) => sanitizeLogValue(item));
  }

  if (typeof val === "object") {
    const res: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (!PROHIBITED_LOG_KEYS.has(k.toLowerCase())) {
        const sanitized = sanitizeLogValue(v, k);
        if (sanitized !== undefined) {
          res[k] = sanitized;
        }
      }
    }
    return res;
  }

  return val;
}

export function sanitizeLogFields(fields?: LogFields): LogFields | undefined {
  if (!fields) return undefined;
  return sanitizeLogValue(fields) as LogFields;
}

function emit(stream: "out" | "err", level: string, message: string, fields?: LogFields): void {
  const sanitized = sanitizeLogFields(fields);
  const line = JSON.stringify({ ts: new Date().toISOString(), level, message, ...sanitized });
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
