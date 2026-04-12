import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Importação corrigida
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email } = await request.json();

    // 1. Validação de entrada
    if (!email) {
      return NextResponse.json(
        { error: "O E-MAIL É OBRIGATÓRIO." },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // 2. Busca o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!user) {
      return NextResponse.json(
        { error: "USUÁRIO NÃO ENCONTRADO NO SISTEMA DO 17º BPM." },
        { status: 404 }
      );
    }

    // 3. Configuração do transportador de e-mail (Gmail)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 4. Link de redefinição
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${user.id}`;

    // 5. Envio do e-mail
    await transporter.sendMail({
      from: `"Suporte 17º BPM" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: "Recuperação de Senha - 17º BPM",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; color: #1e293b;">
          <h2 style="color: #1d4ed8; text-align: center;">Recuperação de Senha</h2>
          <p>Olá, <strong>${user.name}</strong>.</p>
          <p>Você solicitou a redefinição de senha para o aplicativo do <strong>17º Batalhão</strong>.</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
               REDEFINIR MINHA SENHA
            </a>
          </p>
          <p style="font-size: 0.875rem; color: #64748b;">
            Se você não realizou esta solicitação, por favor ignore este e-mail.
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 0.75rem; text-align: center; color: #94a3b8;">
            © 2026 - 17º Batalhão de Polícia Militar do Paraná
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "E-MAIL ENVIADO COM SUCESSO!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("ERRO_FORGOT_PASSWORD_BACKEND:", error);
    return NextResponse.json(
      { error: "FALHA NO SERVIDOR AO ENVIAR E-MAIL." },
      { status: 500 }
    );
  }
}