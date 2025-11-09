import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { success, error, notFound } from '@/lib/api-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    const invite = await prisma.invite.findUnique({
      where: { token }
    })

    if (!invite) {
      return notFound('Convite não encontrado')
    }

    // Verificar se o convite expirou
    if (new Date() > invite.expiresAt) {
      return error('Este convite expirou', 400)
    }

    // Verificar se já foi usado
    if (invite.used) {
      return error('Este convite já foi utilizado', 400)
    }

    return success({
      valid: true,
      tripId: invite.tripId
    })

  } catch (err) {
    console.error('Erro ao validar convite:', err)
    return error('Erro ao validar convite', 500)
  }
}

