import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { success, error, unauthorized, notFound } from '@/lib/api-helpers'

async function checkTripAccess(tripId: string, userId: string) {
  const member = await prisma.tripMember.findFirst({
    where: { tripId, userId }
  })
  return !!member
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request)
    const tripId = params.id

    const hasAccess = await checkTripAccess(tripId, user.userId)
    if (!hasAccess) {
      return notFound('Viagem não encontrada')
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      include: {
        paidBy: { select: { id: true, name: true, email: true, pixKey: true } },
        splits: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    const formattedExpenses = expenses.map(expense => {
      console.log('💳 Despesa formatada:', {
        id: expense.id,
        description: expense.description,
        paidByName: expense.paidBy.name,
        pixKey: expense.paidBy.pixKey,
        hasPixKey: !!expense.paidBy.pixKey
      })
      
      return {
        id: expense.id,
        tripId: expense.tripId,
        description: expense.description,
        amount: Number(expense.amount),
        date: expense.date.toISOString().split('T')[0],
        category: expense.category,
        splitMethod: expense.splitMethod,
        proofImageUrl: expense.proofImageUrl,
        paidBy: expense.paidBy,
        participants: expense.splits.map(split => split.user)
      }
    })

    return success(formattedExpenses)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao buscar despesas:', err)
    return error('Erro ao buscar despesas', 500)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request)
    const tripId = params.id
    const body = await request.json()
    const { description, amount, date, paidById, participantIds, category, splitMethod, proofImageUrl } = body

    const hasAccess = await checkTripAccess(tripId, user.userId)
    if (!hasAccess) {
      return notFound('Viagem não encontrada')
    }

    if (!description || !amount || !date || !paidById || !participantIds || participantIds.length === 0) {
      return error('Todos os campos são obrigatórios', 400)
    }

    if (amount <= 0) {
      return error('Valor deve ser maior que zero', 400)
    }

    const splitAmount = amount / participantIds.length

    const expense = await prisma.$transaction(async (tx) => {
      // Criar despesa
      const newExpense = await tx.expense.create({
        data: {
          tripId,
          description,
          amount,
          date: new Date(date),
          category: category || 'other',
          splitMethod: splitMethod || 'equal',
          proofImageUrl: proofImageUrl || null,
          paidById,
          splits: {
            create: participantIds.map((userId: string) => ({
              userId,
              amount: splitAmount
            }))
          }
        },
        include: {
          paidBy: { select: { id: true, name: true, email: true, pixKey: true } },
          splits: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          }
        }
      })

      // Criar atividade
      await tx.activity.create({
        data: {
          type: 'expense_added',
          message: `Nova despesa adicionada: ${description}`,
          tripId,
          userId: user.userId
        }
      })

      return newExpense
    })

    return success({
      id: expense.id,
      tripId: expense.tripId,
      description: expense.description,
      amount: Number(expense.amount),
      date: expense.date.toISOString().split('T')[0],
      category: expense.category,
      splitMethod: expense.splitMethod,
      paidBy: expense.paidBy,
      participants: expense.splits.map(split => split.user)
    }, 201)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao criar despesa:', err)
    return error('Erro ao criar despesa', 500)
  }
}
