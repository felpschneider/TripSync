import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { success, error, unauthorized, notFound } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; proposalId: string } }
) {
  try {
    const user = requireAuth(request)
    const { id: tripId, proposalId } = params
    const body = await request.json()
    const { vote } = body

    if (!vote || (vote !== 'yes' && vote !== 'no')) {
      return error('Voto deve ser "yes" ou "no"', 400)
    }

    const proposal = await prisma.proposal.findFirst({
      where: { id: proposalId, tripId }
    })

    if (!proposal) {
      return notFound('Proposta não encontrada')
    }

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { organizerId: user.userId },
          { members: { some: { userId: user.userId } } }
        ]
      }
    })

    if (!trip) {
      return notFound('Viagem não encontrada')
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        proposalId_userId: {
          proposalId,
          userId: user.userId
        }
      }
    })

    if (existingVote) {
      await prisma.vote.update({
        where: {
          proposalId_userId: {
            proposalId,
            userId: user.userId
          }
        },
        data: { vote }
      })
    } else {
      await prisma.vote.create({
        data: {
          proposalId,
          userId: user.userId,
          vote
        }
      })
    }

    const updatedProposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        votes: true
      }
    })

    if (!updatedProposal) {
      return notFound('Proposta não encontrada')
    }

    const yesVotes = updatedProposal.votes.filter(v => v.vote === 'yes').length
    const noVotes = updatedProposal.votes.filter(v => v.vote === 'no').length

    return success({
      id: updatedProposal.id,
      tripId: updatedProposal.tripId,
      title: updatedProposal.title,
      description: updatedProposal.description,
      status: updatedProposal.status,
      createdBy: updatedProposal.createdBy,
      createdAt: updatedProposal.createdAt.toISOString(),
      votes: { yes: yesVotes, no: noVotes },
      userVote: vote
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao votar:', err)
    return error('Erro ao votar', 500)
  }
}

