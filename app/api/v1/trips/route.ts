import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { success, error, unauthorized } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

// GET /api/v1/trips - Listar todas as viagens do usuário
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request)

    const trips = await prisma.trip.findMany({
      where: {
        OR: [
          { organizerId: user.userId },
          { members: { some: { userId: user.userId } } }
        ]
      },
      include: {
        members: true,
        expenses: {
          include: {
            splits: true
          }
        },
        _count: {
          select: { members: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Formatar resposta
    const formattedTrips = trips.map(trip => {
      const totalSpent = trip.expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      )

      // Calcular quanto o usuário gastou (despesas onde ele pagou)
      const userSpent = trip.expenses
        .filter(expense => expense.paidById === user.userId)
        .reduce((sum, expense) => sum + Number(expense.amount), 0)

      // Calcular quanto o usuário deve pagar (sua parte nos splits)
      const userOwes = trip.expenses.reduce((sum, expense) => {
        const userSplit = expense.splits.find(split => split.userId === user.userId)
        return sum + (userSplit ? Number(userSplit.amount) : 0)
      }, 0)

      // Quanto devem ao usuário = Quanto pagou - Quanto deve
      const owedToUser = userSpent - userOwes

      return {
        id: trip.id,
        title: trip.title,
        destination: trip.destination,
        startDate: trip.startDate.toISOString().split('T')[0],
        endDate: trip.endDate.toISOString().split('T')[0],
        budget: Number(trip.budget),
        totalSpent,
        userSpent, // Quanto o usuário pagou
        owedToUser, // Quanto devem ao usuário (pode ser negativo se ele deve)
        memberCount: trip._count.members,
        imageUrl: trip.imageUrl
      }
    })

    return success(formattedTrips)

  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao buscar viagens:', err)
    return error('Erro ao buscar viagens', 500)
  }
}

// POST /api/v1/trips - Criar nova viagem
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request)
    const body = await request.json()
    const { title, destination, startDate, endDate, budget } = body

    // Validação
    if (!title || !destination || !startDate || !endDate || !budget) {
      return error('Todos os campos são obrigatórios', 400)
    }

    if (new Date(endDate) < new Date(startDate)) {
      return error('Data de término deve ser posterior à data de início', 400)
    }

    if (budget <= 0) {
      return error('Orçamento deve ser maior que zero', 400)
    }

    // Criar viagem
    const trip = await prisma.trip.create({
      data: {
        title,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget,
        organizerId: user.userId,
        members: {
          create: {
            userId: user.userId,
            role: 'organizer'
          }
        },
        activities: {
          create: {
            type: 'trip_created',
            message: `Viagem ${title} foi criada`,
            userId: user.userId
          }
        }
      },
      include: {
        members: true,
        _count: {
          select: { members: true }
        }
      }
    })

    return success({
      id: trip.id,
      title: trip.title,
      destination: trip.destination,
      startDate: trip.startDate.toISOString().split('T')[0],
      endDate: trip.endDate.toISOString().split('T')[0],
      budget: Number(trip.budget),
      totalSpent: 0,
      memberCount: trip._count.members,
      imageUrl: trip.imageUrl
    }, 201)

  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao criar viagem:', err)
    return error('Erro ao criar viagem', 500)
  }
}

