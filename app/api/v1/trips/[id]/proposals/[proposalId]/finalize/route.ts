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

// POST /api/v1/trips/[id]/proposals/[proposalId]/finalize - Finalizar proposta
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; proposalId: string } }
) {
  try {
    const user = requireAuth(request)
    const tripId = params.id
    const proposalId = params.proposalId

    const hasAccess = await checkTripAccess(tripId, user.userId)
    if (!hasAccess) {
      return notFound('Viagem não encontrada')
    }

    // Buscar proposta
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        votes: true,
        createdBy: { select: { id: true, name: true, email: true } }
      }
    })

    if (!proposal || proposal.tripId !== tripId) {
      return notFound('Proposta não encontrada')
    }

    if (proposal.status !== 'voting') {
      return error('Proposta já foi finalizada', 400)
    }

    // Contar votos
    const yesVotes = proposal.votes.filter(v => v.vote === 'yes').length
    const noVotes = proposal.votes.filter(v => v.vote === 'no').length

    // Determinar status: aprovada se tem mais votos a favor
    const newStatus = yesVotes > noVotes ? 'approved' : 'rejected'

    // Atualizar proposta
    const updatedProposal = await prisma.$transaction(async (tx) => {
      const updated = await tx.proposal.update({
        where: { id: proposalId },
        data: { status: newStatus },
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
          votes: {
            include: {
              user: { select: { id: true, name: true } }
            }
          }
        }
      })

      // Criar atividade
      await tx.activity.create({
        data: {
          type: 'proposal_completed',
          message: `Proposta "${proposal.title}" foi ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'}`,
          tripId,
          userId: user.userId
        }
      })

      return updated
    })

    const userVote = updatedProposal.votes.find(v => v.userId === user.userId)

    return success({
      id: updatedProposal.id,
      tripId: updatedProposal.tripId,
      title: updatedProposal.title,
      description: updatedProposal.description,
      status: updatedProposal.status,
      createdBy: updatedProposal.createdBy,
      createdAt: updatedProposal.createdAt.toISOString(),
      votes: { yes: yesVotes, no: noVotes },
      userVote: userVote ? userVote.vote : null
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao finalizar proposta:', err)
    return error('Erro ao finalizar proposta', 500)
  }
}

