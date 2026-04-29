import type { IUserRepository } from '@/domain/repositories/IUserRepository';
import { UserNotFoundException } from '@/domain/exceptions/UserNotFoundException';
import { UserId } from '@/domain/value-objects/UserId';

import type { UserDto } from '../dtos/UserDto';
import { UserMapper } from '../mappers/UserMapper';

/**
 * GetUserUseCase
 *
 * Fetches a single User by ID and returns a UserDto.
 * Throws UserNotFoundException when the user does not exist.
 */
export interface GetUserDto {
  readonly id: string;
}

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(dto: GetUserDto): Promise<UserDto> {
    const userId = UserId.create(dto.id);
    const user = await this.userRepository.findById(userId);

    if (user === null) {
      throw new UserNotFoundException(dto.id);
    }

    return UserMapper.toDto(user);
  }
}
