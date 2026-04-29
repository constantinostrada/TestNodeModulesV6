import { UserNotFoundException } from '@/domain/exceptions/UserNotFoundException';
import type { IUserRepository } from '@/domain/repositories/IUserRepository';
import { UserId } from '@/domain/value-objects/UserId';

/**
 * DeleteUserUseCase
 *
 * Removes a user from the system by ID.
 * Throws UserNotFoundException if the user does not exist.
 */
export interface DeleteUserDto {
  readonly id: string;
}

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(dto: DeleteUserDto): Promise<void> {
    const userId = UserId.create(dto.id);
    const user = await this.userRepository.findById(userId);

    if (user === null) {
      throw new UserNotFoundException(dto.id);
    }

    await this.userRepository.delete(userId);
  }
}
