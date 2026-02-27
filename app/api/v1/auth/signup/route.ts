import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { success, error } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

// Handle OPTIONS requests (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validação básica
    if (!name || !email || !password) {
      return error('Nome, email e senha são obrigatórios', 400)
    }

    if (password.length < 6) {
      return error('A senha deve ter pelo menos 6 caracteres', 400)
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return error('Este email já está cadastrado', 409)
    }

    // Criar usuário
    const passwordHash = await hashPassword(password)
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    // Gerar token
    const token = generateToken({
      userId: user.id,
      email: user.email
    })

    return success({
      token,
      user
    }, 201)

  } catch (err) {
    console.error('Erro no signup:', err)
    return error('Erro ao criar usuário', 500)
  }
}

