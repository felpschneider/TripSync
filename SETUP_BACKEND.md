# 🚀 Guia de Configuração do Backend - TripSync

Este guia vai te ajudar a configurar o backend completo do TripSync com PostgreSQL e Prisma.

## 📋 Pré-requisitos

1. **Node.js 18+** instalado
2. **PostgreSQL** instalado e rodando
3. **pnpm** (ou npm/yarn)

## 🗄️ Passo 1: Configurar PostgreSQL

### Opção A: PostgreSQL Local

1. Instale o PostgreSQL (se ainda não tiver):
   - **Windows**: Baixe em https://www.postgresql.org/download/windows/
   - **Linux**: `sudo apt install postgresql postgresql-contrib`
   - **Mac**: `brew install postgresql`

2. Inicie o PostgreSQL:
   - **Windows**: O serviço inicia automaticamente
   - **Linux/Mac**: `sudo service postgresql start`

3. Crie o banco de dados:
```bash
# Acesse o PostgreSQL
psql -U postgres

# No console do PostgreSQL, crie o banco
CREATE DATABASE tripsync;

# Saia
\q
```

### Opção B: PostgreSQL via Docker (mais fácil)

```bash
docker run --name tripsync-db -e POSTGRES_PASSWORD=senha123 -e POSTGRES_DB=tripsync -p 5432:5432 -d postgres:15
```

## 🔧 Passo 2: Configurar Variáveis de Ambiente

1. Copie o arquivo de exemplo:
```bash
copy env.example.txt .env
```

2. Edite o arquivo `.env` com suas configurações:

```env
# Configure sua conexão PostgreSQL
# Formato: postgresql://usuario:senha@host:porta/nome_do_banco
DATABASE_URL="postgresql://postgres:senha123@localhost:5432/tripsync?schema=public"

# Gere uma chave secreta forte (você pode usar qualquer string aleatória)
JWT_SECRET="sua-chave-secreta-muito-forte-e-aleatoria-aqui-123456"

# URL da API (mantenha como está para desenvolvimento local)
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api/v1"
```

**Importante**: Troque `senha123` pela senha do seu PostgreSQL!

## 📦 Passo 3: Instalar Dependências

```bash
pnpm install
```

## 🗃️ Passo 4: Criar o Banco de Dados

Execute as migrations do Prisma para criar todas as tabelas:

```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar migrations (criar tabelas no banco)
npx prisma migrate dev --name init
```

Isso vai criar todas as tabelas necessárias:
- `users` - Usuários
- `trips` - Viagens
- `trip_members` - Membros das viagens
- `expenses` - Despesas
- `expense_splits` - Divisão de despesas
- `proposals` - Propostas de roteiro
- `votes` - Votos nas propostas
- `tasks` - Tarefas
- `activities` - Feed de atividades
- `invites` - Convites para viagens

## 🎯 Passo 5: Rodar o Projeto

```bash
pnpm dev
```

Acesse: http://localhost:3000

## ✅ Testar se Está Funcionando

1. Acesse http://localhost:3000
2. Clique em "Criar conta"
3. Preencha o formulário:
   - Nome: Seu Nome
   - Email: teste@example.com
   - Senha: senha123
4. Clique em "Cadastrar"
5. Se funcionar, você será redirecionado para o dashboard! 🎉

## 🔍 Comandos Úteis do Prisma

```bash
# Ver o banco de dados no navegador
npx prisma studio

# Resetar o banco (apaga todos os dados!)
npx prisma migrate reset

# Criar nova migration após alterar o schema
npx prisma migrate dev --name nome_da_migration

# Gerar cliente Prisma após mudanças no schema
npx prisma generate
```

## 📊 Visualizar Dados no Banco

O Prisma Studio é uma interface visual incrível:

```bash
npx prisma studio
```

Isso abre http://localhost:5555 onde você pode:
- Ver todas as tabelas
- Adicionar/editar/deletar registros
- Navegar pelas relações

## 🐛 Troubleshooting

### Erro: "Can't reach database server"

**Causa**: PostgreSQL não está rodando ou credenciais erradas.

**Solução**:
1. Verifique se o PostgreSQL está rodando:
   - Windows: Verifique no Gerenciador de Tarefas > Serviços
   - Linux/Mac: `sudo service postgresql status`
2. Verifique as credenciais no `.env`
3. Tente conectar manualmente: `psql -U postgres -d tripsync`

### Erro: "JWT_SECRET is not defined"

**Causa**: Arquivo `.env` não foi criado ou não está sendo lido.

**Solução**:
1. Certifique-se que o arquivo `.env` existe na raiz do projeto
2. Reinicie o servidor (`pnpm dev`)

### Erro: "Prisma Client not generated"

**Causa**: Cliente Prisma não foi gerado após mudanças no schema.

**Solução**:
```bash
npx prisma generate
```

### Porta 5432 já em uso

**Causa**: Já tem um PostgreSQL rodando.

**Solução**:
- Use o PostgreSQL existente, ou
- Mude a porta no Docker: `-p 5433:5432`

## 🔐 Segurança em Produção

Quando for colocar em produção:

1. **Use uma senha forte no PostgreSQL**
2. **Gere uma JWT_SECRET aleatória forte**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **Use HTTPS** (Vercel/Netlify fazem isso automaticamente)
4. **Configure CORS** adequadamente
5. **Use variáveis de ambiente** no servidor de produção

## 🌐 Deploy em Produção

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Importe no Vercel
3. Configure as variáveis de ambiente:
   - `DATABASE_URL`: Use um serviço como [Supabase](https://supabase.com) ou [Neon](https://neon.tech) para PostgreSQL
   - `JWT_SECRET`: Gere uma chave forte
   - `NEXT_PUBLIC_API_BASE_URL`: URL do seu domínio + /api/v1

### Banco de Dados em Produção

Recomendo usar um serviço gerenciado:
- **[Supabase](https://supabase.com)** - Grátis, fácil, inclui PostgreSQL
- **[Neon](https://neon.tech)** - PostgreSQL serverless, grátis
- **[Railway](https://railway.app)** - Deploy completo (app + banco)

## 📚 Estrutura das APIs

Todas as rotas estão em `/app/api/v1/`:

- 🔐 **Autenticação**: `/api/v1/auth/*`
- 🌍 **Viagens**: `/api/v1/trips/*`
- 💰 **Despesas**: `/api/v1/trips/[tripId]/expenses/*`
- 🗳️ **Propostas**: `/api/v1/trips/[tripId]/proposals/*`
- ✅ **Tarefas**: `/api/v1/trips/[tripId]/tasks/*`
- 👥 **Membros**: `/api/v1/trips/[tripId]/members/*`
- 📊 **Atividades**: `/api/v1/trips/[tripId]/activities/*`

## 🎓 Projeto Escolar

Este é um projeto educacional simplificado:
- Autenticação básica (JWT + bcrypt)
- Sem refresh tokens
- Sem rate limiting
- Sem email de confirmação

Para um projeto real, adicione:
- Confirmação de email
- Recuperação de senha
- Rate limiting
- Logs de auditoria
- Backups automáticos

---

**Boa sorte com o projeto!** 🚀

Se tiver problemas, revise este guia passo a passo.

