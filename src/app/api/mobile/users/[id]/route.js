import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function PUT(request, { params }) {
  try {
    
    const { id } = await params; 
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!userExists) {
      return NextResponse.json({ error: "Militar não encontrado." }, { status: 404 });
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
      { error: "Erro interno no PUT", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // CORREÇÃO: await no params
    const { id } = await params;

    if (!id) {
       return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!userExists) {
      return NextResponse.json({ error: "Militar não encontrado." }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Removido com sucesso" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno no DELETE", details: error.message },
      { status: 500 }
    );
  }
}