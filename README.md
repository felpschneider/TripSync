# 🌍 TripSync - Aplicação Full-Stack para Viagens em Grupo

Aplicação web completa (Full-Stack) para organização de viagens em grupo, desenvolvida com Next.js, PostgreSQL e Prisma.

## 📋 Visão Geral

Sistema **completo** (Frontend + Backend + Banco de Dados) para organizadores de viagens gerenciarem:
- 💰 Orçamento e despesas compartilhadas
- 🗳️ Propostas de roteiro com votação
- ✅ Tarefas e responsabilidades
- 👥 Membros e convites
- 📊 Feed de atividades em tempo real
- 🔐 Autenticação segura (JWT + bcrypt)

**Público-alvo:** Organizadores que coordenam viagens com amigos e precisam de uma ferramenta completa e profissional.

## 🚀 Tecnologias

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI:** React 19 + TypeScript
- **Estilização:** Tailwind CSS v4
- **Componentes:** shadcn/ui
- **PWA:** Manifest configurado para instalação mobile

### Backend
- **API:** Next.js API Routes (REST)
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT (jsonwebtoken)
- **Segurança:** bcrypt para hash de senhas

## 🎨 Design

- **Minimalista e profissional**
- **Cor principal:** Verde #64DD17
- **Mobile-first:** Layout responsivo otimizado para celular
- **Modo claro/escuro:** Suporte completo
- **Idioma:** Português (pt-BR)

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- PostgreSQL (ou Docker)
- pnpm (recomendado) ou npm

### 🚀 Setup Rápido (5 minutos)

1. **Clone o projeto**

```bash
git clone <seu-repositorio>
cd TripSync
```

2. **PostgreSQL via Docker (mais fácil)**

```bash
docker run --name tripsync-db \
  -e POSTGRES_PASSWORD=senha123 \
  -e POSTGRES_DB=tripsync \
  -p 5432:5432 -d postgres:15
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://postgres:senha123@localhost:5432/tripsync?schema=public"
JWT_SECRET="sua-chave-secreta-super-forte"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api/v1"
```

**⚠️ IMPORTANTE:** Troque `senha123` pela sua senha do PostgreSQL!

4. **Instale e configure**

```bash
pnpm install
pnpm run setup
```

5. **Execute o projeto**

```bash
pnpm dev
```

Acesse: http://localhost:3000

### 📚 Documentação Detalhada

- **Setup Rápido:** `INICIO_RAPIDO.md`
- **Setup Completo:** `SETUP_BACKEND.md`
- **Comandos Úteis:** `COMANDOS_UTEIS.md`
- **Implementação:** `IMPLEMENTACAO_BACKEND.md`

## 🗄️ Banco de Dados

### Schema Prisma

O projeto usa **Prisma ORM** com **PostgreSQL**. Schema completo em `prisma/schema.prisma`.

**9 Tabelas:**
- `users` - Usuários
- `trips` - Viagens
- `trip_members` - Membros das viagens
- `expenses` - Despesas
- `expense_splits` - Divisão de despesas
- `proposals` - Propostas de roteiro
- `votes` - Votos
- `tasks` - Tarefas
- `activities` - Feed de atividades
- `invites` - Convites

### Visualizar Dados

```bash
pnpm run db:studio
```

Abre http://localhost:5555 com interface visual do banco.

## 🔌 API Backend

### Arquitetura

O backend está implementado com **Next.js API Routes** em `/app/api/v1/`.

### Principais Endpoints

