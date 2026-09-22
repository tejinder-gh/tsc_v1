/**
 * What: Domain error definitions for the SMS relay subsystem.
 * Why: Normalizes internal failures and cleanly maps them to HTTP responses
 *      without exposing stack traces, cryptographic secrets, or sensitive SMS contents.
 */

export class RelayError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly retryable: boolean;
  readonly internalReason?: string;

  constructor(
    message: string,
    options: {
      statusCode: number;
      code: string;
      retryable?: boolean;
      internalReason?: string;
    },
  ) {
    super(message);
    this.name = "RelayError";
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.retryable = options.retryable ?? false;
    this.internalReason = options.internalReason;
  }
}

export class InvalidMethodError extends RelayError {
  constructor(method: string) {
    super(`HTTP method ${method} not allowed`, {
      statusCode: 405,
      code: "METHOD_NOT_ALLOWED",
      retryable: false,
    });
    this.name = "InvalidMethodError";
  }
}

export class InvalidContentTypeError extends RelayError {
  constructor(contentType: string | null) {
    super(`Unsupported content type: ${contentType ?? "missing"}`, {
      statusCode: 400,
      code: "INVALID_CONTENT_TYPE",
      retryable: false,
    });
    this.name = "InvalidContentTypeError";
  }
}

export class PayloadTooLargeError extends RelayError {
  constructor(sizeBytes: number, limitBytes: number) {
    super(`Payload size (${sizeBytes} bytes) exceeds limit (${limitBytes} bytes)`, {
      statusCode: 413,
      code: "PAYLOAD_TOO_LARGE",
      retryable: false,
    });
    this.name = "PayloadTooLargeError";
  }
}

/**
 * Authentication failures always surface as generic 401 AUTHENTICATION_FAILED externally
 * to avoid leaking whether relay ID, device ID, timestamp, or signature was invalid.
 * The internalReason is retained for automated testing and internal diagnostics.
 */
export class AuthenticationError extends RelayError {
  constructor(internalReason: string) {
    super("Authentication failed", {
      statusCode: 401,
      code: "AUTHENTICATION_FAILED",
      retryable: false,
      internalReason,
    });
    this.name = "AuthenticationError";
  }
}

export class MissingHeaderError extends AuthenticationError {
  constructor(headerName: string) {
    super(`Missing required authentication header: ${headerName}`);
    this.name = "MissingHeaderError";
  }
}

export class TimestampError extends AuthenticationError {
  constructor(internalReason: string) {
    super(`Timestamp validation failed: ${internalReason}`);
    this.name = "TimestampError";
  }
}

export class PayloadValidationError extends RelayError {
  constructor(internalReason: string) {
    // Avoid echoing SMS body content in the error message
    super("Invalid payload", {
      statusCode: 422,
      code: "INVALID_PAYLOAD",
      retryable: false,
      internalReason,
    });
    this.name = "PayloadValidationError";
  }
}

export class DeliveryRetryableError extends RelayError {
  constructor(internalReason: string, code = "DELIVERY_TEMPORARILY_UNAVAILABLE") {
    super("Delivery temporarily unavailable", {
      statusCode: 503,
      code,
      retryable: true,
      internalReason,
    });
    this.name = "DeliveryRetryableError";
  }
}

export class DeliveryPermanentError extends RelayError {
  constructor(internalReason: string, code = "DELIVERY_FAILED") {
    super("Delivery permanently rejected by provider", {
      statusCode: 502,
      code,
      retryable: false,
      internalReason,
    });
    this.name = "DeliveryPermanentError";
  }
}

export class ConfigurationError extends RelayError {
  constructor(internalReason: string) {
    super("Internal server configuration error", {
      statusCode: 500,
      code: "INTERNAL_ERROR",
      retryable: true,
      internalReason,
    });
    this.name = "ConfigurationError";
  }
}
