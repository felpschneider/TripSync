# Viagem em Grupo - Frontend MVP

Aplicativo web responsivo (PWA) para organização de viagens em grupo, desenvolvido com React, Next.js e Tailwind CSS.

## 📋 Visão Geral

Este é o frontend de um sistema completo para organizadores informais de viagens gerenciarem:
- Orçamento e despesas compartilhadas
- Propostas de roteiro com votação
- Tarefas e responsabilidades
- Membros e convites
- Feed de atividades em tempo real

**Público-alvo:** Organizadores como Nathalia em Mogi das Cruzes que coordenam viagens com amigos.

## 🚀 Tecnologias

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19 + TypeScript
- **Estilização:** Tailwind CSS v4
- **Componentes:** shadcn/ui
- **PWA:** Manifest configurado para instalação mobile
- **API:** REST (configurável para seu backend Spring Boot)

## 🎨 Design

- **Minimalista e profissional**
- **Cor principal:** Verde #64DD17
- **Mobile-first:** Layout responsivo otimizado para celular
- **Modo claro/escuro:** Suporte completo
- **Idioma:** Português (pt-BR)

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Passos

1. **Clone ou baixe o projeto**

\`\`\`bash
# Se usando Git
git clone <seu-repositorio>
cd viagem-grupo

# Ou baixe o ZIP e extraia
\`\`\`

2. **Instale as dependências**

\`\`\`bash
npm install
\`\`\`

3. **Configure a URL do backend**

Crie um arquivo `.env.local` na raiz do projeto:

\`\`\`env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
\`\`\`

4. **Execute o projeto**

\`\`\`bash
npm run dev
\`\`\`

Acesse: `http://localhost:3000`

## 🔌 Conectando ao Backend

### Configuração

O frontend está configurado para consumir uma API REST. A URL base é definida em:

