# 📚 Guia do Storybook - TripSync

## O que é o Storybook?

O **Storybook** é uma ferramenta que permite visualizar e interagir com seus componentes React de forma **isolada**, sem precisar rodar a aplicação inteira. É como um "catálogo interativo" dos seus componentes.

### Analogia para Devs Java

Pense no Storybook como uma **API de testes visuais** ou um **Swagger UI para componentes**:

- **Swagger** → Testa seus endpoints REST
- **Storybook** → Testa seus componentes React

## 🚀 Como Usar

### Iniciar o Storybook

```bash
pnpm storybook
```

O Storybook abrirá automaticamente em: **http://localhost:6006**

### Parar o Storybook

Pressione `Ctrl + C` no terminal onde está rodando.

## 📂 Estrutura dos Arquivos

```
TripSync/
├── components/
│   ├── ui/
│   │   ├── button.tsx           # Componente
│   │   └── button.stories.tsx   # Stories do componente
│   ├── trips/
│   │   ├── trip-card.tsx
│   │   └── trip-card.stories.tsx
│   └── ...
├── .storybook/
│   ├── main.ts                  # Configuração principal
│   └── preview.ts               # Configuração de preview (CSS, etc)
└── stories/
    └── TripSync.mdx             # Documentação principal
```

## 📝 Como Funcionam as Stories

### Arquivo de Story (.stories.tsx)

Cada componente tem um arquivo `.stories.tsx` que define diferentes **variações** (stories) do componente:

```typescript
// components/ui/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta = {
  title: 'UI/Button',           // Onde aparece na sidebar
  component: Button,             // Componente sendo documentado
  tags: ['autodocs'],            // Gera documentação automática
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Cada export é uma "story" (variação do componente)
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
}
```

### Analogia com Testes

```java
// Em Java/JUnit você faria:
@Test
public void testButtonDefault() { ... }

@Test
public void testButtonDestructive() { ... }
```

```typescript
// No Storybook você faz:
export const Default: Story = { ... }
export const Destructive: Story = { ... }
```

## 🎨 Componentes Documentados

### Componentes UI Base (Pasta `ui/`)

✅ **Button** - Botões com 6 variantes
- Default, Secondary, Outline, Ghost, Destructive, Link
- Tamanhos: Small, Default, Large, Icon

✅ **Card** - Cards para organização de conteúdo
- Básico, com Footer, com Action

✅ **Badge** - Etiquetas e indicadores
- Status de viagens, orçamento, roles

✅ **Input** - Campos de entrada
- Text, Email, Password, Number, Date, Search

### Componentes TripSync (Funcionalidades)

✅ **TripCard** - Card de viagem completo
- Diferentes níveis de orçamento
- Grupos pequenos e grandes

✅ **TaskItem** - Item de tarefa
- Pendente, Concluída, Atrasada, Prazo próximo

✅ **MemberCard** - Card de membro
- Organizador, Membro, Você
- Com opção de remover

✅ **ProposalCard** - Card de proposta com votação
- Em votação, Aprovada, Rejeitada
- Com/sem voto do usuário

✅ **BudgetSummary** - Resumo financeiro
- 4 cards com métricas: Orçamento, Gasto, Restante, Média

## 🔧 Recursos do Storybook

### 1. **Controls** (Controles Interativos)

No painel inferior, você pode modificar as props do componente em tempo real:

- Mudar texto
- Alternar variantes
- Habilitar/desabilitar
- Trocar tamanhos

### 2. **Actions** (Eventos)

Veja os eventos disparados pelos componentes (clicks, onChange, etc):

```typescript
args: {
  onVote: fn(),  // Registra quando a função é chamada
}
```

### 3. **Accessibility** (A11y)

Verifica automaticamente problemas de acessibilidade:
- Contraste de cores
- Labels em inputs
- Atributos ARIA

### 4. **Docs** (Documentação Automática)

Gera documentação a partir do TypeScript:
- Props e tipos
- Valores padrão
- Descrições

### 5. **Viewport** (Responsividade)

Teste o componente em diferentes tamanhos de tela:
- Mobile
- Tablet
- Desktop

## 💡 Quando Usar o Storybook?

### ✅ BOM para:

1. **Desenvolver componentes isolados**
   - Foco em um componente por vez
   - Sem precisar navegar pela app

2. **Testar diferentes estados**
   - Loading, Error, Success
   - Vazio, Com dados, Cheio

3. **Documentar para o time**
   - Novos devs veem os componentes disponíveis
   - Designers validam a implementação

4. **Regressão visual**
   - Ver se mudanças quebraram algo visualmente

### ❌ NÃO substitui:

- Testes unitários (Jest/Vitest)
- Testes de integração
- Testes E2E (Playwright)

## 🎯 Criando Novas Stories

### Passo a Passo

1. **Crie o componente** (se ainda não existe)

```typescript
// components/example/my-component.tsx
export function MyComponent({ title }: { title: string }) {
  return <h1>{title}</h1>
}
```

2. **Crie o arquivo de stories**

```typescript
// components/example/my-component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MyComponent } from './my-component'

const meta = {
  title: 'Example/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Hello World',
  },
}
```

3. **Visualize no Storybook**

O Storybook detecta automaticamente novos arquivos `.stories.tsx`!

## 📚 Stories Avançadas

### Renderização Customizada

Para componentes mais complexos:

```typescript
export const CustomRender: Story = {
  render: (args) => (
    <div className="space-y-4">
      <MyComponent {...args} />
      <MyComponent {...args} title="Another one" />
    </div>
  ),
}
```

### Decorators (Wrappers)

Para adicionar contexto ou estilos:

```typescript
const meta = {
  title: 'Example/MyComponent',
  component: MyComponent,
  decorators: [
    (Story) => (
      <div className="p-8 bg-gray-100">
        <Story />
      </div>
    ),
  ],
}
```

## 🔗 Links Úteis

- **Storybook Local**: http://localhost:6006
- **Docs Oficiais**: https://storybook.js.org/docs/react
- **Addons**: https://storybook.js.org/addons

## 🎨 Dicas para o TripSync

1. **Sempre crie stories para componentes novos**
   - Facilita desenvolvimento
   - Documenta automaticamente

2. **Teste diferentes estados**
   - Vazio, Loading, Erro, Sucesso
   - Dark mode e Light mode

3. **Use dados realistas**
   - Nomes brasileiros
   - Valores em R$
   - Datas futuras/passadas

4. **Teste edge cases**
   - Textos muito longos
   - Números muito grandes
   - Listas vazias

## 🚀 Comandos Úteis

```bash
# Iniciar Storybook
pnpm storybook

# Build do Storybook (para deploy)
pnpm build-storybook

# O build fica em: storybook-static/
```

## 💻 Integração com VSCode

Extensões recomendadas:

1. **ES7+ React/Redux snippets** - Snippets para React
2. **Tailwind CSS IntelliSense** - Autocomplete do Tailwind
3. **TypeScript Importer** - Auto-import de tipos

---

**Boa exploração!** 🎨

Qualquer dúvida sobre componentes, veja no Storybook em http://localhost:6006

