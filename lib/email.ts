// Email service using Nodemailer
// Para produção, configure SMTP no .env

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

// Get application base URL for links in emails
export function getAppBaseUrl(): string {
  // Priority 1: NEXT_PUBLIC_APP_URL (if explicitly set)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  // Priority 2: VERCEL_URL (automatically set by Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Priority 3: NEXT_PUBLIC_API_BASE_URL without /api/v1
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace('/api/v1', '')
  }
  
  // Fallback: localhost for development
  return 'http://localhost:3000'
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  // Em desenvolvimento, apenas log do e-mail
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 EMAIL ENVIADO (DEV MODE)')
    console.log('Para:', to)
    console.log('Assunto:', subject)
    console.log('Conteúdo:', html)
    console.log('---')
    return true
  }

  // TODO: Em produção, use Nodemailer ou serviço de e-mail
  // Exemplo com Nodemailer:
  /*
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@tripsync.com',
    to,
    subject,
    html
  });
  */

  return true
}

export function getInviteEmailTemplate(inviteLink: string, tripTitle: string, inviterName: string, isNewUser: boolean) {
  if (isNewUser) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🗺️ Bem-vindo ao TripSync!</h1>
          </div>
          <div class="content">
            <h2>Você foi convidado para uma viagem!</h2>
            <p>Olá!</p>
            <p><strong>${inviterName}</strong> convidou você para participar da viagem <strong>"${tripTitle}"</strong> no TripSync.</p>
            
            <p>O TripSync é uma plataforma para organizar viagens em grupo, onde você pode:</p>
            <ul>
              <li>✅ Gerenciar despesas e dividir contas</li>
              <li>🗳️ Votar em propostas de roteiro</li>
              <li>📋 Organizar tarefas</li>
              <li>💬 Conversar com o grupo</li>
            </ul>

            <p><strong>Para aceitar o convite:</strong></p>
            <ol>
              <li>Clique no botão abaixo para criar sua conta</li>
              <li>Faça seu cadastro (é rápido!)</li>
              <li>Você será automaticamente adicionado à viagem</li>
            </ol>

            <center>
              <a href="${inviteLink}" class="button">Criar Conta e Aceitar Convite</a>
            </center>

            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              <strong>Observação:</strong> Este convite expira em 7 dias.
            </p>
          </div>
          <div class="footer">
            <p>TripSync - Organize viagens em grupo com facilidade</p>
            <p>Este é um e-mail automático, por favor não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `
  } else {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🗺️ Novo Convite no TripSync!</h1>
          </div>
          <div class="content">
            <h2>Você foi adicionado a uma viagem!</h2>
            <p>Olá!</p>
            <p><strong>${inviterName}</strong> adicionou você à viagem <strong>"${tripTitle}"</strong> no TripSync.</p>
            
            <p>Você já tem uma conta no TripSync, então foi automaticamente adicionado à viagem!</p>

            <p><strong>Para acessar a viagem:</strong></p>
            <ol>
              <li>Faça login no TripSync</li>
              <li>A viagem "${tripTitle}" aparecerá no seu dashboard</li>
              <li>Clique nela para ver detalhes e participar</li>
            </ol>

            <center>
              <a href="${getAppBaseUrl()}" class="button">Acessar TripSync</a>
            </center>
          </div>
          <div class="footer">
            <p>TripSync - Organize viagens em grupo com facilidade</p>
            <p>Este é um e-mail automático, por favor não responda.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

