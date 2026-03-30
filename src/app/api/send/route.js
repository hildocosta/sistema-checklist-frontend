import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PrismaClient } from "@prisma/client";
export const dynamic = 'force-dynamic';


// Instância do Prisma para uso futuro (ex: logar quem enviou o relatório)
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { pdfBase64, fileName, data, hora, userEmail } = await request.json();

    // 1. Validação de Segurança dos inputs
    if (!pdfBase64 || !fileName) {
      return NextResponse.json({ error: "Dados do PDF ausentes." }, { status: 400 });
    }

    // 2. Configuração otimizada para GMAIL via Variáveis de Ambiente
    // Certifique-se que EMAIL_USER e EMAIL_PASS estão no seu .env.local puxado da Vercel
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 3. Montagem do E-mail com Template Profissional
    const mailOptions = {
      from: `"Sistema de Carga 17º BPM" <${process.env.EMAIL_USER}>`,
      to: "hildo.costa@pm.pr.gov.br", 
      subject: `📦 Relatório de Carga - 17º BPM - ${data}`,
      html: `
        <div style="font-family: sans-serif; color: #334155; max-width: 600px;">
          <h2 style="color: #2563eb;">Relatório de Conferência Diária</h2>
          <p>Prezado(a),</p>
          <p>Informamos que uma nova conferência de carga foi finalizada com sucesso.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <ul style="list-style: none; padding: 0;">
            <li><strong>📅 Data:</strong> ${data}</li>
            <li><strong>⏰ Hora:</strong> ${hora}</li>
            <li><strong>👤 Operador:</strong> ${userEmail || 'Sistema'}</li>
          </ul>
          <p style="font-size: 12px; color: #64748b; margin-top: 30px;">
            Este é um e-mail automático enviado pelo <strong>Sistema de Gestão 17º BPM</strong> hospedado na Vercel.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: pdfBase64.includes("base64,") ? pdfBase64.split("base64,")[1] : pdfBase64,
          encoding: 'base64',
        },
      ],
    };

    // 4. Disparo do E-mail
    await transporter.sendMail(mailOptions);

    // 5. Opcional: Salvar log do envio no Neon
    // Se você tiver uma tabela de 'Logs', poderia inserir aqui.

    return NextResponse.json({ 
      message: "Relatório enviado com sucesso!",
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Erro Crítico no Servidor de E-mail:", error);
    
    // Tratamento específico para erros de autenticação do Gmail
    if (error.code === 'EAUTH') {
      return NextResponse.json(
        { error: "Falha na autenticação do e-mail. Verifique a Senha de App." }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno ao processar relatório: " + error.message }, 
      { status: 500 }
    );
  }
}