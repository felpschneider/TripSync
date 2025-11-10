import type { Meta, StoryObj } from '@storybook/react'
import { BudgetSummary } from './budget-summary'

const meta = {
  title: 'TripSync/BudgetSummary',
  component: BudgetSummary,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-6xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BudgetSummary>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    budget: 5000,
    totalSpent: 3250,
    memberCount: 6,
  },
}

export const LowSpending: Story = {
  args: {
    budget: 3000,
    totalSpent: 500,
    memberCount: 4,
  },
}

export const HighSpending: Story = {
  args: {
    budget: 5000,
    totalSpent: 4750,
    memberCount: 6,
  },
}

export const OverBudget: Story = {
  args: {
    budget: 4000,
    totalSpent: 4500,
    memberCount: 5,
  },
}

export const WayOverBudget: Story = {
  args: {
    budget: 3000,
    totalSpent: 5000,
    memberCount: 4,
  },
}

export const SmallGroup: Story = {
  args: {
    budget: 1500,
    totalSpent: 800,
    memberCount: 2,
  },
}

export const LargeGroup: Story = {
  args: {
    budget: 25000,
    totalSpent: 12000,
    memberCount: 15,
  },
}

export const JustStarted: Story = {
  args: {
    budget: 5000,
    totalSpent: 0,
    memberCount: 6,
  },
}

export const AlmostDone: Story = {
  args: {
    budget: 5000,
    totalSpent: 4999,
    memberCount: 6,
  },
}

export const SoloTrip: Story = {
  args: {
    budget: 2000,
    totalSpent: 1200,
    memberCount: 1,
  },
}

