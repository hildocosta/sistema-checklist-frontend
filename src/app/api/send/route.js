import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { put } from "@vercel/blob";
import { prisma } from "../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { pdfBase64, fileName, data, hora, hash, responsavel } = await request.json();

    // 1. Validação de Segurança (Fail-fast)
    if (!pdfBase64 || !hash) {
      return NextResponse.json({ error: "Dados incompletos para processamento." }, { status: 400 });
    }

    // 2. UPLOAD PARA VERCEL BLOB
    // Extraímos apenas a parte binária do Base64
    const base64Content = pdfBase64.split("base64,")[1];
    const buffer = Buffer.from(base64Content, "base64");

    let blob;
    try {
      blob = await put(`relatorios/${hash}.pdf`, buffer, {
        access: 'public',
        contentType: 'application/pdf',
        addRandomSuffix: true, // Evita conflitos caso o mesmo hash tente subir arquivos diferentes
      });
    } catch (blobError) {
      console.error("❌ Erro Vercel Blob:", blobError);
      throw new Error("Falha ao salvar arquivo no Storage.");
    }

    // 3. SALVAR NO BANCO DE DADOS (NEON)
    // Salvamos primeiro no banco para garantir a integridade da auditoria
    const novoRelatorio = await prisma.relatorio.create({
      data: {
        hash: hash,
        responsavel: responsavel || "Não identificado",
        data: data,
        hora: hora,
        pdfUrl: blob.url,
      },
    });

    // 4. CONFIGURAÇÃO DO GMAIL (Nodemailer)
    // Dica: Crie o transporter fora do try/catch se quiser reutilizá-lo, 
    // mas aqui dentro garante isolamento de erro.
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 5. MONTAGEM E ENVIO DO E-MAIL
    // Encapsulamos o e-mail em um try/catch próprio porque, se o e-mail falhar, 
    // o relatório já está salvo e o usuário não precisa refazer o checklist.
    try {
      const mailOptions = {
        from: `"Sistema de Carga 17º BPM" <${process.env.EMAIL_USER}>`,
        to: "hildo.costa@pm.pr.gov.br", 
        subject: `📦 Relatório de Carga - 17º BPM - ${data} - ID: ${hash}`,
        html: `
          <div style="font-family: sans-serif; color: #334155; max-width: 600px; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;">
            <h2 style="color: #2563eb; margin-top: 0;">Relatório de Conferência Diária</h2>
            <p>Um novo relatório foi gerado e armazenado com sucesso.</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li><strong>👤 Responsável:</strong> ${responsavel}</li>
                <li><strong>📅 Data:</strong> ${data}</li>
                <li><strong>⏰ Hora:</strong> ${hora}</li>
                <li><strong>🔑 ID:</strong> <code>${hash}</code></li>
              </ul>
            </div>
            <p><strong>Acesse o documento original:</strong> <a href="${blob.url}">Visualizar PDF</a></p>
          </div>
        `,
        attachments: [{
          filename: fileName,
          content: base64Content,
          encoding: 'base64',
        }],
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("⚠️ E-mail não enviado, mas relatório salvo:", emailError);
      // Não damos throw aqui para o cliente receber sucesso, já que o banco/blob funcionou
    }

    return NextResponse.json({ 
      success: true,
      message: "Relatório processado com sucesso!",
      hash: novoRelatorio.hash,
      url: blob.url 
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Erro Crítico na Rota Send:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor: " + error.message }, 
      { status: 500 }
    );
  }
}