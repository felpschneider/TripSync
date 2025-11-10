import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { success, error, unauthorized, notFound } from '@/lib/api-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request)
    const tripId = params.id

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { organizerId: user.userId },
          { members: { some: { userId: user.userId } } }
        ]
      },
      include: {
        members: { include: { user: true } },
        expenses: {
          include: {
            paidBy: true,
            splits: { include: { user: true } }
          }
        },
        proposals: {
          where: { status: 'approved' },
          include: { createdBy: true }
        },
        tasks: {
          where: { completed: true },
          include: { assignedTo: true }
        }
      }
    })

    if (!trip) {
      return notFound('Viagem não encontrada')
    }

    const totalSpent = trip.expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    )

    const pdfData = {
      trip: {
        title: trip.title,
        destination: trip.destination,
        startDate: trip.startDate.toISOString().split('T')[0],
        endDate: trip.endDate.toISOString().split('T')[0],
        budget: Number(trip.budget),
        totalSpent
      },
      members: trip.members.map(m => ({
        name: m.user.name,
        email: m.user.email,
        role: m.role
      })),
      expenses: trip.expenses.map(e => ({
        description: e.description,
        amount: Number(e.amount),
        date: e.date.toISOString().split('T')[0],
        paidBy: e.paidBy.name,
        participants: e.splits.map(s => s.user.name)
      })),
      proposals: trip.proposals.map(p => ({
        title: p.title,
        description: p.description,
        createdBy: p.createdBy.name
      })),
      tasks: trip.tasks.map(t => ({
        title: t.title,
        assignedTo: t.assignedTo?.name || 'Não atribuída',
        completed: t.completed
      }))
    }

    return success({
      url: `/api/v1/trips/${tripId}/export/pdf/download`,
      data: pdfData
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao exportar PDF:', err)
    return error('Erro ao exportar PDF', 500)
  }
}

