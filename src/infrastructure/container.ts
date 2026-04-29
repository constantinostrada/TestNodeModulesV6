/**
 * container.ts — Dependency Injection Composition Root
 *
 * This is the ONLY place where concrete infrastructure classes are instantiated
 * and wired to the use cases. All layers above see only interfaces.
 *
 * For a production app, replace InMemoryUserRepository with a real DB
 * implementation here — zero other files need to change.
 */

import { ListProductsUseCase } from '@/application/use-cases/ListProductsUseCase';
import { CreateUserUseCase } from '@/application/use-cases/CreateUserUseCase';
import { DeleteUserUseCase } from '@/application/use-cases/DeleteUserUseCase';
import { GetUserUseCase } from '@/application/use-cases/GetUserUseCase';
import { ListUsersUseCase } from '@/application/use-cases/ListUsersUseCase';
import { UpdateUserUseCase } from '@/application/use-cases/UpdateUserUseCase';

import { UuidGenerator } from './id/UuidGenerator';
import { InMemoryProductRepository } from './repositories/InMemoryProductRepository';
import { InMemoryUserRepository } from './repositories/InMemoryUserRepository';

// ── Singletons ────────────
const productRepository = new InMemoryProductRepository();

const userRepository = new InMemoryUserRepository();
const idGenerator = new UuidGenerator();

// ── Use Case Factories ────────────────────────────────────────────────────────

export function makeCreateUserUseCase(): CreateUserUseCase {
  return new CreateUserUseCase(userRepository, idGenerator);
}

export function makeGetUserUseCase(): GetUserUseCase {
  return new GetUserUseCase(userRepository);
}

export function makeUpdateUserUseCase(): UpdateUserUseCase {
  return new UpdateUserUseCase(userRepository);
}

export function makeDeleteUserUseCase(): DeleteUserUseCase {
  return new DeleteUserUseCase(userRepository);
}

export function makeListUsersUseCase(): ListUsersUseCase {
  return new ListUsersUseCase(userRepository);
}

export function makeListProductsUseCase(): ListProductsUseCase {
  return new ListProductsUseCase(productRepository);
}
