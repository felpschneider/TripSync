import type { Meta, StoryObj } from '@storybook/react'
import { TaskItem } from './task-item'
import { fn } from '@storybook/test'

const meta = {
  title: 'TripSync/TaskItem',
  component: TaskItem,
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
    onToggle: fn(),
  },
} satisfies Meta<typeof TaskItem>

export default meta
type Story = StoryObj<typeof meta>

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
const nextWeek = new Date(today)
nextWeek.setDate(nextWeek.getDate() + 7)
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)

export const Pending: Story = {
  args: {
    task: {
      id: '1',
      title: 'Reservar pousada',
      assignedTo: { id: '1', name: 'Nathalia Silva' },
      completed: false,
      dueDate: nextWeek.toISOString().split('T')[0],
    },
  },
}

export const Completed: Story = {
  args: {
    task: {
      id: '2',
      title: 'Organizar carona',
      assignedTo: { id: '4', name: 'Lucas Santos' },
      completed: true,
      dueDate: yesterday.toISOString().split('T')[0],
    },
  },
}

export const DueSoon: Story = {
  args: {
    task: {
      id: '3',
      title: 'Comprar mantimentos para café da manhã',
      assignedTo: { id: '2', name: 'João Pedro' },
      completed: false,
      dueDate: tomorrow.toISOString().split('T')[0],
    },
  },
}

export const Overdue: Story = {
  args: {
    task: {
      id: '4',
      title: 'Confirmar reserva do restaurante',
      assignedTo: { id: '3', name: 'Maria Clara' },
      completed: false,
      dueDate: yesterday.toISOString().split('T')[0],
    },
  },
}

export const LongTitle: Story = {
  args: {
    task: {
      id: '5',
      title: 'Pesquisar e fazer reservas antecipadas para os principais pontos turísticos incluindo ingressos, horários e possíveis descontos para grupos',
      assignedTo: { id: '5', name: 'Ana Paula Rodrigues' },
      completed: false,
      dueDate: nextWeek.toISOString().split('T')[0],
    },
  },
}

export const MultipleTasks: Story = {
  render: (args) => (
    <div className="space-y-3">
      <TaskItem
        task={{
          id: '1',
          title: 'Reservar pousada',
          assignedTo: { id: '1', name: 'Nathalia Silva' },
          completed: true,
          dueDate: yesterday.toISOString().split('T')[0],
        }}
        onToggle={args.onToggle}
      />
      <TaskItem
        task={{
          id: '2',
          title: 'Comprar mantimentos',
          assignedTo: { id: '2', name: 'João Pedro' },
          completed: false,
          dueDate: tomorrow.toISOString().split('T')[0],
        }}
        onToggle={args.onToggle}
      />
      <TaskItem
        task={{
          id: '3',
          title: 'Confirmar reserva do restaurante',
          assignedTo: { id: '3', name: 'Maria Clara' },
          completed: false,
          dueDate: yesterday.toISOString().split('T')[0],
        }}
        onToggle={args.onToggle}
      />
      <TaskItem
        task={{
          id: '4',
          title: 'Pesquisar atrações turísticas',
          assignedTo: { id: '4', name: 'Lucas Santos' },
          completed: false,
          dueDate: nextWeek.toISOString().split('T')[0],
        }}
        onToggle={args.onToggle}
      />
    </div>
  ),
}

