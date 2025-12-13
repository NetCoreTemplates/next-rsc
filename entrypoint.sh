#!/usr/bin/env bash
set -e

ASPNETCORE_URLS="${ASPNETCORE_URLS:-http://0.0.0.0:8080}"
NEXT_PORT="${NEXT_PORT:-3000}"

# If running an AppTask (e.g. --AppTasks=migrate), run only the .NET app and exit
if [[ "$*" == *"--AppTasks"* ]]; then
  echo "Running AppTask with args: $*"
  ASPNETCORE_CONTENTROOT="/app/api" ASPNETCORE_URLS="${ASPNETCORE_URLS}" \
    dotnet /app/api/MyApp.dll "$@"
  exit $?
fi

echo "Starting ASP.NET Core on ${ASPNETCORE_URLS}..."

# Start ASP.NET Core application as root with full environment
ASPNETCORE_CONTENTROOT="/app/api" ASPNETCORE_URLS="${ASPNETCORE_URLS}" dotnet /app/api/MyApp.dll &
DOTNET_PID=$!

echo "Starting Next.js on port ${NEXT_PORT} as isolated user..."

# Start Node.js with minimal environment and as unprivileged user
# Only pass through safe environment variables
cd /app/client && su nodeuser -s /bin/bash -c "
export HOME=/tmp
export NODE_ENV=production
export NEXT_PORT=${NEXT_PORT}
export INTERNAL_API_URL=${INTERNAL_API_URL:-http://127.0.0.1:8080}
export KAMAL_DEPLOY_HOST=${KAMAL_DEPLOY_HOST}
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
cd /app/client
npm run start -- --port ${NEXT_PORT}
" &
NEXT_PID=$!

term_handler() {
  echo "Stopping processes..."
  if kill -0 "${DOTNET_PID}" 2>/dev/null; then
    kill -TERM "${DOTNET_PID}" 2>/dev/null || true
  fi
  if kill -0 "${NEXT_PID}" 2>/dev/null; then
    kill -TERM "${NEXT_PID}" 2>/dev/null || true
  fi
  wait || true
  exit 0
}

trap term_handler SIGINT SIGTERM

# Wait for the first process to exit
wait -n "${DOTNET_PID}" "${NEXT_PID}"
EXIT_CODE=$?

echo "One of the processes exited with code ${EXIT_CODE}, shutting down the other..."
term_handler
