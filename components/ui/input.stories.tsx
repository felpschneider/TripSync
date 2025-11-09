import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'
import { Label } from './label'
import { SearchIcon, MailIcon, LockIcon } from 'lucide-react'

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Digite algo...',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="seu@email.com" />
    </div>
  ),
}

export const Password: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="password">Senha</Label>
      <Input id="password" type="password" placeholder="••••••••" />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    placeholder: 'Desabilitado',
    disabled: true,
  },
}

export const WithValue: Story = {
  args: {
    value: 'Valor preenchido',
  },
}

export const Number: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="budget">Orçamento</Label>
      <Input id="budget" type="number" placeholder="5000" />
    </div>
  ),
}

export const Date: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="date">Data</Label>
      <Input id="date" type="date" />
    </div>
  ),
}

export const Search: Story = {
  render: () => (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input className="pl-9" placeholder="Buscar viagens..." />
    </div>
  ),
}

export const FormExample: Story = {
  render: () => (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="trip-name">Nome da Viagem</Label>
        <Input id="trip-name" placeholder="Viagem para Campos do Jordão" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="destination">Destino</Label>
        <Input id="destination" placeholder="Campos do Jordão, SP" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start">Data de Início</Label>
          <Input id="start" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end">Data de Término</Label>
          <Input id="end" type="date" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="budget-form">Orçamento Total</Label>
        <Input id="budget-form" type="number" placeholder="5000" />
      </div>
    </form>
  ),
}

