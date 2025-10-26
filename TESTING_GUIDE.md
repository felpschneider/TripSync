# Guia de Testes Manuais - MVP

Este guia contém cenários de teste para validar o MVP com um usuário real (Nathalia).

## 🎯 Objetivo

Validar que o aplicativo atende aos critérios de aceitação do MVP:
- Criar viagem e adicionar 3 despesas
- Visualizar cálculo correto por pessoa
- Criar 2 propostas e votar
- Interface responsiva e intuitiva

---

## 📱 Preparação

### Ambiente
- [ ] Frontend rodando em `http://localhost:3000`
- [ ] Backend rodando em `http://localhost:8080` (ou modo mock)
- [ ] Navegador atualizado (Chrome/Safari/Firefox)
- [ ] Testar em desktop E mobile

### Dados de Teste
- Email: `nathalia@example.com`
- Senha: `senha123`
- Nome: `Nathalia Silva`

---

## 🧪 Cenários de Teste

### Cenário 1: Primeiro Acesso e Cadastro

**Objetivo:** Validar fluxo de onboarding

**Passos:**
1. Acesse `http://localhost:3000`
2. Verifique que a tela de login aparece
3. Clique em "Não tem conta? Cadastre-se"
4. Preencha:
   - Nome: `Nathalia Silva`
   - Email: `nathalia@example.com`
   - Senha: `senha123`
   - Confirmar Senha: `senha123`
5. Clique em "Criar Conta"

**Resultado Esperado:**
- ✅ Redirecionamento para dashboard
- ✅ Mensagem de boas-vindas com nome
- ✅ Dashboard vazio com botão "Nova Viagem"

**Critérios de Sucesso:**
- [ ] Formulário valida campos obrigatórios
- [ ] Senhas diferentes mostram erro
- [ ] Login automático após cadastro

---

### Cenário 2: Criar Primeira Viagem

**Objetivo:** Validar criação de viagem

**Passos:**
1. No dashboard, clique em "Nova Viagem"
2. Preencha:
   - Título: `Final de Semana em Campos do Jordão`
   - Destino: `Campos do Jordão, SP`
   - Data Início: `15/10/2025`
   - Data Término: `18/10/2025`
   - Orçamento: `5000`
3. Clique em "Criar Viagem"

**Resultado Esperado:**
- ✅ Viagem aparece no dashboard como card
- ✅ Card mostra título, destino, datas
- ✅ Orçamento aparece como "R$ 5000.00"
- ✅ "0% gasto" no badge

**Critérios de Sucesso:**
- [ ] Validação de datas (fim >= início)
- [ ] Orçamento aceita decimais
- [ ] Card é clicável

---

### Cenário 3: Adicionar 3 Despesas

**Objetivo:** Validar gestão de despesas e cálculos

**Passos:**

**Despesa 1:**
1. Clique no card da viagem
2. Vá para aba "Despesas"
3. Clique "Nova Despesa"
4. Preencha:
   - Descrição: `Hospedagem - Pousada Serra Verde`
   - Valor: `1800`
   - Data: `15/10/2025`
   - Categoria: `Hospedagem`
   - Pago por: `Nathalia Silva`
   - Participantes: Selecione todos (6 pessoas)
   - Método: `Dividir igualmente`
5. Clique "Adicionar"

**Despesa 2:**
1. Clique "Nova Despesa"
2. Preencha:
   - Descrição: `Jantar - Restaurante Baden Baden`
   - Valor: `450`
   - Data: `15/10/2025`
   - Categoria: `Alimentação`
   - Pago por: `João Pedro`
   - Participantes: Selecione 4 pessoas
   - Método: `Dividir igualmente`
3. Clique "Adicionar"

**Despesa 3:**
1. Clique "Nova Despesa"
2. Preencha:
   - Descrição: `Gasolina - Ida`
   - Valor: `300`
   - Data: `15/10/2025`
   - Categoria: `Transporte`
   - Pago por: `Lucas Santos`
   - Participantes: Selecione 4 pessoas
   - Método: `Dividir igualmente`
3. Clique "Adicionar"

