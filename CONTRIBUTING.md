# Contributing

Thanks for contributing to **nest-microservices**. This guide covers the workflow for humans; AI agents should also follow [AGENTS.md](./AGENTS.md).

## Prerequisites

- **Node.js** >= 24
- **pnpm** (version pinned via `packageManager` in `package.json`; Corepack recommended)
- **Docker** + Docker Compose (databases, Kafka, optional app containers)

## Getting started

```bash
pnpm install
chmod -R +x ./scripts
pnpm microservices:prepare
pnpm microservices:up users && pnpm microservices:up kafka
pnpm database:generate users && pnpm database:push users
pnpm start:dev users
```

Repeat the database/start steps with `posts` when working on that service.

Full script reference: [README.md](./README.md).

## Development workflow

1. Create a branch from `master`
2. Make a focused change (one concern per PR when practical)
3. Format/lint: `pnpm format` and/or `pnpm lint`
4. Run tests for the affected app(s)
5. Open a PR against `master`

### Tests

```bash
# Unit
pnpm test users
pnpm test posts

# E2E (requires test DB schema)
pnpm database:push users test
pnpm test:e2e users
```

CI runs path-filtered unit and e2e jobs on pushes/PRs to `master`. Changing shared `libs/**`, lockfiles, or Nest/TS config will trigger tests for both apps.

## Commit messages

This repo uses [Conventional Commits](https://www.conventionalcommits.org/). Husky runs on pre-commit:

1. `pnpm lint`
2. Message format validation

**Format:** `<type>(optional-scope): <description>`

**Rules:**

- Allowed types: `feat`, `fix`, `chore`, `docs`, `test`, `style`, `refactor`, `perf`, `build`, `ci`, `revert`
- Entire message ≤ **88** characters
- Use the imperative mood (`add`, `fix`, `update` — not `added` / `fixes`)

**Examples:**

```text
feat(kafka): add posts.created topic payload
fix(users): return 404 when user missing
docs: link AGENTS.md from README
```

## Code style

- TypeScript + NestJS module layout already used in `apps/*` and `libs/*`
- Prefer path aliases (`@users-micros/…`, `@libs/…`) over long relative imports
- Prefer `type` aliases and inline `import { type X }` style (enforced by ESLint)
- Prettier: single quotes, trailing commas, width 120
- Do not commit generated Prisma clients, `dist/`, or local `.env` files

See [AGENTS.md](./AGENTS.md) for detailed coding, Prisma, Kafka, and testing conventions.

## Pull requests

- Describe **why** the change exists and how to verify it
- List which services were tested (`users`, `posts`, or both)
- Keep PRs reviewable; split large refactors from feature work when possible
- Expect Dependabot PRs with `chore(…)` prefixes; review lockfile + CI before merging

### Suggested PR checklist

- [ ] Lint passes (`pnpm lint`)
- [ ] Unit tests pass for touched apps
- [ ] E2E updated/passed when HTTP or persistence behavior changed
- [ ] Env/docs updated if new variables or scripts were added
- [ ] No secrets or generated artifacts committed

## Reporting issues

When filing an issue, include:

- Which service (`users` / `posts` / shared lib)
- Steps to reproduce
- Expected vs actual behavior
- Node/pnpm versions and whether Docker services were running

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
