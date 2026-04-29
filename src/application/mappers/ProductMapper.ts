import type { Product } from '@/domain/entities/Product';

import type { ProductDto } from '../dtos/ProductDto';

/**
 * ProductMapper
 *
 * Converts domain entities → output DTOs.
 * Lives in application because it knows about both domain types and DTOs.
 */
export class ProductMapper {
  public static toDto(product: Product): ProductDto {
    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      category: product.category,
      criticalStock: product.isCriticalStock,
    };
  }

  public static toDtoList(products: Product[]): ProductDto[] {
    return products.map(ProductMapper.toDto);
  }
}
