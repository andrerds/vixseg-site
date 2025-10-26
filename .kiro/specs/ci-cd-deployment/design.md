# CI/CD Deployment Design Document

## Overview

This design document outlines the implementation of a dual-platform CI/CD pipeline for the VixSeg corporate website. The system will support both GitLab CI/CD and GitHub Actions, providing automated build, test, and controlled deployment workflows with PM2 process management on the production server.

The design emphasizes security through manual deployment approval, SSH key authentication, and role-based access control to prevent unauthorized deployments.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    A[Developer Push] --> B{Check Commit Message}
    B -->|Contains [ci skip]| C[Skip CI]
    B -->|Normal Commit| D[CI/CD Pipeline]

    D --> E[Install Dependencies]
    E --> F[Run Linter]
    F --> G[Build Application]

    G -->|Success| H{Branch Check}
    G -->|Failure| I[Report Failure]

    H -->|main branch| J[Wait for Manual Trigger]
    H -->|other branch| K[Complete - No Deploy]

    J -->|Manual Approval or Tag| L[Deployment Stage]

    L --> M[Connect via SSH]
    M --> N[Transfer Build Artifacts]
    N --> O[Install Dependencies on Server]
    O --> P[PM2 Reload/Restart]
    P --> Q[Verify Deployment]
    Q --> R[Report Success]
