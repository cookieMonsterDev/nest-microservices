FROM node:22-alpine AS base 

# development stage
FROM base AS development 
ARG APP_NAME 
ARG NODE_ENV=development 
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app 
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --schema ./apps/${APP_NAME}/prisma/schema.prisma
RUN npm run build ${APP_NAME}

# production stage
FROM base AS production 
ARG APP_NAME 
ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV} HUSKY=0
WORKDIR /usr/src/app 
COPY package*.json ./
RUN npm ci --only=production
COPY --from=development /usr/src/app/dist ./dist 

ENV APP_MAIN_FILE=dist/apps/${APP_NAME}/main 
CMD ["sh", "-c", "node ${APP_MAIN_FILE}"]