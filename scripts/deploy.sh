#!/bin/bash

# Deployment Script for VixSeg Site
# Handles backup, dependency installation, PM2 reload, and health check

set -e

# Configuration
DEPLOY_PATH="${DEPLOY_PATH:-/home/vixseg/htdocs/vixseg.com.br}"
BACKUP_DIR="$DEPLOY_PATH/backups"
PM2_APP_NAME="vixseg-site"
APP_PORT="3105"
MAX_BACKUPS=5

echo "🚀 Starting deployment process..."
echo "Deploy path: $DEPLOY_PATH"
echo "Timestamp: $(date +'%Y-%m-%d %H:%M:%S')"

# Change to deployment directory
cd "$DEPLOY_PATH"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup of current version
if [ -d "$DEPLOY_PATH/.next" ]; then
  BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
  echo "📦 Creating backup: $BACKUP_NAME"
  mkdir -p "$BACKUP_DIR/$BACKUP_NAME"
  cp -r "$DEPLOY_PATH/.next" "$BACKUP_DIR/$BACKUP_NAME/"
  echo "✅ Backup created successfully"

  # Clean old backups (keep only last MAX_BACKUPS)
  echo "🧹 Cleaning old backups (keeping last $MAX_BACKUPS)..."
  cd "$BACKUP_DIR"
  ls -t | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm -rf
  cd "$DEPLOY_PATH"
else
  echo "⚠️  No existing .next directory found, skipping backup"
fi

# Install production dependencies
echo "📦 Installing production dependencies..."
npm ci --production

# Check if PM2 process exists
if pm2 describe $PM2_APP_NAME > /dev/null 2>&1; then
  echo "🔄 Reloading PM2 process..."
  pm2 reload ecosystem.config.js --update-env
  echo "✅ PM2 reloaded successfully"
else
  echo "🚀 Starting PM2 process..."
  pm2 start ecosystem.config.js
  pm2 save
  echo "✅ PM2 started successfully"
fi

# Wait for application to stabilize
echo "⏳ Waiting for application to stabilize..."
sleep 5

# Display PM2 status
echo "📊 PM2 Status:"
pm2 status $PM2_APP_NAME

# Health check
echo "🏥 Running health check..."
HEALTH_CHECK_PASSED=false

for i in {1..5}; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$APP_PORT" 2>/dev/null || echo "000")

  if [[ "$HTTP_CODE" == "200" ]] || [[ "$HTTP_CODE" == "301" ]] || [[ "$HTTP_CODE" == "302" ]]; then
    echo "✅ Health check passed! (HTTP $HTTP_CODE)"
    HEALTH_CHECK_PASSED=true
    break
  fi

  echo "⏳ Attempt $i/5 failed (HTTP $HTTP_CODE), retrying in 5 seconds..."
  sleep 5
done

# Handle health check failure
if [ "$HEALTH_CHECK_PASSED" = false ]; then
  echo "❌ Health check failed after 5 attempts"
  echo "🔄 Attempting automatic rollback..."

  # Find the most recent backup
  LATEST_BACKUP=$(ls -t "$BACKUP_DIR" | grep "^backup-" | head -n 1)

  if [ -n "$LATEST_BACKUP" ] && [ -d "$BACKUP_DIR/$LATEST_BACKUP/.next" ]; then
    echo "📦 Rolling back to: $LATEST_BACKUP"
    rm -rf "$DEPLOY_PATH/.next"
    cp -r "$BACKUP_DIR/$LATEST_BACKUP/.next" "$DEPLOY_PATH/"

    pm2 restart $PM2_APP_NAME
    sleep 5

    # Verify rollback
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$APP_PORT" 2>/dev/null || echo "000")
    if [[ "$HTTP_CODE" == "200" ]] || [[ "$HTTP_CODE" == "301" ]] || [[ "$HTTP_CODE" == "302" ]]; then
      echo "✅ Rollback successful, previous version restored"
    else
      echo "❌ Rollback failed, manual intervention required"
    fi
  else
    echo "❌ No backup available for rollback"
  fi

  exit 1
fi

# Deployment successful
echo ""
echo "✅ Deployment completed successfully!"
echo "🌐 Application is running on port $APP_PORT"
echo "📝 Logs: pm2 logs $PM2_APP_NAME"
echo "📊 Status: pm2 status $PM2_APP_NAME"

exit 0
