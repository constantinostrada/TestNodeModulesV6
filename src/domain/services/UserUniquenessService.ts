import type { Email } from '../value-objects/Email';
import type { IUserRepository } from '../repositories/IUserRepository';
import { ValidationException } from '../exceptions/ValidationException';

/**
 * UserUniquenessService — Domain Service
 *
 * Handles the business rule that an email address must be unique
 * across all users. This logic doesn't belong to the User entity itself
 * (the entity can't query the repository), so it lives here as a domain service.
 *
 * Dependencies are injected via constructor — no framework magic.
 */
export class UserUniquenessService {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Asserts that the given email is not already taken.
   * Throws ValidationException if it is.
   */
  public async assertEmailIsUnique(email: Email): Promise<void> {
    const existing = await this.userRepository.findByEmail(email);

    if (existing !== null) {
      throw new ValidationException(
        'email',
        `"${email.value}" is already registered`,
      );
    }
  }
}
