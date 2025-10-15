#!/bin/bash

set -e

COMMAND=$1       # up | down | build
NAME=$2           # service or library name (optional)
EXTRA_FLAG=$3     # --build or --no-cache (optional)

APPS_DIR="apps"
LIBS_DIR="libs"

# Helper function to run docker compose in a given directory
run_compose() {
  local dir=$1
  local cmd=$2
  local flag=$3

  if [ ! -d "$dir" ]; then
    echo "❌ Directory '$dir' not found. Aborting."
    exit 1
  fi

  if [ ! -f "$dir/docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found in '$dir'. Aborting."
    exit 1
  fi

  echo "➡️  Running 'docker compose $cmd' in $dir"
  (cd "$dir" && docker compose $cmd $flag)
}

# Run for all services if no name is passed
run_all() {
  for dir in "$APPS_DIR"/* "$LIBS_DIR"/*; do
    [ -d "$dir" ] || continue
    if [ -f "$dir/docker-compose.yml" ]; then
      echo "📦 Processing $(basename "$dir")..."
      run_compose "$dir" "$1" "$2"
    fi
  done
}

# Main logic
case "$COMMAND" in
  up)
    if [ -z "$NAME" ]; then
      run_all "up -d" "$EXTRA_FLAG"
    else
      if [ -d "$APPS_DIR/$NAME" ]; then
        run_compose "$APPS_DIR/$NAME" "up -d" "$EXTRA_FLAG"
      elif [ -d "$LIBS_DIR/$NAME" ]; then
        run_compose "$LIBS_DIR/$NAME" "up -d" "$EXTRA_FLAG"
      else
        echo "❌ Service or library '$NAME' not found."
        exit 1
      fi
    fi
    ;;
  down)
    if [ -z "$NAME" ]; then
      run_all "down"
    else
      if [ -d "$APPS_DIR/$NAME" ]; then
        run_compose "$APPS_DIR/$NAME" "down"
      elif [ -d "$LIBS_DIR/$NAME" ]; then
        run_compose "$LIBS_DIR/$NAME" "down"
      else
        echo "❌ Service or library '$NAME' not found."
        exit 1
      fi
    fi
    ;;
  build)
    if [ -z "$NAME" ]; then
      run_all "build" "$EXTRA_FLAG"
    else
      if [ -d "$APPS_DIR/$NAME" ]; then
        run_compose "$APPS_DIR/$NAME" "build" "$EXTRA_FLAG"
      elif [ -d "$LIBS_DIR/$NAME" ]; then
        run_compose "$LIBS_DIR/$NAME" "build" "$EXTRA_FLAG"
      else
        echo "❌ Service or library '$NAME' not found."
        exit 1
      fi
    fi
    ;;
  *)
    echo "Usage: $0 {up|down|build} [name] [--build|--no-cache]"
    exit 1
    ;;
esac