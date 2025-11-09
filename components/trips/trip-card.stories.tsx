import type { Meta, StoryObj } from '@storybook/react'
import { TripCard } from './trip-card'

const meta = {
  title: 'TripSync/TripCard',
  component: TripCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TripCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trip: {
      id: '1',
      title: 'Viagem para Campos do Jordão',
      destination: 'Campos do Jordão, SP',
      startDate: '2025-10-15',
      endDate: '2025-10-18',
      budget: 5000,
      totalSpent: 3250,
      memberCount: 6,
      imageUrl: '/campos-do-jordao-mountains.jpg',
    },
  },
}

export const LowBudget: Story = {
  args: {
    trip: {
      id: '2',
      title: 'Final de Semana em Ubatuba',
      destination: 'Ubatuba, SP',
      startDate: '2025-11-05',
      endDate: '2025-11-07',
      budget: 3000,
      totalSpent: 500,
      memberCount: 4,
      imageUrl: '/ubatuba-beach.jpg',
    },
  },
}

export const HighBudgetUsage: Story = {
  args: {
    trip: {
      id: '3',
      title: 'Expedição para Fernando de Noronha',
      destination: 'Fernando de Noronha, PE',
      startDate: '2025-12-20',
      endDate: '2025-12-28',
      budget: 15000,
      totalSpent: 14500,
      memberCount: 8,
      imageUrl: '/placeholder.svg',
    },
  },
}

export const BudgetExceeded: Story = {
  args: {
    trip: {
      id: '4',
      title: 'Aventura em Bonito',
      destination: 'Bonito, MS',
      startDate: '2025-11-10',
      endDate: '2025-11-15',
      budget: 4000,
      totalSpent: 4200,
      memberCount: 5,
      imageUrl: '/placeholder.svg',
    },
  },
}

export const SoloTrip: Story = {
  args: {
    trip: {
      id: '5',
      title: 'Retiro Pessoal',
      destination: 'Serra da Mantiqueira, MG',
      startDate: '2025-10-01',
      endDate: '2025-10-03',
      budget: 1500,
      totalSpent: 800,
      memberCount: 1,
      imageUrl: '/placeholder.svg',
    },
  },
}

export const LargeGroup: Story = {
  args: {
    trip: {
      id: '6',
      title: 'Encontro Anual da Família',
      destination: 'Gramado, RS',
      startDate: '2025-12-15',
      endDate: '2025-12-22',
      budget: 25000,
      totalSpent: 12000,
      memberCount: 15,
      imageUrl: '/placeholder.svg',
    },
  },
}

