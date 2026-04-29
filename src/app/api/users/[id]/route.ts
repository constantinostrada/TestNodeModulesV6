/**
 * /api/users/[id] — Single User Route Handler
 *
 * GET    /api/users/:id  → Get a user by ID
 * PATCH  /api/users/:id  → Update a user
 * DELETE /api/users/:id  → Delete a user
 *
 * Same rule: validate input → delegate to use case → serialise response.
 */

import type { NextRequest } from 'next/server';

import {
  makeDeleteUserUseCase,
  makeGetUserUseCase,
  makeUpdateUserUseCase,
} from '@/infrastructure/container';
import { handleError, noContent, ok } from '@/interfaces/http/helpers/apiResponse';
import { parseBody } from '@/interfaces/http/helpers/parseBody';

type RouteContext = { params: { id: string } };

export async function GET(
  _req: NextRequest,
  { params }: RouteContext,
): Promise<Response> {
  try {
    const useCase = makeGetUserUseCase();
    const user = await useCase.execute({ id: params.id });
    return ok(user);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext,
): Promise<Response> {
  try {
    const body = await parseBody<{ name?: unknown; email?: unknown }>(req);

    const dto: { id: string; name?: string; email?: string } = { id: params.id };

    if (body?.name !== undefined) {
      if (typeof body.name !== 'string') {
        return Response.json(
          { success: false, code: 'BAD_REQUEST', message: '`name` must be a string.' },
          { status: 400 },
        );
      }
      dto.name = body.name;
    }

    if (body?.email !== undefined) {
      if (typeof body.email !== 'string') {
        return Response.json(
          { success: false, code: 'BAD_REQUEST', message: '`email` must be a string.' },
          { status: 400 },
        );
      }
      dto.email = body.email;
    }

    const useCase = makeUpdateUserUseCase();
    const user = await useCase.execute(dto);
    return ok(user);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext,
): Promise<Response> {
  try {
    const useCase = makeDeleteUserUseCase();
    await useCase.execute({ id: params.id });
    return noContent();
  } catch (error) {
    return handleError(error);
  }
}
