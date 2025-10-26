# GitLab CI/CD - Configuração Opcional

Esta pasta contém a configuração do GitLab CI/CD como alternativa ao GitHub Actions.

## ⚠️ Importante

**O projeto está configurado para usar GitHub Actions como padrão.**

Esta configuração GitLab é **OPCIONAL** e só deve ser usada se você:

- Hospedar o código no GitLab
- Quiser usar GitLab CI/CD em vez de GitHub Actions
- Quiser ter ambos os sistemas (GitHub + GitLab)

## Como Usar GitLab CI/CD

### 1. Copiar Arquivo de Configuração

```bash
# Copiar o arquivo para a raiz do projeto
cp docs/gitlab-optional/gitlab-ci.yml .gitlab-ci.yml
```

### 2. Configurar Variáveis no GitLab

Vá para: **Settings → CI/CD → Variables**

Adicione estas variáveis:

| Variable Name     | Value                 | Protected | Masked |
| ----------------- | --------------------- | --------- | ------ |
| `SSH_PRIVATE_KEY` | `<sua-chave-privada>` | ✅        | ✅     |
| `SERVER_HOST`     | `5.75.174.224`        | ✅        | ❌     |
| `SERVER_USER`     | `vixseg`              | ✅        | ❌     |
| `SERVER_PORT`     | `22`                  | ✅        | ❌     |

### 3. Proteger Branch Main

**Settings → Repository → Protected branches**

- Branch: `main`
- Allowed to merge: Maintainers
- Allowed to push: No one

### 4. Fazer Push

```bash
git add .gitlab-ci.yml
git commit -m "feat: add GitLab CI/CD configuration"
git push origin main
```

### 5. Deploy Manual

1. Vá para **CI/CD → Pipelines**
2. Encontre o pipeline da branch main
3. Clique no botão **Play** (▶️) no job de deploy
4. Monitore os logs

## Deploy com Tag de Versão

```bash
# Criar e fazer push de uma tag
git tag v1.0.0
git push origin v1.0.0

# Deploy será automático
```

## Diferenças entre GitHub Actions e GitLab CI/CD

| Recurso        | GitHub Actions                 | GitLab CI/CD     |
| -------------- | ------------------------------ | ---------------- |
| Arquivo Config | `.github/workflows/deploy.yml` | `.gitlab-ci.yml` |
| Secrets        | GitHub Secrets                 | GitLab Variables |
| Manual Deploy  | workflow_dispatch              | when: manual     |
| Runners        | GitHub-hosted                  | GitLab-hosted    |
| Sintaxe        | YAML (GitHub)                  | YAML (GitLab)    |

## Troubleshooting

### Pipeline não inicia

- Verifique se o arquivo `.gitlab-ci.yml` está na raiz
- Verifique a sintaxe YAML
- Veja se há erros em **CI/CD → Pipelines**

### Deploy falha

- Verifique as variáveis em **Settings → CI/CD → Variables**
- Teste conexão SSH manualmente
- Veja logs completos do job

### Secrets não funcionam

- Certifique-se que as variáveis estão marcadas como "Protected"
- Verifique se a branch main está protegida
- SSH_PRIVATE_KEY deve estar marcada como "Masked"

## Documentação Completa

Para mais detalhes sobre GitLab CI/CD, veja:

- [SECRETS.md](../../SECRETS.md) - Seção GitLab
- [DEPLOYMENT.md](../../DEPLOYMENT.md) - Métodos de deploy

## Voltar para GitHub Actions

Se quiser voltar a usar apenas GitHub Actions:

```bash
# Remover arquivo GitLab
rm .gitlab-ci.yml

# Commit
git add .gitlab-ci.yml
git commit -m "chore: remove GitLab CI/CD"
git push origin main
```

---

**Recomendação**: Use GitHub Actions (já configurado) a menos que você tenha um motivo específico para usar GitLab.
