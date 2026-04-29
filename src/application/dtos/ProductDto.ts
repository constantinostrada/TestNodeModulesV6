/**
 * ProductDto — Output DTO
 *
 * Represents a Product as seen by API consumers.
 * No domain types leak out — consumers never touch domain entities.
 */
export interface ProductDto {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly stock: number;
  readonly category: string;
  readonly criticalStock: boolean;
}

/**
 * ListProductsResponseDto — Envelope returned by GET /api/products
 *
 * Wraps the item list with aggregate statistics so clients don't have
 * to compute them client-side.
 */
export interface ListProductsResponseDto {
  readonly total: number;
  readonly criticalStockCount: number;
  readonly items: ProductDto[];
}
