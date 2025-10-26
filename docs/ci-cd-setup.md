# CI/CD Setup Guide

Quick reference guide for setting up GitHub Actions CI/CD pipeline.

## Prerequisites Checklist

- [ ] Server access configured (SSH)
- [ ] PM2 installed on server
- [ ] Deployment directory created
- [ ] SSH keys generated
- [ ] Repository access (maintainer role)

## GitHub Setup

### 1. Configure Secrets

Go to: **Settings → Secrets and variables → Actions**

Add these secrets:

```
SSH_PRIVATE_KEY = <your-private-key-content>
SERVER_HOST = 5.75.174.224
SERVER_USER = vixseg
SERVER_PORT = 22
```

### 2. Configure Environment (Optional but Recommended)

Go to: **Settings → Environments → New environment**

- Name: `production`
- Required reviewers: Select team members
- Deployment branches: `main` only

### 3. Protect Main Branch

Go to: **Settings → Branches → Add branch protection rule**

- Branch name pattern: `main`
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

## Server Setup

### 1. Create Deployment Directory

```bash
ssh vixseg@5.75.174.224

mkdir -p /home/vixseg/htdocs/vixseg.com.br
cd /home/vixseg/htdocs/vixseg.com.br
mkdir -p logs backups
```

### 2. Install PM2

```bash
# Install PM2 globally
npm install -g pm2

# Setup PM2 startup
pm2 startup
# Run the command it outputs

# Verify PM2 is installed
pm2 --version
```

### 3. Configure SSH Key

```bash
# On your local machine, copy public key to server
ssh-copy-id -i ~/.ssh/vixseg_deploy_key.pub vixseg@5.75.174.224

# Or manually:
# 1. Copy public key content
cat ~/.ssh/vixseg_deploy_key.pub

# 2. SSH to server and add to authorized_keys
ssh vixseg@5.75.174.224
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "<paste-public-key-here>" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 4. Test SSH Connection

```bash
# Test with private key
ssh -i ~/.ssh/vixseg_deploy_key vixseg@5.75.174.224

# Should connect without password
```

## First Deployment

### Manual First Deploy

```bash
# Build locally
npm run build

# Transfer files
rsync -avz .next/ vixseg@5.75.174.224:/home/vixseg/htdocs/vixseg.com.br/.next/
rsync -avz public/ vixseg@5.75.174.224:/home/vixseg/htdocs/vixseg.com.br/public/
rsync -avz package*.json ecosystem.config.js vixseg@5.75.174.224:/home/vixseg/htdocs/vixseg.com.br/

# SSH and start
ssh vixseg@5.75.174.224
cd /home/vixseg/htdocs/vixseg.com.br
npm ci --production
pm2 start ecosystem.config.js
pm2 save
```

### Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs vixseg-site

# Test application
curl http://localhost:3105
```

## Testing CI/CD

### Test Build

```bash
# Push to feature branch
git checkout -b test/ci-cd
git push origin test/ci-cd

# Check Actions tab for build status
```

### Test Deployment

1. Merge to main branch
2. Go to **Actions → CI/CD Pipeline**
3. Click **"Run workflow"**
4. Select branch: `main`
5. Click **"Run workflow"**
6. Monitor deployment logs

### Test with Version Tag

```bash
# Create and push version tag
git tag v1.0.0
git push origin v1.0.0

# Deployment will start automatically
# Check Actions tab
```

## Troubleshooting Setup

### SSH Connection Issues

```bash
# Test SSH manually
ssh -vvv -i ~/.ssh/vixseg_deploy_key vixseg@5.75.174.224

# Check key permissions
ls -la ~/.ssh/vixseg_deploy_key
# Should be 600 (-rw-------)

# Check server authorized_keys
ssh vixseg@5.75.174.224
cat ~/.ssh/authorized_keys
# Should contain your public key
```

### PM2 Not Found

```bash
# Install PM2 globally
npm install -g pm2

# Check installation
which pm2
pm2 --version

# Add to PATH if needed
export PATH=$PATH:$(npm bin -g)
```

### Port Already in Use

```bash
# Check what's using port 3105
lsof -i :3105

# Kill process if needed
kill -9 <PID>

# Or use different port in ecosystem.config.js
```

### Permission Denied

```bash
# Check directory permissions
ls -la /home/vixseg/htdocs/

# Fix if needed
sudo chown -R vixseg:vixseg /home/vixseg/htdocs/vixseg.com.br
chmod 755 /home/vixseg/htdocs/vixseg.com.br
```

### GitHub Actions Workflow Not Running

```bash
# Check if workflow file exists
ls -la .github/workflows/deploy.yml

# Verify YAML syntax
# Use online YAML validator or GitHub's workflow editor

# Check Actions tab for errors
# GitHub → Actions → Select workflow → View logs
```

### Secrets Not Working

```bash
# Verify secrets are configured
# GitHub → Settings → Secrets and variables → Actions

# Check secret names match exactly (case-sensitive):
# - SSH_PRIVATE_KEY
# - SERVER_HOST
# - SERVER_USER
# - SERVER_PORT
```

## Security Checklist

- [ ] SSH keys generated with strong algorithm (ED25519)
- [ ] Private keys stored only in GitHub Secrets
- [ ] Public key added to server authorized_keys
- [ ] Main branch protected
- [ ] Deployment requires manual approval
- [ ] Secrets marked as repository secrets
- [ ] Server firewall configured
- [ ] PM2 logs rotation enabled
- [ ] Regular backup schedule established
- [ ] Key rotation schedule documented

## Next Steps

1. ✅ Complete server setup
2. ✅ Configure GitHub Secrets
3. ✅ Protect main branch
4. ✅ Test build pipeline
5. ✅ Test deployment pipeline
6. ✅ Verify application is accessible
7. ✅ Test rollback procedure
8. ✅ Document any custom configurations
9. ✅ Train team on deployment process
10. ✅ Schedule first key rotation

## Quick Commands Reference

```bash
# Test deployment infrastructure
bash scripts/test-deployment.sh

# Test rollback procedures
bash scripts/test-rollback.sh

# Manual deployment (if needed)
bash scripts/deploy.sh

# Manual rollback (if needed)
bash scripts/rollback.sh

# Health check
bash scripts/health-check.sh 5.75.174.224 3105
```

## Support

- **Full Documentation**: [DEPLOYMENT.md](../DEPLOYMENT.md)
- **Secrets Guide**: [SECRETS.md](../SECRETS.md)
- **GitLab Setup**: [gitlab-optional/README.md](gitlab-optional/README.md) (optional)

---

**Setup Date**: 2025-10-26
**Next Review**: 2026-01-26
