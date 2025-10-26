# GitLab CI/CD Setup Guide

Setup guide for GitLab CI/CD (optional alternative to GitHub Actions).

## Prerequisites

- [ ] GitLab account
- [ ] Repository on GitLab
- [ ] Server access configured (SSH)
- [ ] PM2 installed on server
- [ ] SSH keys generated

## Setup Steps

### 1. Copy Configuration File

```bash
# Copy GitLab CI config to project root
cp docs/gitlab-optional/gitlab-ci.yml .gitlab-ci.yml

# Commit and push
git add .gitlab-ci.yml
git commit -m "feat: add GitLab CI/CD configuration"
git push origin main
```

### 2. Configure Variables

Go to: **Settings → CI/CD → Variables**

Add these variables:

| Key               | Value                | Protected | Masked |
| ----------------- | -------------------- | --------- | ------ |
| `SSH_PRIVATE_KEY` | `<your-private-key>` | ✅        | ✅     |
| `SERVER_HOST`     | `5.75.174.224`       | ✅        | ❌     |
| `SERVER_USER`     | `vixseg`             | ✅        | ❌     |
| `SERVER_PORT`     | `22`                 | ✅        | ❌     |

### 3. Protect Main Branch

Go to: **Settings → Repository → Protected branches**

- Branch: `main`
- Allowed to merge: Maintainers
- Allowed to push: No one
- Require approval: Yes

### 4. Configure Protected Tags (Optional)

Go to: **Settings → Repository → Protected tags**

- Tag: `v*`
- Allowed to create: Maintainers

## Testing

### Test Build

```bash
# Push to feature branch
git checkout -b test/gitlab-ci
git push origin test/gitlab-ci

# Check CI/CD → Pipelines for build status
```

### Test Deployment

1. Merge to main branch
2. Go to **CI/CD → Pipelines**
3. Find main branch pipeline
4. Click **Play button** (▶️) on deploy job
5. Monitor deployment logs

### Test with Version Tag

```bash
# Create and push version tag
git tag v1.0.0
git push origin v1.0.0

# Deployment will start automatically
# Check CI/CD → Pipelines
```

## Troubleshooting

### Pipeline Not Starting

- Verify `.gitlab-ci.yml` is in project root
- Check YAML syntax
- View errors in **CI/CD → Pipelines**

### Variables Not Working

- Ensure variables are marked as "Protected"
- Verify main branch is protected
- Check variable names match exactly

### Deploy Job Fails

- Check SSH connection manually
- Verify all variables are configured
- Review job logs for specific errors

## Support

- **Main Setup Guide**: [../ci-cd-setup.md](../ci-cd-setup.md)
- **Secrets Guide**: [../../SECRETS.md](../../SECRETS.md)
- **Deployment Guide**: [../../DEPLOYMENT.md](../../DEPLOYMENT.md)

---

**Note**: This is an optional configuration. The project uses GitHub Actions by default.
