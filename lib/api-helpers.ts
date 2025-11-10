import { NextResponse } from 'next/server'

export function success<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function unauthorized(message = 'Não autorizado') {
  return NextResponse.json({ error: message }, { status: 401 })
}

export function forbidden(message = 'Acesso negado') {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function notFound(message = 'Não encontrado') {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function serverError(message = 'Erro interno do servidor') {
  return NextResponse.json({ error: message }, { status: 500 })
}

