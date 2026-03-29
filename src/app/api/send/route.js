import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    // Recebe os dados enviados pelo seu componente 'page.jsx'
    const { pdfBase64, fileName, data, hora } = await request.json();

    // 1. Configuração do Transportador para E-mail Institucional (@pm.pr.gov.br)
    // O e-mail da PMPR geralmente roda sobre a infraestrutura do Office 365
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com", 
      port: 587,
      secure: false, // TLS (padrão para porta 587)
      auth: {
        user: process.env.EMAIL_USER, // Ex: hildo.costa@pm.pr.gov.br (configurado na Vercel)
        pass: process.env.EMAIL_PASS, // Sua senha institucional (configurada na Vercel)
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false // Evita bloqueios de certificados internos da rede PR
      }
    });

    // 2. Montagem do E-mail
    const mailOptions = {
      from: `"Sistema de Carga 17º BPM" <${process.env.EMAIL_USER}>`,
      to: "hildo.costa@pm.pr.gov.br", // Destinatário fixo ou pode vir do corpo da requisição
      subject: `Relatório de Carga - 17º BPM - ${data}`,
      text: `Prezado,\n\nSegue em anexo o relatório de conferência de carga realizado em ${data} às ${hora}.\n\nEste é um e-mail automático do Sistema de Gestão de Checklists.`,
      attachments: [
        {
          filename: fileName,
          content: pdfBase64.split("base64,")[1], // Remove o prefixo do DataURI para enviar apenas o binário
          encoding: 'base64',
        },
      ],
    };

    // 3. Disparo do e-mail
    await transporter.sendMail(mailOptions);

    // Retorno de sucesso para o Frontend
    return NextResponse.json({ message: "Relatório enviado com sucesso!" }, { status: 200 });

  } catch (error) {
    console.error("Erro Crítico no Servidor Vercel:", error);
    
    // Retorna o erro detalhado para ajudar no debug (pode ver no console do navegador)
    return NextResponse.json(
      { error: "Erro ao enviar e-mail: " + error.message }, 
      { status: 500 }
    );
  }
}