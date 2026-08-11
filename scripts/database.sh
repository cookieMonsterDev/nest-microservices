#!/bin/bash

COMMAND=$1
SERVICE=$2
ENV_TYPE=${3:-default}

if [ -z "$COMMAND" ] || [ -z "$SERVICE" ]; then
  echo "Usage: $0 <command> <service> [default|test]"
  echo "Commands: generate, studio, migrate, deploy, reset, pull, push, validate, format"
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
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

CONFIG_PATH="$SERVICE_DIR/src/modules/prisma/prisma.config.ts"

generate() {
  prisma generate --config "${CONFIG_PATH}"
}

studio() {
  prisma studio --config "${CONFIG_PATH}"
}

migrate() {
  prisma migrate dev --create-only --config "${CONFIG_PATH}"
}

deploy() {
  prisma migrate deploy --config "${CONFIG_PATH}"
}

reset() {
  prisma migrate reset --config "${CONFIG_PATH}"
}

pull() {
  prisma db pull --config "${CONFIG_PATH}"
}

push() {
  prisma db push --config "${CONFIG_PATH}"
}

validate() {
  prisma validate --config "${CONFIG_PATH}"
}

format() {
  prisma format --config "${CONFIG_PATH}"
}

case "$COMMAND" in
  generate|studio|migrate|deploy|reset|pull|push|validate|format)
    $COMMAND
    ;;
  *)
    echo "Unknown command: $COMMAND"
    exit 1
    ;;
esac
