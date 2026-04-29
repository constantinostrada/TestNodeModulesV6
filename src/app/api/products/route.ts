/**
 * /api/products — Products Collection Route Handler
 *
 * GET /api/products              → List all inventory products
 * GET /api/products?name=laptop  → Filter by name (partial, case-insensitive)
 * GET /api/products?sku=ELEC     → Filter by SKU  (partial, case-insensitive)
 * GET /api/products?category=electronics → Filter by category (exact, normalised)
 *
 * Filters can be combined freely: ?name=mouse&category=electronics
 *
 * Response envelope:
 *   { success: true, data: { total, criticalStockCount, items: [...] } }
 */

import type { NextRequest } from 'next/server';

import { makeListProductsUseCase } from '@/infrastructure/container';
import { handleError, ok } from '@/interfaces/http/helpers/apiResponse';

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
