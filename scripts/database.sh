#!/bin/bash

COMMAND=$1
SERVICE=$2

if [ -z "$COMMAND" ] || [ -z "$SERVICE" ]; then
  echo "Usage: $0 <command> <service>"
  echo "Commands: generate, studio, migrate, reset, pull, push, validate, format, debug"
  exit 1
fi


if [ ! -d "apps/$SERVICE" ]; then
  echo "Error: Service '$SERVICE' does not exist in apps/"
  exit 1
fi


generate() {
  prisma generate --schema "apps/$SERVICE/prisma/schema.prisma"
}

studio() {
  prisma studio --schema "apps/$SERVICE/prisma/schema.prisma"
}

migrate() {
  prisma migrate dev --schema "apps/$SERVICE/prisma/schema.prisma"
}

reset() {
  prisma migrate reset --schema "apps/$SERVICE/prisma/schema.prisma"
}

pull() {
  prisma db pull --schema "apps/$SERVICE/prisma/schema.prisma"
}

push() {
  prisma db push --schema "apps/$SERVICE/prisma/schema.prisma"
}

validate() {
  prisma validate --schema "apps/$SERVICE/prisma/schema.prisma"
}

format() {
  prisma format --schema "apps/$SERVICE/prisma/schema.prisma"
}

debug() {
  prisma doctor --schema "apps/$SERVICE/prisma/schema.prisma"
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

