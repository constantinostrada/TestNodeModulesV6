import { randomUUID } from 'crypto';

import type { IIdGenerator } from '@/application/ports/IIdGenerator';

/**
 * UuidGenerator — Infrastructure
 *
 * Implements IIdGenerator using Node's built-in `crypto.randomUUID()`.
 * No third-party library required.
 */
export class UuidGenerator implements IIdGenerator {
  public generate(): string {
    return randomUUID();
  }
}
