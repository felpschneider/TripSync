import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { success, error, unauthorized, notFound } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function POST(
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

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        completed: !existingTask.completed
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    })

    if (task.completed) {
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
    console.error('Erro ao alternar tarefa:', err)
    return error('Erro ao alternar tarefa', 500)
  }
}

