import { User } from '@/domain/entities/User';
import type { IUserRepository } from '@/domain/repositories/IUserRepository';
import type { Email } from '@/domain/value-objects/Email';
import type { UserId } from '@/domain/value-objects/UserId';

/**
 * InMemoryUserRepository — Infrastructure
 *
 * In-memory implementation of IUserRepository.
 * Useful for development, tests, and the demo build.
 *
 * Replace with a real DB-backed implementation (e.g. PrismaUserRepository)
 * without touching any other layer — only the DI wiring needs to change.
 */
export class InMemoryUserRepository implements IUserRepository {
  /**
   * Simple Map used as the backing store.
   * Key = userId string value.
   */
  private readonly store = new Map<string, User>();

  public async save(user: User): Promise<void> {
    this.store.set(user.id.value, user);
  }

  public async findById(id: UserId): Promise<User | null> {
    return this.store.get(id.value) ?? null;
  }

  public async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.store.values()) {
      if (user.email.equals(email)) {
        return user;
      }
    }
    return null;
  }

  public async delete(id: UserId): Promise<void> {
    this.store.delete(id.value);
  }

  public async findAll(): Promise<User[]> {
    return [...this.store.values()];
  }

  /** Utility for tests — clears all stored users. */
  public clear(): void {
    this.store.clear();
  }

  /** Utility for tests — returns the current number of stored users. */
  public count(): number {
    return this.store.size;
  }
}