```

### Platform-Specific Implementations

#### GitLab CI/CD

- Configuration file: `.gitlab-ci.yml`
- Uses GitLab CI/CD variables for secrets
- Manual deployment via GitLab UI button
- Supports protected branches and tags

#### GitHub Actions

- Configuration file: `.github/workflows/deploy.yml`
- Uses GitHub Secrets for credentials
- Manual deployment via workflow_dispatch
- Supports environment protection rules

## Components and Interfaces

### 1. CI/CD Configuration Files

#### GitLab CI/CD Configuration (.gitlab-ci.yml)

**Stages:**

- `build`: Install dependencies, lint, and build
- `deploy`: SSH connection and PM2 dent (manual trigger)

**Jobs:**

- `build-job`: Executes on all branches
- `deploy-job`: Executes only on main branch with manual trigger

**Variables Required:**

- `SSH_PRIVATE_KEY`: Private SSH key for server authentication (already configured)
- `SERVER_HOST`: 5.75.174.224
- `SERVER_USER`: vixseg
- `SERVER_PORT`: 22
- `APP_PORT`: 3105
- `DEPLOY_PATH`: /home/vixseg/htdocs/vixseg.com.br

#### GitHub Actions Configuration (.github/workflows/deploy.yml)

**Triggers:**

- `push`: Runs build on all branches
- `workflow_dispatch`: Manual deployment trigger
- `push` with tags: Automatic deployment for version tags (v*.*.\*)

**Jobs:**

- `build`: Install, lint, and build
- `deploy`: SSH deployment (requires manual trigger or tag)

**Secrets Required:**

- `SSH_PRIVATE_KEY`: Private SSH key (already configured)
- `SERVER_HOST`: 5.75.174.224
- `SERVER_USER`: vixseg
- `SERVER_PORT`: 22

### 2. SSH Connection Module

**Purpose:** Establish secure connection to production server

**Implementation:**

- Use SSH key-based authentication (no passwords)
- Add server to known_hosts to prevent MITM attacks
- Use rsync or scp for file transfer
- Execute remote commands via SSH

**Security Measures:**

- Private key stored as encrypted secret
- Connection timeout: 30 seconds
- Strict host key checking enabled

### 3. Build Process

**Steps:**

1. Checkout code from repository
2. Setup Node.js environment (v20+)
3. Install dependencies: `npm ci` (clean install)
4. Run linter: `npm run lint`
5. Build application: `npm run build`
6. Create artifact from `.next` directory

**Caching Strategy:**

- Cache `node_modules` based on `package-lock.json` hash
- Cache `.next/cache` for faster subsequent builds

### 4. Deployment Process

**Pre-deployment:**

1. Verify manual trigger or tag push
2. Check user permissions (maintainer role)
3. Validate build artifacts exist

**Deployment Steps:**

1. Connect to server via SSH
2. Create/verify deployment directory
3. Transfer build artifacts (`.next`, `public`, `package.json`, `package-lock.json`)
4. Install production dependencies on server
5. Update PM2 configuration
6. Reload application with PM2
7. Verify application is running
8. Health check on port 3105

**Rollback Strategy:**

- Keep previous deployment in backup directory
- If health check fails, restore previous version
- PM2 maintains process state during updates

### 5. PM2 Configuration

**PM2 Ecosystem File (ecosystem.config.js):**

```javascript
module.exports = {
  apps: [
    {
      name: "vixseg-site",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/home/vixseg/htdocs/vixseg.com.br",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3105,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
```

**PM2 Commands:**

- Start: `pm2 start ecosystem.config.js`
- Reload: `pm2 reload vixseg-site` (zero-downtime)
- Restart: `pm2 restart vixseg-site`
- Status: `pm2 status vixseg-site`
- Logs: `pm2 logs vixseg-site`

## Data Models

### Workflow Execution Context

```typescript
interface WorkflowContext {
  platform: "gitlab" | "github";
  branch: string;
  commitSha: string;
  commitMessage: string;
  triggeredBy: string;
  triggerType: "push" | "manual" | "tag";
  timestamp: Date;
}
```

### Deployment Configuration

```typescript
interface DeploymentConfig {
  serverHost: string;
  serverUser: string;
  serverPort: number;
  appPort: number;
  deployPath: string;
  pm2AppName: string;
  sshPrivateKey: string;
}
```

### Deployment Result

```typescript
interface DeploymentResult {
  success: boolean;
  deploymentId: string;
  timestamp: Date;
  duration: number;
  version?: string;
  error?: string;
  logs: string[];
}
```

## Error Handling

### Build Failures

**Scenarios:**

- Dependency installation fails
- Linting errors detected
- TypeScript compilation errors
- Next.js build fails

**Handling:**

- Stop workflow immediately
- Report detailed error logs
- Prevent deployment stage from running
- Notify via CI/CD interface

### Deployment Failures

**Scenarios:**

- SSH connection timeout
- Authentication failure
- File transfer errors
- PM2 restart fails
- Health check fails

**Handling:**

- Log detailed error information
- Attempt rollback to previous version
- Send failure notification
- Maintain application availability
- Provide troubleshooting steps in logs

### Network Issues

**Scenarios:**

- Server unreachable
- Connection drops during transfer
- Timeout during deployment

**Handling:**

- Retry SSH connection (max 3 attempts)
- Resume file transfer if supported
- Timeout after 5 minutes
- Preserve previous deployment state

## Security Considerations

### Secret Management

**GitLab:**

- Store secrets in GitLab CI/CD Variables
- Mark variables as "Protected" and "Masked"
- Restrict to protected branches only

**GitHub:**

- Store secrets in GitHub Secrets
- Use environment secrets for production
- Enable required reviewers for deployments

### SSH Key Management

**Key Generation:**

```bash
ssh-keygen -t ed25519 -C "ci-cd-deployment" -f vixseg_deploy_key
```

**Server Setup:**

- Add public key to `~/.ssh/authorized_keys` on server
- Set proper permissions (600 for private key, 644 for public key)
- Use dedicated deployment user with limited permissions

**CI/CD Setup:**

- Store private key as secret variable
- Never log or expose private key
- Rotate keys periodically (every 90 days)

### Access Control

**Repository Level:**

- Protect main branch (require pull request reviews)
- Restrict force push
- Require status checks to pass

**Deployment Level:**

- Manual approval required for production
- Only maintainers can trigger deployments
- Log all deployment activities
- Audit trail in CI/CD history

## Testing Strategy

### CI/CD Pipeline Testing

**Local Testing:**

- Use `act` tool to test GitHub Actions locally
- Use GitLab Runner locally for GitLab CI testing
- Validate YAML syntax before committing

**Staging Environment:**

- Test deployment process on staging server first
- Verify PM2 configuration
- Test rollback procedures
- Validate health checks

### Deployment Verification

**Automated Checks:**

1. HTTP health check on port 3105
2. Verify PM2 process is running
3. Check application logs for errors
4. Validate response time < 2 seconds

**Manual Verification:**

- Access website via browser
- Check critical pages load correctly
- Verify no console errors
- Test contact form functionality

### Rollback Testing

**Scenarios to Test:**

- Failed deployment mid-process
- Application crashes after deployment
- Configuration errors
- Database connection issues

**Validation:**

- Previous version restored successfully
- Application accessible within 1 minute
- No data loss
- PM2 process stable

## Monitoring and Logging

### CI/CD Logs

**Build Logs:**

- Dependency installation output
- Linter results
- Build warnings and errors
- Build duration and artifact size

**Deployment Logs:**

- SSH connection status
- File transfer progress
- PM2 command output
- Health check results

### Application Logs

**PM2 Logs:**

- Application stdout/stderr
- Error logs with stack traces
- Access logs
- Performance metrics

**Log Rotation:**

- Rotate logs daily
- Keep last 7 days of logs
- Compress old logs
- Maximum log size: 10MB per file

### Notifications

**Success Notifications:**

- Deployment completed successfully
- Version deployed
- Deployment duration
- Deployed by (user)

**Failure Notifications:**

- Stage where failure occurred
- Error message
- Link to full logs
- Suggested remediation steps

## Performance Considerations

### Build Optimization

- Use npm ci instead of npm install (faster, more reliable)
- Cache node_modules between builds
- Cache Next.js build cache
- Parallel linting and type checking if possible

### Deployment Optimization

- Use rsync for incremental file transfers
- Compress files during transfer
- PM2 reload for zero-downtime deployments
- Keep-alive SSH connections

### Resource Usage

**CI/CD Runner:**

- Memory: 2GB minimum
- CPU: 2 cores recommended
- Disk: 10GB for caching

**Production Server:**

- Memory: 512MB per PM2 instance
- CPU: 1 core minimum
- Disk: 1GB for application + logs

## Maintenance and Operations

### Regular Maintenance

**Weekly:**

- Review deployment logs
- Check PM2 process health
- Monitor disk space usage

**Monthly:**

- Rotate SSH keys if needed
- Update dependencies
- Review and clean old logs
- Test rollback procedures

**Quarterly:**

- Security audit of CI/CD configuration
- Review and update access permissions
- Performance optimization review

### Troubleshooting Guide

**Common Issues:**

1. **Build fails with dependency errors**

   - Clear cache and retry
   - Check package-lock.json for conflicts
   - Verify Node.js version compatibility

2. **SSH connection fails**

   - Verify server is accessible
   - Check SSH key is correctly configured
   - Validate server user permissions

3. **PM2 fails to restart**

   - Check PM2 logs for errors
   - Verify port 3105 is available
   - Check application configuration

4. **Application not accessible after deployment**
   - Verify PM2 process is running
   - Check firewall rules
   - Review application logs
   - Test health check endpoint

## Migration Path

### Initial Setup

1. Generate SSH key pair for CI/CD
2. Configure SSH access on production server
3. Install PM2 on production server
4. Create deployment directory structure
5. Configure CI/CD variables/secrets
6. Test SSH connection manually
7. Perform first manual deployment
8. Configure PM2 ecosystem file
9. Test PM2 restart procedures
10. Enable CI/CD workflows

### Rollout Strategy

**Phase 1: Testing (Week 1)**

- Deploy to staging environment
- Test all workflow scenarios
- Validate rollback procedures

**Phase 2: Soft Launch (Week 2)**

- Enable CI/CD for non-main branches
- Manual deployments only
- Monitor for issues

**Phase 3: Full Deployment (Week 3)**

- Enable all workflows
- Document procedures
- Train team members

## Documentation Requirements

### Repository Documentation

**README.md additions:**

- CI/CD status badges
- Deployment instructions
- Environment variables required
- Troubleshooting section

**DEPLOYMENT.md (new file):**

- Step-by-step deployment guide
- Manual deployment procedures
- Rollback instructions
- Emergency contacts

### Team Training

**Topics to Cover:**

- How to trigger manual deployments
- Reading CI/CD logs
- Rollback procedures
- Security best practices
- Troubleshooting common issues
