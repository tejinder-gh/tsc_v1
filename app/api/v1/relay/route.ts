/**
 * What: Next.js Route Handler for POST /api/v1/relay.
 * Why: Entry point for signed SMS relay submissions from the Android capture layer.
 *      Only POST is permitted; all other methods return 405 with Allow: POST.
 *      Forces Node.js runtime and dynamic execution without caching.
 */

import { handleMethodNotAllowed, handleRelayRequest } from "@/relay/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return handleRelayRequest(request);
}

export async function GET(): Promise<Response> {
  return handleMethodNotAllowed();
}

export async function PUT(): Promise<Response> {
  return handleMethodNotAllowed();
}

export async function DELETE(): Promise<Response> {
  return handleMethodNotAllowed();
}

export async function PATCH(): Promise<Response> {
  return handleMethodNotAllowed();
}

export async function HEAD(): Promise<Response> {
  return handleMethodNotAllowed();
}

export async function OPTIONS(): Promise<Response> {
  return handleMethodNotAllowed();
}
