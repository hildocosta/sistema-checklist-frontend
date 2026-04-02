import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Evita criar múltiplas conexões em desenvolvimento
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export async function POST(request) {
  try {
    const data = await request.json();
    
    const { categoria, descricao, pmpr, serie, quantidade } = data;

    // 1. Validação básica
    if (!categoria || !descricao) {
      return NextResponse.json(
        { error: "Categoria e Descrição são obrigatórios." }, 
        { status: 400 }
      );
    }

    // 2. Gravação no Banco (USANDO Item COM "I" MAIÚSCULO)
    // O Prisma gera o acesso ao modelo exatamente como o nome do model no schema
    const novoItem = await prisma.item.create({
      data: {
        categoria,
        descricao,
        pmpr: pmpr || null,
        serie: serie || null,
        quantidade: parseInt(quantidade) || 1,
        status: "Disponível"
      },
    });

    return NextResponse.json(
      { message: "Item cadastrado com sucesso!", item: novoItem }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ ERRO_PRISMA:", error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "PMPR ou Série já cadastrado." }, 
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno ao salvar item." }, 
      { status: 500 }
    );
  }
}