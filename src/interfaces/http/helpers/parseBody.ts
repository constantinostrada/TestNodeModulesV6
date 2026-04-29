import type { NextRequest } from 'next/server';

/**
 * parseBody — Interface-layer helper
 *
 * Safely parses the JSON body of a NextRequest.
 * Returns null if the body is missing or malformed.
 */
export async function parseBody<T>(req: NextRequest): Promise<T | null> {
  try {
    const text = await req.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
