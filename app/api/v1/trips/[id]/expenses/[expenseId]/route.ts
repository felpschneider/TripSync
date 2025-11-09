import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { success, error, unauthorized, notFound } from '@/lib/api-helpers'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; expenseId: string } }
) {
  try {
    const user = requireAuth(request)
    const { id: tripId, expenseId } = params
    const body = await request.json()
    const { description, amount, date, paidById, participantIds, category, splitMethod, proofImageUrl } = body

    const existingExpense = await prisma.expense.findFirst({
      where: { id: expenseId, tripId }
    })

    if (!existingExpense) {
      return notFound('Despesa não encontrada')
    }

    if (amount <= 0) {
      return error('Valor deve ser maior que zero', 400)
    }

    const splitAmount = amount / participantIds.length

    const expense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        description,
        amount,
        date: new Date(date),
        category: category || 'other',
        splitMethod: splitMethod || 'equal',
        proofImageUrl: proofImageUrl || null,
        paidById,
        splits: {
          deleteMany: {},
          create: participantIds.map((userId: string) => ({
            userId,
            amount: splitAmount
          }))
        }
      },
      include: {
        paidBy: { select: { id: true, name: true, email: true } },
        splits: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        }
      }
    })

    return success({
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
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao atualizar despesa:', err)
    return error('Erro ao atualizar despesa', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; expenseId: string } }
) {
  try {
    const user = requireAuth(request)
    const { id: tripId, expenseId } = params

    const existingExpense = await prisma.expense.findFirst({
      where: { id: expenseId, tripId }
    })

    if (!existingExpense) {
      return notFound('Despesa não encontrada')
    }

    // Deletar expense e seus splits (cascade)
    await prisma.$transaction(async (tx) => {
      // Deletar splits primeiro
      await tx.expenseSplit.deleteMany({
        where: { expenseId }
      })
      
      // Depois deletar expense
      await tx.expense.delete({
        where: { id: expenseId }
      })
    })

    return new Response(null, { status: 204 })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao deletar despesa:', err)
    return error('Erro ao deletar despesa', 500)
  }
}

