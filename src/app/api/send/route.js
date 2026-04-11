import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { put } from "@vercel/blob";
import { prisma } from "../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // 1. EXTRAÇÃO DOS DADOS (Adicionado 'itens' que estava faltando)
    const { pdfBase64, fileName, data, hora, hash, responsavel, itens } = await request.json();

    // 2. VALIDAÇÃO DE SEGURANÇA
    if (!pdfBase64 || !hash) {
      return NextResponse.json({ error: "Dados incompletos para processamento." }, { status: 400 });
    }

    // 3. UPLOAD PARA VERCEL BLOB
    const base64Content = pdfBase64.split("base64,")[1];
    const buffer = Buffer.from(base64Content, "base64");

    let blob;
    try {
      blob = await put(`relatorios/${hash}.pdf`, buffer, {
        access: 'public',
        contentType: 'application/pdf',
        addRandomSuffix: true,
      });
    } catch (blobError) {
      console.error("❌ Erro Vercel Blob:", blobError);
      throw new Error("Falha ao salvar arquivo no Storage.");
    }

    // 4. SALVAR NO BANCO DE DADOS (NEON/PRISMA)
    // CORREÇÃO: Agora passamos o campo 'itens' para o banco de dados
    const novoRelatorio = await prisma.relatorio.create({
      data: {
        hash: hash,
        responsavel: responsavel || "Não identificado",
        data: data,
        hora: hora,
        pdfUrl: blob.url,
      
        itens: itens || [], 
      },
    });

    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

   
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