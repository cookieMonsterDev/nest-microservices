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
RUN pnpm run database:generate ${APP_NAME} \
    && pnpm run build ${APP_NAME}

# production stage
FROM base AS production
ARG APP_NAME
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV} HUSKY=0
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/apps/${APP_NAME}/src/modules/prisma ./apps/${APP_NAME}/src/modules/prisma

ENV APP_MAIN_FILE=dist/apps/${APP_NAME}/main
ENV PRISMA_CONFIG=apps/${APP_NAME}/src/modules/prisma/prisma.config.ts
CMD ["sh", "-c", "pnpm dlx prisma migrate deploy --config ${PRISMA_CONFIG} && node ${APP_MAIN_FILE}"]
