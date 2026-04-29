import { ValidationException } from '../exceptions/ValidationException';

/**
 * Email — Value Object
 *
 * Immutable. Equality is determined by value, not identity.
 * Enforces the email format invariant at construction time.
 */
export class Email {
  private readonly _value: string;

  private static readonly REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Factory method — the only way to create an Email.
   * Throws ValidationException if the format is invalid.
   */
  public static create(raw: string): Email {
    const trimmed = raw.trim().toLowerCase();

    if (trimmed.length === 0) {
      throw new ValidationException('email', 'must not be empty');
    }

    if (!Email.REGEX.test(trimmed)) {
      throw new ValidationException('email', `"${trimmed}" is not a valid email address`);
    }

    return new Email(trimmed);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Email): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
