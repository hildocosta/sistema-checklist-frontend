import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { pdfBase64, fileName, data, hora } = await request.json();

    // 1. Configuração otimizada para GMAIL
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Seu e-mail @gmail.com (na Vercel)
        pass: process.env.EMAIL_PASS, // Sua SENHA DE APP de 16 letras (na Vercel)
      },
    });

    // 2. Montagem do E-mail
    const mailOptions = {
      from: `"Sistema de Carga 17º BPM" <${process.env.EMAIL_USER}>`,
      to: "hildo.costa@pm.pr.gov.br", 
      subject: `Relatório de Carga - 17º BPM - ${data}`,
      text: `Prezado,\n\nSegue em anexo o relatório de conferência de carga realizado em ${data} às ${hora}.\n\nEste é um e-mail automático do Sistema de Gestão de Checklists.`,
      attachments: [
        {
          filename: fileName,
          content: pdfBase64.split("base64,")[1],
          encoding: 'base64',
        },
      ],
    };

    // 3. Disparo
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Relatório enviado com sucesso!" }, { status: 200 });

  } catch (error) {
    console.error("Erro no Servidor:", error);
    return NextResponse.json(
      { error: "Erro ao enviar e-mail: " + error.message }, 
      { status: 500 }
    );
  }
}