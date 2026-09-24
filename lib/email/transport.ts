/**
 * What: Shared email transport infrastructure for HTTP-based email providers (SendGrid, Resend).
 * Why: Eliminates duplicated HTTP transport, timeout handling, retry classification,
 *      header sanitization, and response parsing between SMS relay and customer automation channels
 *      without coupling domain-specific formatting or creating a bloated god object.
 * How:
 *   Domain formatting (Relay SMS / Automation CRM)
 *       ↓
 *   sendSendGridEmail / sendResendEmail (lib/email/transport)
 *       ↓
 *   Provider HTTP API (fetch POST)
 */

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailMessage {
  from: string | { email: string; name?: string };
  to: string | string[] | EmailRecipient[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  headers?: Record<string, string>;
  customArgs?: Record<string, string>;
}

export interface EmailTransportResult {
  ok: boolean;
  provider: "sendgrid" | "resend";
  messageId?: string;
  statusCode?: number;
  retryable?: boolean;
  error?: string;
}

export interface SendGridTransportOptions {
  apiKey: string;
  endpoint?: string;
  timeoutMs?: number;
}

export interface ResendTransportOptions {
  apiKey: string;
  endpoint?: string;
  timeoutMs?: number;
}

/**
 * Sanitizes an email header or subject string by removing CR, LF, and control characters
 * to prevent header injection vulnerabilities.
 */
export function sanitizeEmailHeader(val: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Protect against CRLF and control chars in email headers
  return (val || "").replace(/[\r\n\x00-\x1f\x7f]+/g, " ").trim();
}

/**
 * Sends an email via SendGrid's v3 Mail Send HTTP API.
 */
export async function sendSendGridEmail(
  message: EmailMessage,
  options: SendGridTransportOptions,
): Promise<EmailTransportResult> {
  const endpoint = options.endpoint || "https://api.sendgrid.com/v3/mail/send";
  const timeoutMs = options.timeoutMs ?? 10000;

  // Format recipient list
  const rawTo = Array.isArray(message.to) ? message.to : [message.to];
  const formattedTo = rawTo.map((recipient) => {
    if (typeof recipient === "string") {
      return { email: sanitizeEmailHeader(recipient) };
    }
    return {
      email: sanitizeEmailHeader(recipient.email),
      ...(recipient.name ? { name: sanitizeEmailHeader(recipient.name) } : {}),
    };
  });

  // Format sender
  const formattedFrom =
    typeof message.from === "string"
      ? { email: sanitizeEmailHeader(message.from) }
      : {
          email: sanitizeEmailHeader(message.from.email),
          ...(message.from.name ? { name: sanitizeEmailHeader(message.from.name) } : {}),
        };

  const content: Array<{ type: string; value: string }> = [];
  if (message.text !== undefined) {
    content.push({ type: "text/plain", value: message.text });
  }
  if (message.html !== undefined) {
    content.push({ type: "text/html", value: message.html });
  }
  if (content.length === 0) {
    content.push({ type: "text/plain", value: "" });
  }

  const payload: Record<string, unknown> = {
    personalizations: [{ to: formattedTo }],
    from: formattedFrom,
    subject: sanitizeEmailHeader(message.subject),
    content,
  };

  if (message.replyTo) {
    payload.reply_to = { email: sanitizeEmailHeader(message.replyTo) };
  }
  if (message.customArgs) {
    payload.custom_args = message.customArgs;
  }
  if (message.headers) {
    payload.headers = message.headers;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (response.ok) {
      const messageId = response.headers.get("x-message-id") || undefined;
      return {
        ok: true,
        provider: "sendgrid",
        messageId,
        statusCode: response.status,
      };
    }

    const isRetryable = response.status === 429 || response.status >= 500;
    let detail = "";
    try {
      detail = (await response.text()).slice(0, 300);
    } catch {
      detail = "(no body)";
    }

    return {
      ok: false,
      provider: "sendgrid",
      statusCode: response.status,
      retryable: isRetryable,
      error: `SendGrid responded ${response.status}: ${detail}`,
    };
  } catch (err: unknown) {
    return {
      ok: false,
      provider: "sendgrid",
      retryable: true,
      error: err instanceof Error ? err.message : "Network error reaching SendGrid",
    };
  }
}

/**
 * Sends an email via Resend's HTTP API.
 */
export async function sendResendEmail(
  message: EmailMessage,
  options: ResendTransportOptions,
): Promise<EmailTransportResult> {
  const endpoint = options.endpoint || "https://api.resend.com/emails";
  const timeoutMs = options.timeoutMs ?? 10000;

  const rawTo = Array.isArray(message.to) ? message.to : [message.to];
  const toList = rawTo.map((recipient) => {
    if (typeof recipient === "string") {
      return sanitizeEmailHeader(recipient);
    }
    return recipient.name
      ? `${sanitizeEmailHeader(recipient.name)} <${sanitizeEmailHeader(recipient.email)}>`
      : sanitizeEmailHeader(recipient.email);
  });

  const fromStr =
    typeof message.from === "string"
      ? sanitizeEmailHeader(message.from)
      : message.from.name
        ? `${sanitizeEmailHeader(message.from.name)} <${sanitizeEmailHeader(message.from.email)}>`
        : sanitizeEmailHeader(message.from.email);

  const payload: Record<string, unknown> = {
    from: fromStr,
    to: toList,
    subject: sanitizeEmailHeader(message.subject),
    ...(message.text !== undefined ? { text: message.text } : {}),
    ...(message.html !== undefined ? { html: message.html } : {}),
    ...(message.headers ? { headers: message.headers } : {}),
    ...(message.replyTo ? { reply_to: sanitizeEmailHeader(message.replyTo) } : {}),
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (response.ok) {
      const json = (await response.json().catch(() => ({}))) as { id?: string };
      return {
        ok: true,
        provider: "resend",
        messageId: json.id,
        statusCode: response.status,
      };
    }

    const isRetryable = response.status === 429 || response.status >= 500;
    let detail = "";
    try {
      detail = (await response.text()).slice(0, 300);
    } catch {
      detail = "(no body)";
    }

    return {
      ok: false,
      provider: "resend",
      statusCode: response.status,
      retryable: isRetryable,
      error: `Resend responded ${response.status}: ${detail}`,
    };
  } catch (err: unknown) {
    return {
      ok: false,
      provider: "resend",
      retryable: true,
      error: err instanceof Error ? err.message : "Network error reaching Resend",
    };
  }
}
