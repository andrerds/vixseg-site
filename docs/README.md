# Documentação do Projeto

Índice da documentação do VixSeg Site.

## 📚 Documentação Principal

### Para Desenvolvedores

- **[../README.md](../README.md)** - Overview do projeto e quick start
- **[ci-cd-setup.md](ci-cd-setup.md)** - Setup completo do CI/CD (GitHub Actions)
- **[../DEPLOYMENT.md](../DEPLOYMENT.md)** - Guia de deployment e operações
- **[../SECRETS.md](../SECRETS.md)** - Configuração de secrets e segurança

### Informações da Empresa

- **[vixseg.md](vixseg.md)** - Informações institucionais da VixSeg
- **[development-guid.md](development-guid.md)** - Guia de desenvolvimento

### Exemplos e Referências

- **[exemplos/](exemplos/)** - Screenshots e referências visuais

## 🔧 Configuração Opcional

- **[gitlab-optional/](gitlab-optional/)** - Configuração GitLab CI/CD (alternativa ao GitHub Actions)

## 🔐 Arquivos Sensíveis

Alguns arquivos contêm informações sensíveis e **NÃO** devem ser commitados:

- `doc.server.md` - Credenciais do servidor (use `doc.server.md.example` como template)
- Qualquer arquivo `*.credentials.md` ou `*.secrets.md`

Estes arquivos estão no `.gitignore` por segurança.

## 📖 Ordem de Leitura Recomendada

Para novos desenvolvedores:

1. **README.md** (raiz) - Entenda o projeto
2. **ci-cd-setup.md** - Configure o ambiente
3. **SECRETS.md** - Configure secrets
4. **DEPLOYMENT.md** - Aprenda a fazer deploy

## 🆘 Precisa de Ajuda?

- Problemas com deploy? Veja [DEPLOYMENT.md](../DEPLOYMENT.md) → Troubleshooting
- Problemas com secrets? Veja [SECRETS.md](../SECRETS.md) → Troubleshooting
- Quer usar GitLab? Veja [gitlab-optional/README.md](gitlab-optional/README.md)
