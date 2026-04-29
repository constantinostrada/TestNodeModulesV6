/**
 * IIdGenerator — Application Port
 *
 * Abstracts ID generation so the use case doesn't depend on any specific
 * library (uuid, nanoid, crypto, etc.). The concrete implementation lives
 * in infrastructure.
 */
export interface IIdGenerator {
  /** Returns a new, unique string identifier. */
  generate(): string;
}
