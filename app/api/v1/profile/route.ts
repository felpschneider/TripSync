import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { success, error, unauthorized } from '@/lib/api-helpers'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request)

    const profile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        pixKey: true,
        createdAt: true
      }
    })

    if (!profile) {
      return error('Usuário não encontrado', 404)
    }

    return success({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      profileImageUrl: profile.profileImageUrl,
      pixKey: profile.pixKey,
      createdAt: profile.createdAt.toISOString()
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao buscar perfil:', err)
    return error('Erro ao buscar perfil', 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = requireAuth(request)
    const body = await request.json()
    const { name, currentPassword, newPassword, profileImageUrl, pixKey } = body

    // Validações básicas
    if (!name || name.trim() === '') {
      return error('Nome é obrigatório', 400)
    }

    // Se está tentando mudar a senha
    if (newPassword) {
      if (!currentPassword) {
        return error('Senha atual é obrigatória para alterar a senha', 400)
      }

      if (newPassword.length < 6) {
        return error('A nova senha deve ter pelo menos 6 caracteres', 400)
      }

      // Verificar senha atual
      const userWithPassword = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { passwordHash: true }
      })

      if (!userWithPassword) {
        return error('Usuário não encontrado', 404)
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.passwordHash)
      if (!isPasswordValid) {
        return error('Senha atual incorreta', 400)
      }

      // Hash da nova senha
      const newPasswordHash = await bcrypt.hash(newPassword, 10)

      // Atualizar com nova senha
      await prisma.user.update({
        where: { id: user.userId },
        data: {
          name: name.trim(),
          profileImageUrl: profileImageUrl || null,
          pixKey: pixKey || null,
          passwordHash: newPasswordHash
        }
      })
    } else {
      // Atualizar sem mudar senha
      await prisma.user.update({
        where: { id: user.userId },
        data: {
          name: name.trim(),
          profileImageUrl: profileImageUrl || null,
          pixKey: pixKey || null
        }
      })
    }

    // Buscar perfil atualizado
    const updatedProfile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        pixKey: true
      }
    })

    return success({
      id: updatedProfile!.id,
      name: updatedProfile!.name,
      email: updatedProfile!.email,
      profileImageUrl: updatedProfile!.profileImageUrl,
      pixKey: updatedProfile!.pixKey
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Erro ao atualizar perfil:', err)
    return error('Erro ao atualizar perfil', 500)
  }
}

