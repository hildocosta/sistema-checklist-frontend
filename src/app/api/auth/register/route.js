import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Inicializa o Prisma (Singleton para evitar múltiplas conexões em serverless)
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // 1. Coleta os dados do corpo da requisição
    const body = await request.json();
    const { name, email, password } = body;

    // 2. Validação de campos obrigatórios
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "PREENCHA TODOS OS CAMPOS PARA CONTINUAR." },
        { status: 400 }
      );
    }

    // 3. Validação de formato de e-mail (Opcional, mas recomendado)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "FORMATO DE E-MAIL INVÁLIDO." },
        { status: 400 }
      );
    }

    // 4. Verificar se o usuário já existe no Banco Neon
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "ESTE E-MAIL JÁ ESTÁ CADASTRADO NO SISTEMA." },
        { status: 400 }
      );
    }

    // 5. Criptografia da Senha (Segurança Master)
    // Nunca salvamos a senha real, apenas o "hash"
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Criação do usuário no Banco de Dados
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    // 7. Resposta de Sucesso
    return NextResponse.json(
      { message: "USUÁRIO CRIADO COM SUCESSO!", userId: user.id },
      { status: 201 }
    );

  } catch (error) {
    console.error("ERRO NO REGISTRO:", error);
    
    return NextResponse.json(
      { error: "ERRO INTERNO NO SERVIDOR. TENTE NOVAMENTE." },
      { status: 500 }
    );
  }
}