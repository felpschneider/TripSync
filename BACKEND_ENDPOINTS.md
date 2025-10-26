# Documentação de Endpoints REST - Backend Spring Boot

Este documento lista todos os endpoints que o frontend espera do backend.

## 🔐 Autenticação

Todos os endpoints (exceto `/auth/*`) requerem header:
\`\`\`
Authorization: Bearer {jwt_token}
\`\`\`

---

## 📍 Endpoints

### 1. Autenticação

#### POST `/api/v1/auth/login`
Login de usuário existente.

**Request:**
\`\`\`json
{
  "email": "nathalia@example.com",
  "password": "senha123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "Nathalia Silva",
    "email": "nathalia@example.com"
  }
}
\`\`\`

**Errors:**
- 401: Credenciais inválidas
- 400: Dados inválidos

---

#### POST `/api/v1/auth/signup`
Cadastro de novo usuário.

**Request:**
\`\`\`json
{
  "name": "Nathalia Silva",
  "email": "nathalia@example.com",
  "password": "senha123"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "Nathalia Silva",
    "email": "nathalia@example.com"
  }
}
\`\`\`

**Errors:**
- 409: Email já cadastrado
- 400: Dados inválidos

---

#### GET `/api/v1/auth/invite/{token}`
Valida token de convite.

**Response (200):**
\`\`\`json
{
  "valid": true,
  "tripId": "123"
}
\`\`\`

---

### 2. Viagens

#### GET `/api/v1/trips`
Lista todas as viagens do usuário autenticado.

**Response (200):**
\`\`\`json
[
  {
    "id": "1",
    "title": "Viagem para Campos do Jordão",
    "destination": "Campos do Jordão, SP",
    "startDate": "2025-10-15",
    "endDate": "2025-10-18",
    "budget": 5000.00,
    "totalSpent": 3250.00,
    "memberCount": 6,
    "imageUrl": "/campos-do-jordao.jpg"
  }
]
\`\`\`

---

#### GET `/api/v1/trips/{id}`
Detalhes de uma viagem específica.

**Response (200):**
\`\`\`json
{
  "id": "1",
  "title": "Viagem para Campos do Jordão",
  "destination": "Campos do Jordão, SP",
  "startDate": "2025-10-15",
  "endDate": "2025-10-18",
  "budget": 5000.00,
  "totalSpent": 3250.00,
  "memberCount": 6,
  "imageUrl": "/campos-do-jordao.jpg"
}
\`\`\`

**Errors:**
- 404: Viagem não encontrada
- 403: Usuário não tem acesso

---

#### POST `/api/v1/trips`
Cria nova viagem.

**Request:**
\`\`\`json
{
  "title": "Final de Semana em Ubatuba",
  "destination": "Ubatuba, SP",
  "startDate": "2025-11-05",
  "endDate": "2025-11-07",
  "budget": 3000.00
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "id": "2",
  "title": "Final de Semana em Ubatuba",
  "destination": "Ubatuba, SP",
  "startDate": "2025-11-05",
  "endDate": "2025-11-07",
  "budget": 3000.00,
  "totalSpent": 0,
  "memberCount": 1,
  "imageUrl": null
}
\`\`\`

---

#### PUT `/api/v1/trips/{id}`
Atualiza viagem existente.

**Request:**
\`\`\`json
{
  "title": "Final de Semana em Ubatuba - Atualizado",
  "destination": "Ubatuba, SP",
  "startDate": "2025-11-05",
  "endDate": "2025-11-08",
  "budget": 3500.00
}
\`\`\`

**Response (200):** Viagem atualizada

---

#### DELETE `/api/v1/trips/{id}`
Deleta uma viagem.

**Response (204):** No content

---

### 3. Despesas

#### GET `/api/v1/trips/{tripId}/expenses`
Lista despesas de uma viagem.

**Response (200):**
\`\`\`json
[
  {
    "id": "1",
    "tripId": "1",
    "description": "Hospedagem - Pousada Serra Verde",
    "amount": 1800.00,
    "date": "2025-10-15",
    "paidBy": {
      "id": "1",
      "name": "Nathalia Silva"
    },
    "participants": [
      { "id": "1", "name": "Nathalia Silva" },
      { "id": "2", "name": "João Pedro" }
    ],
    "splitMethod": "equal",
    "category": "accommodation"
  }
]
\`\`\`

---

#### POST `/api/v1/trips/{tripId}/expenses`
Adiciona nova despesa.

**Request:**
\`\`\`json
{
  "description": "Jantar no restaurante",
  "amount": 450.00,
  "date": "2025-10-15",
  "paidById": "2",
  "participantIds": ["1", "2", "3", "4"],
  "splitMethod": "equal",
  "category": "food"
}
\`\`\`

**Response (201):** Despesa criada

**Categorias válidas:**
- `accommodation` - Hospedagem
- `food` - Alimentação
- `transport` - Transporte
- `activity` - Atividade
- `other` - Outro

---

#### PUT `/api/v1/trips/{tripId}/expenses/{id}`
Atualiza despesa existente.

**Request:** Mesmo formato do POST

**Response (200):** Despesa atualizada

---

#### DELETE `/api/v1/trips/{tripId}/expenses/{id}`
Deleta uma despesa.

**Response (204):** No content

---

### 4. Propostas

#### GET `/api/v1/trips/{tripId}/proposals`
Lista propostas de roteiro.

**Response (200):**
\`\`\`json
[
  {
    "id": "1",
    "tripId": "1",
    "title": "Visita ao Horto Florestal",
    "description": "Trilha pela manhã no Horto Florestal, com piquenique no final.",
    "createdBy": {
      "id": "1",
      "name": "Nathalia Silva"
    },
    "createdAt": "2025-09-20T10:30:00Z",
    "votes": {
      "yes": 5,
      "no": 1
    },
    "userVote": "yes",
    "status": "approved"
  }
]
\`\`\`

**Status válidos:**
- `voting` - Em votação
- `approved` - Aprovada
- `rejected` - Rejeitada

---

#### POST `/api/v1/trips/{tripId}/proposals`
Cria nova proposta.

**Request:**
\`\`\`json
{
  "title": "Jantar no Restaurante Libertango",
  "description": "Jantar especial no sábado à noite."
}
\`\`\`

**Response (201):** Proposta criada

---

#### POST `/api/v1/trips/{tripId}/proposals/{proposalId}/vote`
Registra voto em proposta.

**Request:**
\`\`\`json
{
  "vote": "yes"
}
\`\`\`

**Valores válidos:** `"yes"` ou `"no"`

**Response (200):** Proposta com votos atualizados

---

### 5. Tarefas

#### GET `/api/v1/trips/{tripId}/tasks`
Lista tarefas da viagem.

**Response (200):**
\`\`\`json
[
  {
    "id": "1",
    "tripId": "1",
    "title": "Reservar pousada",
    "assignedTo": {
      "id": "1",
      "name": "Nathalia Silva"
    },
    "completed": true,
    "dueDate": "2025-09-30"
  }
]
\`\`\`

---

#### POST `/api/v1/trips/{tripId}/tasks`
Cria nova tarefa.

**Request:**
\`\`\`json
{
  "title": "Comprar mantimentos",
  "assignedToId": "2",
  "dueDate": "2025-10-14"
}
\`\`\`

**Response (201):** Tarefa criada

---

#### PUT `/api/v1/trips/{tripId}/tasks/{id}`
Atualiza tarefa.

**Request:**
\`\`\`json
{
  "title": "Comprar mantimentos - Atualizado",
  "assignedToId": "2",
  "dueDate": "2025-10-14",
  "completed": false
}
\`\`\`

**Response (200):** Tarefa atualizada

---

#### POST `/api/v1/trips/{tripId}/tasks/{id}/toggle`
Alterna status de conclusão da tarefa.

**Response (200):** Tarefa com status atualizado

---

### 6. Membros

#### GET `/api/v1/trips/{tripId}/members`
Lista membros da viagem.

**Response (200):**
\`\`\`json
[
  {
    "id": "1",
    "name": "Nathalia Silva",
    "email": "nathalia@example.com",
    "role": "organizer"
  },
  {
    "id": "2",
    "name": "João Pedro",
    "email": "joao@example.com",
    "role": "member"
  }
]
\`\`\`

**Roles válidos:**
- `organizer` - Organizador (criador da viagem)
- `member` - Membro

---

#### POST `/api/v1/trips/{tripId}/members/invite`
Gera link de convite.

**Request:**
\`\`\`json
{
  "email": "amigo@example.com"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "inviteLink": "https://app.com/invite/abc123xyz"
}
\`\`\`

---

#### DELETE `/api/v1/trips/{tripId}/members/{memberId}`
Remove membro da viagem.

**Response (204):** No content

**Errors:**
- 403: Não pode remover organizador
- 403: Apenas organizador pode remover membros

---

### 7. Atividades

#### GET `/api/v1/trips/{tripId}/activities`
Lista feed de atividades.

**Response (200):**
\`\`\`json
[
  {
    "id": "1",
    "tripId": "1",
    "type": "expense_added",
    "message": "Nathalia adicionou uma despesa: Hospedagem - Pousada Serra Verde",
    "timestamp": "2025-09-28T10:30:00Z",
    "user": {
      "id": "1",
      "name": "Nathalia Silva"
    }
  }
]
\`\`\`

**Tipos de atividade:**
- `expense_added` - Despesa adicionada
- `proposal_created` - Proposta criada
- `task_completed` - Tarefa concluída
- `member_joined` - Membro entrou
- `trip_created` - Viagem criada
- `budget_updated` - Orçamento atualizado

---

### 8. Exportação

#### GET `/api/v1/trips/{tripId}/export/pdf`
Gera PDF com resumo da viagem.

**Response (200):**
\`\`\`json
{
  "url": "https://storage.com/trip-summary-123.pdf"
}
\`\`\`

**Conteúdo do PDF deve incluir:**
- Informações da viagem
- Resumo de orçamento
- Lista de despesas
- Propostas aprovadas
- Tarefas concluídas
- Lista de membros

---

## 🔒 Regras de Negócio

### Permissões

1. **Organizador** (criador da viagem):
   - Pode editar/deletar viagem
   - Pode remover membros
   - Pode gerar convites

2. **Membro**:
   - Pode adicionar despesas
   - Pode criar propostas
   - Pode votar
   - Pode criar tarefas
   - Pode sair da viagem

### Validações

- Datas: `endDate` deve ser >= `startDate`
- Orçamento: Deve ser > 0
- Despesas: Deve ter pelo menos 1 participante
- Tarefas: `dueDate` não pode ser no passado
- Votos: Um usuário só pode votar uma vez por proposta

### Cálculos

- `totalSpent`: Soma de todas as despesas
- `perPerson`: `totalSpent / memberCount`
- Status da proposta:
  - `approved`: `yes > no` e votação encerrada
  - `rejected`: `no >= yes` e votação encerrada
  - `voting`: Ainda em votação

---

## 🧪 Testes Recomendados

1. **Autenticação**
   - Login com credenciais válidas/inválidas
   - Signup com email duplicado
   - Token expirado

2. **Viagens**
   - CRUD completo
   - Acesso não autorizado

3. **Despesas**
   - Cálculo correto de divisão
   - Atualização de `totalSpent`

4. **Propostas**
   - Votação única por usuário
   - Mudança de voto
   - Cálculo de status

5. **Tarefas**
   - Toggle de conclusão
   - Validação de prazo

6. **Membros**
   - Geração de convite único
   - Remoção de membro atualiza despesas

---

## 📊 Modelo de Dados Sugerido

### User
\`\`\`java
@Entity
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String passwordHash;
}
\`\`\`

### Trip
\`\`\`java
@Entity
public class Trip {
    @Id
    private String id;
    private String title;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal budget;
    
    @ManyToOne
    private User organizer;
    
    @ManyToMany
    private List<User> members;
}
\`\`\`

### Expense
\`\`\`java
@Entity
public class Expense {
    @Id
    private String id;
    
    @ManyToOne
    private Trip trip;
    
    private String description;
    private BigDecimal amount;
    private LocalDate date;
    
    @ManyToOne
    private User paidBy;
    
    @ManyToMany
    private List<User> participants;
    
    @Enumerated(EnumType.STRING)
    private SplitMethod splitMethod;
    
    @Enumerated(EnumType.STRING)
    private Category category;
}
\`\`\`

---

**Boa sorte com a implementação do backend!** 🚀
