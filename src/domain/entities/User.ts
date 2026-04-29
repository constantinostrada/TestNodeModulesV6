import { ValidationException } from '../exceptions/ValidationException';
import { Email } from '../value-objects/Email';
import { UserId } from '../value-objects/UserId';

/**
 * User — Domain Entity
 *
 * The central entity of the domain. Protects its own invariants.
 * Cannot be created in an invalid state.
 *
 * NOTE: This class has NO knowledge of persistence, HTTP, or any framework.
 */
export class User {
  private _name: string;
  private _email: Email;
  private readonly _id: UserId;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: UserId,
    name: string,
    email: Email,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // ── Factory ──────────────────────────────────────────────────────────────

  /**
   * Creates a brand-new User, enforcing all invariants.
   */
  public static create(params: { id: string; name: string; email: string }): User {
    const id = UserId.create(params.id);
    const email = Email.create(params.email);
    const name = User.validateName(params.name);
    const now = new Date();

    return new User(id, name, email, now, now);
  }

  /**
   * Reconstitutes a User from persisted data (no invariant re-enforcement needed
   * beyond the value objects, since the data was already validated on write).
   */
  public static reconstitute(params: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      UserId.create(params.id),
      params.name,
      Email.create(params.email),
      params.createdAt,
      params.updatedAt,
    );
  }

  // ── Accessors ─────────────────────────────────────────────────────────────

  public get id(): UserId {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): Email {
    return this._email;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  // ── Mutators (domain behaviour) ──────────────────────────────────────────

  /**
   * Updates the user's display name. Enforces length invariant.
   */
  public rename(newName: string): void {
    this._name = User.validateName(newName);
    this._updatedAt = new Date();
  }

  /**
   * Changes the user's email address. Delegates format validation to the Email VO.
   */
  public changeEmail(newEmail: string): void {
    this._email = Email.create(newEmail);
    this._updatedAt = new Date();
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private static validateName(name: string): string {
    const trimmed = name.trim();

    if (trimmed.length === 0) {
      throw new ValidationException('name', 'must not be empty');
    }

    if (trimmed.length > 100) {
      throw new ValidationException('name', 'must not exceed 100 characters');
    }

    return trimmed;
  }
}
