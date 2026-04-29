import { DomainException } from './DomainException';

/**
 * Thrown when a requested user does not exist in the system.
 */
export class UserNotFoundException extends DomainException {
  constructor(userId: string) {
    super(`User with id "${userId}" was not found.`, 'USER_NOT_FOUND');
    this.name = 'UserNotFoundException';
  }
}
