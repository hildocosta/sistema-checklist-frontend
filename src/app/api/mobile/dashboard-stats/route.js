import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. AJUSTE DE FUSO HORÁRIO (Brasília UTC-3)
    // Servidores (Vercel/Railway) usam UTC. Se são 12:27 no PR, o servidor vê 15:27.
    const agoraUTC = new Date();
    const agoraBrasil = new Date(agoraUTC.getTime() - (3 * 60 * 60 * 1000));
    const horaBrasil = agoraBrasil.getUTCHours();
    
    // 2. DEFINE O TURNO ATUAL (Diurno: 06h às 17h59 | Noturno: 18h às 05h59)
    const turnoEsperadoAgora = (horaBrasil >= 6 && horaBrasil < 18) ? "DIURNO" : "NOTURNO";

    // 3. BUSCA RELATÓRIOS DAS ÚLTIMAS 24 HORAS
    // Usamos 24h para garantir que o turno da madrugada (que vira o dia) seja localizado.
    const umDiaAtras = new Date(agoraUTC.getTime() - (24 * 60 * 60 * 1000));

    const relatoriosRecentes = await prisma.relatorio.findMany({
      where: { 
        createdAt: { gte: umDiaAtras } 
      },
      orderBy: { createdAt: 'desc' }
    });

    // 4. VERIFICA SE EXISTE RELATÓRIO NO TURNO ATUAL
    // Varremos os relatórios recentes para ver se algum deles pertence ao turno vigente.
    const relatorioDesteTurno = relatoriosRecentes.find(rel => {
      const dataRel = new Date(new Date(rel.createdAt).getTime() - (3 * 60 * 60 * 1000));
      const h = dataRel.getUTCHours();
      const turnoDesteRelatorio = (h >= 6 && h < 18) ? "DIURNO" : "NOTURNO";
      
      return turnoDesteRelatorio === turnoEsperadoAgora;
    });

    // Se achou um relatório do turno atual, isPendente é FALSE.
    const isPendente = !relatorioDesteTurno;

    // Se não houver nenhum relatório nas últimas 24h, retorna vazio mas pendente
    if (relatoriosRecentes.length === 0) {
      return NextResponse.json({ 
        isPendente: true, 
        turnoAlvo: turnoEsperadoAgora,
        ultimoChecklist: { responsavel: "NENHUM REGISTRO", hora: "--:--", data: "--/--/----" },
        stats: { aderencia: "PENDENTE", avarias: 0, emCautela: 0, reserva: 0 },
        logs: [] 
      });
    }

    // Usamos o relatório mais recente para compor as estatísticas da tela
    const ultimoRelatorio = relatoriosRecentes[0];

    // --- DICIONÁRIOS DE FILTRO ---
    const termosEstoque = ['OK', 'DISPONIVEL', 'DISPONÍVEL', 'RESERVA', 'ESTOQUE', 'CARGA', '---', 'FURRIELAÇÃO', 'NO ARMARIO', 'PRONTO'];
    const termosDanos = ['DANIFICADA', 'DANIFICADO', 'QUEBRADO', 'DEFEITO', 'ESTRAGADO', 'INOPERANTE', 'DANO'];
    const termosManutencao = ['MANUTENCAO', 'MANUTENÇÃO', 'REVISAO', 'REVISÃO', 'OFICINA', 'ARMARIA'];
    const termosExtravio = ['EXTRAVIO', 'EXTRAVIADA', 'EXTRAVIADO', 'PERDIDO', 'SUMIDO', 'NÃO LOCALIZADO', 'FALTA', 'ROUBADO', 'ROUBADA', 'FURTADO'];

    let avariasCount = 0;
    let cautelasCount = 0;
    let reservaCount = 0;
    let historico = [];

    const itens = Array.isArray(ultimoRelatorio.itens) 
      ? ultimoRelatorio.itens 
      : JSON.parse(ultimoRelatorio.itens || "[]");

    itens.forEach(item => {
      const obsRaw = (item.cautela || "").trim();
      const obsUpper = obsRaw.toUpperCase();
      const itemID = (item.serie || item.pmpr || item.desc || "S/ID").trim();

      const ehEstoque = !obsRaw || termosEstoque.some(t => obsUpper.includes(t));
      const ehDano = termosDanos.some(t => obsUpper.includes(t));
      const ehManutencao = termosManutencao.some(t => obsUpper.includes(t));
      const ehExtravio = termosExtravio.some(t => obsUpper.includes(t));

      if (ehEstoque) {
        reservaCount++;
      } else if (ehDano || ehManutencao || ehExtravio) {
        avariasCount++;
      } else {
        cautelasCount++;
      }

      if (!ehEstoque) {
        let statusFinal = "CAUTELADO";
        if (ehDano) statusFinal = "CRÍTICO";
        if (ehManutencao) statusFinal = "MANUTENÇÃO";
        if (ehExtravio) statusFinal = "EXTRAVIO";

        historico.push({
          id: itemID,
          equipamento: item.desc || "Equipamento",
          militar: obsRaw, 
          livro: item.pagLivro || "---",
          status: statusFinal,
          hora: ultimoRelatorio.hora,
          responsavel: ultimoRelatorio.responsavel
        });
      }
    });

    return NextResponse.json({
      isPendente,
      turnoAlvo: turnoEsperadoAgora,
      ultimoChecklist: {
        data: ultimoRelatorio.data,
        hora: ultimoRelatorio.hora,
        responsavel: ultimoRelatorio.responsavel
      },
      stats: {
        aderencia: isPendente ? "PENDENTE" : "100%",
        avarias: avariasCount,
        emCautela: cautelasCount,
        reserva: reservaCount,
      },
      logs: historico
    });

  } catch (error) {
    console.error("Erro na API Dashboard Mobile:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}