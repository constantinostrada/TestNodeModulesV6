/**
 * /api/products — Products Collection Route Handler
 *
 * GET  /api/products              → List all inventory products
 * GET  /api/products?name=laptop  → Filter by name (partial, case-insensitive)
 * GET  /api/products?sku=ELEC     → Filter by SKU  (partial, case-insensitive)
 * GET  /api/products?category=electronics → Filter by category (exact, normalised)
 *
 * POST /api/products              → Create a new product
 *   Body (JSON): { sku, name, brand, price, stock, category }
 *   Returns 201 with the created product, or:
 *     400 — validation failure (missing field, bad format, price ≤ 0, stock < 0)
 *     409 — SKU already in use
 *     422 — unparseable JSON body
 */

import type { NextRequest } from 'next/server';

import { makeCreateProductUseCase, makeListProductsUseCase } from '@/infrastructure/container';
import { handleError, ok, created } from '@/interfaces/http/helpers/apiResponse';
import { parseBody } from '@/interfaces/http/helpers/parseBody';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const { searchParams } = req.nextUrl;

    const name = searchParams.get('name') ?? undefined;
    const sku = searchParams.get('sku') ?? undefined;
    const category = searchParams.get('category') ?? undefined;

    const useCase = makeListProductsUseCase();
    const result = await useCase.execute({ name, sku, category });

    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Parse body — returns null when JSON is malformed
    const body = await parseBody<Record<string, unknown>>(req);
    if (body === null) {
      return new Response(
        JSON.stringify({ success: false, code: 'INVALID_JSON', message: 'Request body must be valid JSON' }),
        { status: 422, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Presence guard — catch missing required fields before hitting the domain
    const missing: string[] = [];
    for (const field of ['sku', 'name', 'brand', 'price', 'stock', 'category']) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        missing.push(field);
      }
    }
    if (missing.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          code: 'MISSING_FIELDS',
          message: `Missing required fields: ${missing.join(', ')}`,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Coerce numeric fields defensively — reject non-numeric input early
    const price = Number(body['price']);
    const stock = Number(body['stock']);

    if (!Number.isFinite(price)) {
      return new Response(
        JSON.stringify({ success: false, code: 'INVALID_FIELD', message: 'price must be a number' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
    if (!Number.isFinite(stock)) {
      return new Response(
        JSON.stringify({ success: false, code: 'INVALID_FIELD', message: 'stock must be a number' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const useCase = makeCreateProductUseCase();
    const product = await useCase.execute({
      sku: String(body['sku']).trim(),
      name: String(body['name']).trim(),
      brand: String(body['brand']).trim(),
      price,
      stock,
      category: String(body['category']).trim(),
    });

    return created(product);
  } catch (error) {
    return handleError(error);
  }
}
