import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { success, error } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validação básica
    if (!email || !password) {
      return error('Email e senha são obrigatórios', 400)
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return error('Credenciais inválidas', 401)
    }

    // Verificar senha
    const isPasswordValid = await verifyPassword(password, user.passwordHash)

    if (!isPasswordValid) {
      return error('Credenciais inválidas', 401)
    }

    // Gerar token
    const token = generateToken({
      userId: user.id,
      email: user.email
    })

    return success({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (err) {
    console.error('Erro no login:', err)
    return error('Erro ao fazer login', 500)
  }
}

