import { NextResponse } from "next/server";
import { AuthenticationError } from "./auth/authenticate";

/**
 * Keeps private-machine failures observable to operators without disclosing
 * database, transport, or implementation details to an authenticated caller.
 */
export function internalApiErrorResponse(error: unknown, operation: string): NextResponse {
  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode },
    );
  }

  console.error(`Error in ${operation}`, error);
  return NextResponse.json(
    { error: "Internal server error", code: "INTERNAL_SERVER_ERROR" },
    { status: 500 },
  );
}
