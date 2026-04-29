import type { User } from '../entities/User';
import type { Email } from '../value-objects/Email';
import type { UserId } from '../value-objects/UserId';

/**
 * IUserRepository — Domain Repository Interface
 *
 * Defines WHAT operations the domain needs for User persistence.
 * The HOW (SQL, in-memory, etc.) is determined by the infrastructure layer.
 *
 * This interface lives in domain so it can be referenced by the application
 * layer without creating a dependency on any concrete implementation.
 */
export interface IUserRepository {
  /** Persist a new or updated User. */
  save(user: User): Promise<void>;

  /** Retrieve a User by its unique identifier. Returns null if not found. */
  findById(id: UserId): Promise<User | null>;

  /** Retrieve a User by email address. Returns null if not found. */
  findByEmail(email: Email): Promise<User | null>;

  /** Remove a User from the store. */
  delete(id: UserId): Promise<void>;

  /** Return all Users (useful for admin / listing pages). */
  findAll(): Promise<User[]>;
}
