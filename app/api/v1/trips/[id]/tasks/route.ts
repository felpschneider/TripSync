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

    const tasks = await prisma.task.findMany({
      where: { tripId },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedTasks = tasks.map(task => ({
      id: task.id,
      tripId: task.tripId,
      title: task.title,
      completed: task.completed,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
      assignedTo: task.assignedTo
    }))

    return success(formattedTasks)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao buscar tarefas:', err)
    return error('Erro ao buscar tarefas', 500)
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
    const { title, assignedToId, dueDate } = body

    const hasAccess = await checkTripAccess(tripId, user.userId)
    if (!hasAccess) {
      return notFound('Viagem não encontrada')
    }

    if (!title) {
      return error('Título é obrigatório', 400)
    }

    const task = await prisma.task.create({
      data: {
        tripId,
        title,
        assignedToId: assignedToId || null,
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    })

    return success({
      id: task.id,
      tripId: task.tripId,
      title: task.title,
      completed: task.completed,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
      assignedTo: task.assignedTo
    }, 201)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao criar tarefa:', err)
    return error('Erro ao criar tarefa', 500)
  }
}

