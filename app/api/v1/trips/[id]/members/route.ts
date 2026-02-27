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

    const members = await prisma.tripMember.findMany({
      where: { tripId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { joinedAt: 'asc' }
    })

    const formattedMembers = members.map(member => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      role: member.role
    }))

    return success(formattedMembers)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao buscar membros:', err)
    return error('Erro ao buscar membros', 500)
  }
}

