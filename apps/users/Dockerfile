# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files from root
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Copy all source code and configuration
COPY apps/ ./apps/
COPY libs/ ./libs/

# Install dependencies
RUN npm ci

# Generate Prisma client for users microservice
WORKDIR /app/apps/users
RUN npx prisma generate

# Build the users microservice
WORKDIR /app
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist/apps/users ./dist/apps/users
COPY --from=builder /app/apps/users/prisma ./prisma
COPY --from=builder /app/apps/users/generated ./generated

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 8080

# Start the application
CMD ["sh", "-c", "cd apps/users && npx prisma db push && npm run start:prod"]