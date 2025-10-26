# Deployment Guide

Complete guide for deploying the VixSeg corporate website using CI/CD pipelines.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Deployment Methods](#deployment-methods)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)
- [Monitoring](#monitoring)

## Overview

The VixSeg site uses automated CI/CD pipelines for deployment:

- **Build**: Automatic on every push
- **Deploy**: Manual trigger or version tags
- **Platform**: GitHub Actions and GitLab CI/CD
- **Server**: PM2 on production server (5.75.174.224)
- **Port**: 3105

### Deployment Flow

```
Code Push → Build & Test → Manual Approval → Deploy → Health Check → Success
                                                    ↓
                                              (if fails)
                                                    ↓
                                            Automatic Rollback
```

## Prerequisites

### Server Requirements

- Node.js 20+
- PM2 installed globally
- SSH access configured
- Deployment directory: `/home/vixseg/htdocs/vixseg.com.br`

### CI/CD Requirements

- SSH private key configured in secrets
- Server credentials configured
- Protected main branch
- Maintainer permissions for deployment

## Initial Setup

### 1. Server Setup

```bash
# SSH into the server
ssh vixseg@5.75.174.224

# Create deployment directory
mkdir -p /home/vixseg/htdocs/vixseg.com.br
cd /home/vixseg/htdocs/vixseg.com.br

# Install PM2 globally (if not installed)
npm install -g pm2

# Setup PM2 startup script
pm2 startup
# Follow the instructions provided by the command

# Create logs directory
mkdir -p logs
```

### 2. SSH Key Configuration

See [SECRETS.md](./SECRETS.md) for detailed instructions on:

- Generating SSH keys
- Adding keys to server
- Configuring secrets in GitHub/GitLab

### 3. First Deployment

**Manual deployment for initial setup**:

```bash
# On your local machine
npm run build

# Transfer files to server
rsync -avz .next/ vixseg@5.75.174.224:/home/vixseg/htdocs/vixseg.com.br/.next/
rsync -avz public/ vixseg@5.75.174.224:/home/vixseg/htdocs/vixseg.com.br/public/
rsync -avz package*.json ecosystem.config.js vixseg@5.75.174.224:/home/vixseg/htdocs/vixseg.com.br/

# SSH into server
ssh vixseg@5.75.174.224

# Install dependencies and start PM2
cd /home/vixseg/htdocs/vixseg.com.br
npm ci --production
pm2 start ecosystem.config.js
pm2 save

# Verify
pm2 status
curl http://localhost:3105
```

## Deployment Methods

### Method 1: GitHub Actions (Manual Trigger)

1. Go to repository on GitHub
2. Click **Actions** tab
3. Select **CI/CD Pipeline** workflow
4. Click **Run workflow** button
5. Select branch: `main`
6. Click **Run workflow**
7. Monitor deployment progress
8. Wait for health check to pass

### Method 2: GitHub Actions (Version Tag)

```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0

# Deployment will start automatically
# Monitor in Actions tab
```

### Method 3: GitLab CI/CD (Manual Trigger)

1. Go to project on GitLab
2. Click **CI/CD → Pipelines**
3. Find the pipeline for main branch
4. Click **Play** button (▶️) on deploy job
5. Confirm deployment
6. Monitor deployment logs

### Method 4: GitLab CI/CD (Version Tag)

```bas
e and push a version tag
git tag v1.0.0
git push origin v1.0.0

# Deployment will start automatically
# Monitor in CI/CD → Pipelines
```

### Method 5: Manual Deployment (Emergency)

```bash
# SSH into server
ssh vixseg@5.75.174.224

# Navigate to deployment directory
cd /home/vixseg/htdocs/vixseg.com.br

# Pull latest changes (if using git on server)
git pull origin main

# Or transfer files manually using rsync

# Run deployment script
bash scripts/deploy.sh
```

## Rollback Procedures

### Automatic Rollback

The deployment script automatically rolls back if health check fails.

### Manual Rollback (Method 1: Using Script)

```bash
# SSH into server
ssh vixseg@5.75.174.224

# Navigate to deployment directory
cd /home/vixseg/htdocs/vixseg.com.br

# Run rollback script
bash scripts/rollback.sh

# Follow prompts to confirm rollback
```

### Manual Rollback (Method 2: Direct PM2)

```bash
# SSH into server
ssh vixseg@5.75.174.224
cd /home/vixseg/htdocs/vixseg.com.br

# List available backups
ls -lt backups/

# Choose a backup (e.g., backup-20251026-143000)
BACKUP_NAME="backup-20251026-143000"

# Restore files
rm -rf .next
cp -r backups/$BACKUP_NAME/.next ./

# Restart PM2
pm2 restart vixseg-site

# Verify
pm2 status
curl http://localhost:3105
```

### Rollback from CI/CD

If you need to rollback to a previous version:

1. Find the commit SHA of the working version
2. Create a new branch from that commit:
   ```bash
   git checkout -b hotfix/rollback <commit-sha>
   git push origin hotfix/rollback
   ```
3. Merge to main and deploy
4. Or create a revert commit:
   ```bash
   git revert <bad-commit-sha>
   git push origin main
   ```

## Troubleshooting

### Build Fails

**Symptom**: Build job fails in CI/CD

**Common Causes**:

- Linting errors
- TypeScript errors
- Missing dependencies
- Build configuration issues

**Solutions**:

```bash
# Test locally
npm ci
npm run lint
npm run build

# Fix errors and push again
```

### Deployment Fails - SSH Connection

**Symptom**: `Permission denied` or `Connection refused`

**Solutions**:

1. Verify SSH key is correct in secrets
2. Test SSH connection manually:
   ```bash
   ssh -i path/to/key vixseg@5.75.174.224
   ```
3. Check server is accessible
4. Verify firewall rules

### Deployment Fails - PM2 Issues

**Symptom**: PM2 fails to start or reload

**Solutions**:

```bash
# SSH into server
ssh vixseg@5.75.174.224

# Check PM2 status
pm2 status

# Check PM2 logs
pm2 logs vixseg-site --lines 50

# Restart PM2
pm2 restart vixseg-site

# If process is stuck
pm2 delete vixseg-site
pm2 start ecosystem.config.js
pm2 save
```

### Health Check Fails

**Symptom**: Deployment completes but health check fails

**Solutions**:

```bash
# SSH into server
ssh vixseg@5.75.174.224

# Check if application is running
pm2 status vixseg-site

# Check application logs
pm2 logs vixseg-site

# Check if port is listening
netstat -tlnp | grep 3105

# Test locally on server
curl http://localhost:3105

# Check for errors
pm2 logs vixseg-site --err
```

### Application Not Accessible

**Symptom**: Deployment succeeds but site not accessible

**Solutions**:

1. Check firewall rules:

   ```bash
   sudo ufw status
   sudo ufw allow 3105/tcp
   ```

2. Check if port is in use:

   ```bash
   lsof -i :3105
   ```

3. Verify PM2 is running:

   ```bash
   pm2 status
   pm2 logs vixseg-site
   ```

4. Check application configuration:
   ```bash
   cat ecosystem.config.js
   ```

### Disk Space Issues

**Symptom**: Deployment fails with disk space errors

**Solutions**:

```bash
# Check disk space
df -h

# Clean old backups
cd /home/vixseg/htdocs/vixseg.com.br/backups
ls -lt
rm -rf <old-backup-directories>

# Clean PM2 logs
pm2 flush

# Clean npm cache
npm cache clean --force
```

## Monitoring

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Process status
pm2 status vixseg-site

# View logs
pm2 logs vixseg-site

# View only errors
pm2 logs vixseg-site --err

# View specific number of lines
pm2 logs vixseg-site --lines 100
```

### Application Health

```bash
# Check if application responds
curl http://localhost:3105

# Check response time
curl -w "@-" -o /dev/null -s http://localhost:3105 <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
      time_redirect:  %{time_redirect}\n
   time_pretransfer:  %{time_pretransfer}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

### CI/CD Monitoring

**GitHub Actions**:

- Go to Actions tab
- View workflow runs
- Check deployment history
- Download logs if needed

**GitLab CI/CD**:

- Go to CI/CD → Pipelines
- View pipeline history
- Check job logs
- Download artifacts

### Log Files

```bash
# PM2 logs location
/home/vixseg/htdocs/vixseg.com.br/logs/

# View error log
tail -f /home/vixseg/htdocs/vixseg.com.br/logs/err.log

# View output log
tail -f /home/vixseg/htdocs/vixseg.com.br/logs/out.log
```

## Maintenance

### Regular Tasks

**Weekly**:

- Review deployment logs
- Check PM2 process health
- Monitor disk space

**Monthly**:

- Clean old backups (keep last 5)
- Review and rotate logs
- Update dependencies

**Quarterly**:

- Rotate SSH keys (see SECRETS.md)
- Security audit
- Performance review

### Backup Management

```bash
# List backups
ls -lt /home/vixseg/htdocs/vixseg.com.br/backups/

# Keep only last 5 backups
cd /home/vixseg/htdocs/vixseg.com.br/backups
ls -t | tail -n +6 | xargs rm -rf

# Manual backup
BACKUP_NAME="manual-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p backups/$BACKUP_NAME
cp -r .next backups/$BACKUP_NAME/
```

## Emergency Procedures

### Complete Service Outage

1. **Immediate Actions**:

   ```bash
   ssh vixseg@5.75.174.224
   pm2 restart vixseg-site
   ```

2. **If restart doesn't work**:

   ```bash
   pm2 logs vixseg-site --err
   # Identify the issue
   ```

3. **Rollback to last known good version**:

   ```bash
   bash scripts/rollback.sh
   ```

4. **If rollback fails**:
   - Contact system administrator
   - Check server resources (CPU, memory, disk)
   - Review system logs

### Data Loss Prevention

- Backups are created automatically before each deployment
- Last 5 backups are kept
- Manual backups can be created anytime
- PM2 logs are rotated automatically

## Support

### Documentation

- [SECRETS.md](./SECRETS.md) - Secret configuration
- [README.md](./README.md) - Project overview
- [ecosystem.config.js](./ecosystem.config.js) - PM2 configuration

### Useful Commands

```bash
# PM2 commands
pm2 start ecosystem.config.js
pm2 reload vixseg-site
pm2 restart vixseg-site
pm2 stop vixseg-site
pm2 delete vixseg-site
pm2 logs vixseg-site
pm2 monit
pm2 save

# Deployment scripts
bash scripts/deploy.sh
bash scripts/rollback.sh
bash scripts/health-check.sh localhost 3105
```

---

**Last Updated**: 2025-10-26
