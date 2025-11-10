import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { success, error, unauthorized, notFound } from '@/lib/api-helpers'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const user = requireAuth(request)
    const { id: tripId, taskId } = params
    const body = await request.json()
    const { title, assignedToId, dueDate, completed } = body

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, tripId }
    })

    if (!existingTask) {
      return notFound('Tarefa não encontrada')
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        assignedToId: assignedToId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed: completed !== undefined ? completed : existingTask.completed
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    })

    if (completed && !existingTask.completed) {
      await prisma.activity.create({
        data: {
          tripId,
          type: 'task_completed',
          message: `Tarefa concluída: ${task.title}`,
          userId: user.userId
        }
      })
    }

    return success({
      id: task.id,
      tripId: task.tripId,
      title: task.title,
      completed: task.completed,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
      assignedTo: task.assignedTo
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao atualizar tarefa:', err)
    return error('Erro ao atualizar tarefa', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const user = requireAuth(request)
    const { id: tripId, taskId } = params

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, tripId }
    })

    if (!existingTask) {
      return notFound('Tarefa não encontrada')
    }

    await prisma.task.delete({
      where: { id: taskId }
    })

    return new Response(null, { status: 204 })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao deletar tarefa:', err)
    return error('Erro ao deletar tarefa', 500)
  }
}