**Resultado Esperado:**
- ✅ 3 despesas aparecem na lista
- ✅ Resumo de orçamento atualiza:
  - Total Gasto: `R$ 2550.00`
  - Saldo Restante: `R$ 2450.00`
  - Média por Pessoa: `R$ 425.00` (2550 / 6)
  - Barra de progresso: `51%`
- ✅ Cada despesa mostra valor por pessoa correto:
  - Hospedagem: `R$ 300.00 / pessoa` (1800 / 6)
  - Jantar: `R$ 112.50 / pessoa` (450 / 4)
  - Gasolina: `R$ 75.00 / pessoa` (300 / 4)

**Critérios de Sucesso:**
- [ ] Cálculos estão corretos
- [ ] Categorias têm cores diferentes
- [ ] Pode editar despesa
- [ ] Pode deletar despesa

---

### Cenário 4: Criar e Votar em Propostas

**Objetivo:** Validar sistema de votação

**Passos:**

**Proposta 1:**
1. Vá para aba "Propostas"
2. Clique "Nova Proposta"
3. Preencha:
   - Título: `Visita ao Horto Florestal`
   - Descrição: `Trilha pela manhã no Horto Florestal, com piquenique no final.`
4. Clique "Criar Proposta"
5. Vote "A favor"

**Proposta 2:**
1. Clique "Nova Proposta"
2. Preencha:
   - Título: `Jantar no Restaurante Libertango`
   - Descrição: `Jantar especial no sábado à noite.`
3. Clique "Criar Proposta"
4. Vote "Contra"

**Resultado Esperado:**
- ✅ 2 propostas aparecem na aba "Em Votação"
- ✅ Proposta 1 mostra: "1 a favor • 0 contra"
- ✅ Proposta 2 mostra: "0 a favor • 1 contra"
- ✅ Barra de progresso reflete votos
- ✅ Botões de voto ficam destacados após votar
- ✅ Mensagem "Você votou a favor/contra" aparece

**Critérios de Sucesso:**
- [ ] Pode mudar voto
- [ ] Votos atualizam em tempo real
- [ ] Não pode votar múltiplas vezes

---

### Cenário 5: Gerenciar Tarefas

**Objetivo:** Validar atribuição e conclusão de tarefas

**Passos:**
1. Vá para aba "Tarefas"
2. Clique "Nova Tarefa"
3. Preencha:
   - Título: `Reservar pousada`
   - Responsável: `Nathalia Silva`
   - Prazo: `30/09/2025`
4. Clique "Criar Tarefa"
5. Marque checkbox para concluir
6. Vá para aba "Concluídas"

**Resultado Esperado:**
- ✅ Tarefa aparece em "Pendentes"
- ✅ Após marcar, move para "Concluídas"
- ✅ Badge "Concluída" aparece
- ✅ Texto fica riscado quando concluída

**Critérios de Sucesso:**
- [ ] Tarefas atrasadas têm badge vermelho
- [ ] Prazo próximo tem badge laranja
- [ ] Pode desmarcar tarefa concluída

---

### Cenário 6: Convidar Membros

**Objetivo:** Validar sistema de convites

**Passos:**
1. Vá para aba "Membros"
2. Clique "Convidar Membro"
3. Digite email: `amigo@example.com`
4. Clique "Gerar Convite"
5. Copie o link gerado
6. Clique "Fechar"

**Resultado Esperado:**
- ✅ Link de convite é gerado
- ✅ Botão de copiar funciona
- ✅ Feedback visual ao copiar (ícone muda)
- ✅ Link tem formato: `http://localhost:3000/invite/{tripId}/{token}`

**Critérios de Sucesso:**
- [ ] Link é único
- [ ] Pode gerar múltiplos convites
- [ ] Membros aparecem na lista

---

### Cenário 7: Visualizar Feed de Atividades

**Objetivo:** Validar registro de atividades

**Passos:**
1. Vá para aba "Atividades"
2. Verifique que todas as ações anteriores aparecem:
   - Despesas adicionadas
   - Propostas criadas
   - Tarefas concluídas

**Resultado Esperado:**
- ✅ Atividades em ordem cronológica (mais recente primeiro)
- ✅ Cada atividade tem ícone colorido
- ✅ Timestamp relativo ("2h atrás", "1d atrás")
- ✅ Avatar do usuário aparece

