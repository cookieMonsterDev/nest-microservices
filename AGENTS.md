# AGENTS.md

Guidelines for AI coding agents and humans working in this repository.

## Project overview

NestJS microservices monorepo demonstrating:

- Two REST apps (`users`, `posts`), each with its own PostgreSQL database via Prisma
- Inter-service messaging with Kafka (`@nestjs/microservices` + `kafkajs`)
- Path-filtered unit/e2e CI so only affected services run tests

Package manager: **pnpm** (see `packageManager` in `package.json`). Node: **>=24**.

## Repository layout

```text
apps/
  users/                 # Users REST + Kafka microservice
  posts/                 # Posts REST + Kafka microservice
libs/
  common/                # Shared config, DTOs, entities, utils
  kafka/                 # Kafka module, service, mocks, topic messages
  prisma/                # Shared Prisma filters, query DTOs, helpers
scripts/
  database.sh            # Prisma wrappers (generate, push, migrate, …)
  microservices.sh       # Docker Compose wrappers (up, down, build, prepare)
  test.sh                # E2E Jest runner per app
.github/workflows/       # Path-filtered unit + e2e CI
```

Each app typically contains:

```text
apps/<name>/
  src/
    main.ts
    app.module.ts
    modules/
      <domain>/          # controller, service, module, dto/, entities/
      prisma/            # schema.prisma, prisma.config.ts, PrismaService
  test/                  # e2e specs, fixture.module.ts, jest-e2e.json
  docker-compose.yml
  Dockerfile
  .env.example
  .env.test
```

## Path aliases

Always import via TypeScript path aliases (defined in `tsconfig.json` / Jest `moduleNameMapper`):

| Alias                            | Target              |
| -------------------------------- | ------------------- |
| `@libs/common`, `@libs/common/*` | `libs/common/src`   |
| `@libs/kafka`, `@libs/kafka/*`   | `libs/kafka/src`    |
| `@libs/prisma`, `@libs/prisma/*` | `libs/prisma/src`   |
| `@users-micros/*`                | `apps/users/src/*`  |
| `@users-micros/test/*`           | `apps/users/test/*` |
| `@posts-micros/*`                | `apps/posts/src/*`  |
| `@posts-micros/test/*`           | `apps/posts/test/*` |

Do **not** use deep relative imports across apps/libs when an alias exists.

## Tech stack

| Area        | Choice                                                            |
| ----------- | ----------------------------------------------------------------- |
| Runtime     | Node.js 24+                                                       |
| Language    | TypeScript (decorators, `emitDecoratorMetadata`)                  |
| Framework   | NestJS 11 (HTTP + microservices)                                  |
| ORM         | Prisma 7 (`@prisma/adapter-pg`, per-app generated client)         |
| DB          | PostgreSQL                                                        |
| Messaging   | Kafka / KafkaJS                                                   |
| Validation  | `class-validator` + `class-transformer` + global `ValidationPipe` |
| API docs    | `@nestjs/swagger` at `/docs`                                      |
| Tests       | Jest + Supertest                                                  |
| Lint/format | ESLint flat config + Prettier                                     |
| Containers  | Docker / Docker Compose per app/lib                               |
| CI          | GitHub Actions (path filters via `dorny/paths-filter`)            |
| Hooks       | Husky pre-commit (lint + conventional commit check)               |

## Coding guidelines

### TypeScript / ESLint

- Prefer `type` over `interface` (`@typescript-eslint/consistent-type-definitions`)
- Prefer inline type imports: `import { type Foo } from '…'` (`consistent-type-imports`)
- Prettier: single quotes, trailing commas, print width **120**
- Match existing Nest patterns; do not introduce unrelated frameworks or ORMs

### NestJS app structure

- Keep domain logic in `*Service`; controllers stay thin
- Controllers: Swagger `@ApiResponse`, DTO/query validation, wrap responses in `*Entity`
- Entities: constructor `Object.assign(this, partial)` + `@ApiProperty`
- DTOs: `class-validator` + `@ApiProperty` with examples
- Use global patterns already wired in `main.ts`:
  - `ValidationPipe({ whitelist: true, transform: true })`
  - `ClassSerializerInterceptor`
  - Kafka microservice via `createKafkaMicroserviceOptions`
- Config: `createConfigModuleOptions('<service>')` from `@libs/common/config` (loads `apps/<service>/.env` or `.env.test` when `NODE_ENV=test`)

### Shared libraries

- Put reusable pagination/search/sort DTOs and helpers in `@libs/common` or `@libs/prisma`
- Kafka topics and event payload types live in `libs/kafka/src/messages/`
- Topic names use dotted lowercase: `user.updated`, `user.created`
- Emit events with `KafkaService.emit(topic, payload)`; consumers use `@MessagePattern`
- For unit/e2e tests that should not hit Kafka, use `KafkaMockService` / `KafkaMockModule`

### Prisma

- Each app owns `apps/<name>/src/modules/prisma/`
- Generated client output is under that module (`generated/`) — **never commit** generated clients
- Always run `pnpm database:generate <service>` before build/test after schema changes
- Prefer `database:migrate` for real schema changes; `database:push` is fine for local/test bootstrap
- Throw Nest HTTP exceptions (`NotFoundException`, etc.) from services when entities are missing

