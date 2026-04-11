import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dataFiltro = searchParams.get('data');

    const relatorios = await prisma.relatorio.findMany({
      where: dataFiltro ? { data: dataFiltro } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(relatorios, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { pdfBase64, fileName, data, hora, hash, responsavel, itens } = body;

    if (!pdfBase64 || !hash) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

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
      throw new Error("Falha ao salvar arquivo no Storage.");
    }

    const novoRelatorio = await prisma.relatorio.create({
      data: {
        hash: hash,
        responsavel: responsavel || "Militar não identificado",
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
      await transporter.sendMail({
        from: `"Sistema de Carga 17º BPM" <${process.env.EMAIL_USER}>`,
        to: "hildo.costa@pm.pr.gov.br", 
        subject: `📦 Relatório de Carga - 17º BPM - ${data} - ID: ${hash}`,
        html: `
          <div style="font-family: sans-serif; color: #334155; max-width: 600px; border: 1px solid #e2e8f0; padding: 20px; border-radius: 10px;">
            <h2 style="color: #2563eb; margin-top: 0;">Relatório de Conferência Diária</h2>
            <p><strong>👤 Responsável:</strong> ${responsavel}</p>
            <p><strong>📅 Data:</strong> ${data} às ${hora}</p>
            <p><strong>🔑 ID:</strong> <code>${hash}</code></p>
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
    } catch (emailError) {
      
    }

    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      hash: novoRelatorio.hash 
    }, { 
      status: 201,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}