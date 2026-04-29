import { NextResponse } from 'next/server';

import { DomainException } from '@/domain/exceptions/DomainException';
import { UserNotFoundException } from '@/domain/exceptions/UserNotFoundException';
import { ValidationException } from '@/domain/exceptions/ValidationException';

/**
 * apiResponse — Interface-layer helper
 *
 * Centralises the mapping of application/domain exceptions to HTTP responses.
 * Controllers stay thin: call a use case, then pass the result here.
 */
export function ok<T>(data: T): NextResponse {
  return NextResponse.json({ success: true, data }, { status: 200 });
}

export function created<T>(data: T): NextResponse {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function handleError(error: unknown): NextResponse {
  if (error instanceof UserNotFoundException) {
    return NextResponse.json(
      { success: false, code: error.code, message: error.message },
      { status: 404 },
    );
  }

  if (error instanceof ValidationException) {
    return NextResponse.json(
      {
        success: false,
        code: error.code,
        message: error.message,
        field: error.field,
      },
      { status: 422 },
    );
  }

  if (error instanceof DomainException) {
    return NextResponse.json(
      { success: false, code: error.code, message: error.message },
      { status: 400 },
    );
  }

  // Unknown / unexpected error — don't leak internals.
  console.error('[Unhandled error]', error);
  return NextResponse.json(
    { success: false, code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' },
    { status: 500 },
  );
}
