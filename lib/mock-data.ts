// Mock data for local development and demo

export const mockUser = {
  id: "1",
  name: "Nathalia Silva",
  email: "nathalia@example.com",
}

export const mockTrips = [
  {
    id: "1",
    title: "Viagem para Campos do Jordão",
    destination: "Campos do Jordão, SP",
    startDate: "2025-10-15",
    endDate: "2025-10-18",
    budget: 5000,
    totalSpent: 3250,
    memberCount: 6,
    imageUrl: "/campos-do-jordao-mountains.jpg",
  },
  {
    id: "2",
    title: "Final de Semana em Ubatuba",
    destination: "Ubatuba, SP",
    startDate: "2025-11-05",
    endDate: "2025-11-07",
    budget: 3000,
    totalSpent: 1200,
    memberCount: 4,
    imageUrl: "/ubatuba-beach.jpg",
  },
]

export const mockExpenses = [
  {
    id: "1",
    tripId: "1",
    description: "Hospedagem - Pousada Serra Verde",
    amount: 1800,
    date: "2025-10-15",
    paidBy: { id: "1", name: "Nathalia Silva" },
    participants: [
      { id: "1", name: "Nathalia Silva" },
      { id: "2", name: "João Pedro" },
      { id: "3", name: "Maria Clara" },
      { id: "4", name: "Lucas Santos" },
      { id: "5", name: "Ana Paula" },
      { id: "6", name: "Rafael Costa" },
    ],
    splitMethod: "equal",
    category: "accommodation",
  },
  {
    id: "2",
    tripId: "1",
    description: "Jantar - Restaurante Baden Baden",
    amount: 450,
    date: "2025-10-15",
    paidBy: { id: "2", name: "João Pedro" },
    participants: [
      { id: "1", name: "Nathalia Silva" },
      { id: "2", name: "João Pedro" },
      { id: "3", name: "Maria Clara" },
      { id: "4", name: "Lucas Santos" },
    ],
    splitMethod: "equal",
    category: "food",
  },
  {
    id: "3",
    tripId: "1",
    description: "Gasolina - Ida",
    amount: 300,
    date: "2025-10-15",
    paidBy: { id: "4", name: "Lucas Santos" },
    participants: [
      { id: "1", name: "Nathalia Silva" },
      { id: "2", name: "João Pedro" },
      { id: "4", name: "Lucas Santos" },
      { id: "5", name: "Ana Paula" },
    ],
    splitMethod: "equal",
    category: "transport",
  },
]

export const mockProposals = [
  {
    id: "1",
    tripId: "1",
    title: "Visita ao Horto Florestal",
    description: "Trilha pela manhã no Horto Florestal, com piquenique no final.",
    createdBy: { id: "1", name: "Nathalia Silva" },
    createdAt: "2025-09-20",
    votes: {
      yes: 5,
      no: 1,
    },
    userVote: "yes",
    status: "approved",
  },
  {
    id: "2",
    tripId: "1",
    title: "Jantar no Restaurante Libertango",
    description: "Jantar especial no sábado à noite.",
    createdBy: { id: "3", name: "Maria Clara" },
    createdAt: "2025-09-22",
    votes: {
      yes: 4,
      no: 0,
    },
    userVote: null,
    status: "voting",
  },
]

export const mockTasks = [
  {
    id: "1",
    tripId: "1",
    title: "Reservar pousada",
    assignedTo: { id: "1", name: "Nathalia Silva" },
    completed: true,
    dueDate: "2025-09-30",
  },
  {
    id: "2",
    tripId: "1",
    title: "Comprar mantimentos para café da manhã",
    assignedTo: { id: "2", name: "João Pedro" },
    completed: false,
    dueDate: "2025-10-14",
  },
  {
    id: "3",
    tripId: "1",
    title: "Organizar carona",
    assignedTo: { id: "4", name: "Lucas Santos" },
    completed: true,
    dueDate: "2025-10-10",
  },
  {
    id: "4",
    tripId: "1",
    title: "Pesquisar restaurantes",
    assignedTo: { id: "3", name: "Maria Clara" },
    completed: false,
    dueDate: "2025-10-12",
  },
]

export const mockActivities = [
  {
    id: "1",
    tripId: "1",
    type: "expense_added",
    message: "Nathalia adicionou uma despesa: Hospedagem - Pousada Serra Verde",
    timestamp: "2025-09-28T10:30:00",
    user: { id: "1", name: "Nathalia Silva" },
  },
  {
    id: "2",
    tripId: "1",
    type: "proposal_created",
    message: "Maria Clara criou uma proposta: Jantar no Restaurante Libertango",
    timestamp: "2025-09-22T15:45:00",
    user: { id: "3", name: "Maria Clara" },
  },
  {
    id: "3",
    tripId: "1",
    type: "task_completed",
    message: "Lucas Santos completou a tarefa: Organizar carona",
    timestamp: "2025-09-20T09:15:00",
    user: { id: "4", name: "Lucas Santos" },
  },
  {
    id: "4",
    tripId: "1",
    type: "member_joined",
    message: "Rafael Costa entrou na viagem",
    timestamp: "2025-09-18T14:20:00",
    user: { id: "6", name: "Rafael Costa" },
  },
]

export const mockMembers = [
  { id: "1", name: "Nathalia Silva", email: "nathalia@example.com", role: "organizer" },
  { id: "2", name: "João Pedro", email: "joao@example.com", role: "member" },
  { id: "3", name: "Maria Clara", email: "maria@example.com", role: "member" },
  { id: "4", name: "Lucas Santos", email: "lucas@example.com", role: "member" },
  { id: "5", name: "Ana Paula", email: "ana@example.com", role: "member" },
  { id: "6", name: "Rafael Costa", email: "rafael@example.com", role: "member" },
]
