'use client';

/**
 * useProducts — Client-side data-fetching hook
 *
 * Fetches all products from GET /api/products and returns them along
 * with the request state.  Keeping the fetch here (instead of inside
 * InventoryClient) makes the data layer easy to swap later.
 */

import { useEffect, useState } from 'react';

import type { ListProductsResponseDto, ProductDto } from '@/application/dtos/ProductDto';

export interface UseProductsResult {
  items: ProductDto[];
  categories: string[];
  criticalStockCount: number;
  total: number;
  loading: boolean;
  error: string | null;
}

export function useProducts(): UseProductsResult {
  const [items, setItems] = useState<ProductDto[]>([]);
  const [criticalStockCount, setCriticalStockCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = (await res.json()) as {
          success: boolean;
          data: ListProductsResponseDto;
        };

        if (!json.success) throw new Error('API returned success: false');

        if (!cancelled) {
          setItems(json.data.items);
          setCriticalStockCount(json.data.criticalStockCount);
          setTotal(json.data.total);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = Array.from(new Set(items.map((p) => p.category))).sort();

  return { items, categories, criticalStockCount, total, loading, error };
}
