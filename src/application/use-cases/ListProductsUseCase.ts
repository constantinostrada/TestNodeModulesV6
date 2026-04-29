import type { IProductRepository, ProductFilters } from '@/domain/repositories/IProductRepository';

import type { ListProductsResponseDto } from '../dtos/ProductDto';
import { ProductMapper } from '../mappers/ProductMapper';

/**
 * ListProductsUseCase
 *
 * Returns all inventory products, optionally filtered by name, sku, or
 * category. The response envelope includes the total item count and how
 * many products are in critical stock (stock < 5).
 */
export class ListProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  public async execute(filters?: ProductFilters): Promise<ListProductsResponseDto> {
    const products = await this.productRepository.findAll(filters);
    const items = ProductMapper.toDtoList(products);

    const criticalStockCount = items.filter((p) => p.criticalStock).length;

    return {
      total: items.length,
      criticalStockCount,
      items,
    };
  }
}
