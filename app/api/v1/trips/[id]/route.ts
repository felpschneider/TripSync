import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { success, error, unauthorized, forbidden, notFound } from '@/lib/api-helpers'

// Verificar se usuário tem acesso à viagem
async function checkTripAccess(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      OR: [
        { organizerId: userId },
        { members: { some: { userId } } }
      ]
    },
    include: {
      members: true,
      expenses: true,
      _count: {
        select: { members: true }
      }
    }
  })

  return trip
}

// GET /api/v1/trips/[id] - Buscar viagem específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request)
    const { id } = params

    const trip = await checkTripAccess(id, user.userId)

    if (!trip) {
      return notFound('Viagem não encontrada')
    }

    const totalSpent = trip.expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    )

    return success({
      id: trip.id,
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate.toISOString().split('T')[0],
      endDate: trip.endDate.toISOString().split('T')[0],
      budget: Number(trip.budget),
      totalSpent,
      memberCount: trip._count.members,
      imageUrl: trip.imageUrl
    })

  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao buscar viagem:', err)
    return error('Erro ao buscar viagem', 500)
  }
}

// PUT /api/v1/trips/[id] - Atualizar viagem
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request)
    const { id } = params
    const body = await request.json()
    const { title, destination, startDate, endDate, budget } = body

    // Verificar se é o organizador
    const trip = await prisma.trip.findUnique({
      where: { id }
    })

    if (!trip) {
      return notFound('Viagem não encontrada')
    }

    if (trip.organizerId !== user.userId) {
      return forbidden('Apenas o organizador pode editar a viagem')
    }

    // Validação
    if (new Date(endDate) < new Date(startDate)) {
      return error('Data de término deve ser posterior à data de início', 400)
    }

    if (budget <= 0) {
      return error('Orçamento deve ser maior que zero', 400)
    }

    // Atualizar viagem
    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        title,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget,
        activities: {
          create: {
            type: 'budget_updated',
            message: `Viagem atualizada`,
            userId: user.userId
          }
        }
      },
      include: {
        expenses: true,
        _count: {
          select: { members: true }
        }
      }
    })

    const totalSpent = updatedTrip.expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    )

    return success({
      id: updatedTrip.id,
      title: updatedTrip.title,
      destination: updatedTrip.destination,
      startDate: updatedTrip.startDate.toISOString().split('T')[0],
      endDate: updatedTrip.endDate.toISOString().split('T')[0],
      budget: Number(updatedTrip.budget),
      totalSpent,
      memberCount: updatedTrip._count.members,
      imageUrl: updatedTrip.imageUrl
    })

  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao atualizar viagem:', err)
    return error('Erro ao atualizar viagem', 500)
  }
}

// DELETE /api/v1/trips/[id] - Deletar viagem
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request)
    const { id } = params

    // Verificar se é o organizador
    const trip = await prisma.trip.findUnique({
      where: { id }
    })

    if (!trip) {
      return notFound('Viagem não encontrada')
    }

    if (trip.organizerId !== user.userId) {
      return forbidden('Apenas o organizador pode deletar a viagem')
    }

    // Deletar viagem (cascade deleta tudo relacionado)
    await prisma.trip.delete({
      where: { id }
    })

    return new Response(null, { status: 204 })

  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao deletar viagem:', err)
    return error('Erro ao deletar viagem', 500)
  }
}

