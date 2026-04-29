/**
 * Base class for all domain-level exceptions.
 * Domain exceptions carry semantic meaning about what business rule was violated.
 * They must NOT contain any framework-specific types.
 */
export class DomainException extends Error {
  public readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'DomainException';
    this.code = code;

    // Restore the prototype chain so `instanceof` works after transpilation.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
