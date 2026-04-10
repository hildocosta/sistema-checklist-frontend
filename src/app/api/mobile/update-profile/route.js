import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // 1. Incluímos 'image' aqui para extrair do corpo da requisição
    const { 
      id, 
      name, 
      email, 
      re, 
      posto, 
      telefone, 
      setor, 
      unidade,
      image // <-- Novo campo
    } = await request.json();

    // 2. Atualizamos o usuário no Banco Neon
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        name,
        email,
        re,
        posto,
        telefone,
        setor,
        unidade,
        image // <-- Adicionado ao Prisma
      }
    });

    return NextResponse.json({ 
      message: "Perfil atualizado com sucesso!",
      user: {
        name: updatedUser.name,
        re: updatedUser.re,
        posto: updatedUser.posto,
        image: updatedUser.image // Retornando a imagem atualizada
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Este RE já está cadastrado em outra conta." }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno ao atualizar no banco de dados." }, 
      { status: 500 }
    );
  }
}