import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Importante para a senha não ir em texto puro

// Garante que não criaremos múltiplas conexões com o banco em desenvolvimento
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export async function POST(request) {
  try {
    const data = await request.json();

    // 1. Desestruturar os dados que vêm do seu novo Front-end
    const { name, email, password, re, posto, unidade, nivel, telefone } = data;

    // 2. Validação simples de segurança
    if (!email || !password || !re) {
      return NextResponse.json(
        { error: "Campos obrigatórios (E-mail, Senha, RE) ausentes." }, 
        { status: 400 }
      );
    }

    // 3. Criptografar a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Salvar no banco de dados (Tabela User do seu Schema)
    const novoUsuario = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        re,
        posto,
        unidade,
        nivel,
        telefone,
        status: "Ativo",
      },
    });

    // 5. Retornar sucesso
    return NextResponse.json(
      { message: "Militar cadastrado com sucesso!", id: novoUsuario.id }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("ERRO_NO_CADASTRO:", error);

    // Tratar erro de duplicidade (RE ou E-mail já existentes)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Este RE ou E-mail já está cadastrado no sistema." }, 
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno ao salvar no banco de dados." }, 
      { status: 500 }
    );
  }
}