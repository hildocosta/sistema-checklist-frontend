import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const userExists = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!userExists) {
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

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao atualizar dados.", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const userExists = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: "Militar não encontrado para exclusão." },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: id },
    });

    return NextResponse.json({ 
      message: `Militar ${userExists.name} removido com sucesso.` 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao processar a exclusão.", details: error.message },
      { status: 500 }
    );
  }
}