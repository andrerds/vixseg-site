#!/bin/bash

# Rollback Test Script
# Tests rollback procedures without affecting production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_HOST="${SERVER_HOST:-5.75.174.224}"
SERVER_USER="${SERVER_USER:-vixseg}"
SERVER_PORT="${SERVER_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/home/vixseg/htdocs/vixseg.com.br}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/vixseg_deploy_key}"
TEST_DIR="/tmp/rollback-test-$(date +%s)"

echo "🧪 Rollback Procedure Test"
echo "=========================="
echo ""
echo -e "${YELLOW}⚠️  This test simulates rollback without affecting production${NC}"
echo ""

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test result
test_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✅ PASS${NC}: $2"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}❌ FAIL${NC}: $2"
    ((TESTS_FAILED++))
  fi
}

# Function to cleanup
cleanup() {
  echo ""
  echo -e "${BLUE}🧹 Cleaning up test files...${NC}"
  ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
    "rm -rf $TEST_DIR" 2>/dev/null || true
  echo -e "${GREEN}✅ Cleanup complete${NC}"
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Test 1: SSH Connection
echo "Test 1: SSH Connection"
if ssh -i "$SSH_KEY" -p "$SERVER_PORT" -o ConnectTimeout=10 \
   "$SERVER_USER@$SERVER_HOST" "echo 'Connected'" > /dev/null 2>&1; then
  test_result 0 "SSH connection successful"
else
  test_result 1 "SSH connection failed"
  exit 1
fi
echo ""

# Test 2: Create Test Environment
echo "Test 2: Create Test Environment"
if ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
   "mkdir -p $TEST_DIR/backups $TEST_DIR/.next" 2>/dev/null; then
  test_result 0 "Test environment created"
else
  test_result 1 "Failed to create test environment"
  exit 1
fi
echo ""

# Test 3: Create Mock Application Files
echo "Test 3: Create Mock Application Files"
if ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
  TEST_DIR="/tmp/rollback-test-"*
  echo "version: 1.0.0" > $TEST_DIR/.next/version.txt
  echo "Mock application v1" > $TEST_DIR/.next/app.js
ENDSSH
then
  test_result 0 "Mock application files created"
else
  test_result 1 "Failed to create mock files"
fi
echo ""

# Test 4: Create Backup
echo "Test 4: Create Backup"
BACKUP_NAME="test-backup-$(date +%Y%m%d-%H%M%S)"
if ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << ENDSSH
  TEST_DIR="/tmp/rollback-test-"*
  mkdir -p \$TEST_DIR/backups/$BACKUP_NAME
  cp -r \$TEST_DIR/.next \$TEST_DIR/backups/$BACKUP_NAME/
  echo "Backup created: $BACKUP_NAME"
ENDSSH
then
  test_result 0 "Backup created successfully"
else
  test_result 1 "Failed to create backup"
fi
echo ""

# Test 5: Modify Application (Simulate New Deployment)
echo "Test 5: Simulate New Deployment"
if ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
  TEST_DIR="/tmp/rollback-test-"*
  echo "version: 2.0.0" > $TEST_DIR/.next/version.txt
  echo "Mock application v2 (broken)" > $TEST_DIR/.next/app.js
ENDSSH
then
  test_result 0 "New version deployed (simulated)"
else
  test_result 1 "Failed to simulate new deployment"
fi
echo ""

# Test 6: Verify Backup Exists
echo "Test 6: Verify Backup Exists"
BACKUP_CHECK=$(ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
  "TEST_DIR=/tmp/rollback-test-*; ls -t \$TEST_DIR/backups/ | head -n 1" 2>/dev/null)
if [ -n "$BACKUP_CHECK" ]; then
  test_result 0 "Backup found: $BACKUP_CHECK"
  LATEST_BACKUP="$BACKUP_CHECK"
else
  test_result 1 "No backup found"
  exit 1
fi
echo ""

# Test 7: Verify Current Version (Before Rollback)
echo "Test 7: Verify Current Version (Before Rollback)"
CURRENT_VERSION=$(ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
  "TEST_DIR=/tmp/rollback-test-*; cat \$TEST_DIR/.next/version.txt" 2>/dev/null)
if [ "$CURRENT_VERSION" = "version: 2.0.0" ]; then
  test_result 0 "Current version is 2.0.0 (as expected)"
else
  test_result 1 "Unexpected current version: $CURRENT_VERSION"
fi
echo ""

# Test 8: Perform Rollback
echo "Test 8: Perform Rollback"
if ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << ENDSSH
  TEST_DIR="/tmp/rollback-test-"*
  LATEST_BACKUP=\$(ls -t \$TEST_DIR/backups/ | head -n 1)

  if [ -d "\$TEST_DIR/backups/\$LATEST_BACKUP/.next" ]; then
    rm -rf \$TEST_DIR/.next
    cp -r \$TEST_DIR/backups/\$LATEST_BACKUP/.next \$TEST_DIR/
    echo "Rollback completed"
  else
    echo "Backup directory not found"
    exit 1
  fi
ENDSSH
then
  test_result 0 "Rollback executed successfully"
else
  test_result 1 "Rollback failed"
fi
echo ""

# Test 9: Verify Rolled Back Version
echo "Test 9: Verify Rolled Back Version"
ROLLED_BACK_VERSION=$(ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
  "TEST_DIR=/tmp/rollback-test-*; cat \$TEST_DIR/.next/version.txt" 2>/dev/null)
if [ "$ROLLED_BACK_VERSION" = "version: 1.0.0" ]; then
  test_result 0 "Successfully rolled back to version 1.0.0"
else
  test_result 1 "Rollback verification failed: $ROLLED_BACK_VERSION"
fi
echo ""

# Test 10: Test Backup Cleanup (Keep Last 5)
echo "Test 10: Test Backup Cleanup"
# Create multiple backups
for i in {1..7}; do
  ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << ENDSSH > /dev/null 2>&1
    TEST_DIR="/tmp/rollback-test-"*
    sleep 1
    BACKUP_NAME="test-backup-\$(date +%Y%m%d-%H%M%S)"
    mkdir -p \$TEST_DIR/backups/\$BACKUP_NAME
    echo "backup \$i" > \$TEST_DIR/backups/\$BACKUP_NAME/test.txt
ENDSSH
done

# Cleanup old backups (keep last 5)
if ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
  TEST_DIR="/tmp/rollback-test-"*
  cd $TEST_DIR/backups
  ls -t | tail -n +6 | xargs -r rm -rf
ENDSSH
then
  BACKUP_COUNT=$(ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
    "TEST_DIR=/tmp/rollback-test-*; ls \$TEST_DIR/backups/ | wc -l" 2>/dev/null)

  if [ "$BACKUP_COUNT" -le 5 ]; then
    test_result 0 "Backup cleanup working (kept $BACKUP_COUNT backups)"
  else
    test_result 1 "Backup cleanup failed (found $BACKUP_COUNT backups, expected ≤5)"
  fi
else
  test_result 1 "Backup cleanup command failed"
fi
echo ""

# Test 11: Test Rollback Script Existence
echo "Test 11: Rollback Script Existence"
if [ -f "scripts/rollback.sh" ]; then
  test_result 0 "Rollback script exists"
else
  test_result 1 "Rollback script not found"
fi
echo ""

# Test 12: Test Rollback Script Syntax
echo "Test 12: Rollback Script Syntax"
if [ -f "scripts/rollback.sh" ]; then
  if bash -n scripts/rollback.sh 2>/dev/null; then
    test_result 0 "Rollback script syntax is valid"
  else
    test_result 1 "Rollback script has syntax errors"
  fi
else
  test_result 1 "Cannot test - script doesn't exist"
fi
echo ""

# Summary
echo "=========================="
echo "Test Summary"
echo "=========================="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All rollback tests passed!${NC}"
  echo ""
  echo "Rollback procedure is working correctly:"
  echo "  • Backups are created properly"
  echo "  • Rollback restores previous version"
  echo "  • Backup cleanup works"
  echo "  • Scripts are valid"
  echo ""
  echo -e "${BLUE}ℹ️  To perform actual rollback on production:${NC}"
  echo "  ssh $SERVER_USER@$SERVER_HOST"
  echo "  cd $DEPLOY_PATH"
  echo "  bash scripts/rollback.sh"
  exit 0
else
  echo -e "${RED}❌ Some rollback tests failed.${NC}"
  echo "Please fix the issues before relying on rollback procedures."
  exit 1
fi
