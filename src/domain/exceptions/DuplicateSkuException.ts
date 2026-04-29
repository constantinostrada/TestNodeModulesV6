import { DomainException } from './DomainException';

/**
 * Thrown when attempting to create a product whose SKU already exists.
 * Maps to HTTP 409 Conflict at the interface layer.
 */
export class DuplicateSkuException extends DomainException {
  constructor(sku: string) {
    super(`A product with SKU "${sku}" already exists.`, 'DUPLICATE_SKU');
    this.name = 'DuplicateSkuException';
  }
}
