# Next.js para Desenvolvedores Java Backend - Um Guia Prático

> Este guia foi criado para desenvolvedores Java/Spring Boot que estão começando com Next.js e precisam entender os conceitos fundamentais usando analogias familiares.

## 📋 Índice
1. [O que é Next.js?](#1-o-que-é-nextjs-comparação-com-spring-boot)
2. [Estrutura de Pastas = Roteamento Automático](#2-estrutura-de-pastas--roteamento-automático)
3. [Prisma = JPA/Hibernate do JavaScript](#3-prisma--jpahibernate-do-javascript)
4. [Server Components vs Client Components](#4-server-components-vs-client-components)
5. [Como o Fluxo Funciona](#5-como-o-fluxo-funciona-request--response)
6. [Autenticação JWT](#6-autenticação-jwt-igual-ao-spring-security)
7. [Contextos React](#7-contextos-react--injeção-de-dependência)
8. [Resumo dos Conceitos-Chave](#8-resumo-dos-conceitos-chave)
9. [Por que Next.js é Popular?](#9-por-que-nextjs-é-popular)

---

## 1. **O que é Next.js? (Comparação com Spring Boot)**

### Java/Spring Boot:
```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### Next.js:
É um **framework full-stack** para React (JavaScript/TypeScript) que já vem com:
- ✅ Servidor web embutido (como o Tomcat no Spring)
- ✅ Roteamento automático baseado em arquivos
- ✅ API REST integrada (como seus `@RestController`)
- ✅ Renderização server-side (SSR) e client-side (CSR)

**Analogia**: Se Spring Boot é um framework para criar backends em Java, Next.js é um framework para criar **aplicações web completas** (frontend + backend) em JavaScript/TypeScript.

---

## 2. **Estrutura de Pastas = Roteamento Automático**

### 🔴 No Spring Boot (Java):
```java
@RestController
@RequestMapping("/api/v1/trips")
public class TripController {
    
    @GetMapping
    public List<Trip> getAllTrips() { ... }
    
    @PostMapping
    public Trip createTrip(@RequestBody TripDTO dto) { ... }
    
    @GetMapping("/{id}")
    public Trip getTrip(@PathVariable String id) { ... }
}
```

### 🟢 No Next.js (TripSync):
**A estrutura de pastas DEFINE as rotas automaticamente!**

```
app/api/v1/trips/
  ├── route.ts          → /api/v1/trips (GET, POST)
  └── [id]/
      └── route.ts      → /api/v1/trips/{id} (GET, PUT, DELETE)
```

**Exemplo do projeto TripSync:**

```typescript
// app/api/v1/trips/route.ts

// GET /api/v1/trips
export async function GET(request: NextRequest) {
  const user = requireAuth(request)
  const trips = await prisma.trip.findMany({ ... })
  return success(trips)
}

// POST /api/v1/trips
export async function POST(request: NextRequest) {
  const user = requireAuth(request)
  const body = await request.json()
  const trip = await prisma.trip.create({ data: body })
  return success(trip, 201)
}
```

**É como se cada `route.ts` fosse um Controller e os métodos HTTP (GET, POST, PUT, DELETE) fossem os `@GetMapping`, `@PostMapping`, etc.**

### Rotas Dinâmicas com `[parametro]`

```
app/api/v1/trips/[id]/expenses/[expenseId]/route.ts
→ /api/v1/trips/123/expenses/456
```

Equivalente Java:
```java
@GetMapping("/trips/{id}/expenses/{expenseId}")
public Expense getExpense(
    @PathVariable String id,
    @PathVariable String expenseId
) { ... }
```

---

## 3. **Prisma = JPA/Hibernate do JavaScript**

### 🔴 Java com JPA:
```java
@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue
    private String id;
    
    private String title;
    
    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private User organizer;
    
    @OneToMany(mappedBy = "trip")
    private List<Expense> expenses;
}

@Repository
public interface TripRepository extends JpaRepository<Trip, String> {
    List<Trip> findByOrganizerId(String organizerId);
}
```

### 🟢 Next.js com Prisma:
```prisma
// prisma/schema.prisma
model Trip {
  id          String    @id @default(uuid())
  title       String
  organizer   User      @relation(fields: [organizerId], references: [id])
  organizerId String
  expenses    Expense[]
}
```

```typescript
// Uso no código (lib/prisma.ts)
const trips = await prisma.trip.findMany({
  where: { organizerId: user.userId },
  include: { 
    members: true,
    expenses: true 
  }
})
```

**Prisma gera o código TypeScript automaticamente** (como o Hibernate faz com proxies). Você escreve o schema e ele cria os métodos!

### Comparação de Queries

| Operação | JPA (Java) | Prisma (TypeScript) |
|----------|-----------|---------------------|
| Buscar todos | `repository.findAll()` | `prisma.trip.findMany()` |
| Buscar por ID | `repository.findById(id)` | `prisma.trip.findUnique({ where: { id } })` |
| Criar | `repository.save(trip)` | `prisma.trip.create({ data: trip })` |
| Atualizar | `repository.save(trip)` | `prisma.trip.update({ where: { id }, data })` |
| Deletar | `repository.deleteById(id)` | `prisma.trip.delete({ where: { id } })` |
| Buscar com filtro | `repository.findByTitle(title)` | `prisma.trip.findMany({ where: { title } })` |

---

## 4. **Server Components vs Client Components**

### Conceito IMPORTANTE:

No Next.js 13+, você tem **DOIS tipos de componentes**:

#### 🟦 **Server Components** (padrão)
- Rodam **no servidor** (como JSP/Thymeleaf)
- Podem acessar banco de dados diretamente
- Não têm interatividade JavaScript
- Não precisam de `"use client"`

#### 🟨 **Client Components** (marcados com `"use client"`)
- Rodam **no navegador** (JavaScript puro)
- Têm interatividade (botões, formulários, state)
- Fazem requisições HTTP para APIs
- Usam hooks como `useState`, `useEffect`

### Exemplo do projeto TripSync:

```typescript
// app/dashboard/page.tsx
"use client"  // ← Isso marca como Client Component!

export default function DashboardPage() {
  const [trips, setTrips] = useState<any[]>([])
  
  useEffect(() => {
    // Faz requisição HTTP para a API
    const fetchTrips = async () => {
      const tripsData = await api.trips.list()  // ← Chama /api/v1/trips
      setTrips(tripsData)
    }
    fetchTrips()
  }, [])
  
  return <div>{/* Renderiza as trips */}</div>
}
```

**Analogia com Java:**
- **Server Component** = Controller que retorna uma View (JSP) já renderizada
- **Client Component** = SPA (Angular/React) que faz fetch para sua API REST

---

## 5. **Como o Fluxo Funciona (Request → Response)**

### Exemplo: Usuário cria uma viagem no TripSync

#### 1️⃣ **Frontend (Client Component)**
```typescript
// components/trips/create-trip-dialog.tsx
const handleSubmit = async (data) => {
  // Chama a função da camada API
  const newTrip = await api.trips.create(data)
}
```

#### 2️⃣ **Camada API Client (lib/api.ts)**
```typescript
export const api = {
  trips: {
    create: (data: any) =>
      apiRequest<any>("/trips", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  }
}

// Função genérica que adiciona Auth header
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers,
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })
  
  return response.json()
}
```

#### 3️⃣ **API Route (route.ts = Controller)**
```typescript
// app/api/v1/trips/route.ts
export async function POST(request: NextRequest) {
  const user = requireAuth(request)  // ← Middleware de auth
  const body = await request.json()
  
  // Validação
  if (!body.title || !body.destination) {
    return error('Campos obrigatórios faltando', 400)
  }
  
  // Salva no banco via Prisma (= JPA)
  const trip = await prisma.trip.create({
    data: {
      title: body.title,
      destination: body.destination,
      organizerId: user.userId,
      members: {
        create: {
          userId: user.userId,
          role: 'organizer'
        }
      }
    }
  })
  
  return success(trip, 201)  // ← Helper que retorna JSON
}
```

#### 4️⃣ **Prisma (ORM = Hibernate)**
```typescript
// Prisma gera e executa SQL:
INSERT INTO trips (id, title, destination, organizer_id, created_at)
VALUES ('uuid-123', 'Viagem Legal', 'Campos do Jordão', 'user-456', NOW())

INSERT INTO trip_members (trip_id, user_id, role)
VALUES ('uuid-123', 'user-456', 'organizer')
```

### 🎯 **Analogia Completa com Spring Boot:**

```
┌─────────────────────────────────────┐
│  SPRING BOOT (Java)                 │
├─────────────────────────────────────┤
│ Angular/React (frontend separado)   │
│       ↓ HTTP REST                   │
│ @RestController                     │
│       ↓                             │
│ @Service (regras de negócio)       │
│       ↓                             │
│ @Repository (JPA)                   │
│       ↓                             │
│ PostgreSQL                          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  NEXT.JS (TypeScript) - TripSync    │
├─────────────────────────────────────┤
│ Client Component ("use client")     │
│       ↓ HTTP (lib/api.ts)          │
│ API Routes (route.ts)               │
│       ↓                             │
│ Auth/Helpers (lib/auth.ts)         │
│       ↓                             │
│ Prisma (ORM)                        │
│       ↓                             │
│ PostgreSQL                          │
└─────────────────────────────────────┘
```

---

## 6. **Autenticação JWT (igual ao Spring Security)**

### 🔴 Spring Boot:
```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain
    ) {
        String token = extractToken(request);
        
        if (token != null && validateToken(token)) {
            Authentication auth = getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        
        chain.doFilter(request, response);
    }
}

@RestController
public class TripController {
    
    @GetMapping("/trips")
    public List<Trip> getTrips(@AuthenticationPrincipal User user) {
        return tripService.findByUser(user);
    }
}
```

### 🟢 Next.js (TripSync):
```typescript
// lib/auth.ts
export function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('Unauthorized')
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded  // { userId: '123', email: 'user@example.com' }
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Uso no route.ts (equivalente a @PreAuthorize)
export async function GET(request: NextRequest) {
  const user = requireAuth(request)  // ← Valida JWT ou lança erro
  
  const trips = await prisma.trip.findMany({
    where: { organizerId: user.userId }
  })
  
  return success(trips)
}
```

### Fluxo de Login

```typescript
// app/api/v1/auth/login/route.ts
export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  // Busca usuário
  const user = await prisma.user.findUnique({ where: { email } })
  
  // Valida senha (bcrypt)
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return error('Credenciais inválidas', 401)
  }
  
  // Gera JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  
  return success({ token, user })
}
```

---

## 7. **Contextos React = Injeção de Dependência**

### 🔴 Spring Boot:
```java
@Service
public class AuthService {
    
    private User currentUser;
    
    public User getCurrentUser() {
        return currentUser;
    }
    
    public void login(String email, String password) {
        // Lógica de login
        this.currentUser = authenticatedUser;
    }
}

@RestController
public class TripController {
    
    @Autowired
    private AuthService authService;  // ← Injeção de Dependência
    
    @GetMapping("/trips")
    public List<Trip> getTrips() {
        User user = authService.getCurrentUser();
        return tripService.findByUser(user);
    }
}
```

### 🟢 Next.js (TripSync):
```typescript
// contexts/auth-context.tsx (equivalente a @Service)
export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)
  
  const login = async (email: string, password: string) => {
    const { token, user } = await api.auth.login(email, password)
    setAuthToken(token)
    setUser(user)
  }
  
  const logout = () => {
    removeAuthToken()
    setUser(null)
  }
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Uso no componente (equivalente a @Autowired)
export default function DashboardPage() {
  const { user, login, logout } = useAuth()  // ← "Injeta" o contexto
  
  return (
    <div>
      <p>Bem-vindo, {user.name}</p>
      <button onClick={logout}>Sair</button>
    </div>
  )
}
```

**A diferença é que no React o contexto é "injetado" através da árvore de componentes, enquanto no Spring é através do container IoC.**

---

## 8. **Resumo dos Conceitos-Chave**

| Conceito Java/Spring | Equivalente Next.js | No projeto TripSync |
|---------------------|---------------------|---------------------|
| `@SpringBootApplication` | `app/layout.tsx` | Raiz da aplicação |
| `@RestController` | `app/api/**/route.ts` | Endpoints REST (trips, expenses, etc) |
| `@GetMapping("/{id}")` | `app/api/[id]/route.ts` → `GET()` | Rotas dinâmicas com parâmetros |
| `@PostMapping` | `export async function POST()` | Método POST no route.ts |
| `@RequestBody` | `await request.json()` | Parse do body JSON |
| `@PathVariable` | `params.id` | Parâmetros da URL |
| JPA/Hibernate | Prisma ORM | `lib/prisma.ts` |
| `@Entity` | `model` no Prisma Schema | `prisma/schema.prisma` |
| `@Repository` | `prisma.trip.*` | Métodos gerados automaticamente |
| `@Service` | Funções helper | `lib/auth.ts`, `lib/api-helpers.ts` |
| Spring Security | JWT Middleware | `requireAuth()` função |
| `@PreAuthorize` | `requireAuth(request)` | Validação de token |
| JSP/Thymeleaf | Server Components | Componentes sem `"use client"` |
| SPA (Angular/React) | Client Components | Componentes com `"use client"` |
| `@Autowired` | Hooks (useAuth, etc) | `contexts/auth-context.tsx` |
| `application.properties` | `.env` / `env.local` | Variáveis de ambiente |
| Maven/Gradle | npm/pnpm | `package.json` |
| `mvn spring-boot:run` | `npm run dev` | Rodar em desenvolvimento |

---

## 9. **Por que Next.js é Popular?**

### Vantagens

1. **Tudo em um só lugar**: Frontend + Backend no mesmo projeto
   - Não precisa de CORS
   - Compartilha tipos TypeScript entre front e back

2. **TypeScript First**: Tipagem estática (como Java!)
   ```typescript
   interface Trip {
     id: string
     title: string
     budget: number
   }
   ```

3. **Hot Reload**: Muda o código e vê na hora (como Spring DevTools)
   - Desenvolvimento muito mais rápido
   - Não precisa recompilar

4. **SEO amigável**: Server-side rendering
   - Páginas são renderizadas no servidor
   - Google indexa melhor

5. **Deploy fácil**: Vercel (criadora do Next.js) hospeda de graça
   - Git push → Deploy automático
   - CDN global incluída

6. **Performance**: 
   - Code splitting automático
   - Otimização de imagens
   - Lazy loading de componentes

---

## 💡 **Dicas Finais para Desenvolvedores Java**

### Quando você ver isso, pense nisso:

| Código Next.js | Pense em... |
|----------------|-------------|
| `"use client"` | JavaScript que roda no **navegador** (fetch, eventos, state) |
| `route.ts` | `@RestController` (recebe HTTP, retorna JSON) |
| `prisma.*` | `JpaRepository` (acessa banco de dados) |
| `useEffect()` | `@PostConstruct` ou `componentDidMount` (roda quando componente carrega) |
| `useState()` | Variável que re-renderiza a tela quando muda |
| `async/await` | Igual ao Java! Operações assíncronas |
| `Promise` | Similar ao `CompletableFuture` do Java |
| `export default` | Similar ao `public class` (exporta para outros módulos) |
| `import { x } from 'y'` | Similar ao `import` do Java |

### Convenções de Nomenclatura

| Java | TypeScript/React |
|------|------------------|
| `TripController.java` | `route.ts` ou `trip-controller.tsx` |
| `getTripById()` | `getTripById()` ou `get()` no route.ts |
| `TripService` | `tripService.ts` ou hooks customizados |
| `camelCase` para métodos | `camelCase` para funções |
| `PascalCase` para classes | `PascalCase` para componentes React |

### Comandos Úteis

| Maven/Gradle | npm/pnpm | Descrição |
|--------------|----------|-----------|
| `mvn spring-boot:run` | `pnpm dev` | Rodar em desenvolvimento |
| `mvn clean install` | `pnpm install` | Instalar dependências |
| `mvn package` | `pnpm build` | Build para produção |
| `mvn test` | `pnpm test` | Rodar testes |

---

## 📚 **Próximos Passos**

1. **Explore o código do TripSync**:
   - Comece pelos arquivos em `app/api/v1/` (são os "Controllers")
   - Depois veja `lib/prisma.ts` (é o "Repository")
   - Por último, explore os componentes em `app/` e `components/`

2. **Pratique criando um novo endpoint**:
   - Crie um arquivo `app/api/v1/trips/[id]/settings/route.ts`
   - Implemente GET e PUT para configurações da viagem
   - Use `requireAuth()` para proteger a rota

3. **Aprenda mais sobre React Hooks**:
   - `useState` - para state local
   - `useEffect` - para efeitos colaterais
   - `useContext` - para injeção de dependência
   - Custom hooks - para reutilizar lógica

4. **Entenda TypeScript**:
   - É JavaScript com tipos (como Java!)
   - Interfaces, tipos, generics
   - Type safety em tempo de compilação

---

## 🎯 **Conclusão**

Next.js para um dev Java é:
- **Familiar**: Tem conceitos similares (routing, ORM, middleware)
- **Diferente**: É full-stack (front + back junto)
- **Poderoso**: TypeScript + React + Node.js em um framework só
- **Moderno**: Hot reload, deploy fácil, performance otimizada

A maior diferença é que você está escrevendo **frontend E backend** no mesmo projeto, usando JavaScript/TypeScript. Mas os conceitos fundamentais (HTTP, REST, ORM, Auth) são os mesmos que você já conhece do Java!

---

**Criado para o projeto TripSync** 🚀  
Dúvidas? Explore o código e pratique criando novos endpoints!

