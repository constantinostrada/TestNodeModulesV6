import { UserNotFoundException } from '@/domain/exceptions/UserNotFoundException';
import type { IUserRepository } from '@/domain/repositories/IUserRepository';
import { UserId } from '@/domain/value-objects/UserId';

import type { UpdateUserDto } from '../dtos/UpdateUserDto';
import type { UserDto } from '../dtos/UserDto';
import { UserMapper } from '../mappers/UserMapper';

/**
 * UpdateUserUseCase
 *
 * Updates a User's name and/or email. Only fields that are provided in the
 * DTO are changed — the entity methods enforce all business rules.
 */
export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(dto: UpdateUserDto): Promise<UserDto> {
    const userId = UserId.create(dto.id);
    const user = await this.userRepository.findById(userId);

    if (user === null) {
      throw new UserNotFoundException(dto.id);
    }

    if (dto.name !== undefined) {
      user.rename(dto.name);
    }

    if (dto.email !== undefined) {
      user.changeEmail(dto.email);
    }

    await this.userRepository.save(user);

    return UserMapper.toDto(user);
  }
}
