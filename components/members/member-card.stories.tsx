import type { Meta, StoryObj } from '@storybook/react'
import { MemberCard } from './member-card'
import { fn } from '@storybook/test'

const meta = {
  title: 'TripSync/MemberCard',
  component: MemberCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
  args: {
    onRemove: fn(),
    currentUserId: 'current-user-id',
  },
} satisfies Meta<typeof MemberCard>

export default meta
type Story = StoryObj<typeof meta>

export const Organizer: Story = {
  args: {
    member: {
      id: '1',
      name: 'Nathalia Silva',
      email: 'nathalia@example.com',
      role: 'organizer',
    },
  },
}

export const RegularMember: Story = {
  args: {
    member: {
      id: '2',
      name: 'João Pedro',
      email: 'joao@example.com',
      role: 'member',
    },
  },
}

export const CurrentUser: Story = {
  args: {
    member: {
      id: 'current-user-id',
      name: 'Você Mesmo',
      email: 'voce@example.com',
      role: 'member',
    },
  },
}

export const LongEmail: Story = {
  args: {
    member: {
      id: '3',
      name: 'Maria Clara',
      email: 'maria.clara.rodrigues.muito.longo@example.com',
      role: 'member',
    },
  },
}

export const ShortName: Story = {
  args: {
    member: {
      id: '4',
      name: 'Ana',
      email: 'ana@example.com',
      role: 'member',
    },
  },
}

export const LongName: Story = {
  args: {
    member: {
      id: '5',
      name: 'Rafael Costa dos Santos Junior',
      email: 'rafael.costa@example.com',
      role: 'member',
    },
  },
}

export const MemberList: Story = {
  render: (args) => (
    <div className="space-y-3">
      <MemberCard
        member={{
          id: '1',
          name: 'Nathalia Silva',
          email: 'nathalia@example.com',
          role: 'organizer',
        }}
        currentUserId={args.currentUserId}
        onRemove={args.onRemove}
      />
      <MemberCard
        member={{
          id: 'current-user-id',
          name: 'Você',
          email: 'voce@example.com',
          role: 'member',
        }}
        currentUserId={args.currentUserId}
        onRemove={args.onRemove}
      />
      <MemberCard
        member={{
          id: '2',
          name: 'João Pedro',
          email: 'joao@example.com',
          role: 'member',
        }}
        currentUserId={args.currentUserId}
        onRemove={args.onRemove}
      />
      <MemberCard
        member={{
          id: '3',
          name: 'Maria Clara',
          email: 'maria@example.com',
          role: 'member',
        }}
        currentUserId={args.currentUserId}
        onRemove={args.onRemove}
      />
    </div>
  ),
}

