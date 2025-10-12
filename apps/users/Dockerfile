FROM node:22-alpine AS base 

# build stage
FROM base AS build 
ARG APP_NAME 
ARG NODE_ENV=development 
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app 
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --schema apps/${APP_NAME}/prisma/schema.prisma \
    && npm run build ${APP_NAME}

# production stage
FROM base AS production 
ARG APP_NAME 
ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV} HUSKY=0
WORKDIR /usr/src/app 
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/apps/${APP_NAME}/prisma ./apps/${APP_NAME}/prisma


ENV APP_MAIN_FILE=dist/apps/${APP_NAME}/main 
CMD ["sh", "-c", "npx prisma migrate deploy --schema apps/${APP_NAME}/prisma/schema.prisma && node ${APP_MAIN_FILE}"]
