import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { error, unauthorized, forbidden, notFound } from '@/lib/api-helpers'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const user = requireAuth(request)
    const { id: tripId, memberId } = params

    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    })

    if (!trip) {
      return notFound('Viagem não encontrada')
    }

    if (trip.organizerId !== user.userId) {
      return forbidden('Apenas o organizador pode remover membros')
    }

    if (memberId === trip.organizerId) {
      return forbidden('Não é possível remover o organizador')
    }

    const member = await prisma.tripMember.findFirst({
      where: { tripId, userId: memberId }
    })

    if (!member) {
      return notFound('Membro não encontrado')
    }

    await prisma.tripMember.delete({
      where: { id: member.id }
    })

    return new Response(null, { status: 204 })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao remover membro:', err)
    return error('Erro ao remover membro', 500)
  }
}

