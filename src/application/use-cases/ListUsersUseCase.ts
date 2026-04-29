import type { IUserRepository } from '@/domain/repositories/IUserRepository';

import type { UserDto } from '../dtos/UserDto';
import { UserMapper } from '../mappers/UserMapper';

/**
 * ListUsersUseCase
 *
 * Returns all users in the system as a list of UserDtos.
 */
export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(): Promise<UserDto[]> {
    const users = await this.userRepository.findAll();
    return UserMapper.toDtoList(users);
  }
}
