/**
 * UserDto — Output DTO
 *
 * Represents a User as seen by the outside world (API consumers, pages, etc.).
 * No domain types leak out — consumers never touch domain entities.
 */
export interface UserDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly createdAt: string; // ISO-8601
  readonly updatedAt: string; // ISO-8601
}
