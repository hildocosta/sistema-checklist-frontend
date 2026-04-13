import { NextResponse } from 'next/server';
import { prisma } from "../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dataFiltro = searchParams.get('data'); 

  try {
    const relatorios = await prisma.relatorio.findMany({
      where: dataFiltro ? { data: dataFiltro } : {},
      orderBy: { createdAt: 'desc' },
    });

    
    const relatoriosFormatados = relatorios.map(rel => {
    
      const dataRel = new Date(rel.createdAt);
      const dataRelBR = new Date(dataRel.getTime() - (3 * 60 * 60 * 1000));
      const hora = dataRelBR.getUTCHours();

      
      const iconeTurno = (hora >= 6 && hora < 18) ? "sol" : "lua";

      return {
        ...rel,
        turnoIcone: iconeTurno 
      };
    });

    return NextResponse.json(relatoriosFormatados);

  } catch (error) {
    console.error("Erro ao buscar relatórios:", error);
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}