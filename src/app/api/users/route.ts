/**
 * /api/users — Users Collection Route Handler
 *
 * GET  /api/users  → List all users
 * POST /api/users  → Create a new user
 *
 * This file is part of the interfaces layer (Next.js App Router convention
 * forces it inside `src/app/`, but it delegates immediately to use cases).
 *
 * Pattern: validate input → call use case → serialise response.
 * NO business logic lives here.
 */

import type { NextRequest } from 'next/server';

import {
  makeCreateUserUseCase,
  makeListUsersUseCase,
} from '@/infrastructure/container';
import { created, handleError, ok } from '@/interfaces/http/helpers/apiResponse';
import { parseBody } from '@/interfaces/http/helpers/parseBody';

export async function GET(): Promise<Response> {
  try {
    const useCase = makeListUsersUseCase();
    const users = await useCase.execute();
    return ok(users);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await parseBody<{ name?: unknown; email?: unknown }>(req);

    if (!body || typeof body.name !== 'string' || typeof body.email !== 'string') {
      return Response.json(
        { success: false, code: 'BAD_REQUEST', message: '`name` and `email` are required.' },
        { status: 400 },
      );
    }

    const useCase = makeCreateUserUseCase();
    const user = await useCase.execute({ id: '', name: body.name, email: body.email });
    return created(user);
  } catch (error) {
    return handleError(error);
  }
}
