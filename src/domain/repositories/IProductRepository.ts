import type { Product } from '../entities/Product';

/**
 * IProductRepository — Domain Repository Interface
 *
 * Defines WHAT operations the domain needs for Product persistence.
 * The HOW (in-memory, SQL, etc.) is determined by the infrastructure layer.
 */
export interface IProductRepository {
  /** Return all products, with optional filters applied. */
  findAll(filters?: ProductFilters): Promise<Product[]>;
}

export interface ProductFilters {
  /** Case-insensitive partial match on product name. */
  name?: string;
  /** Case-insensitive partial match on SKU. */
  sku?: string;
  /** Exact match on category (normalised to lowercase). */
  category?: string;
}
