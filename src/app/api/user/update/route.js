import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Sessão expirada. Faça login novamente." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    return NextResponse.json(user || {});
  } catch (error) {
    console.error("Erro Prisma GET:", error);
    return NextResponse.json({ error: "Erro de conexão com o banco" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await req.json();

    const userAtualizado = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: body.nome,
        posto: body.posto,
        unidade: body.unidade,
        setor: body.setor,
        telefone: body.telefone,
        re: body.re,
        image: body.image,
      },
    });

    return NextResponse.json(userAtualizado);
  } catch (error) {
    console.error("Erro Prisma Update:", error);
    return NextResponse.json({ error: "Erro ao salvar no banco Neon" }, { status: 500 });
  }
}