**Critérios de Sucesso:**
- [ ] Atividades são legíveis
- [ ] Cores ajudam a identificar tipo
- [ ] Feed atualiza automaticamente

---

### Cenário 8: Responsividade Mobile

**Objetivo:** Validar experiência mobile

**Passos:**
1. Abra DevTools (F12)
2. Ative modo mobile (iPhone 12 Pro)
3. Navegue por todas as telas
4. Teste em orientação portrait e landscape

**Resultado Esperado:**
- ✅ Layout se adapta ao mobile
- ✅ Botões são tocáveis (mínimo 44x44px)
- ✅ Texto é legível sem zoom
- ✅ Navegação por abas funciona com scroll horizontal
- ✅ Formulários são fáceis de preencher
- ✅ Cards não quebram

**Critérios de Sucesso:**
- [ ] Sem scroll horizontal indesejado
- [ ] Imagens não distorcem
- [ ] Modais ocupam tela inteira em mobile

---

### Cenário 9: Modo Escuro

**Objetivo:** Validar tema escuro

**Passos:**
1. No dashboard, clique no ícone de lua/sol
2. Navegue por todas as telas
3. Verifique contraste de texto

**Resultado Esperado:**
- ✅ Cores invertem corretamente
- ✅ Verde #64DD17 permanece vibrante
- ✅ Texto tem contraste adequado
- ✅ Cards são distinguíveis do fundo
- ✅ Preferência é salva (persiste após reload)

**Critérios de Sucesso:**
- [ ] Sem texto ilegível
- [ ] Imagens têm bom contraste
- [ ] Ícones são visíveis

---

### Cenário 10: Exportar Resumo

**Objetivo:** Validar exportação de PDF

**Passos:**
1. Vá para aba "Membros"
2. Clique "Exportar Resumo"
3. Aguarde geração

**Resultado Esperado:**
- ✅ Modal/alerta confirma exportação
- ✅ Em produção, PDF seria baixado
- ✅ PDF conteria:
  - Informações da viagem
  - Resumo de orçamento
  - Lista de despesas
  - Propostas aprovadas
  - Tarefas concluídas
  - Lista de membros

**Critérios de Sucesso:**
- [ ] Botão mostra loading
- [ ] Erro é tratado graciosamente

---

## ✅ Checklist Final

### Funcionalidades MVP
- [ ] Login/Signup funciona
- [ ] Criar viagem funciona
- [ ] Adicionar 3 despesas funciona
- [ ] Cálculo por pessoa está correto
- [ ] Criar 2 propostas funciona
- [ ] Votação funciona
- [ ] Tarefas podem ser criadas e concluídas
- [ ] Convites podem ser gerados
- [ ] Feed de atividades atualiza

### UX/UI
- [ ] Interface é intuitiva
- [ ] Cores são agradáveis
- [ ] Tipografia é legível
- [ ] Espaçamento é adequado
- [ ] Feedback visual em ações
- [ ] Mensagens de erro são claras

### Responsividade
- [ ] Funciona em desktop
- [ ] Funciona em tablet
- [ ] Funciona em mobile
- [ ] Orientação landscape funciona

### Performance
- [ ] Carregamento é rápido
- [ ] Transições são suaves
- [ ] Sem travamentos

### Acessibilidade
- [ ] Pode navegar com teclado
- [ ] Contraste adequado
- [ ] Textos alternativos em imagens

---

## 🐛 Registro de Bugs

Use esta seção para anotar problemas encontrados:

| # | Descrição | Severidade | Tela | Status |
|---|-----------|------------|------|--------|
| 1 | | Alta/Média/Baixa | | Aberto/Resolvido |
| 2 | | | | |

---

## 📊 Feedback do Usuário

Após os testes, pergunte a Nathalia:

1. **Facilidade de uso (1-5):** ___
2. **Design (1-5):** ___
3. **Funcionalidades atendem necessidade? (Sim/Não):** ___
4. **O que mais gostou?**
   - 
5. **O que mudaria?**
   - 
6. **Usaria no dia a dia? (Sim/Não):** ___

---

**Boa sorte nos testes!** 🚀