\`\`\`typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1"
\`\`\`

### Endpoints Esperados

O frontend faz requisições para os seguintes endpoints. Implemente-os no seu backend Spring Boot:

#### Autenticação

\`\`\`
POST   /auth/login
Body:  { "email": "string", "password": "string" }
Response: { "token": "string", "user": { "id": "string", "name": "string", "email": "string" } }

POST   /auth/signup
Body:  { "email": "string", "password": "string", "name": "string" }
Response: { "token": "string", "user": { "id": "string", "name": "string", "email": "string" } }

GET    /auth/invite/{token}
Response: { "valid": boolean, "tripId": "string" }
\`\`\`

#### Viagens

\`\`\`
GET    /trips
Response: Array<Trip>

GET    /trips/{id}
Response: Trip

POST   /trips
Body:  { "title": "string", "destination": "string", "startDate": "string", "endDate": "string", "budget": number }
Response: Trip

PUT    /trips/{id}
Body:  { "title": "string", "destination": "string", "startDate": "string", "endDate": "string", "budget": number }
Response: Trip

DELETE /trips/{id}
Response: void
\`\`\`

#### Despesas

\`\`\`
GET    /trips/{tripId}/expenses
Response: Array<Expense>

GET    /trips/{tripId}/expenses/{id}
Response: Expense

POST   /trips/{tripId}/expenses
Body:  { 
  "description": "string", 
  "amount": number, 
  "date": "string", 
  "paidById": "string",
  "participantIds": ["string"],
  "category": "string",
  "splitMethod": "string"
}
Response: Expense

PUT    /trips/{tripId}/expenses/{id}
Body:  { ... }
Response: Expense

DELETE /trips/{tripId}/expenses/{id}
Response: void
\`\`\`

#### Propostas

\`\`\`
GET    /trips/{tripId}/proposals
Response: Array<Proposal>

GET    /trips/{tripId}/proposals/{id}
Response: Proposal

POST   /trips/{tripId}/proposals
Body:  { "title": "string", "description": "string" }
Response: Proposal

POST   /trips/{tripId}/proposals/{proposalId}/vote
Body:  { "vote": "yes" | "no" }
Response: Proposal
\`\`\`

#### Tarefas

\`\`\`
GET    /trips/{tripId}/tasks
Response: Array<Task>

POST   /trips/{tripId}/tasks
Body:  { "title": "string", "assignedToId": "string", "dueDate": "string" }
Response: Task

PUT    /trips/{tripId}/tasks/{id}
Body:  { "title": "string", "assignedToId": "string", "dueDate": "string", "completed": boolean }
Response: Task

POST   /trips/{tripId}/tasks/{id}/toggle
Response: Task
\`\`\`

#### Membros

\`\`\`
GET    /trips/{tripId}/members
Response: Array<Member>

POST   /trips/{tripId}/members/invite
Body:  { "email": "string" }
Response: { "inviteLink": "string" }

DELETE /trips/{tripId}/members/{memberId}
Response: void
\`\`\`

#### Atividades

\`\`\`
GET    /trips/{tripId}/activities
Response: Array<Activity>
\`\`\`

#### Exportação

\`\`\`
GET    /trips/{tripId}/export/pdf
Response: { "url": "string" }
\`\`\`

### Autenticação JWT

O frontend envia o token JWT no header de todas as requisições autenticadas:

\`\`\`
Authorization: Bearer {token}
\`\`\`

O token é armazenado no `localStorage` após login/signup.

## 🧪 Modo Demo (Dados Mock)

O projeto inclui dados de exemplo em `lib/mock-data.ts` para desenvolvimento local sem backend.

Para usar dados reais:
1. Configure `NEXT_PUBLIC_API_BASE_URL` no `.env.local`
2. Implemente os endpoints no backend
3. O frontend automaticamente usará a API real

## 📱 PWA (Progressive Web App)

O app pode ser instalado em dispositivos móveis:

1. Acesse pelo navegador mobile
2. Toque em "Adicionar à tela inicial"
3. Use como app nativo

Configuração em: `public/manifest.json`

## 🎯 Critérios de Aceitação MVP

- ✅ Criar uma viagem com título, destino, datas e orçamento
- ✅ Adicionar 3 despesas e visualizar cálculo por pessoa
- ✅ Criar 2 propostas de roteiro e votar
- ✅ Atribuir tarefas a membros
- ✅ Visualizar feed de atividades
- ✅ Convidar membros via link
- ✅ Layout responsivo mobile-first
- ✅ Modo claro/escuro

## 🧪 Testes Manuais

### Cenário 1: Criar e Gerenciar Viagem

1. Faça login com qualquer email/senha (modo demo)
2. Clique em "Nova Viagem"
3. Preencha: "Campos do Jordão", datas futuras, orçamento R$ 5000
4. Verifique que a viagem aparece no dashboard

### Cenário 2: Adicionar Despesas

1. Entre na viagem criada
2. Vá para aba "Despesas"
3. Clique "Nova Despesa"
4. Adicione: "Hospedagem", R$ 1800, selecione participantes
5. Adicione mais 2 despesas
6. Verifique que o resumo de orçamento atualiza corretamente
7. Confirme que "Média por Pessoa" está correta

### Cenário 3: Propostas e Votação

1. Vá para aba "Propostas"
2. Crie proposta: "Visita ao Horto Florestal"
3. Crie segunda proposta: "Jantar no Restaurante X"
4. Vote "A favor" na primeira
5. Vote "Contra" na segunda
6. Verifique que os votos aparecem corretamente

### Cenário 4: Tarefas

1. Vá para aba "Tarefas"
2. Crie tarefa: "Reservar pousada", atribua a um membro
3. Marque como concluída
4. Verifique que aparece na aba "Concluídas"

### Cenário 5: Membros e Convites

1. Vá para aba "Membros"
2. Clique "Convidar Membro"
3. Digite um email
4. Copie o link gerado
5. Verifique que pode compartilhar

## 📂 Estrutura do Projeto

\`\`\`
viagem-grupo/
├── app/                      # Páginas Next.js (App Router)
│   ├── page.tsx             # Login/Signup
│   ├── dashboard/           # Dashboard de viagens
│   └── trips/[id]/          # Páginas da viagem
│       ├── page.tsx         # Painel principal
│       ├── expenses/        # Gestão de despesas
│       ├── proposals/       # Propostas e votação
│       ├── tasks/           # Tarefas
│       ├── members/         # Membros
│       └── activity/        # Feed de atividades
├── components/              # Componentes React
│   ├── auth/               # Login/Signup forms
│   ├── trips/              # Cards e dialogs de viagens
│   ├── expenses/           # Componentes de despesas
│   ├── proposals/          # Componentes de propostas
│   ├── tasks/              # Componentes de tarefas
│   ├── members/            # Componentes de membros
│   ├── activity/           # Feed de atividades
│   ├── layout/             # Header, Nav
│   └── ui/                 # Componentes base (shadcn)
├── contexts/               # React Context (Auth)
├── lib/                    # Utilitários
│   ├── api.ts             # Cliente REST API
│   ├── mock-data.ts       # Dados de exemplo
│   └── utils.ts           # Helpers
├── public/                 # Assets estáticos
│   ├── manifest.json      # PWA manifest
│   └── *.jpg              # Imagens
└── README.md              # Esta documentação
\`\`\`

## 🚢 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Importe no Vercel
3. Configure a variável de ambiente:
   - `NEXT_PUBLIC_API_BASE_URL`: URL do seu backend em produção
4. Deploy automático

### Netlify

\`\`\`bash
npm run build
\`\`\`

Faça upload da pasta `.next` ou conecte ao Git.

### Build Estático

\`\`\`bash
npm run build
npm run start
\`\`\`

## 🔧 Desenvolvimento

### Adicionar Nova Funcionalidade

1. Crie componentes em `components/`
2. Adicione páginas em `app/`
3. Atualize `lib/api.ts` com novos endpoints
4. Teste com dados mock primeiro
5. Conecte ao backend real

### Customizar Cores

Edite `app/globals.css`:

\`\`\`css
:root {
  --primary: oklch(0.78 0.21 130); /* Verde #64DD17 */
  /* ... outras cores ... */
}
\`\`\`

## 📝 Notas para o Backend

### Segurança

- Implemente validação de JWT em todos os endpoints protegidos
- Valide que o usuário tem permissão para acessar a viagem
- Sanitize inputs para prevenir SQL injection
- Use HTTPS em produção

### CORS

Configure CORS no Spring Boot para aceitar requisições do frontend:

\`\`\`java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000", "https://seu-dominio.com")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
\`\`\`

### Modelos de Dados

Crie entidades JPA correspondentes aos tipos TypeScript em `lib/api.ts`.

## 🐛 Troubleshooting

### Erro de CORS

- Verifique configuração CORS no backend
- Confirme que `NEXT_PUBLIC_API_BASE_URL` está correto

### Token Expirado

- Implemente refresh token no backend
- Adicione lógica de renovação no frontend

### Imagens não carregam

- Verifique que as imagens estão em `public/`
- Use caminhos absolutos: `/imagem.jpg`

## 📞 Suporte

Para dúvidas sobre o frontend, consulte:
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## 📄 Licença

Este projeto foi desenvolvido como MVP para demonstração.

---

**Desenvolvido para Nathalia e organizadores de viagens em grupo** 🚀
