import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- FUNÇÃO PARA BUSCAR DADOS (GET) ---
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        posto: true,
        re: true,
        unidade: true,
        setor: true,
        telefone: true,
        image: true, // 1. ADICIONADO: Agora o GET busca a imagem do banco
      },
    });

    return NextResponse.json(user || {});
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}

// --- FUNÇÃO PARA SALVAR DADOS (PUT) ---
export async function PUT(req) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Recebido no PUT da API:", body); // Log para debug

    const userAtualizado = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: body.nome,
        posto: body.posto,
        unidade: body.unidade,
        setor: body.setor,
        telefone: body.telefone,
        re: body.re,
        image: body.image, // 2. ADICIONADO: Agora o link da Vercel é salvo no banco!
      },
    });

    return NextResponse.json(userAtualizado);
  } catch (error) {
    console.error("Erro Prisma Update:", error);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}