import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
}

export const TripStatuses: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge>Em andamento</Badge>
      <Badge variant="secondary">Planejando</Badge>
      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">Concluída</Badge>
      <Badge variant="destructive">Cancelada</Badge>
    </div>
  ),
}

export const BudgetIndicators: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">25% gasto</Badge>
      <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">50% gasto</Badge>
      <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20">75% gasto</Badge>
      <Badge variant="destructive">95% gasto</Badge>
    </div>
  ),
}

export const Roles: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap items-center">
      <Badge className="bg-primary/10 text-primary">Organizador</Badge>
      <Badge variant="outline">Você</Badge>
      <Badge variant="secondary">Membro</Badge>
    </div>
  ),
}

