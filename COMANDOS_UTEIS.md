# ⚡ Comandos Úteis - TripSync

Referência rápida de comandos para o projeto.

## 🚀 Desenvolvimento

```bash
# Rodar o projeto em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Rodar em produção
pnpm start

# Linter
pnpm lint
```

## 🗄️ Banco de Dados

```bash
# Gerar cliente Prisma (após alterar schema)
pnpm run db:generate
# ou
npx prisma generate

# Criar migration (após alterar schema)
pnpm run db:migrate
# ou
npx prisma migrate dev --name nome_da_migration

# Aplicar schema sem migration (dev only)
pnpm run db:push
# ou
npx prisma db push

# Abrir Prisma Studio (GUI do banco)
pnpm run db:studio
# ou
npx prisma studio

# Resetar banco (APAGA TUDO!)
pnpm run db:reset
# ou
npx prisma migrate reset

# Setup inicial completo
pnpm run setup
# ou
npx prisma generate && npx prisma migrate dev --name init
```

## 🐳 Docker (PostgreSQL)

```bash
# Criar container PostgreSQL
docker run --name tripsync-db \
  -e POSTGRES_PASSWORD=senha123 \
  -e POSTGRES_DB=tripsync \
  -p 5432:5432 \
  -d postgres:15

# Parar container
docker stop tripsync-db

# Iniciar container
docker start tripsync-db

# Ver logs
docker logs tripsync-db

# Remover container
docker rm -f tripsync-db

# Entrar no PostgreSQL do container
docker exec -it tripsync-db psql -U postgres -d tripsync
```

## 🔍 PostgreSQL (Comandos SQL)

```bash
# Conectar ao PostgreSQL local
psql -U postgres -d tripsync

# Dentro do psql:
\dt              # Listar tabelas
\d users         # Descrever tabela users
\l               # Listar databases
\q               # Sair

# Criar banco
CREATE DATABASE tripsync;

# Deletar banco (cuidado!)
DROP DATABASE tripsync;
```

## 🧪 Testes com cURL

### Autenticação

```bash
# Cadastro
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste User","email":"teste@example.com","password":"senha123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@example.com","password":"senha123"}'

# Salve o token retornado!
```

### Viagens (substitua SEU_TOKEN)

```bash
# Listar viagens
curl http://localhost:3000/api/v1/trips \
  -H "Authorization: Bearer SEU_TOKEN"

# Criar viagem
curl -X POST http://localhost:3000/api/v1/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "title":"Viagem Teste",
    "destination":"São Paulo",
    "startDate":"2025-12-01",
    "endDate":"2025-12-05",
    "budget":5000
  }'

# Buscar viagem específica (substitua TRIP_ID)
curl http://localhost:3000/api/v1/trips/TRIP_ID \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 📦 Dependências

```bash
# Instalar todas as dependências
pnpm install

# Adicionar nova dependência
pnpm add nome-do-pacote

# Adicionar dependência de desenvolvimento
pnpm add -D nome-do-pacote

# Remover dependência
pnpm remove nome-do-pacote

# Atualizar dependências
pnpm update
```

## 🔧 Git

```bash
# Ver status
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "Mensagem do commit"

# Push
git push origin main

# Ver histórico
git log --oneline

# Criar branch
git checkout -b nome-da-branch

# Voltar para main
git checkout main
```

## 🌐 Variáveis de Ambiente

```bash
# Criar .env (Windows)
echo. > .env

# Criar .env (Linux/Mac)
touch .env

# Editar .env
code .env  # VS Code
notepad .env  # Notepad (Windows)
nano .env  # Nano (Linux/Mac)
```

Conteúdo do `.env`:
```env
DATABASE_URL="postgresql://postgres:senha123@localhost:5432/tripsync?schema=public"
JWT_SECRET="sua-chave-secreta-super-forte"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api/v1"
```

## 🐛 Troubleshooting

```bash
# Limpar cache do Next.js
rm -rf .next
# ou (Windows)
rmdir /s .next

# Limpar node_modules e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Verificar se PostgreSQL está rodando
# Windows
tasklist | findstr postgres

# Linux/Mac
ps aux | grep postgres

# Verificar porta 3000
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Matar processo na porta 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
kill -9 $(lsof -t -i:3000)
```

## 📊 Prisma Studio

```bash
# Abrir Prisma Studio
pnpm run db:studio

# Acesse: http://localhost:5555

# Funcionalidades:
# - Ver todas as tabelas
# - Adicionar registros
# - Editar registros
# - Deletar registros
# - Ver relações
```

## 🔍 Logs e Debug

```bash
# Ver logs do Next.js
# (já aparecem automaticamente com pnpm dev)

# Ver logs do PostgreSQL (Docker)
docker logs -f tripsync-db

# Ver logs do Prisma
# Adicione ao .env:
DEBUG="prisma:*"

# Então rode:
pnpm dev
```

## 📱 Acessar de Outro Dispositivo

```bash
# 1. Descubra seu IP local
# Windows
ipconfig

# Linux/Mac
ifconfig

# 2. No .env, adicione:
NEXT_PUBLIC_API_BASE_URL="http://SEU_IP:3000/api/v1"

# 3. Acesse de outro dispositivo:
http://SEU_IP:3000
```

## 🚀 Deploy (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod
```

## 📝 Úteis do Sistema

```bash
# Ver versão do Node
node -v

# Ver versão do npm/pnpm
pnpm -v

# Ver versão do PostgreSQL
psql --version

# Ver versão do Docker
docker --version

# Limpar terminal
clear  # Linux/Mac
cls    # Windows
```

## 🎯 Workflow Típico

```bash
# 1. Iniciar PostgreSQL
docker start tripsync-db

# 2. Rodar projeto
pnpm dev

# 3. Abrir Prisma Studio (em outro terminal)
pnpm run db:studio

# 4. Fazer alterações no código...

# 5. Se alterar schema.prisma:
pnpm run db:migrate

# 6. Commit
git add .
git commit -m "Descrição das mudanças"
git push
```

## 🔐 Gerar JWT Secret Forte

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32

# Online
# https://generate-secret.vercel.app/32
```

## 📚 Links Úteis

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

---

## 💡 Dicas

1. **Sempre rode `pnpm run db:generate` após alterar `schema.prisma`**
2. **Use Prisma Studio para debug do banco**
3. **Mantenha o PostgreSQL rodando enquanto desenvolve**
4. **Commit frequentemente**
5. **Leia os logs de erro com atenção**

---

**Salve este arquivo para referência rápida! 📌**

