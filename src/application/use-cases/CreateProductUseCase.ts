import { Product } from '@/domain/entities/Product';
import { DuplicateSkuException } from '@/domain/exceptions/DuplicateSkuException';
import { ProductMapper } from '../mappers/ProductMapper';

import type { IProductRepository } from '@/domain/repositories/IProductRepository';
import type { CreateProductDto } from '../dtos/CreateProductDto';
import type { ProductDto } from '../dtos/ProductDto';
import type { IIdGenerator } from '../ports/IIdGenerator';

/**
 * CreateProductUseCase
 *
 * Orchestrates the creation of a new inventory product:
 *  1. Asserts SKU uniqueness (409 Conflict if already taken).
 *  2. Creates the Product entity — entity enforces all field invariants.
 *  3. Persists via the repository interface.
 *  4. Returns a ProductDto — never a raw domain entity.
 *
 * All dependencies injected via constructor (no framework magic).
 */
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly idGenerator: IIdGenerator,
  ) {}

  public async execute(dto: CreateProductDto): Promise<ProductDto> {
    // Business rule: SKU must be unique across the catalogue.
    const existing = await this.productRepository.findBySku(dto.sku);
    if (existing !== null) {
      throw new DuplicateSkuException(dto.sku);
    }

    const product = Product.create({
      id: this.idGenerator.generate(),
      sku: dto.sku,
      name: dto.name,
      brand: dto.brand,
      price: dto.price,
      stock: dto.stock,
      category: dto.category,
    });

    await this.productRepository.save(product);

    return ProductMapper.toDto(product);
  }
}
