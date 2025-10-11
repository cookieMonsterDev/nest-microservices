<p align="center">
  <a href="https://github.com/cookieMonsterDev/brick-crack-server/" target="blank">
    <img src="./public/logo.png" width="240" alt="Brick Crack Logo" />
  </a>
</p>

<h4 align="center">A Lego marketplace for those whom blicklink is not good enough.</h4>

## 📖 Description

**Brick Crack Server** is a robust monolithic API designed for the Brick Crack store application. It enables both users and administrators to efficiently manage trade items and overall store content. Built with [Node.js](https://nodejs.org/en) and powered by the [NestJS](https://nestjs.com/) framework, this API offers a scalable and maintainable backend structure that supports the core functionalities of the platform.

## 🎓 Philosophy

## 🚀 Local Setup ( Quick Start )

Here are a few simple instructions to help you set up your local environment (with or without Docker) and start development.

### 💻 Setup without Docker

1. Clone the repo using SSH or HTTPS:

```bash
git clone https://github.com/cookieMonsterDev/brick-crack-server.git
```

2. Create environment file `.env` in the root and provide next env variables ( example below ):

```bash
FRONT_END_ORIGIN="*"

POSTGRES_DB="postgresql"
POSTGRES_USER="johndoe"
POSTGRES_PASSWORD="randompassword"
POSTGRES_DATABASE_URL="postgresql://johndoe:randompassword@localhost:8081/postgresql"

MONGO_INITDB_DATABASE="mongodb"
MONGO_INITDB_ROOT_USERNAME="johndoe"
MONGO_INITDB_ROOT_PASSWORD="randompassword"
MONGO_DATABASE_URL="mongodb://johndoe:randompassword@localhost:8082/mongodb"

ACCESS_TOKEN_SECRET="ACCESS_TOKEN_SECRET"
REFRESH_TOKEN_SECRET="REFRESH_TOKEN_SECRET"

ACCESS_TOKEN_EXPIRES_IN="1d"
REFRESH_TOKEN_EXPIRES_IN="7d"

VEFIFY_EMAIL_CODE_EXPIRES_IN="1h"
RESET_PASSWORD_CODE_EXPIRES_IN="10m"

MAILER_FROM="brickcrack@gmail.com"
MAILER_HOST="smtp.ethereal.email"
MAILER_PORT="587"
MAILER_USER="marcelle.bauch@ethereal.email"
MAILER_PASS="MrhM6EX5y4p4gXnPAu"

CLIENT_HOST="https://brickcrack.com"
CLIENT_RESET_PATH="/auth/reset-password"
CLIENT_SUPPORT_PATH="mailto:brickcrack@gmail.com"
CLIENT_VERIFICATION_PATH="/auth/verify-email"
```

3. Install dependency:

```bash
npm install
```

4. Apply migration to database and generate schema:

```bash
npm run databases:generate && npm run databases:migrate
```

5. Start the project locally:

```bash
npm run start:dev
```

### 🐋 Setup with Docker

1. Follow the first two steps from [Setup without Docker](#💻-setup-without-docker)

2. Create and run containers

```bash
docker compose up -d
```

## 🌱 Data seeds & Scripts

Sometimes in app you need to add large amount of data or put seed data in database. For this you may use following command since nestjs already installed `ts-node` dependency for you:

```bash
npx ts-node <path-to-script>
```

Most of the scripts stored by path: `src/scripts`, here is an example for adding root admin to database:

```bash
npx ts-node create-god.ts
```

/// to run single test: npm run test -- src/core/admins/root/root.controller.spec.ts
