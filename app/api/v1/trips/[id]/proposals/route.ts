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

    const proposals = await prisma.proposal.findMany({
      where: { tripId },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        votes: {
          include: {
            user: { select: { id: true, name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedProposals = proposals.map(proposal => {
      const yesVotes = proposal.votes.filter(v => v.vote === 'yes').length
      const noVotes = proposal.votes.filter(v => v.vote === 'no').length
      const userVote = proposal.votes.find(v => v.userId === user.userId)

      return {
        id: proposal.id,
        tripId: proposal.tripId,
        title: proposal.title,
        description: proposal.description,
        status: proposal.status,
        createdBy: proposal.createdBy,
        createdAt: proposal.createdAt.toISOString(),
        votes: { yes: yesVotes, no: noVotes },
        userVote: userVote ? userVote.vote : null
      }
    })

    return success(formattedProposals)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao buscar propostas:', err)
    return error('Erro ao buscar propostas', 500)
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
    const { title, description } = body

    const hasAccess = await checkTripAccess(tripId, user.userId)
    if (!hasAccess) {
      return notFound('Viagem não encontrada')
    }

    if (!title || !description) {
      return error('Título e descrição são obrigatórios', 400)
    }

    const proposal = await prisma.$transaction(async (tx) => {
      // Criar proposta
      const newProposal = await tx.proposal.create({
        data: {
          tripId,
          title,
          description,
          createdById: user.userId,
          votes: {
            create: {
              userId: user.userId,
              vote: 'yes' // Voto automático a favor do criador
            }
          }
        },
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
          type: 'proposal_created',
          message: `Nova proposta criada: ${title}`,
          tripId,
          userId: user.userId
        }
      })

      return newProposal
    })

    const yesVotes = proposal.votes.filter(v => v.vote === 'yes').length
    const noVotes = proposal.votes.filter(v => v.vote === 'no').length

    return success({
      id: proposal.id,
      tripId: proposal.tripId,
      title: proposal.title,
      description: proposal.description,
      status: proposal.status,
      createdBy: proposal.createdBy,
      createdAt: proposal.createdAt.toISOString(),
      votes: { yes: yesVotes, no: noVotes },
      userVote: 'yes' // Criador já votou a favor
    }, 201)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao criar proposta:', err)
    return error('Erro ao criar proposta', 500)
  }
}

