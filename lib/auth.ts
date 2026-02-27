import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'

export interface JWTPayload {
  userId: string
  email: string
}

// Hash de senha
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Verificar senha
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Gerar token JWT
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verificar token JWT
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// Extrair usuário do header Authorization
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  return verifyToken(token)
}

// Middleware helper para rotas protegidas
export function requireAuth(request: NextRequest): JWTPayload {
  const user = getUserFromRequest(request)
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}

