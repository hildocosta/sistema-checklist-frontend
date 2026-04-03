import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dataFiltro = searchParams.get('data'); 

  try {
    const relatorios = await prisma.relatorio.findMany({
      where: dataFiltro ? { data: dataFiltro } : {},
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(relatorios);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}