#!/bin/bash

# Health Check Script for VixSeg Site Deployment
# Verifies that the application is running and responding correctly

set -e

# Configuration
HOST="${1:-localhost}"
PORT="${2:-3105}"
MAX_ATTEMPTS="${3:-5}"
RETRY_DELAY="${4:-5}"

echo "🏥 Starting health check for $HOST:$PORT"
echo "Max attempts: $MAX_ATTEMPTS, Retry delay: ${RETRY_DELAY}s"

# Function to check HTTP response
check_health() {
  local attempt=$1

  echo "⏳ Attempt $attempt/$MAX_ATTEMPTS..."

  # Try to get HTTP status code
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$HOST:$PORT" 2>/dev/null || echo "000")

  # Check if response is successful (200, 301, 302)
  if [[ "$HTTP_CODE" == "200" ]] || [[ "$HTTP_CODE" == "301" ]] || [[ "$HTTP_CODE" == "302" ]]; then
    echo "✅ Health check passed! (HTTP $HTTP_CODE)"
    return 0
  else
    echo "❌ Health check failed (HTTP $HTTP_CODE)"
    return 1
  fi
}

# Main health check loop
for i in $(seq 1 $MAX_ATTEMPTS); do
  if check_health $i; then
    exit 0
  fi

  if [ $i -lt $MAX_ATTEMPTS ]; then
    echo "⏳ Retrying in ${RETRY_DELAY}s..."
    sleep $RETRY_DELAY
  fi
done

echo "❌ Health check failed after $MAX_ATTEMPTS attempts"
exit 1
