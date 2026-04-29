import type { User } from '@/domain/entities/User';

import type { UserDto } from '../dtos/UserDto';

/**
 * UserMapper
 *
 * Converts domain entities → output DTOs.
 * Lives in application because it knows about both domain types and DTOs.
 */
export class UserMapper {
  public static toDto(user: User): UserDto {
    return {
      id: user.id.value,
      name: user.name,
      email: user.email.value,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  public static toDtoList(users: User[]): UserDto[] {
    return users.map(UserMapper.toDto);
  }
}
