# Nestjs Microservices

This repo is an example of what a NestJS monorepo may look like. It provides two REST microservices—users and posts—each using its own database via Prisma ORM. For communication between microservices, Kafka is used, leveraging the features of @nestjs/microservices.

To be completely honest, this repo was set up primarily to demonstrate the possibility of running tests in GitHub CI/CD for specific microservices depending on the changes made in the repo. But feel free to use it however you like!

This repository was also used for writing this [article](https://dev.to/cookiemonsterdev/nestjs-microservices-monorepo-setup-testing-and-containerization-4abb). I’d really appreciate it if you found it useful — give it a star and a like! 😊

## 🚀 Local Setup ( Quick Start )

This is an example of staring the users microservice for local development.

This project uses [pnpm](https://pnpm.io/) as its package manager (see `packageManager` in `package.json`).

1. Install dependencies

```bash
pnpm install
```

2. Give access to bash scripts

```bash
chmod -R +x ./scripts
```

3. Copy all `.env.example` to `.env` files

```bash
pnpm microservices:prepare
```

4. Start all required databases and featues, libs etc.

```bash
pnpm microservices:up users && pnpm microservices:up kafka
```

5. Generate database schema and apply database migrations

```bash
pnpm database:generate users && pnpm database:push users
```

6. Start the users microservice

```bash
pnpm start:dev users
```

> ⚠️ **Warning:** If you want to set up all apps in Docker containers, you need to uncomment the app service in each `docker-compose.yml`. Be careful with environment variables like `DATABASE_URL` and `KAFKA_URL`, as they need to be updated to match your Docker setup.

## 📊 Microservice

About all microservices scripts that is available via `pnpm`:

### Usage

```bash
pnpm microservices:up users --build
```

- `<command>` – One of the following: up, down, build, prepare

- `[name]` – Optional service or library name (default runs for all)

- `[flag]` – Optional extra flag for Docker Compose (--build or --no-cache)

### Available Scripts

| Script                         | Description                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `microservices:up <name>`      | Start a microservice or library in detached mode. If no name is provided, starts all available services with Docker Compose.                           |
| `microservices:down <name>`    | Stop a microservice or library. If no name is provided, stops all services.                                                                            |
| `microservices:build <name>`   | Build a microservice or library Docker image. Optional flags: `--build` or `--no-cache`.                                                               |
| `microservices:prepare <name>` | Prepare environment files by copying `.env.example` to `.env` for the service or library. If no name is provided, prepares all services and libraries. |

## 📖 Database

About all database scripts that is available via `pnpm`:

### Usage

```bash
pnpm database:push users
```

- `<script>` – One of the database scripts listed below.

- `<service>` – Name of the microservice (e.g., users, posts).

- `[env]` – Optional environment: default (default) or test.

### Available Scripts

| Script              | Description                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `database:generate` | Generates Prisma client for the specified service.                                                |
| `database:studio`   | Opens Prisma Studio (GUI for the database) for the service.                                       |
| `database:migrate`  | Creates a new migration for the service without applying it (`prisma migrate dev --create-only`). |
| `database:reset`    | Resets the database, rolling back all migrations and reapplying them.                             |
| `database:pull`     | Pulls the current database schema from the database into Prisma schema file.                      |
| `database:push`     | Pushes the Prisma schema to the database without generating migrations.                           |
| `database:validate` | Validates the Prisma schema for syntax and consistency.                                           |
| `database:format`   | Formats the Prisma schema file according to Prisma conventions.                                   |
| `database:debug`    | Runs `prisma doctor` to check database and schema health.                                         |

## 🧪 Testing ( Unit / E2E )

### Unit Tests:

```bash
pnpm test users
```

### E2E Tests:

1. Apply migrations to test database

```bash
pnpm database:push users test
```

2. To run e2e tests

```bash
pnpm test:e2e users
```
