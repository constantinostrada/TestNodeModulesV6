import { DomainException } from './DomainException';

/**
 * Thrown when a domain invariant (validation rule) is violated.
 */
export class ValidationException extends DomainException {
  public readonly field: string;

  constructor(field: string, reason: string) {
    super(`Validation failed for field "${field}": ${reason}`, 'VALIDATION_ERROR');
    this.name = 'ValidationException';
    this.field = field;
  }
}
