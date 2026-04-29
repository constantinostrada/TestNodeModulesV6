import { User } from '@/domain/entities/User';
import type { IUserRepository } from '@/domain/repositories/IUserRepository';
import { UserUniquenessService } from '@/domain/services/UserUniquenessService';
import { Email } from '@/domain/value-objects/Email';

import type { CreateUserDto } from '../dtos/CreateUserDto';
import type { UserDto } from '../dtos/UserDto';
import { UserMapper } from '../mappers/UserMapper';
import type { IIdGenerator } from '../ports/IIdGenerator';

/**
 * CreateUserUseCase
 *
 * Orchestrates the creation of a new user:
 *  1. Validates email uniqueness via a domain service.
 *  2. Creates the User entity (entity protects its own invariants).
 *  3. Persists via the repository interface.
 *  4. Returns a UserDto — never a raw domain entity.
 *
 * Receives ALL dependencies via constructor (Dependency Injection).
 */
export class CreateUserUseCase {
  private readonly uniquenessService: UserUniquenessService;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly idGenerator: IIdGenerator,
  ) {
    // Domain service is composed here; it receives the same repository.
    this.uniquenessService = new UserUniquenessService(userRepository);
  }

  public async execute(dto: CreateUserDto): Promise<UserDto> {
    const email = Email.create(dto.email);

    // Business rule: email must be unique across all users.
    await this.uniquenessService.assertEmailIsUnique(email);

    const id = dto.id || this.idGenerator.generate();

    const user = User.create({
      id,
      name: dto.name,
      email: dto.email,
    });

    await this.userRepository.save(user);

    return UserMapper.toDto(user);
  }
}