### Naming

- Files: Nest convention (`users.controller.ts`, `create-user.dto.ts`, `user.entity.ts`)
- Specs: `*.spec.ts` (unit), `*.e2e-spec.ts` (e2e)
- Params: resource ids like `userId`, `postId`
- Prefer clear method names: `createUser`, `findUsers`, `updateUser`

### What not to do

- Do not commit `.env` files (only `.env.example` / committed `.env.test` patterns already in repo)
- Do not commit `dist/`, `coverage/`, or Prisma `generated/` output
- Do not change CI path filters without updating both unit and e2e workflows consistently
- Do not add new package managers; use **pnpm** only
- Avoid drive-by refactors unrelated to the task

## Build & local development

```bash
pnpm install
chmod -R +x ./scripts
pnpm microservices:prepare                 # copy .env.example → .env
pnpm microservices:up users && pnpm microservices:up kafka
pnpm database:generate users && pnpm database:push users
pnpm start:dev users                       # or: posts
```

Useful scripts:

| Script                                               | Purpose                                    |
| ---------------------------------------------------- | ------------------------------------------ |
| `pnpm build [app]`                                   | Nest webpack build                         |
| `pnpm start:dev [app]`                               | Watch mode                                 |
| `pnpm lint`                                          | ESLint with `--fix`                        |
| `pnpm format`                                        | Prettier write for `apps/**` and `libs/**` |
| `pnpm microservices:up\|down\|build\|prepare [name]` | Docker Compose helpers                     |
| `pnpm database:* <service> [default\|test]`          | Prisma helpers                             |

Build a specific app: `pnpm build users` / `pnpm build posts`.

When adding Dockerized apps, keep `DATABASE_URL` / `KAFKA_URL` consistent with Compose networking (see README warning).

## Testing rules

### Unit tests

- Location: next to source as `*.spec.ts` under `apps/` or `libs/`
- Run: `pnpm test <app>` (e.g. `pnpm test users`)
- Mock Prisma and Kafka; instantiate services directly or via Nest testing module
- Prefer `KafkaMockService` instead of real Kafka
- Cover happy path + not-found / validation-related service behavior

### E2E tests

- Location: `apps/<app>/test/*.e2e-spec.ts`
- Use `FixtureModule` (real Prisma + `KafkaMockModule`)
- Reset DB state in `beforeEach` / `afterAll` (`deleteMany`)
- Apply test schema first: `pnpm database:push <app> test`
- Run: `pnpm test:e2e <app>`
- Assert HTTP status codes and response shape with Supertest

### CI expectations

- Unit and e2e workflows run only when relevant paths change (`apps/<svc>/**`, shared `libs/**`, lockfile, Nest/TS config, scripts, workflow file)
- After schema changes, CI runs `database:generate` (and e2e also `database:push … test`)
- Agents should run the smallest relevant test set locally before finishing a change

## Git & commit rules (Conventional Commits)

Husky pre-commit runs `pnpm lint` and enforces conventional commit messages.

### Format

```text
<type>(optional-scope): <description>
```

- Entire message length: **≤ 88 characters**
- `type` is required; `scope` is optional
- Description is required (at least one character after the colon/space)

### Allowed types

| Type       | Use for                                     |
| ---------- | ------------------------------------------- |
| `feat`     | New feature                                 |
| `fix`      | Bug fix                                     |
| `chore`    | Maintenance, deps (Dependabot uses `chore`) |
| `docs`     | Documentation only                          |
| `test`     | Adding/updating tests                       |
| `style`    | Formatting / lint-only                      |
| `refactor` | Code change with no feature/fix intent      |
| `perf`     | Performance improvement                     |
| `build`    | Build system / tooling                      |
| `ci`       | CI configuration                            |
| `revert`   | Reverts a previous commit                   |

### Examples

```text
feat(users): add find-by-email endpoint
fix(posts): handle missing author on update
docs: clarify e2e database setup
chore(deps): bump nestjs packages
test(users): cover updateUser not-found path
```

### PR / branch guidance

- Prefer small, focused PRs scoped to one service or shared lib concern
- Target branch: `master`
- Ensure unit and/or e2e still pass for touched services
- Do not commit secrets; rotate any credential that was committed by mistake

## Adding a new microservice (checklist)

1. Scaffold under `apps/<name>/` mirroring `users`/`posts` (src modules, prisma, test, Compose, Dockerfile, env examples)
2. Register the project in `nest-cli.json`
3. Add path aliases in root `tsconfig.json` and Jest `moduleNameMapper` (root + each app `jest-e2e.json` as needed)
4. Wire shared libs (`@libs/common`, `@libs/kafka`, `@libs/prisma`) rather than duplicating helpers
5. Extend path filters in `.github/workflows/unit-tests.yml` and `e2e-tests.yml`
6. Document ports/env in `.env.example` and README if user-facing

## Agent working agreements

- Read existing modules before inventing new patterns
- Prefer editing shared libs when two apps need the same behavior
- Keep diffs minimal and task-scoped
- After substantive changes, run lint and the affected `pnpm test` / `pnpm test:e2e`
- Never modify git config; only commit when explicitly asked
- For contributor-facing process details, see [CONTRIBUTING.md](./CONTRIBUTING.md)
