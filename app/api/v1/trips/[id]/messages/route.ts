import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { success, error, unauthorized, notFound } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

async function checkTripAccess(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      OR: [
        { organizerId: userId },
        { members: { some: { userId } } }
      ]
    }
  })
  return !!trip
}

// GET /api/v1/trips/[id]/messages - Listar mensagens do chat
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

    const messages = await prisma.chatMessage.findMany({
      where: { tripId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: 100 // Limitar a 100 mensagens mais recentes
    })

    const formattedMessages = messages.map(message => ({
      id: message.id,
      content: message.content,
      userId: message.userId,
      userName: message.user.name,
      userEmail: message.user.email,
      userAvatar: message.user.profileImageUrl,
      timestamp: message.createdAt.toISOString()
    }))

    return success(formattedMessages)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao buscar mensagens:', err)
    return error('Erro ao buscar mensagens', 500)
  }
}

// POST /api/v1/trips/[id]/messages - Enviar mensagem
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request)
    const tripId = params.id
    const body = await request.json()
    const { content } = body

    const hasAccess = await checkTripAccess(tripId, user.userId)
    if (!hasAccess) {
      return notFound('Viagem não encontrada')
    }

    if (!content || content.trim() === '') {
      return error('Mensagem não pode estar vazia', 400)
    }

    if (content.length > 5000) {
      return error('Mensagem muito longa (máximo 5000 caracteres)', 400)
    }

    const message = await prisma.chatMessage.create({
      data: {
        tripId,
        userId: user.userId,
        content: content.trim()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true
          }
        }
      }
    })

    return success({
      id: message.id,
      content: message.content,
      userId: message.userId,
      userName: message.user.name,
      userEmail: message.user.email,
      userAvatar: message.user.profileImageUrl,
      timestamp: message.createdAt.toISOString()
    }, 201)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao enviar mensagem:', err)
    return error('Erro ao enviar mensagem', 500)
  }
}

