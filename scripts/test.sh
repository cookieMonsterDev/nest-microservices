APP=$1

if [ -z "$APP" ]; then
  echo "❌ Please specify an app name. Example:"
  echo "   npm run test:e2e users"
  exit 1
fi

NODE_ENV=test jest --config ./apps/$APP/test/jest-e2e.json