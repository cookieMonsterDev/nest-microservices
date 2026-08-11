FROM node:22-alpine AS base
RUN corepack enable

# build stage
FROM base AS build
ARG APP_NAME
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm exec prisma generate --schema apps/${APP_NAME}/prisma/schema.prisma \
    && pnpm run build -- ${APP_NAME}

# production stage
FROM base AS production
ARG APP_NAME
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV} HUSKY=0
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/apps/${APP_NAME}/prisma ./apps/${APP_NAME}/prisma
COPY --from=build /usr/src/app/apps/${APP_NAME}/generated ./apps/${APP_NAME}/generated

ENV APP_MAIN_FILE=dist/apps/${APP_NAME}/main
ENV DATABASE_SCHEMA=apps/${APP_NAME}/prisma/schema.prisma
CMD ["sh", "-c", "pnpm dlx prisma migrate deploy --schema ${DATABASE_SCHEMA} && node ${APP_MAIN_FILE}"]
