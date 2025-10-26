# Fix GitHub Access Issue

## Problema

Você está autenticado com a chave SSH errada. O GitHub está reconhecendo você como `andrerds/rms-corretora-app` mas você precisa acessar `andrerds/vixseg-site`.

## Solução 1: Usar HTTPS em vez de SSH (Mais Rápido)

```bash
# Mudar remote para HTTPS
git remote set-url origin https://github.com/andrerds/vixseg-site.git

# Fazer push
git push -u origin main

# Você será solicitado a fazer login com suas credenciais GitHub
```

## Solução 2: Configurar SSH Key Específica para Este Repo

### Passo 1: Verificar suas chaves SSH

```bash
# Listar chaves SSH
ls -la ~/.ssh/

# Ver qual chave está sendo usada
ssh-add -l
```

### Passo 2: Gerar nova chave SSH para vixseg (se necessário)

```bash
# Gerar nova chave
ssh-keygen -t ed25519 -C "seu-email@example.com" -f ~/.ssh/id_ed25519_vixseg

# Adicionar ao ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_vixseg
```

### Passo 3: Adicionar chave pública ao GitHub

```bash
# Copiar chave pública
cat ~/.ssh/id_ed25519_vixseg.pub

# Ou no Windows
type %USERPROFILE%\.ssh\id_ed25519_vixseg.pub
```

1. Vá para GitHub → Settings → SSH and GPG keys
2. Click "New SSH key"
3. Cole a chave pública
4. Salve

### Passo 4: Configurar SSH config para usar chave específica

Crie/edite o arquivo `~/.ssh/config`:

```bash
# No Linux/Mac
nano ~/.ssh/config

# No Windows
notepad %USERPROFILE%\.ssh\config
```

Adicione:

```
# Configuração para vixseg-site
Host github.com-vixseg
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_vixseg
    IdentitiesOnly yes

# Configuração padrão do GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

### Passo 5: Atualizar remote do git

```bash
# Mudar URL do remote para usar o host específico
git remote set-url origin git@github.com-vixseg:andrerds/vixseg-site.git

# Verificar
git remote -v

# Testar conexão
ssh -T git@github.com-vixseg

# Fazer push
git push -u origin main
```

## Solução 3: Usar Token de Acesso Pessoal (PAT)

### Passo 1: Criar Token no GitHub

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Selecione scopes: `repo` (full control)
4. Copie o token (você só verá uma vez!)

### Passo 2: Usar token para push

```bash
# Mudar para HTTPS
git remote set-url origin https://github.com/andrerds/vixseg-site.git

# Fazer push (use o token como senha)
git push -u origin main

# Username: andrerds
# Password: <cole-seu-token-aqui>
```

### Passo 3: Salvar credenciais (opcional)

```bash
# Configurar git para lembrar credenciais
git config --global credential.helper store

# Próximo push salvará as credenciais
git push -u origin main
```

## Solução 4: Verificar Permissões do Repositório

Se você não é o dono do repositório:

1. Verifique se você tem permissão de escrita
2. Peça ao dono para adicionar você como colaborador:
   - Repositório → Settings → Collaborators → Add people

## Verificação Rápida

```bash
# Ver configuração atual
git remote -v
git config --list | grep remote

# Testar conexão SSH
ssh -T git@github.com

# Ver qual chave está sendo usada
ssh -vT git@github.com 2>&1 | grep "identity file"
```

## Recomendação

Para este projeto, recomendo usar **Solução 1 (HTTPS)** por ser mais simples e rápida:

```bash
git remote set-url origin https://github.com/andrerds/vixseg-site.git
git push -u origin main
```

Você pode sempre voltar para SSH depois se preferir.
