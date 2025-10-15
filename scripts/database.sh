#!/bin/bash

COMMAND=$1
SERVICE=$2
ENV_TYPE=${3:-default}

if [ -z "$COMMAND" ] || [ -z "$SERVICE" ]; then
  echo "Usage: $0 <command> <service>"
  echo "Commands: generate, studio, migrate, reset, pull, push, validate, format, debug"
  echo "Env: (optional): default | test"
  exit 1
fi

SERVICE_DIR="apps/$SERVICE"

if [ ! -d "$SERVICE_DIR" ]; then
  echo "Error: Service '$SERVICE' does not exist in apps/"
  exit 1
fi

if [ "$ENV_TYPE" = "test" ]; then
  ENV_FILE="$SERVICE_DIR/.env.test"
else
  ENV_FILE="$SERVICE_DIR/.env"
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Warning: Env file '$ENV_FILE' not found. Continuing without loading environment variables."
else
  echo "Using environment file: $ENV_FILE"
  export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

SCHEMA_PATH="$SERVICE_DIR/prisma/schema.prisma"

generate() { 
  prisma generate --schema "${SCHEMA_PATH}"
}

studio() {
  prisma studio --schema "${SCHEMA_PATH}"
}

migrate() {
  prisma migrate dev --create-only --schema "${SCHEMA_PATH}"
}

reset() {
  prisma migrate reset --schema "${SCHEMA_PATH}"
}

pull() {
  prisma db pull --schema "${SCHEMA_PATH}"
}

push() {
  prisma db push --schema "${SCHEMA_PATH}"
}

validate() {
  prisma validate --schema "${SCHEMA_PATH}"
}

format() {
  prisma format --schema "${SCHEMA_PATH}"
}

debug() {
  prisma doctor --schema "${SCHEMA_PATH}"
}

# Call the function based on the second argument
case "$COMMAND" in
  generate|studio|migrate|pull|push|validate|format|debug)
    $COMMAND
    ;;
  *)
    echo "Unknown command: $COMMAND"
    exit 1
    ;;
esac

