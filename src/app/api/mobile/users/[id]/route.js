import { NextResponse } from "next/server";
// Recomendo fortemente usar: import { prisma } from "@/lib/prisma";
// Mas para o teste com os logs, vamos manter sua estrutura atual:
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  console.log("--- INÍCIO DA REQUISIÇÃO PUT ---");
  try {
    const { id } = params;
    const body = await request.json();

    console.log("ID recebido na URL:", id);
    console.log("Dados recebidos no Body:", body);

    const userExists = await prisma.user.findUnique({
      where: { id: id },
    });

    console.log("Usuário encontrado no banco?", userExists ? "Sim" : "Não");

    if (!userExists) {
      console.warn(`Aviso: Usuário com ID ${id} não existe.`);
      return NextResponse.json(
        { error: "Militar não encontrado no sistema." },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        name: body.name,
        posto: body.posto,
        nivel: body.nivel,
      },
    });

    console.log("Usuário atualizado com sucesso!");
    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("ERRO CRÍTICO NO PUT:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar dados.", details: error.message },
      { status: 500 }
    );
  } finally {
    console.log("--- FIM DA REQUISIÇÃO PUT ---");
  }
}

export async function DELETE(request, { params }) {
  console.log("--- INÍCIO DA REQUISIÇÃO DELETE ---");
  try {
    const { id } = params;
    console.log("ID para exclusão:", id);

    const userExists = await prisma.user.findUnique({
      where: { id: id },
    });

    console.log("Usuário existe para excluir?", userExists ? "Sim" : "Não");

    if (!userExists) {
      return NextResponse.json(
        { error: "Militar não encontrado para exclusão." },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: id },
    });

    console.log("Exclusão realizada com sucesso no banco.");
    return NextResponse.json({ 
      message: `Militar ${userExists.name} removido com sucesso.` 
    });

  } catch (error) {
    console.error("ERRO CRÍTICO NO DELETE:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a exclusão.", details: error.message },
      { status: 500 }
    );
  } finally {
    console.log("--- FIM DA REQUISIÇÃO DELETE ---");
  }
}