**Autenticação:**
- `POST /api/v1/auth/signup` - Cadastro
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/invite/{token}` - Validar convite

**Viagens:**
- `GET /api/v1/trips` - Listar
- `POST /api/v1/trips` - Criar
- `GET /api/v1/trips/{id}` - Detalhes
- `PUT /api/v1/trips/{id}` - Atualizar
- `DELETE /api/v1/trips/{id}` - Deletar

**Despesas, Propostas, Tarefas, Membros, Atividades:**
- Endpoints completos em `/api/v1/trips/{tripId}/...`

📖 **Documentação completa:** `BACKEND_ENDPOINTS.md`

### Segurança

- ✅ **JWT** - Tokens com expiração de 7 dias
- ✅ **bcrypt** - Hash de senhas com 10 salt rounds
- ✅ **Validações** - Entrada validada em todos os endpoints
- ✅ **Permissões** - Controle de acesso (organizer vs member)

## 🧪 Testando

### Via Interface
1. Acesse http://localhost:3000
2. Crie uma conta
3. Crie uma viagem
4. Adicione despesas, propostas, tarefas
5. Convide membros

### Via Prisma Studio
```bash
pnpm run db:studio
```
Visualize e edite dados em tempo real em http://localhost:5555

### Via cURL
```bash
# Cadastro
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@test.com","password":"123456"}'
```

## 📱 PWA (Progressive Web App)

O app pode ser instalado em dispositivos móveis:

1. Acesse pelo navegador mobile
2. Toque em "Adicionar à tela inicial"
3. Use como app nativo

Configuração em: `public/manifest.json`

## ✅ Funcionalidades

- ✅ **Autenticação** - Cadastro e login seguros
- ✅ **Viagens** - CRUD completo
- ✅ **Despesas** - Adicionar e dividir custos
- ✅ **Propostas** - Criar e votar
- ✅ **Tarefas** - Gerenciar responsabilidades
- ✅ **Membros** - Convidar via link
- ✅ **Atividades** - Feed em tempo real
- ✅ **Responsivo** - Mobile-first
- ✅ **Modo Escuro** - Tema claro/escuro
- ✅ **PWA** - Instalável como app

## 📂 Estrutura do Projeto

```
TripSync/
├── 📱 Frontend
│   ├── app/
│   │   ├── page.tsx                # Login/Signup
│   │   ├── dashboard/              # Dashboard
│   │   └── trips/[id]/             # Páginas da viagem
│   ├── components/                 # Componentes React
│   └── contexts/
│       └── auth-context.tsx        # Autenticação
│
├── 🔌 Backend
│   ├── app/api/v1/                 # API Routes
│   │   ├── auth/                   # Autenticação
│   │   └── trips/                  # Endpoints
│   └── lib/
│       ├── prisma.ts               # Cliente Prisma
│       ├── auth.ts                 # JWT + bcrypt
│       └── api-helpers.ts          # Helpers
│
├── 🗄️ Banco de Dados
│   └── prisma/
│       └── schema.prisma           # Schema
│
└── 📚 Documentação
    ├── INICIO_RAPIDO.md
    ├── SETUP_BACKEND.md
    ├── COMANDOS_UTEIS.md
    └── IMPLEMENTACAO_BACKEND.md
```

## 🚢 Deploy

### Vercel (Recomendado)

1. Push para GitHub
2. Importe no Vercel
3. Configure variáveis:
   - `DATABASE_URL` - Use [Supabase](https://supabase.com) ou [Neon](https://neon.tech)
   - `JWT_SECRET` - Gere uma chave forte
   - `NEXT_PUBLIC_API_BASE_URL` - Seu domínio + /api/v1
4. Deploy automático! 🚀

### Banco de Dados em Produção

Recomendado:
- **[Supabase](https://supabase.com)** - Grátis, PostgreSQL
- **[Neon](https://neon.tech)** - PostgreSQL serverless
- **[Railway](https://railway.app)** - App + Banco completo

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                    # Rodar projeto
pnpm build                  # Build produção

# Banco de Dados
pnpm run db:studio          # GUI do banco
pnpm run db:migrate         # Criar migration
pnpm run db:reset           # Resetar banco

# Setup
pnpm run setup              # Setup completo
```

📖 **Mais comandos:** `COMANDOS_UTEIS.md`

## 🐛 Troubleshooting

### "Can't reach database server"
- PostgreSQL não está rodando
- Senha errada no `.env`
- Verifique: `docker ps` ou `psql -U postgres`

### "JWT_SECRET is not defined"
- Arquivo `.env` não existe
- Crie o `.env` na raiz do projeto

### Página em branco após login
- Backend não está rodando
- Rode: `pnpm dev`

📖 **Mais soluções:** `SETUP_BACKEND.md`

## 📚 Documentação

- 📖 **Setup Rápido** - `INICIO_RAPIDO.md`
- 📖 **Setup Completo** - `SETUP_BACKEND.md`
- 📖 **Comandos** - `COMANDOS_UTEIS.md`
- 📖 **Implementação** - `IMPLEMENTACAO_BACKEND.md`
- 📖 **API Endpoints** - `BACKEND_ENDPOINTS.md`
- 📖 **Testes** - `TESTING_GUIDE.md`

## 🎓 Para Projeto Escolar

Este projeto está **completo** para apresentação acadêmica:
- ✅ Frontend profissional
- ✅ Backend próprio (API REST)
- ✅ Banco de dados PostgreSQL
- ✅ Autenticação segura
- ✅ Documentação completa
- ✅ Funcional e testável

## 📄 Licença

Projeto educacional desenvolvido para a Univesp.

---

**Desenvolvido com ❤️ para organizadores de viagens em grupo** 🚀
