# NestJS Microservices with Kafka and Docker

This project demonstrates a microservices architecture using NestJS, Kafka for inter-service communication, and Docker for containerization.

## Architecture

- **API Gateway** (Port 3000): Routes all requests to microservices
- **Users Service** (Port 3001): Manages user data with PostgreSQL database
- **Posts Service** (Port 3002): Manages post data with PostgreSQL database
- **Kafka**: Message broker for inter-service communication
- **PostgreSQL**: Separate databases for each microservice

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

## Quick Start

### Start All Services

```bash
# Start all microservices with Docker Compose
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### Individual Service Development

```bash
# Start only the gateway
cd apps/gateway
docker-compose up --build

# Start only the users service
cd apps/users
docker-compose up --build

# Start only the posts service
cd apps/posts
docker-compose up --build
```

## API Endpoints

All requests go through the API Gateway at `http://localhost:3000`:

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

## Service Communication

- **Gateway → Microservices**: Uses Kafka topics (`users-service`, `posts-service`)
- **Microservices → Gateway**: Uses Kafka response topics (`users-response`, `posts-response`)
- **Inter-service**: Microservices can communicate directly via Kafka

## Database Configuration

- **Users DB**: PostgreSQL on port 5432
  - Database: `users_db`
  - User: `users`
  - Password: `users_password`

- **Posts DB**: PostgreSQL on port 5433
  - Database: `posts_db`
  - User: `posts`
  - Password: `posts_password`

## Kafka Topics

- `users-service`: Messages from gateway to users service
- `posts-service`: Messages from gateway to posts service
- `users-response`: Responses from users service
- `posts-response`: Responses from posts service

## Development

### Local Development

```bash
# Install dependencies
npm install

# Start individual services for development
npm run start:dev gateway
npm run start:dev users
npm run start:dev posts
```

### Building

```bash
# Build all services
npm run build

# Build specific service
npm run build gateway
npm run build users
npm run build posts
```

## Environment Variables

- `KAFKA_BROKER`: Kafka broker address (default: localhost:9092)
- `KAFKA_CLIENT_ID`: Client ID for Kafka connection
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Service port number

## Monitoring

- **Gateway Health**: `http://localhost:3000`
- **Users Health**: `http://localhost:3001`
- **Posts Health**: `http://localhost:3002`
- **Kafka**: `localhost:9092`
- **Zookeeper**: `localhost:2181`

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Troubleshooting

1. **Port conflicts**: Ensure ports 3000-3002, 5432-5433, 9092, 2181 are available
2. **Kafka connection issues**: Wait for Kafka and Zookeeper to fully start before starting microservices
3. **Database connection**: Ensure PostgreSQL containers are running and accessible
4. **Build issues**: Clear Docker cache with `docker system prune -a`
