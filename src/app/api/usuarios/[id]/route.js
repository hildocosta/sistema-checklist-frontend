import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// MÉTODO PARA EDITAR
export async function PUT(req, { params }) {
  try {
    const resolvedParams = await params; 
    const id = resolvedParams.id;
    const body = await req.json();

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
    console.error("Erro ao atualizar:", error);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

// MÉTODO PARA EXCLUIR 
export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Usuário removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir o usuário" }, 
      { status: 500 }
    );
  }
}