/**
 * CreateProductDto — Input DTO for product creation.
 *
 * Carries the raw (already type-checked) input from the interface layer
 * into the use case. No domain types, no framework types.
 */
export interface CreateProductDto {
  readonly sku: string;
  readonly name: string;
  readonly brand: string;
  readonly price: number;
  readonly stock: number;
  readonly category: string;
}
