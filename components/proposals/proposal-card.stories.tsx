import type { Meta, StoryObj } from '@storybook/react'
import { ProposalCard } from './proposal-card'
import { fn } from '@storybook/test'

const meta = {
  title: 'TripSync/ProposalCard',
  component: ProposalCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
  args: {
    onVote: fn(),
  },
} satisfies Meta<typeof ProposalCard>

export default meta
type Story = StoryObj<typeof meta>

export const Voting: Story = {
  args: {
    proposal: {
      id: '1',
      title: 'Visita ao Horto Florestal',
      description: 'Trilha pela manhã no Horto Florestal, com piquenique no final.',
      createdBy: { id: '1', name: 'Nathalia Silva' },
      createdAt: '2025-09-20',
      votes: {
        yes: 4,
        no: 0,
      },
      userVote: null,
      status: 'voting',
    },
  },
}

export const VotedYes: Story = {
  args: {
    proposal: {
      id: '2',
      title: 'Jantar no Restaurante Libertango',
      description: 'Jantar especial no sábado à noite.',
      createdBy: { id: '3', name: 'Maria Clara' },
      createdAt: '2025-09-22',
      votes: {
        yes: 5,
        no: 1,
      },
      userVote: 'yes',
      status: 'voting',
    },
  },
}

export const VotedNo: Story = {
  args: {
    proposal: {
      id: '3',
      title: 'Subir o Pico do Itapeva às 5h da manhã',
      description: 'Acordar cedo para ver o nascer do sol no pico.',
      createdBy: { id: '2', name: 'João Pedro' },
      createdAt: '2025-09-21',
      votes: {
        yes: 2,
        no: 4,
      },
      userVote: 'no',
      status: 'voting',
    },
  },
}

export const Approved: Story = {
  args: {
    proposal: {
      id: '4',
      title: 'Parada no Chocolate Araucária',
      description: 'Fazer uma parada obrigatória na fábrica de chocolates durante o trajeto.',
      createdBy: { id: '4', name: 'Lucas Santos' },
      createdAt: '2025-09-18',
      votes: {
        yes: 6,
        no: 0,
      },
      userVote: 'yes',
      status: 'approved',
    },
  },
}

export const Rejected: Story = {
  args: {
    proposal: {
      id: '5',
      title: 'Bungee jumping no Parque de Aventuras',
      description: 'Atividade radical para os mais corajosos do grupo.',
      createdBy: { id: '5', name: 'Ana Paula' },
      createdAt: '2025-09-19',
      votes: {
        yes: 1,
        no: 5,
      },
      userVote: null,
      status: 'rejected',
    },
  },
}

export const TiedVote: Story = {
  args: {
    proposal: {
      id: '6',
      title: 'Visita à Cervejaria Baden Baden',
      description: 'Tour guiado na cervejaria com degustação.',
      createdBy: { id: '6', name: 'Rafael Costa' },
      createdAt: '2025-09-23',
      votes: {
        yes: 3,
        no: 3,
      },
      userVote: null,
      status: 'voting',
    },
  },
}

export const LongDescription: Story = {
  args: {
    proposal: {
      id: '7',
      title: 'Dia completo no Parque Estadual',
      description: 'Passar o dia inteiro no Parque Estadual de Campos do Jordão, incluindo trilha pela manhã, piquenique no almoço, e passeio de bicicleta à tarde. Levar lanche, protetor solar e roupas confortáveis. Precisamos sair às 8h para aproveitar o dia todo.',
      createdBy: { id: '1', name: 'Nathalia Silva' },
      createdAt: '2025-09-24',
      votes: {
        yes: 5,
        no: 1,
      },
      userVote: 'yes',
      status: 'voting',
    },
  },
}

export const ProposalList: Story = {
  render: (args) => (
    <div className="space-y-4">
      <ProposalCard
        proposal={{
          id: '1',
          title: 'Visita ao Horto Florestal',
          description: 'Trilha pela manhã com piquenique.',
          createdBy: { id: '1', name: 'Nathalia Silva' },
          createdAt: '2025-09-20',
          votes: { yes: 5, no: 1 },
          userVote: null,
          status: 'approved',
        }}
        onVote={args.onVote}
      />
      <ProposalCard
        proposal={{
          id: '2',
          title: 'Jantar no Libertango',
          description: 'Jantar especial no sábado à noite.',
          createdBy: { id: '2', name: 'Maria Clara' },
          createdAt: '2025-09-22',
          votes: { yes: 4, no: 0 },
          userVote: null,
          status: 'voting',
        }}
        onVote={args.onVote}
      />
      <ProposalCard
        proposal={{
          id: '3',
          title: 'Bungee jumping',
          description: 'Atividade radical para os corajosos.',
          createdBy: { id: '3', name: 'João Pedro' },
          createdAt: '2025-09-19',
          votes: { yes: 1, no: 5 },
          userVote: 'no',
          status: 'rejected',
        }}
        onVote={args.onVote}
      />
    </div>
  ),
}

