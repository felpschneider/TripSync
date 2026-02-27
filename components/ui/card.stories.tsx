import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from './card'
import { Button } from './button'
import { MoreVerticalIcon } from 'lucide-react'

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area where you can place any content.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Trip Card</CardTitle>
        <CardDescription>Plan your next adventure</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Organize trips with your friends and family.</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Notification</CardTitle>
        <CardDescription>You have a new message</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Your trip to Campos do Jordão has been updated.</p>
      </CardContent>
    </Card>
  ),
}

export const TripCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Campos do Jordão</CardTitle>
        <CardDescription>15-18 Oct, 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Budget:</span>
            <span className="font-medium">R$ 5.000,00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Spent:</span>
            <span className="font-medium">R$ 3.250,00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Members:</span>
            <span className="font-medium">6 people</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1">View Trip</Button>
        <Button variant="outline" className="flex-1">Edit</Button>
      </CardFooter>
    </Card>
  ),
}

