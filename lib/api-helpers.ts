import { NextResponse } from 'next/server'

// CORS headers for API responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function success<T>(data: T, status = 200) {
  return NextResponse.json(data, { 
    status,
    headers: corsHeaders
  })
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { 
    status,
    headers: corsHeaders
  })
}

export function unauthorized(message = 'Não autorizado') {
  return NextResponse.json({ error: message }, { 
    status: 401,
    headers: corsHeaders
  })
}

export function forbidden(message = 'Acesso negado') {
  return NextResponse.json({ error: message }, { 
    status: 403,
    headers: corsHeaders
  })
}

export function notFound(message = 'Não encontrado') {
  return NextResponse.json({ error: message }, { 
    status: 404,
    headers: corsHeaders
  })
}

export function serverError(message = 'Erro interno do servidor') {
  return NextResponse.json({ error: message }, { 
    status: 500,
    headers: corsHeaders
  })
}

