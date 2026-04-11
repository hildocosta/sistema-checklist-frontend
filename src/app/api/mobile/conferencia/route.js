import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { put } from "@vercel/blob";
import { prisma } from "../../../lib/prisma"; // Verifique se o caminho do prisma está correto

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { pdfBase64, fileName, data, hora, hash, responsavel, itens } = body;

    // 1. VALIDAÇÃO
    if (!pdfBase64 || !hash) {
      console.error("❌ Dados incompletos: pdfBase64 ou hash ausentes");
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    // 2. UPLOAD PARA VERCEL BLOB
    console.log("📂 Iniciando upload para Vercel Blob...");
    const base64Content = pdfBase64.split("base64,")[1];
    const buffer = Buffer.from(base64Content, "base64");

    let blob;
    try {
      blob = await put(`relatorios/${hash}.pdf`, buffer, {
        access: 'public',
        contentType: 'application/pdf',
        addRandomSuffix: true,
      });
      console.log("✅ PDF salvo no Blob:", blob.url);
    } catch (blobError) {
      console.error("❌ Erro Vercel Blob:", blobError);
      throw new Error("Falha ao salvar arquivo no Storage.");
    }

    // 3. SALVAR NO BANCO DE DADOS
    console.log("💾 Salvando no Prisma...");
    const novoRelatorio = await prisma.relatorio.create({
      data: {
        hash: hash,
        responsavel: responsavel || "Militar não identificado",
        data: data,
        hora: hora,
        pdfUrl: blob.url, // AQUI O CAMPO É PREENCHIDO
        itens: itens || [], 
      },
    });

    // 4. CONFIGURAÇÃO DO GMAIL
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 5. ENVIO DO E-MAIL
    try {
      console.log("📧 Enviando e-mail para hildo.costa@pm.pr.gov.br...");
      await transporter.sendMail({
        from: `"Sistema de Carga 17º BPM" <${process.env.EMAIL_USER}>`,
        to: "hildo.costa@pm.pr.gov.br", 
        subject: `📦 Relatório de Carga - 17º BPM - ${data} - ID: ${hash}`,
        html: `
          <div style="font-family: sans-serif; color: #334155; max-width: 600px; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;">
            <h2 style="color: #2563eb; margin-top: 0;">Relatório de Conferência Diária</h2>
            <p><strong>👤 Responsável:</strong> ${responsavel}</p>
            <p><strong>📅 Data:</strong> ${data} às ${hora}</p>
            <p><strong>🔑 ID:</strong> ${hash}</p>
            <br/>
            <p><strong>Acesse o documento original:</strong> <a href="${blob.url}">Visualizar PDF</a></p>
          </div>
        `,
        attachments: [{
          filename: fileName || 'relatorio.pdf',
          content: base64Content,
          encoding: 'base64',
        }],
      });
      console.log("✅ E-mail enviado com sucesso!");
    } catch (emailError) {
      console.error("⚠️ Falha no e-mail (mas os dados foram salvos):", emailError);
    }

    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      hash: novoRelatorio.hash 
    }, { status: 201 });

  } catch (error) {
    console.error("❌ Erro Crítico:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}