/**
 * CreateUserDto — Input DTO
 *
 * Carries the raw data needed to create a new user from an external request
 * into the application layer. Plain data only — no domain types.
 */
export interface CreateUserDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}
