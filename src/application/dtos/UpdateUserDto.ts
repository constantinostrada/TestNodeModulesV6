/**
 * UpdateUserDto — Input DTO
 *
 * Carries the raw data needed to update an existing user.
 * All fields except `id` are optional — only provided fields are changed.
 */
export interface UpdateUserDto {
  readonly id: string;
  readonly name?: string;
  readonly email?: string;
}
