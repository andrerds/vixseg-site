# CI/CD Secrets Configuration

This document describes all required secrets and variables for the CI/CD pipelines.

## ⚠️ Security Notice

- **NEVER commit secrets to the repository**
- All secrets should be stored in the platform's secret management system
- Rotate SSH keys every 90 days
- Use different keys for different environments if possible

## GitHub Secrets

Configure these secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

### Required Secrets

| Secret Name       | Description                       | Example Value                            |
| ----------------- | --------------------------------- | ---------------------------------------- |
| `SSH_PRIVATE_KEY` | Private SSH key for server access | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `SERVER_HOST`     | Server IP address or hostname     | `5.75.174.224`                           |
| `SERVER_USER`     | SSH username                      | `vixseg`                                 |
| `SERVER_PORT`     | SSH port                          | `22`                                     |

### Setup Instructions

1. **Generate SSH Key Pair** (if not already done):

   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f vixseg_deploy_key
   ```

2. **Add Public Key to Server**:

   ```bash
   ssh-copy-id -i vixseg_deploy_key.pub vixseg@5.75.174.224
   ```

   Or manually add to `~/.ssh/authorized_keys` on the server

3. **Add Private Key to GitHub**:

   - Copy the entire private key content:
     ```bash
     cat vixseg_deploy_key
     ```
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `SSH_PRIVATE_KEY`
   - Value: Paste the entire private key (including BEGIN and END lines)

4. **Add Other Secrets**:
   - Repeat step 3 for `SERVER_HOST`, `SERVER_USER`, and `SERVER_PORT`

### Environment Protection (Optional but Recommended)

1. Go to Settings → Environments → New environment
2. Name: `production`
3. Configure protection rules:
   - ✅ Required reviewers (select team members)
   - ✅ Wait timer (optional delay before deployment)
4. Add environment secrets (same as above)

## GitLab CI/CD Variables

Configure these variables in your GitLab project:

**Settings → CI/CD → Variables → Add variable**

### Required Variables

| Variable Name     | Description                       | Example Value                            | Protected | Masked |
| ----------------- | --------------------------------- | ---------------------------------------- | --------- | ------ |
| `SSH_PRIVATE_KEY` | Private SSH key for server access | `-----BEGIN OPENSSH PRIVATE KEY-----...` | ✅        | ✅     |
| `SERVER_HOST`     | Server IP address or hostname     | `5.75.174.224`                           | ✅        | ❌     |
| `SERVER_USER`     | SSH username                      | `vixseg`                                 | ✅        | ❌     |
| `SERVER_PORT`     | SSH port                          | `22`                                     | ✅        | ❌     |

### Setup Instructions

1. **Generate SSH Key Pair** (if not already done):

   ```bash
   ssh-keygen -t ed25519 -C "gitlab-ci-deploy" -f vixseg_deploy_key
   ```

2. **Add Public Key to Server**:

   ```bash
   ssh-copy-id -i vixseg_deploy_key.pub vixseg@5.75.174.224
   ```

3. **Add Variables to GitLab**:

   - Go to GitLab project → Settings → CI/CD → Variables
   - Click "Add variable" for each:

   **SSH_PRIVATE_KEY**:

   - Key: `SSH_PRIVATE_KEY`
   - Value: Paste entire private key content
   - Type: File or Variable
   - Flags: ✅ Protected, ✅ Masked

   **SERVER_HOST**:

   - Key: `SERVER_HOST`
   - Value: `5.75.174.224`
   - Flags: ✅ Protected

   **SERVER_USER**:

   - Key: `SERVER_USER`
   - Value: `vixseg`
   - Flags: ✅ Protected

   **SERVER_PORT**:

   - Key: `SERVER_PORT`
   - Value: `22`
   - Flags: ✅ Protected

### Protected Branches

1. Go to Settings → Repository → Protected branches
2. Protect `main` branch:
   - Allowed to merge: Maintainers
   - Allowed to push: No one
   - Require approval: Yes

## SSH Key Management

### Key Generation Best Practices

- Use ED25519 algorithm (more secure and faster than RSA)
- Add a descriptive comment to identify the key purpose
- Store private keys securely (never commit to repository)
- Use different keys for different environments

### Key Rotation Schedule

- **Every 90 days**: Rotate SSH keys
- **Immediately**: If key is compromised or team member leaves

### Key Rotation Process

1. Generate new SSH key pair
2. Add new public key to server (don't remove old one yet)
3. Update CI/CD secrets with new private key
4. Test deployment with new key
5. Remove old public key from server
6. Securely delete old private key

## Testing Secrets Configuration

### GitHub Actions

1. Push a commit to a feature branch
2. Check Actions tab for build status
3. For deployment test:
   - Push to main branch
   - Go to Actions → Select workflow → Run workflow
   - Monitor deployment logs

### GitLab CI/CD

1. Push a commit to a feature branch
2. Check CI/CD → Pipelines for build status
3. For deployment test:
   - Push to main branch
   - Go to CI/CD → Pipelines
   - Click "Play" button on deploy job
   - Monitor deployment logs

## Troubleshooting

### SSH Connection Fails

**Error**: `Permission denied (publickey)`

**Solutions**:

1. Verify private key is correctly formatted in secrets
2. Check public key is in server's `~/.ssh/authorized_keys`
3. Verify server user and host are correct
4. Check SSH port (default is 22)

### Secrets Not Found

**Error**: `secret not found` or `variable not defined`

**Solutions**:

1. Verify secret name matches exactly (case-sensitive)
2. Check secret is not expired
3. Verify secret is accessible to the workflow/pipeline
4. For GitLab: ensure variable is not restricted to specific branches

### Masked Variable Shows in Logs

**Solutions**:

1. In GitLab: ensure "Masked" flag is enabled
2. In GitHub: secrets are automatically masked
3. Never echo or print secret values in scripts

## Security Best Practices

1. **Principle of Least Privilege**

   - Use dedicated deployment user with minimal permissions
   - Restrict SSH key to specific commands if possible

2. **Secret Rotation**

   - Rotate keys regularly (every 90 days)
   - Document rotation dates

3. **Access Control**

   - Limit who can view/edit secrets
   - Use environment protection rules
   - Require approvals for production deployments

4. **Monitoring**

   - Monitor deployment logs for suspicious activity
   - Set up alerts for failed deployments
   - Review access logs regularly

5. **Backup**
   - Keep secure backup of SSH keys
   - Document recovery procedures
   - Test recovery process

## Emergency Contacts

If you need to revoke access or suspect a security breach:

1. Immediately remove public key from server
2. Rotate all secrets
3. Review deployment logs for unauthorized access
4. Contact system administrator

---

**Last Updated**: 2025-10-26
**Next Key Rotation Due**: 2026-01-24
