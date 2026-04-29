# TestNodeModulesV6

A production-ready **Next.js 14 + TypeScript** boilerplate built on **Clean Architecture** principles.

---

## Table of Contents

1. [Project Description](#project-description)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Clean Architecture Layers](#clean-architecture-layers)
6. [REST API Reference](#rest-api-reference)
7. [Scripts](#scripts)
8. [Environment Variables](#environment-variables)
9. [Extending the Project](#extending-the-project)

---

## Project Description

TestNodeModulesV6 is a full-stack TypeScript application scaffold built with Next.js 14 (App Router).  
It demonstrates how to structure a real-world web application following **Clean Architecture** — keeping business logic completely independent of frameworks, databases, and UI.

---

## Tech Stack

| Layer        | Technology                             |
|--------------|----------------------------------------|
| Framework    | Next.js 14 (App Router)                |
| Language     | TypeScript 5                           |
| Runtime      | Node.js 20+                            |
| Linting      | ESLint + `@typescript-eslint`          |
| Formatting   | Prettier                               |
| Architecture | Clean Architecture (4-layer)           |

---

## Getting Started

### Prerequisites

- Node.js **≥ 20.0.0**
- npm **≥ 10.0.0** (or pnpm / yarn)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Start the development server
npm run dev
```

The app is now running at **http://localhost:3000**.

---

## Project Structure

```
TestNodeModulesV6/
├── src/
│   ├── domain/                 # Business rules & interfaces
│   │   ├── entities/           #   User entity
│   │   ├── value-objects/      #   Email, UserId
│   │   ├── repositories/       #   IUserRepository interface
│   │   ├── services/           #   UserUniquenessService
│   │   └── exceptions/         #   DomainException, ValidationException …
│   │
│   ├── application/            # Use cases & orchestration
│   │   ├── dtos/               #   Input/output contracts
│   │   ├── mappers/            #   Domain entity → DTO
│   │   ├── ports/              #   IIdGenerator (infra port)
│   │   └── use-cases/          #   CreateUser, GetUser, UpdateUser …
│   │
│   ├── infrastructure/         # Concrete implementations
│   │   ├── id/                 #   UuidGenerator
│   │   ├── repositories/       #   InMemoryUserRepository
│   │   └── container.ts        #   DI composition root
│   │
│   ├── interfaces/             # HTTP helpers
│   │   └── http/helpers/       #   apiResponse, parseBody
│   │
│   └── app/                    # Next.js App Router
│       ├── api/users/          #   REST route handlers (interfaces layer)
│       ├── users/              #   Users listing page
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
│
├── CLAUDE.md                   # Global architecture contract
├── architecture.json           # Machine-readable layer rules
├── next.config.ts
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
└── package.json
```

---

## Clean Architecture Layers

Clean Architecture organises code into concentric layers, where **dependencies only point inward**.

```
┌──────────────────────────────────────────────┐
│                  interfaces                  │  ← HTTP handlers, pages
│  ┌────────────────────────────────────────┐  │
│  │             application                │  │  ← Use cases, DTOs
│  │  ┌──────────────────────────────────┐  │  │
│  │  │            domain                │  │  │  ← Entities, rules
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
│  infrastructure ─────────────────────────────┼──► implements domain interfaces
└──────────────────────────────────────────────┘
```

### `src/domain/` — The Core

- **No external dependencies whatsoever.**
- Contains: `Entity` classes, `Value Object` classes, `Repository interfaces`, `Domain Services`, custom exceptions.
- Business rules are enforced inside entities and value objects — never in controllers.

### `src/application/` — Use Cases

- Imports only from `domain/`.
- Each use case is **one class** with a single `execute(dto)` method.
- Returns DTOs (plain objects) — never raw domain entities.
- Receives all dependencies via constructor (Dependency Injection).

### `src/infrastructure/` — I/O Adapters

- Imports from `domain/` and `application/`.
- **All** I/O lives here: databases, HTTP clients, ID generators, queues.
- Implements repository and port interfaces defined in the inner layers.
- `container.ts` is the **only** place where concrete classes are wired together.

### `src/interfaces/` — Entry Points

- Imports only from `application/`.
- HTTP route handlers, CLI commands, WebSocket handlers.
- **Thin by design**: validate input → call use case → serialise response.
- HTTP status codes are decided here; business rules are enforced in domain.

### Dependency Rule (ABSOLUTE)

```
interfaces → application → domain
infrastructure → application → domain
domain imports NOTHING from outside itself
```

---

## REST API Reference

All responses follow the shape `{ success: boolean, data?: T }` on success
and `{ success: false, code: string, message: string }` on error.

### `GET /api/users`
List all users.

**Response 200**
```json
{ "success": true, "data": [ { "id": "...", "name": "Alice", "email": "alice@example.com", "createdAt": "...", "updatedAt": "..." } ] }
```

### `POST /api/users`
Create a new user.

**Body**
```json
{ "name": "Alice", "email": "alice@example.com" }
```

**Response 201**
```json
{ "success": true, "data": { "id": "...", "name": "Alice", "email": "alice@example.com", "createdAt": "...", "updatedAt": "..." } }
```

### `GET /api/users/:id`
Get a single user by UUID.

**Response 200 / 404**

### `PATCH /api/users/:id`
Partial update — provide only the fields you want to change.

**Body**
```json
{ "name": "Alice Smith" }
```

**Response 200 / 404 / 422**

### `DELETE /api/users/:id`
Delete a user.

**Response 204 / 404**

---

## Scripts

| Command              | Description                              |
|----------------------|------------------------------------------|
| `npm run dev`        | Start Next.js in development mode        |
| `npm run build`      | Create a production build                |
| `npm start`          | Start the production server              |
| `npm run lint`       | Run ESLint                               |
| `npm run lint:fix`   | Run ESLint and auto-fix issues           |
| `npm run format`     | Format all source files with Prettier    |
| `npm run format:check` | Check formatting without writing       |
| `npm run type-check` | Run `tsc --noEmit` type checking         |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

| Variable               | Default                   | Description                         |
|------------------------|---------------------------|-------------------------------------|
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000`   | Absolute URL used by Server Components when calling the internal API. |

---

## Extending the Project

### Add a new entity
1. Create `src/domain/entities/MyEntity.ts` — protect invariants in the constructor.
2. Create `src/domain/repositories/IMyEntityRepository.ts` — define the interface.
3. Add a use case in `src/application/use-cases/`.
4. Implement the repository in `src/infrastructure/repositories/`.
5. Wire it up in `src/infrastructure/container.ts`.
6. Add a route handler under `src/app/api/`.

### Swap the database
Replace `InMemoryUserRepository` in `src/infrastructure/repositories/` with a
real implementation (e.g. `PrismaUserRepository`). Update `container.ts` — **zero other files change**.

### Add authentication
Add a middleware in `src/interfaces/http/` that validates tokens and passes
identity information to use cases via a DTO — business rules stay in domain.
