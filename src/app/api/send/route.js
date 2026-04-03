import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { pdfBase64, fileName, data, hora, hash, responsavel } = await request.json();

    // 1. Validação de Segurança
    if (!pdfBase64 || !hash) {
      return NextResponse.json({ error: "Dados incompletos para processamento." }, { status: 400 });
    }

    // 2. SALVAR NO BANCO DE DADOS (NEON)
    // Isso garante que a página /validar/[hash] encontre os dados
    await prisma.relatorio.create({
      data: {
        hash: hash,
        responsavel: responsavel || "Não identificado",
        data: data,
        hora: hora,
      },
    });

    // 3. Configuração do GMAIL
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 4. Montagem do E-mail
    const mailOptions = {
      from: `"Sistema de Carga 17º BPM" <${process.env.EMAIL_USER}>`,
      to: "hildo.costa@pm.pr.gov.br", 
      subject: `📦 Relatório de Carga - 17º BPM - ${data} - ID: ${hash}`,
      html: `
        <div style="font-family: sans-serif; color: #334155; max-width: 600px; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2563eb; margin-top: 0;">Relatório de Conferência Diária</h2>
          <p>Uma nova conferência de carga foi finalizada e registrada no banco de dados.</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 8px;"><strong>👤 Responsável:</strong> ${responsavel}</li>
              <li style="margin-bottom: 8px;"><strong>📅 Data:</strong> ${data}</li>
              <li style="margin-bottom: 8px;"><strong>⏰ Hora:</strong> ${hora}</li>
              <li style="margin-bottom: 8px;"><strong>🔑 Hash ID:</strong> <code style="background: #e2e8f0; padding: 2px 4px; border-radius: 4px;">${hash}</code></li>
            </ul>
          </div>
          <p style="font-size: 12px; color: #64748b;">
            Verifique a autenticidade deste documento escaneando o QR Code no PDF anexo.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: pdfBase64.split("base64,")[1],
          encoding: 'base64',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      message: "Relatório registrado e enviado com sucesso!",
      hash: hash
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Erro:", error);
    return NextResponse.json(
      { error: "Erro ao processar: " + error.message }, 
      { status: 500 }
    );
  }
}