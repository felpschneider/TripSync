import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { success, error, unauthorized, notFound } from '@/lib/api-helpers'
import { sendEmail, getInviteEmailTemplate, getAppBaseUrl } from '@/lib/email'
import { v4 as uuidv4 } from 'uuid'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = requireAuth(request)
    const tripId = params.id
    const body = await request.json()
    const { email } = body

    if (!email) {
      return error('Email é obrigatório', 400)
    }

    // Validar e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return error('Email inválido', 400)
    }

    // Buscar informações da viagem e verificar acesso
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { organizerId: user.userId },
          { members: { some: { userId: user.userId } } }
        ]
      },
      include: {
        organizer: { select: { name: true } }
      }
    })

    if (!trip) {
      return notFound('Viagem não encontrada')
    }

    const inviter = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { name: true }
    })

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // Usuário já existe - adicionar diretamente à viagem
      const existingMember = await prisma.tripMember.findFirst({
        where: { tripId, userId: existingUser.id }
      })

      if (existingMember) {
        return error('Este usuário já é membro da viagem', 400)
      }

      // Adicionar usuário à viagem
      await prisma.$transaction(async (tx) => {
        await tx.tripMember.create({
          data: {
            tripId,
            userId: existingUser.id,
            role: 'member'
          }
        })

        await tx.activity.create({
          data: {
            type: 'member_joined',
            message: `${existingUser.name} entrou na viagem`,
            tripId,
            userId: existingUser.id
          }
        })
      })

      // Enviar e-mail informando que foi adicionado
      const emailHtml = getInviteEmailTemplate(
        getAppBaseUrl(),
        trip.title,
        inviter?.name || 'Um membro',
        false
      )

      try {
        await sendEmail({
          to: email,
          subject: `Você foi adicionado à viagem "${trip.title}" no TripSync`,
          html: emailHtml
        })
      } catch (emailError) {
        console.error('Erro ao enviar e-mail:', emailError)
        // Não falhar a requisição se o e-mail não for enviado
      }

      return success({
        message: 'Usuário adicionado à viagem com sucesso',
        added: true
      })
    } else {
      // Usuário não existe - criar convite
      const token = uuidv4()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      await prisma.invite.create({
        data: {
          tripId,
          email,
          token,
          expiresAt
        }
      })

      const inviteLink = `${getAppBaseUrl()}/invite/${token}`

      // Enviar e-mail de convite
      const emailHtml = getInviteEmailTemplate(
        inviteLink,
        trip.title,
        inviter?.name || 'Um membro',
        true
      )

      try {
        await sendEmail({
          to: email,
          subject: `Convite para viagem "${trip.title}" no TripSync`,
          html: emailHtml
        })
      } catch (emailError) {
        console.error('Erro ao enviar e-mail:', emailError)
        // Não falhar a requisição se o e-mail não for enviado
      }

      return success({
        inviteLink,
        message: 'Convite enviado por e-mail',
        added: false
      })
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao criar convite:', err)
    return error('Erro ao criar convite', 500)
  }
}

