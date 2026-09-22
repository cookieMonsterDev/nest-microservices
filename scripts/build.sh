#!/bin/bash

APP=$1

if [ -z "$APP" ]; then
  echo "❌ Please specify an app name. Example:"
  echo "   pnpm run build users"
  exit 1
fi

nest build "$APP" && tsc-alias -p "apps/$APP/tsconfig.app.json"
