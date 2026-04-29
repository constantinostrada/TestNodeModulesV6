import { ValidationException } from '../exceptions/ValidationException';

/**
 * UserId — Value Object
 *
 * Wraps the user's unique identifier to prevent primitive obsession
 * and enforce a consistent format across the domain.
 */
export class UserId {
  private readonly _value: string;

  private static readonly REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Factory method. Validates that the provided string is a valid UUID v4.
   */
  public static create(raw: string): UserId {
    const trimmed = raw.trim();

    if (!UserId.REGEX.test(trimmed)) {
      throw new ValidationException('userId', `"${trimmed}" is not a valid UUID`);
    }

    return new UserId(trimmed.toLowerCase());
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: UserId): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}
