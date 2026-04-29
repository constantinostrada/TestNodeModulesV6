import { ValidationException } from '../exceptions/ValidationException';

/**
 * Product — Domain Entity
 *
 * Represents an inventory product. Enforces its own invariants through
 * the private constructor + static factory pattern.
 *
 * NOTE: No persistence, HTTP, or framework knowledge lives here.
 */
export class Product {
  private _name: string;
  private _brand: string;
  private _price: number;
  private _stock: number;
  private _category: string;

  private readonly _id: string;
  private readonly _sku: string;

  private constructor(
    id: string,
    sku: string,
    name: string,
    brand: string,
    price: number,
    stock: number,
    category: string,
  ) {
    this._id = id;
    this._sku = sku;
    this._name = name;
    this._brand = brand;
    this._price = price;
    this._stock = stock;
    this._category = category;
  }

  // ── Factory ────────────────────────────────────────────────────────────────

  public static create(props: {
    id: string;
    sku: string;
    name: string;
    brand: string;
    price: number;
    stock: number;
    category: string;
  }): Product {
    Product.validateId(props.id);
    Product.validateSku(props.sku);
    Product.validateName(props.name);
    Product.validateBrand(props.brand);
    Product.validatePrice(props.price);
    Product.validateStock(props.stock);
    Product.validateCategory(props.category);

    return new Product(
      props.id.trim(),
      props.sku.trim().toUpperCase(),
      props.name.trim(),
      props.brand.trim(),
      props.price,
      props.stock,
      props.category.trim().toLowerCase(),
    );
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  public get id(): string {
    return this._id;
  }

  public get sku(): string {
    return this._sku;
  }

  public get name(): string {
    return this._name;
  }

  public get brand(): string {
    return this._brand;
  }

  public get price(): number {
    return this._price;
  }

  public get stock(): number {
    return this._stock;
  }

  public get category(): string {
    return this._category;
  }

  /** A product is considered "critical" when its available stock is below 5. */
  public get isCriticalStock(): boolean {
    return this._stock < 5;
  }

  // ── Domain behaviour ───────────────────────────────────────────────────────

  public adjustStock(newStock: number): void {
    Product.validateStock(newStock);
    this._stock = newStock;
  }

  // ── Private validators ─────────────────────────────────────────────────────

  private static validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new ValidationException('id', 'must not be empty');
    }
  }

  private static readonly SKU_PATTERN = /^[A-Z0-9-]+$/;

  private static validateSku(sku: string): void {
    if (!Product.SKU_PATTERN.test(sku)) {
      throw new ValidationException(
        'sku',
        'must contain only uppercase letters, digits, and hyphens (e.g. ELEC-001)',
      );
    }
    if (!sku || sku.trim().length === 0) {
      throw new ValidationException('sku', 'must not be empty');
    }
    if (sku.trim().length > 50) {
      throw new ValidationException('sku', 'must not exceed 50 characters');
    }
  }

  private static validateName(name: string): void {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      throw new ValidationException('name', 'must not be empty');
    }
    if (trimmed.length > 150) {
      throw new ValidationException('name', 'must not exceed 150 characters');
    }
  }

  private static validateBrand(brand: string): void {
    const trimmed = brand.trim();
    if (trimmed.length === 0) {
      throw new ValidationException('brand', 'must not be empty');
    }
    if (trimmed.length > 100) {
      throw new ValidationException('brand', 'must not exceed 100 characters');
    }
  }

  private static validatePrice(price: number): void {
    if (!Number.isFinite(price) || price < 0) {
      throw new ValidationException('price', 'must be a non-negative finite number');
    }
  }

  private static validateStock(stock: number): void {
    if (!Number.isInteger(stock) || stock < 0) {
      throw new ValidationException('stock', 'must be a non-negative integer');
    }
  }

  private static validateCategory(category: string): void {
    const trimmed = category.trim();
    if (trimmed.length === 0) {
      throw new ValidationException('category', 'must not be empty');
    }
    if (trimmed.length > 80) {
      throw new ValidationException('category', 'must not exceed 80 characters');
    }
  }
}
