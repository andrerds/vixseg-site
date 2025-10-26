#!/bin/bash

# Deployment Simulation Test Script
# Tests SSH connection, file transfer, and PM2 commands without actual deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_HOST="${SERVER_HOST:-5.75.174.224}"
SERVER_USER="${SERVER_USER:-vixseg}"
SERVER_PORT="${SERVER_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/home/vixseg/htdocs/vixseg.com.br}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/vixseg_deploy_key}"

echo "🧪 Deployment Simulation Test"
echo "=============================="
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

# Test 1: Check if SSH key exists
echo "Test 1: SSH Key Existence"
if [ -f "$SSH_KEY" ]; then
  test_result 0 "SSH key found at $SSH_KEY"
else
  test_result 1 "SSH key not found at $SSH_KEY"
  echo -e "${YELLOW}⚠️  Generate key with: ssh-keygen -t ed25519 -f $SSH_KEY${NC}"
fi
echo ""

# Test 2: Check SSH key permissions
echo "Test 2: SSH Key Permissions"
if [ -f "$SSH_KEY" ]; then
  PERMS=$(stat -c %a "$SSH_KEY" 2>/dev/null || stat -f %A "$SSH_KEY" 2>/dev/null)
  if [ "$PERMS" = "600" ]; then
    test_result 0 "SSH key has correct permissions (600)"
  else
    test_result 1 "SSH key has incorrect permissions ($PERMS, should be 600)"
    echo -e "${YELLOW}⚠️  Fix with: chmod 600 $SSH_KEY${NC}"
  fi
else
  test_result 1 "Cannot check permissions - key doesn't exist"
fi
echo ""

# Test 3: SSH Connection
echo "Test 3: SSH Connection"
if ssh -i "$SSH_KEY" -p "$SERVER_PORT" -o ConnectTimeout=10 -o BatchMode=yes \
   "$SERVER_USER@$SERVER_HOST" "echo 'Connection successful'" > /dev/null 2>&1; then
  test_result 0 "SSH connection successful"
else
  test_result 1 "SSH connection failed"
  echo -e "${YELLOW}⚠️  Check: 1) Key is added to server, 2) Server is accessible, 3) Credentials are correct${NC}"
fi
echo ""

# Test 4: Deployment Directory Exists
echo "Test 4: Deployment Directory"
if ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
   "test -d $DEPLOY_PATH" 2>/dev/null; then
  test_result 0 "Deployment directory exists: $DEPLOY_PATH"
else
  test_result 1 "Deployment directory not found: $DEPLOY_PATH"
  echo -e "${YELLOW}⚠️  Create with: ssh $SERVER_USER@$SERVER_HOST 'mkdir -p $DEPLOY_PATH'${NC}"
fi
echo ""

# Test 5: Write Permissions
echo "Test 5: Write Permissions"
if ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
   "test -w $DEPLOY_PATH" 2>/dev/null; then
  test_result 0 "Write permissions OK on $DEPLOY_PATH"
else
  test_result 1 "No write permissions on $DEPLOY_PATH"
  echo -e "${YELLOW}⚠️  Fix with: ssh $SERVER_USER@$SERVER_HOST 'chmod 755 $DEPLOY_PATH'${NC}"
fi
echo ""

# Test 6: Node.js Installation
echo "Test 6: Node.js Installation"
NODE_VERSION=$(ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
   "node --version" 2>/dev/null || echo "not found")
if [[ "$NODE_VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  test_result 0 "Node.js installed: $NODE_VERSION"
else
  test_result 1 "Node.js not found or invalid version"
  echo -e "${YELLOW}⚠️  Install Node.js 20+ on the server${NC}"
fi
echo ""

# Test 7: PM2 Installation
echo "Test 7: PM2 Installation"
PM2_VERSION=$(ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
   "pm2 --version" 2>/dev/null || echo "not found")
if [[ "$PM2_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  test_result 0 "PM2 installed: v$PM2_VERSION"
else
  test_result 1 "PM2 not found"
  echo -e "${YELLOW}⚠️  Install with: ssh $SERVER_USER@$SERVER_HOST 'npm install -g pm2'${NC}"
fi
echo ""

# Test 8: rsync Installation (local)
echo "Test 8: rsync Installation (local)"
if command -v rsync &> /dev/null; then
  RSYNC_VERSION=$(rsync --version | head -n1)
  test_result 0 "rsync installed: $RSYNC_VERSION"
else
  test_result 1 "rsync not found on local machine"
  echo -e "${YELLOW}⚠️  Install rsync on your local machine${NC}"
fi
echo ""

# Test 9: File Transfer Test
echo "Test 9: File Transfer Test"
TEST_FILE="/tmp/deployment-test-$(date +%s).txt"
echo "Test deployment file" > "$TEST_FILE"

if rsync -avz -e "ssh -i $SSH_KEY -p $SERVER_PORT" \
   "$TEST_FILE" "$SERVER_USER@$SERVER_HOST:/tmp/" > /dev/null 2>&1; then
  test_result 0 "File transfer successful"

  # Cleanup
  rm -f "$TEST_FILE"
  ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
    "rm -f /tmp/$(basename $TEST_FILE)" 2>/dev/null
else
  test_result 1 "File transfer failed"
  rm -f "$TEST_FILE"
fi
echo ""

# Test 10: PM2 Commands
echo "Test 10: PM2 Commands"
PM2_LIST=$(ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
   "pm2 list" 2>/dev/null || echo "failed")
if [[ "$PM2_LIST" != "failed" ]]; then
  test_result 0 "PM2 commands working"
else
  test_result 1 "PM2 commands failed"
fi
echo ""

# Test 11: Port Availability
echo "Test 11: Port 3105 Check"
PORT_CHECK=$(ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
   "lsof -i :3105 || echo 'available'" 2>/dev/null)
if [[ "$PORT_CHECK" == *"available"* ]]; then
  test_result 0 "Port 3105 is available"
else
  echo -e "${YELLOW}⚠️  Port 3105 is in use (this is OK if app is already running)${NC}"
  test_result 0 "Port 3105 is in use (app may be running)"
fi
echo ""

# Test 12: Backup Directory
echo "Test 12: Backup Directory"
if ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
   "test -d $DEPLOY_PATH/backups || mkdir -p $DEPLOY_PATH/backups" 2>/dev/null; then
  test_result 0 "Backup directory exists or created"
else
  test_result 1 "Cannot create backup directory"
fi
echo ""

# Test 13: Logs Directory
echo "Test 13: Logs Directory"
if ssh -i "$SSH_KEY" -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" \
   "test -d $DEPLOY_PATH/logs || mkdir -p $DEPLOY_PATH/logs" 2>/dev/null; then
  test_result 0 "Logs directory exists or created"
else
  test_result 1 "Cannot create logs directory"
fi
echo ""

# Summary
echo "=============================="
echo "Test Summary"
echo "=============================="
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed! Deployment environment is ready.${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Please fix the issues above before deploying.${NC}"
  exit 1
fi
