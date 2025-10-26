#!/bin/bash

# Rollback Script for VixSeg Site
# Restores the previous version from backup and restarts PM2

set -e

# Configuration
DEPLOY_PATH="${DEPLOY_PATH:-/home/vixseg/htdocs/vixseg.com.br}"
BACKUP_DIR="$DEPLOY_PATH/backups"
PM2_APP_NAME="vixseg-site"

echo "🔄 Starting rollback process..."
echo "Deploy path: $DEPLOY_PATH"

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
  echo "❌ Backup directory not found: $BACKUP_DIR"
  exit 1
fi

# Find the most recent backup
LATEST_BACKUP=$(ls -t "$BACKUP_DIR" | head -n 1)

if [ -z "$LATEST_BACKUP" ]; then
  echo "❌ No backups found in $BACKUP_DIR"
  exit 1
fi

echo "📦 Found backup: $LATEST_BACKUP"
echo "⚠️  This will restore the application to the previous version"
read -p "Continue with rollback? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Rollback cancelled"
  exit 1
fi

# Create a backup of current state before rollback
echo "📦 Creating backup of current state..."
ROLLBACK_BACKUP="rollback-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR/$ROLLBACK_BACKUP"
if [ -d "$DEPLOY_PATH/.next" ]; then
  cp -r "$DEPLOY_PATH/.next" "$BACKUP_DIR/$ROLLBACK_BACKUP/"
  echo "✅ Current state backed up to: $ROLLBACK_BACKUP"
fi

# Restore from backup
echo "🔄 Restoring from backup: $LATEST_BACKUP"
if [ -d "$BACKUP_DIR/$LATEST_BACKUP/.next" ]; then
  rm -rf "$DEPLOY_PATH/.next"
  cp -r "$BACKUP_DIR/$LATEST_BACKUP/.next" "$DEPLOY_PATH/"
  echo "✅ Files restored successfully"
else
  echo "❌ Backup does not contain .next directory"
  exit 1
fi

# Restart PM2
echo "🔄 Restarting PM2..."
cd "$DEPLOY_PATH"

if pm2 describe $PM2_APP_NAME > /dev/null 2>&1; then
  pm2 restart $PM2_APP_NAME
  echo "✅ PM2 restarted successfully"
else
  echo "⚠️  PM2 process not found, starting fresh..."
  pm2 start ecosystem.config.js
  pm2 save
  echo "✅ PM2 started successfully"
fi

# Wait for application to start
echo "⏳ Waiting for application to start..."
sleep 5

# Verify PM2 status
echo "📊 PM2 Status:"
pm2 status $PM2_APP_NAME

# Health check
echo "🏥 Running health check..."
if command -v curl &> /dev/null; then
  for i in {1..5}; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3105 || echo "000")
    if [[ "$HTTP_CODE" == "200" ]] || [[ "$HTTP_CODE" == "301" ]] || [[ "$HTTP_CODE" == "302" ]]; then
      echo "✅ Rollback completed successfully! Application is responding."
      exit 0
    fi
    echo "⏳ Attempt $i/5 failed, retrying..."
    sleep 3
  done
  echo "⚠️  Health check failed, but rollback completed. Check application logs."
else
  echo "⚠️  curl not found, skipping health check"
fi

echo "✅ Rollback completed"
