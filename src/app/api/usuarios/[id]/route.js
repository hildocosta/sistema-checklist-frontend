import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
    
    const resolvedParams = await params; 
    const id = resolvedParams.id;

    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const usuarioAtualizado = await prisma.user.update({
      where: { id: id },
      data: {
        posto: body.posto,
        name: body.nome || body.name,
        re: body.re,
        nivel: body.nivel,
        status: body.status,
      },
    });

    return NextResponse.json(usuarioAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar", details: error.message }, 
      { status: 500 }
    );
  }
}